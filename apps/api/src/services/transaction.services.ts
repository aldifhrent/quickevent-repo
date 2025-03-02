// transactionService.ts
import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import { TransactionStatus } from "@prisma/client";
import { cloudinaryUpload, extractPublicFromURL } from "@/helpers/cloudinary";
import "@/interface/global.interface"; //

class TransactionService {
  async createTransaction(req: Request, res: Response) {
    const userId = req.user.id;
    const file = req.file;
    const organizerId = req.user.organizerId;

    try {
      let data = req.body;
      if (typeof req.body === "string") {
        try {
          data = JSON.parse(req.body);
        } catch (e) {
          console.error("Error parsing body:", e);
        }
      }

      const { eventId, totalAmount, quantity, expiresAt } = data;

      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: "Missing eventId",
          receivedBody: data,
        });
      }

      const eventIdNumber = Number(eventId);

      // Check event exists and get price
      const event = await prisma.events.findUnique({
        where: { id: eventIdNumber },
        select: {
          attendedEvent: true,
          totalTicket: true,
          price: true,
        },
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event Not Found",
        });
      }

      // Validate ticket quantity input
      if (quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid ticket quantity",
        });
      }

      // Validate ticket availability
      const availableTickets = event.totalTicket - (event.attendedEvent || 0);


      if (availableTickets < quantity) {
        return res.status(400).json({
          success: false,
          message: `Tiket tidak mencukupi. Sisa tiket tersedia: ${availableTickets}`,
        });
      }

      // Handle payment proof based on event price
      let paymentProof;
      if (event.price > 0) {
        if (!file) {
          return res.status(400).json({
            success: false,
            message: "Payment proof required for paid events",
          });
        }
        const { secure_url: paymentProofUrl } = await cloudinaryUpload({
          userId,
          organizerId,
          file,
          folder: "transactions",
        });
        paymentProof = paymentProofUrl;
      }

      const newTransaction = await prisma.transaction.create({
        data: {
          totalAmount: Number(totalAmount),
          quantity: Number(quantity),
          paymentProof,
          status: "WAITING_CONFIRMATION",
          expiresAt: new Date(expiresAt),
          user: {
            connect: { id: userId },
          },
          event: {
            connect: { id: eventIdNumber },
          },
        },
      });

      // Update event attendance count
      await prisma.events.update({
        where: { id: eventIdNumber },
        data: {
          attendedEvent: {
            increment: Number(quantity),
          },
        },
      });

      return res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        data: newTransaction,
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create transaction",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async deleteExpiredTransactions(req?: Request, res?: Response) {
    try {
      const now = new Date();

      const deletedTransactions = await prisma.transaction.deleteMany({
        where: {
          OR: [
            {
              status: TransactionStatus.WAITING_PAYMENT,
              expiresAt: { lte: now },
            },
            { status: TransactionStatus.EXPIRED },
          ],
        },
      });

      console.log(
        `Deleted ${deletedTransactions.count} expired or pending transactions`
      );

      if (res) {
        return res.status(200).json({
          success: true,
          message: `${deletedTransactions.count} expired transactions deleted`,
        });
      }
    } catch (error) {
      console.error("Error deleting expired transactions:", error);
      if (res) {
        return res.status(500).json({
          success: false,
          message: "Failed to delete expired transactions",
        });
      }
    }
  }

  async getAllTransactions(req: Request, res: Response) {
    try {
      const transactions = await prisma.transaction.findMany({
        include: {
          event: true,
        },
      });

      return res.status(200).json({
        success: true,
        data: transactions,
      });
    } catch (error) { }
  }

  async getTransactionStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Transaction ID is required",
        });
      }

      const transaction = await prisma.transaction.findUnique({
        where: {
          id: id,
          userId: userId,
        },
        select: {
          id: true,
          eventId: true,
          status: true,
          quantity: true,
          totalAmount: true,
          createdAt: true,
          expiresAt: true,
          event: {
            select: {
              title: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      });

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found",
        });
      }

      // Cek apakah transaksi sudah expired
      if (
        transaction.status === "WAITING_CONFIRMATION" &&
        transaction.expiresAt &&
        new Date() > new Date(transaction.expiresAt)
      ) {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: "EXPIRED" },
        });

        transaction.status = "EXPIRED";
      }

      return res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      console.error("Error getting transaction status:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to get transaction status",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }


  async getTransactionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Transaction ID is required",
        });
      }

      const transaction = await prisma.transaction.findUnique({
        where: {
          id: id,
          userId: userId, // Memastikan transaksi milik user yang sedang login
        },
        select: {
          id: true,
          eventId: true,
          status: true,
          quantity: true,
          totalAmount: true,
          createdAt: true,
          expiresAt: true,
          event: {
            select: {
              title: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      });

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      console.error("Error getting transaction by ID:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to get transaction by ID",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getTransactionsByOrganizer(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(404).json({
          message: "Invalid Organizer Id",
        });
      }

      const events = await prisma.events.findMany({
        where: {
          organizerId: id,
        },
        select: {
          id: true,
          title: true,
          price: true,
          imageUrl: true,
          transactions: {
            where: {
              status: {
                in: [
                  "CANCELED",
                  "WAITING_PAYMENT",
                  "EXPIRED",
                  "REJECTED",
                  "WAITING_CONFIRMATION",
                ],
              },
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      const formattedData = events.map((event) => ({
        eventId: event.id,
        eventTitle: event.title,
        eventPrice: event.price,
        eventImage: event.imageUrl,
        transactionCount: event.transactions.length,
        transactions: event.transactions,
      }));

      return res.status(200).json({
        success: true,
        data: formattedData,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data transaksi",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async verifyTransaction(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { action } = req.body;
      const organizerId = req.user.organizerId;

      // Cek apakah transaksi ada dan terkait dengan event dari organizer tersebut
      const transaction = await prisma.transaction.findFirst({
        where: {
          id: id,
          event: {
            organizerId: organizerId,
          },
        },
        include: {
          event: true,
        },
      });

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: "Transaksi tidak ditemukan atau Anda tidak memiliki akses",
        });
      }

      if (action === "DONE") {
        // Mengkonfirmasi transaksi
        const updatedTransaction = await prisma.transaction.update({
          where: { id: id },
          data: { status: "DONE" }
        });

        return res.status(200).json({
          success: true,
          message: "Transaksi berhasil dikonfirmasi",
          data: updatedTransaction,
        });
      } else if (action === "CANCEL") {
        // Membatalkan transaksi
        await prisma.transaction.delete({
          where: { id: id }
        });

        // Update jumlah tiket yang tersedia (mengembalikan kuota)
        await prisma.events.update({
          where: { id: transaction.eventId },
          data: {
            attendedEvent: {
              decrement: transaction.quantity,
            },
          },
        });

        return res.status(200).json({
          success: true,
          message: "Transaksi berhasil dibatalkan dan dihapus",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Action tidak valid. Gunakan 'DONE' atau 'CANCEL'",
        });
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal memproses transaksi",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default new TransactionService();
