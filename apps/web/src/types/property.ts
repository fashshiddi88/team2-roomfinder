export type PropertyType = {
  id: number;
  name: string;
  image: string;
  category?: {
    name: string;
  };
  deletedAt?: Date | null;
};

export type RoomType = {
  id: number;
  name: string;
  image: string;
  deletedAt?: Date | null;
};

export type PeakSeasonType = {
  id: number;
  startDate: Date;
  endDate: Date;
  priceModifierType: string;
  priceModifierValue: number;
};
