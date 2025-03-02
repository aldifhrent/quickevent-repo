import { prisma } from "lib/prisma";

// Fungsi untuk mencari event yang akan datang (upcoming) dengan pagination
export async function findUpcomingEvent(page: number, limit: number) {
  const skip = (page - 1) * limit;
  return prisma.events.findMany({
    where: {
      eventStartDate: {
        gte: new Date(),
      }
    },
    skip,
    take: limit,
    include: {
      organizer: true,
    },
  });
}

// Fungsi untuk menghitung jumlah event upcoming
export async function countUpcomingEvents() {
  return prisma.events.count({
    where: {
      eventStartDate: {
        gte: new Date(),
      },
    },
  });
}

// Fungsi untuk mencari event terbaru (new) dengan pagination
export async function findNewEvents(page: number, limit: number) {
  const skip = (page - 1) * limit;
  return prisma.events.findMany({
    orderBy: {
      createdAt: "desc", // Event yang baru dibuat
    },
    skip,
    take: limit,
    include: {
      organizer: true,

    },
  });
}

// Fungsi untuk menghitung jumlah event terbaru
export async function countNewEvents() {
  return prisma.events.count();
}


export const findEventBySlug = async (slug: string) => {
  return await prisma.events.findUnique({
    where: {
      slug: slug,
    },
    include: {
      organizer: {
        select: {
          logoUrl: true,
          organizerName: true,
        },
      },
    },
  });
};
