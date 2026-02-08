import { AlertTriangle } from 'lucide-react';

export default function UnauthorizedPage() {
  const message = 'You are not allowed to perform this operation.';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center mx-auto">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} className="text-red-400" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#ededed] px-4">{message}</h1>
      </div>
    </div>
  );
}
