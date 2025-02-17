import { Organizer } from "@/types/org";

export enum Ticket {
  PAID = "PAID",
  FREE = "FREE",
}
export interface Event {
  id?: number;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  registrationStartDate: string;
  registrationEndDate: string;
  eventStartDate: Date;
  eventEndDate: Date;
  price: number;
  availableSeats: number;
  ticketType: Ticket;
  organizer?: Organizer;
}
