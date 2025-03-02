/** @format */

import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import * as streamifier from "streamifier";

cloudinary.config(process.env.CLOUDINARY_URL!);

interface CloudinaryUploadOptions {
  userId?: string;
  organizerId?: string;
  folder: "profile" | "event" | "organizer" | "transactions"
}

export const cloudinaryUpload = ({
  userId,
  organizerId,
  folder,
  file,
}: CloudinaryUploadOptions & { file: { buffer: Buffer } }): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    if (!userId) return reject(new Error("userId is required"));

    let folderPath: string;

    switch (folder) {
      case "profile":
        folderPath = `profile/${userId}`;
        break;
      case "event":
        folderPath = `event/${userId}`;
        break;
      case "organizer":
        folderPath = `organizer/${userId}`;
        break;
      case "transactions":
        folderPath = `transactions/payment_proof/${userId}`;
        break;
      default:
        return reject(new Error("Invalid folder type")); // Menangani folder yang tidak valid
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath, // Menggunakan folderPath yang ditentukan oleh switch
      },
      (error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error) {
          return reject(error); // Error dari Cloudinary
        }
        if (!result) {
          return reject(new Error("Upload failed: No result returned.")); // Error jika tidak ada hasil
        }

        console.log("Cloudinary result:", result); // Log response dari Cloudinary untuk memastikan upload berhasil
        resolve(result); // Mengembalikan result jika ada
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });

export const extractPublicFromURL = (url: string): string => {
  const regex = /\/v\d+\/(.*)\.(jpg|jpeg|png|gif|webp)/; // Menangkap public_id dengan memperhitungkan versi dan ekstensi gambar
  const match = url.match(regex);
  return match ? match[1] : ""; // Mengembalikan public_id jika ditemukan
};
