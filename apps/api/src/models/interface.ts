export interface UserInput {
  email: string;
}

export interface TenantInput {
  companyName: string;
  email: string;
}

export interface UserPayLoad {
  userId: number;
  email: string;
  role?: string;
  purpose?: 'verify' | 'access'; // Tambahan jika kamu mau pisahkan jenis token
}
