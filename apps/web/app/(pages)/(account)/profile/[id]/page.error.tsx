import Link from "next/link";

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-6xl font-extrabold text-red-500">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">
        Profile Not Found
      </h2>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        Sorry, the profile you are looking for does not exist or has been
        removed. Please go back to the homepage or check the URL again.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
