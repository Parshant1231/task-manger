type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null; // ✅ don't forget `return null`

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full  max-h-full overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity-50">
      <div className="relative p-4 w-full max-w-2xl maxh-full">
        {/* Model content */}
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          {/* Model Header */}

          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>

            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:bg-gray-600 dark:hover:text-white cursor-pointer"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1L13 13M13 1L1 13"
                />
              </svg>
            </button>
          </div>

          {/* Model body */}
          <div className="p-4 md:p-5 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
