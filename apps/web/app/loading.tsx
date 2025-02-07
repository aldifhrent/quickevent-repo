export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 mt-4">Loading...</p>
    </div>
  );
}
