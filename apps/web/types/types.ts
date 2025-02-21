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
  location: string;
  eventEndDate: Date;
  price: number;
  attendedEvent: number;
  totalTicket: number;
  ticketType: Ticket;
  organizerId: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  organizer: Organizer,
  category: string
}

export interface Organizer {
  id: string;
  slug: string;
  organizerId: string;
  organizerName: string;
  logoUrl: string | null;
  totalEvents?: number;
}

export interface Transactions {
  id: string;
  totalAmount: number;
  pointUsed: 0;
  status: string;
  quantity: number;
  paymentProof: string;
  userId: string;
  eventId: string;
  createdAt: string;
  updatedAt: string
  user: {
    name: string;
    email: string;
  }
}

export interface EventAnalytics {
  eventTitle: string;
  totalTickets: number;
  attendedCount: number;
  nonAttendedCount: number;
  attendanceRate: string;
}

export interface SummaryAnalytics {
  totalTickets: number;
  totalAttended: number;
  totalNonAttended: number;
  overallAttendanceRate: string;
}

export interface AnalyticsData {
  events: EventAnalytics[];
  summary: SummaryAnalytics;
}

export interface BarChartProps {
  data: AnalyticsData
}
export interface SummaryChartProps {
  data: AnalyticsData
}
export interface PieChartProps {
  name: string;
  value: number;
}