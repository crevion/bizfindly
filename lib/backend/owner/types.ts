export interface OwnerProfile {
  id?: number;
  name: string;
  phone: string;
  email: string;
  bio: string;
  avatar: string | null;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  bio?: string;
}
