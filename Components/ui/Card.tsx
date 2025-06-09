export default function Card() {
  return (
    <div className="bg-white h-auto rounded-2xl shadow-md py-3 px-5 w-250 max-w-lg mx-auto mt-15">
      <div className="flex gap-3">
        <div className="text-xs font-medium text-indigo-500 rounded bg-indigo-50 border border-indigo-800 px-3 py-1">
          Pending
        </div>
        <div className="text-xs font-medium text-amber-300 rounded bg-amber-50 border border-amber-800 px-3 py-1">
          Medium Priority
        </div>
      </div>
      <div>
        <h2 className="text-lg font-bold mt-2">Social Media Campaign</h2>
        <p className="text-gray-600 text-sm mt-1">
          This is a brief description of the task that needs to be completed.
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold ">Start Date </span>
          <span className="text-xs font-bold ">16th Mar 2023</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold ">Due Date </span>
          <span className="text-xs font-bold ">20th Mar 2023</span>
        </div>
      </div>
    </div>
  );
}
