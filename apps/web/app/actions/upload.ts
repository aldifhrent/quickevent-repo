import { api } from "@/lib/api";

export const uploadAvatar = async (formData: FormData, token: string) =>
  await api(
    "/auth/profile/image",
    "POST",
    {
      body: formData,
    },
    token
  );


export const uploadProof = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append("file", file);

  await api(
    "/transactions/payment-proof",
    "POST",
    {
      body: formData,
    },
    token
  );
};
