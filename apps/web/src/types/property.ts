export type PropertyType = {
  id: number;
  name: string;
  image: string;
  category?: {
    name: string;
  };
  deletedAt?: Date | null;
};
