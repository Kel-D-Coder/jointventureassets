export default function ThreeStepProcess() {
  return (
    <section className="w-full py-16 bg-gray-50 flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
        Simple 3-Step Process
      </h2>
      <p className="text-gray-700 text-base sm:text-lg mb-10 text-center max-w-2xl">
        Get matched with the right partners in minutes, not months
      </p>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center">
        {/* Step 1 */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <div className="bg-gray-900 text-yellow-400 font-bold text-2xl w-16 h-16 flex items-center justify-center rounded-full mb-4 border-4 border-yellow-400">
            1
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">Register</h3>
          <p className="text-gray-700 text-center">
            Choose your role category (Individual, Cooperative, Government) and create your profile.
          </p>
        </div>
        {/* Step 2 */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <div className="bg-gray-900 text-yellow-400 font-bold text-2xl w-16 h-16 flex items-center justify-center rounded-full mb-4 border-4 border-yellow-400">
            2
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">Post Needs</h3>
          <p className="text-gray-700 text-center">
            Submit requests, form investor groups, and browse opportunities that match your criteria.
          </p>
        </div>
        {/* Step 3 */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <div className="bg-gray-900 text-yellow-400 font-bold text-2xl w-16 h-16 flex items-center justify-center rounded-full mb-4 border-4 border-yellow-400">
            3
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">Get Matched</h3>
          <p className="text-gray-700 text-center">
            Connect with verified partners, join investor groups, and manage large-scale joint ventures.
          </p>
        </div>
      </div>
    </section>
  );
}