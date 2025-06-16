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
  role: 'USER' | 'TENANT';
  purpose?: 'verify' | 'access';
}
