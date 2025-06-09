export default function () {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white h-screen w-screen rounded shadow-md py-10 px-14 ">
        <h2 className="text-2xl font-bold mb-40">Task Manager</h2>
        <div className="flex-1">
            <div>
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-gray-600">Please enter your details to log in</p>
            </div>
          <form className="mt-6">
            <div className="mb-6">
              <label className="block text-sm  font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-xl px-3 py-2 mt-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm  font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 block w-xl px-3 py-2 mt-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-xl bg-blue-600 font-bold text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              LOGIN
            </button>
          </form>
        </div>
        <div>
            <p className="mt-4 text-sm text-gray-600">
                Dont&apos;t have an account?{' '}
                <a href="/auth/login" className="text-blue-600 font-medium underline">
                SignUp
                </a>
            </p>
        </div>
      </div>
      <div className="bg-blue-600 h-screen w-screen rounded shadow-md "></div>
    </div>
  );
}
