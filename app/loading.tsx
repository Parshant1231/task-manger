// app/loading.tsx
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-gray-800">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid" />
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
}
