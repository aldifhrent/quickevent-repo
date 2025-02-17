export enum Ticket {
  PAID = "PAID",
  FREE = "FREE",
}
export interface Events {
  id: number;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  registrationStartDate: Date;
  registrationEndDate: Date;
  eventStartDate: Date;
  eventEndDate: Date;
  price: number;
  availableSeats: number;
  totalTicket: number;
  ticketType: Ticket;
  organizerId: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  organizer: Organizer;
  Category: Category[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Organizer {
  [x: string]: any;
  id: string;
  slug?: string;
  organizerId: string;
  organizerName: string;
  logoUrl: string;
}
