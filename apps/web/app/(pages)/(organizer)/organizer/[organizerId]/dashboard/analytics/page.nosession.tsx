export default function PageNoSession() {
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Authentication Required
          </h2>
          <p className="text-gray-600 mt-2">
            Please sign in to view analytics.
          </p>
        </div>
      </div>
    </div>
  );
}
