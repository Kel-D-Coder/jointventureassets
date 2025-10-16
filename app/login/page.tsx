export default function Login() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4">
      <form className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 flex flex-col gap-7 border border-gray-100">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center mb-2">
          <div className="bg-gray-900 text-white rounded-lg px-3 py-2 font-bold text-sm mb-2 shadow">
            JVA
          </div>
          <span className="font-bold text-gray-900 text-lg mb-2">Joint Venture Assets</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-1">Welcome Back</h1>
        <p className="text-gray-700 text-center mb-4">Sign in to your Joint Venture Assets account</p>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            type="email"
            required
            placeholder="Enter your email"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-400 bg-gray-50"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            required
            placeholder="Enter your password"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-400 bg-gray-50"
          />
        </div>
        <div className="flex justify-end">
          <a href="#forgot" className="text-sm text-yellow-500 hover:underline font-medium">Forgot password?</a>
        </div>
        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg py-3 mt-2 transition-colors shadow"
        >
          Sign In
        </button>
        <p className="text-center text-gray-700 text-sm mt-2">
          Don't have an account?{' '}
          <a href="#get-started" className="font-bold text-gray-900 hover:text-yellow-500">Get Started</a>
        </p>
      </form>
    </div>
  );
}
