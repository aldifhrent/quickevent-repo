import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import slugify from "slugify";
import { Prisma } from "@prisma/client";
;
import { slugGenerator } from "@/helpers/slug";
import { cloudinaryUpload } from "@/helpers/cloudinary";
import "@/interface/global.interface"; // Pastikan jalur ini benar
import { findEventBySlug, findNewEvents, findUpcomingEvent } from "sql/events";

class eventServices {
  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const pageSize = parseInt(limit as string, 10);
      const skip = (pageNumber - 1) * pageSize;

      let events;
      let totalEvents;

      if (type === "upcoming") {
        events = await findUpcomingEvent(pageNumber, pageSize);
        totalEvents = await prisma.events.count({
          where: {
            eventStartDate: {
              gte: new Date()
            }
          }
        })
      } else if (type === "new") {
        events = await findNewEvents(pageNumber, pageSize);
        totalEvents = await prisma.events.count()
      } else {
        totalEvents = await prisma.events.count();
        events = await prisma.events.findMany({
          skip,
          take: pageSize,
          include: {
            organizer: true,
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Successfully retrieved events",
        data: events,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalEvents / pageSize),
          totalItems: totalEvents,
          pageSize,
        },
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async getAllEventsByORG(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user.organizerId;

      // Throw an error if organizerId is not present
      if (!organizerId) {
        throw new Error("Organizer ID is required.");
      }

      // Fetch events related to the organizerId
      const events = await prisma.events.findMany({
        where: {
          organizerId: organizerId, // Ensure you're fetching events by organizerId
        },
      });

      return res.status(200).json({
        success: true,
        message: "Successfully retrieved events",
        data: events,
      });
    } catch (error) {
      console.error(error);
      next(error); // Let the error be handled by the global error handler
    }
  }

  async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = String(req.params.id);
      const event = await findEventBySlug(slug);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Successfully retrieved event",
        data: event,
      });
    } catch (error) {
      console.error(error);
      next(error); // Let the error be handled by the global error handler
    }
  }

  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      if (!req.user || !req.user.organizerId) {
        return res.status(401).json({
          message: "Unauthorized: Organizer ID is required",
        });
      }

      const organizerId = String(req.user.organizerId);

      // Cek apakah organizer ada
      const organizer = await prisma.organizer.findUnique({
        where: { id: organizerId },
      });

      if (!organizer) {
        return res.status(400).json({ message: "Invalid Organizer ID" });
      }

      // Ambil data dari request body
      const {
        title,
        description,
        registrationStartDate,
        registrationEndDate,
        eventStartDate,
        eventEndDate,
        price,
        location,
        attendedEvent,
        ticketType,
        totalTicket,
        category,
      } = req.body;

      // Validasi input
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "File is required" }); // Pastikan file ada
      }
      const { secure_url: imageUrl } = await cloudinaryUpload({
        userId,
        organizerId,
        file,
        folder: "event",
      });
      // Pastikan categoryIds adalah array dari angka

      // Membuat event baru dan menghubungkannya dengan kategori
      const event = await prisma.events.create({
        data: {
          title,
          slug: slugify(title, { lower: true }),
          description,
          imageUrl,
          registrationStartDate,
          registrationEndDate,
          eventStartDate,
          eventEndDate,
          price: Number(price),
          category,
          location,
          attendedEvent: Number(attendedEvent) || 0,
          ticketType,
          totalTicket: Number(totalTicket),
          organizer: {
            connect: {
              id: organizerId,
            },
          },
        },
      });

      return res.status(201).json({
        message: "Event created successfully",
        data: event,
      });
    } catch (error) {
      console.error("Error creating event:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res
          .status(400)
          .json({ message: "Database error: " + error.message });
      }

      next(error);
    }
  }

  async getEventAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.organizerId; // Gunakan optional chaining

      if (!organizerId) {
        return res.status(401).json({
          success: false,
          message: "Organizer ID is required."
        });
      }

      // Mengambil semua event dari organizer
      const events = await prisma.events.findMany({
        where: {
          organizerId: organizerId,
        },
        select: {
          id: true,
          title: true,
          totalTicket: true,
          attendedEvent: true,
        },
      });

      if (!events || events.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No events found",
          data: {
            events: [],
            summary: {
              totalTickets: 0,
              totalAttended: 0,
              totalNonAttended: 0,
              overallAttendanceRate: "0%"
            }
          }
        });
      }

      // Mengolah data untuk analytics
      const analytics = events.map(event => {
        const nonAttendedCount = event.totalTicket - (event.attendedEvent || 0); // Handle null attendedEvent
        const attendanceRate = event.totalTicket > 0
          ? ((event.attendedEvent || 0) / event.totalTicket * 100).toFixed(2)
          : "0.00";

        return {
          eventTitle: event.title,
          totalTickets: event.totalTicket,
          attendedCount: event.attendedEvent || 0,
          nonAttendedCount: nonAttendedCount,
          attendanceRate: `${attendanceRate}%`
        };
      });

      // Menghitung total keseluruhan
      const totals = events.reduce((acc, event) => {
        acc.totalTickets += event.totalTicket || 0;
        acc.totalAttended += event.attendedEvent || 0;
        acc.totalNonAttended += (event.totalTicket - (event.attendedEvent || 0));
        return acc;
      }, {
        totalTickets: 0,
        totalAttended: 0,
        totalNonAttended: 0
      });

      const overallAttendanceRate = totals.totalTickets > 0
        ? ((totals.totalAttended / totals.totalTickets) * 100).toFixed(2)
        : "0.00";

      return res.status(200).json({
        success: true,
        message: "Successfully retrieved event analytics",
        data: {
          events: analytics,
          summary: {
            ...totals,
            overallAttendanceRate: `${overallAttendanceRate}%`
          }
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Analytics Error:", error.message);
        return res.status(500).json({
          success: false,
          message: "Failed to retrieve analytics",
          error: error.message
        });
      }

    }
  }

  async editEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      if (!req.user || !req.user.organizerId) {
        return res.status(401).json({
          message: "Unauthorized: Organizer ID is required",
        });
      }

      const organizerId = String(req.user.organizerId);
      const slug = String(req.params.id);
      const event = await findEventBySlug(slug);

      if (!event) {
        return res.status(404).json({ message: "Event not found or not authorized" });
      }

      const {
        title,
        description,
        registrationStartDate,
        registrationEndDate,
        eventStartDate,
        eventEndDate,
        price,
        location,
        attendedEvent,
        ticketType,
        totalTicket,
        category,
      } = req.body;

      // Validasi title
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ message: "Title is required and must be a string" });
      }

      // Jika ada file baru, unggah ke Cloudinary
      let imageUrl = event.imageUrl;
      if (req.file) {
        const { secure_url } = await cloudinaryUpload({
          userId,
          organizerId,
          file: req.file,
          folder: "event",
        });
        imageUrl = secure_url;
      }

      // Generate new slug hanya jika title berubah
      const newSlug = title !== event.title ? slugify(String(title), { lower: true }) : event.slug;

      // Update event
      const updatedEvent = await prisma.events.update({
        where: { slug: slug },
        data: {
          title,
          slug: newSlug,
          description: description || event.description,
          imageUrl,
          registrationStartDate: registrationStartDate ? new Date(registrationStartDate) : event.registrationStartDate,
          registrationEndDate: registrationEndDate ? new Date(registrationEndDate) : event.registrationEndDate,
          eventStartDate: eventStartDate ? new Date(eventStartDate) : event.eventStartDate,
          eventEndDate: eventEndDate ? new Date(eventEndDate) : event.eventEndDate,
          price: Number(price) || 0,
          category: category || event.category,
          location: location || event.location,
          attendedEvent: Number(attendedEvent) || 0,
          ticketType: ticketType || event.ticketType,
          totalTicket: Number(totalTicket) || event.totalTicket,
        },
      });

      return res.status(200).json({
        message: "Event updated successfully",
        data: updatedEvent,
      });

    } catch (error) {
      console.error("Error updating event:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res
          .status(400)
          .json({ message: "Database error: " + error.message });
      }

      next(error);
    }
  }

}


export default new eventServices();
