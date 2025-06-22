import { prisma } from '@/prisma/client';

export class CatalogService {
  async getAvailableProperties(query: {
    search?: string;
    categoryId?: number;
    sortBy?: 'name' | 'price';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
    startDate?: Date;
    endDate?: Date;
    days?: Date[];
  }) {
    const {
      search,
      categoryId,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      pageSize = 10,
      startDate,
      endDate,
    } = query;

    const skip = (page - 1) * pageSize;

    const rooms = await prisma.room.findMany({
      where: {
        deletedAt: null,
        property: {
          deletedAt: null,
          categoryId: categoryId || undefined,
          ...(search && {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { city: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }),
        },
        NOT:
          startDate && endDate
            ? {
                availabilities: {
                  some: {
                    date: { gte: startDate, lte: endDate },
                    isAvailable: false,
                  },
                },
              }
            : undefined,
      },
      include: {
        property: {
          include: {
            city: true,
          },
        },
        peakRates: true,
      },
    });

    function getDateRange(start: Date, end: Date): Date[] {
      const dates: Date[] = [];
      const current = new Date(start);
      while (current < end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    }

    const days = startDate && endDate ? getDateRange(startDate, endDate) : [];

    const roomsWithEffectivePrice = rooms.map((room) => {
      if (days.length === 0) {
        return { ...room, effectivePrice: room.basePrice };
      }

      const totalPrice = days.reduce((sum, day) => {
        const peak = room.peakRates.find((rate) => {
          const dayStr = day.toISOString().slice(0, 10);
          const startStr = rate.startDate.toISOString().slice(0, 10);
          const endStr = rate.endDate.toISOString().slice(0, 10);

          return startStr <= dayStr && dayStr <= endStr;
        });

        let price = room.basePrice;

        if (peak) {
          if (peak.priceModifierType === 'PERCENTAGE') {
            price += (price * peak.priceModifierValue) / 100;
          } else if (peak.priceModifierType === 'NOMINAL') {
            price += peak.priceModifierValue;
          }
        }

        return sum + price;
      }, 0);

      const averagePrice = totalPrice / days.length;

      return {
        ...room,
        effectivePrice: Math.round(averagePrice),
      };
    });

    const propertyMap = new Map<
      number,
      { property: (typeof rooms)[0]['property']; minPrice: number }
    >();

    roomsWithEffectivePrice.forEach((room) => {
      const prop = room.property;
      const current = propertyMap.get(prop.id);

      if (!current || room.effectivePrice < current.minPrice) {
        propertyMap.set(prop.id, {
          property: prop,
          minPrice: room.effectivePrice,
        });
      }
    });

    let results = Array.from(propertyMap.values()).map(
      ({ property, minPrice }) => ({
        id: property.id,
        name: property.name,
        image: property.image,
        address: property.address,
        categoryId: property.categoryId,
        minPrice,
      }),
    );

    if (sortBy === 'name') {
      results.sort((a, b) =>
        sortOrder === 'desc'
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name),
      );
    } else if (sortBy === 'price') {
      results.sort((a, b) =>
        sortOrder === 'desc'
          ? b.minPrice - a.minPrice
          : a.minPrice - b.minPrice,
      );
    }

    const totalCount = results.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const paginated = results.slice(skip, skip + pageSize);

    return {
      data: paginated,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }
}
