export default function PageError({ error }: { error: string }) {
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-2">
            Error Loading Analytics
          </h2>
          <p className="text-gray-600">{error}</p>
          <p className="text-gray-500 mt-2">Please try again later.</p>
        </div>
      </div>
    </div>
  );
}
