
export interface RegistrationData {
  id?: string;
  timestamp?: string;
  name: string;
  adults: number;
  children: number;
  preferredLocation: 'location_a' | 'location_b';
  phone: string;
}

export interface LocationOption {
  id: 'location_a' | 'location_b';
  name: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

export enum AppTab {
  INFO = 'info',
  REGISTER = 'register',
  GALLERY = 'gallery',
  ADMIN = 'admin'
}
