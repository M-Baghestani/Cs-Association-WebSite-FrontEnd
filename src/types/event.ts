// src/types/event.ts

export type RegistrationStatusType = 
    | 'VERIFIED' 
    | 'PENDING' 
    | 'FAILED' 
    | 'PAID' 
    | 'REGISTERED'
    | 'APPROVED'   
    | 'REJECTED'   
    | 'RECEIPT_PENDING'; 

export interface RegistrationStatus {
  // استفاده از تایپ جدید
  status: RegistrationStatusType;
  mobile?: string;
  telegram?: string;
  _id: string; // افزودن فیلد ID برای استفاده در Optimistic Update
}

export interface EventType {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  registeredCount: number;
  isFree: boolean;
  price: number;
  thumbnail?: string;
  registrationStatus?: 'SCHEDULED' | 'OPEN' | 'CLOSED';
  registrationOpensAt?: string;
  // استفاده از تایپ جدید و امکان null بودن
  userRegistration?: RegistrationStatus | null; 
  hasQuestions?: boolean;
}