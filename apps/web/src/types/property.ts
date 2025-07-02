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

export type Room = {
  id: number;
  name: string;
  image: string;
  description: string;
  capacity: number;
  totalAvailable: number;
  effectivePrice: number;
};

export type Review = {
  id: number;
  name: string;
  photo?: string;
  rating: number;
  comment: string;
};

export type Property = {
  id: number;
  name: string;
  image: string;
  address: string;
  description: string;
  city: string;
  category: string;
  propertyImages: string[];
  rooms: Room[];
  reviews: Review[];
  mapEmbedUrl?: string;
};

export enum BookingTypeEnum {
  MANUAL = 'MANUAL',
  GATEWAY = 'GATEWAY',
}

export type BookingSummary = {
  id: number;
  reservationId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  bookingType: 'MANUAL' | 'GATEWAY';
  expiredAt: string;
  status: string;
  propertyName: string;
  location: string;
  roomName: string;
  userName: string;
  userEmail: string;
};

export enum BookingStatus {
  WAITING_PAYMENT = 'WAITING_PAYMENT',
  WAITING_CONFIRMATION = 'WAITING_CONFIRMATION',
  CANCELED = 'CANCELED',
  CONFIRMED = 'CONFIRMED',
  DONE = 'DONE',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}
