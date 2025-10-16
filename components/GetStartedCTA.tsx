export default function GetStartedCTA() {
  return (
    <section className="w-full py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">Ready to Get Started?</h2>
      <p className="text-gray-200 text-lg mb-8 text-center max-w-2xl">
        Join individuals, groups, cooperatives, and government entities in successful partnerships and unlock the potential of your real estate ventures.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="#get-started"
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow transition-colors flex items-center justify-center"
        >
          Start Your Journey &rarr;
        </a>
        <a
          href="#consultation"
          className="bg-white border border-gray-300 hover:bg-gray-900 hover:text-white text-gray-900 font-semibold px-6 py-3 rounded-lg shadow transition-colors flex items-center justify-center"
        >
          Book Consultation
        </a>
      </div>
    </section>
  );
}
