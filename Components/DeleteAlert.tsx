export interface DeleteAlertProps {
  content: string;
  onDelete: () => void;
}

const DeleteAlert = ({ content, onDelete }: DeleteAlertProps) => {
  return (
    <div className="text-gray-800 dark:text-gray-100">
      <p className="text-sm">{content}</p>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium whitespace-nowrap
            text-rose-600 dark:text-rose-400 
            bg-rose-100 dark:bg-rose-950 
            border border-rose-200 dark:border-rose-700 
            rounded-lg px-4 py-2 transition-colors duration-200 hover:bg-rose-200 dark:hover:bg-rose-900"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;