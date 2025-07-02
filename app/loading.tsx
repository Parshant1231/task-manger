// app/loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 text-slate-700">
      {/* Icons marching with animation */}
      <div className="flex items-center space-x-6 mb-4">
        {/* Task Icon */}
        <div className="flex flex-col items-center animate-bounce">
          <div className="p-3 bg-indigo-100 rounded-xl shadow">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 12h6M9 16h6M9 8h6M5 12h.01M5 16h.01M5 8h.01" />
            </svg>
          </div>
        </div>

        {/* Todo Icon */}
        <div className="flex flex-col items-center animate-bounce [animation-delay:150ms]">
          <div className="p-3 bg-yellow-100 rounded-xl shadow">
            <svg
              className="w-6 h-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 12l2 2l4 -4M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </div>

        {/* Attachments Icon */}
        <div className="flex flex-col items-center animate-bounce [animation-delay:300ms]">
          <div className="p-3 bg-green-100 rounded-xl shadow">
            <svg
              className="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M16.5 15.5l-6 6a4.243 4.243 0 01-6-6l10-10a2.828 2.828 0 114 4l-10 10a1 1 0 01-1.5-1.5l9.5-9.5" />
            </svg>
          </div>
        </div>

        {/* Users Icon */}
        <div className="flex flex-col items-center animate-bounce [animation-delay:450ms]">
          <div className="p-3 bg-pink-100 rounded-xl shadow">
            <svg
              className="w-6 h-6 text-pink-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M17 20h5v-1a4 4 0 00-5-4M9 20H4v-1a4 4 0 015-4m8-4a4 4 0 11-8 0a4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-sm mt-1">
          <span className="text-pink-600 font-bold">S</span>
          <span className="text-slate-800 lowercase">y</span>
          <span className="text-emerald-600 uppercase">N</span>
          <span className="text-yellow-600 lowercase">c</span>
          <span className="text-indigo-600 uppercase">I</span>
          <span className="text-purple-600 lowercase">n</span>
          <span className="text-pink-600 uppercase">G</span>
          &nbsp;
          <span className="text-gray-400">•</span>
          &nbsp;
          <span className="text-cyan-700 uppercase">R</span>
          <span className="text-orange-500 lowercase">e</span>
          <span className="text-lime-600 uppercase">A</span>
          <span className="text-sky-500 lowercase">l</span>
          <span className="text-rose-500 uppercase">I</span>
          <span className="text-teal-500 lowercase">t</span>
          <span className="text-gray-700 lowercase">i</span>
          <span className="text-indigo-400 lowercase">e</span>
          <span className="text-fuchsia-600 lowercase">s</span>
          <span className="text-gray-500">...</span>
        </p>
      </div>
    </div>
  );
}
