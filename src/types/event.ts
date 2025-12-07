// src/types/event.ts

export interface RegistrationStatus {
  status: 'VERIFIED' | 'PENDING' | 'FAILED' | 'PAID' | 'REGISTERED';
  mobile?: string;
  telegram?: string;
}

export interface EventType {
  _id: string; 
  title: string;
  slug: string;
  description: string;
  date: string; 
  location: string;
  capacity: number;
  registeredCount: number;
  isFree: boolean;
  price: number; 
  thumbnail?: string;
  registrationStatus: 'SCHEDULED' | 'OPEN' | 'CLOSED';
  userRegistration?: RegistrationStatus | null;
}