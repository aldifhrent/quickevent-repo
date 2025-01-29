"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* Left Section: Branding / Illustration */}
      <div className="hidden items-center justify-center bg-black dark:bg-gray-900 lg:flex lg:w-5/12">
        {/* <Image
          src="https://media.istockphoto.com/id/1191395009/vector/group-of-people-stand-near-big-calendar-watches-document-time-management-work-schedule.jpg?s=612x612&w=0&k=20&c=v1YF-esfPoKrCsXS3P3xvPyAZvxe6Tw8flwM3Rl5Wiw=" // Ganti dengan gambar branding Anda
          alt="Authentication Illustration"
          width={500}
          height={500}
          className="h-screen w-full object-contain"
        /> */}
      </div>

      {/* Right Section: Form Content */}
      <div className="flex h-screen w-full flex-col items-center justify-center px-6 sm:px-12 lg:w-1/2">
        {children}
      </div>
    </div>
  );
}
