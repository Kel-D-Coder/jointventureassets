import { FiStar, FiTrendingUp } from "react-icons/fi";
import { FaUsersCog } from "react-icons/fa";

export default function WhyJVA() {
  return (
    <section className="w-full py-16 flex flex-col items-center bg-white">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-10 px-4">
        {/* Left: Features */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Joint Venture Assets?
          </h2>
          <p className="text-gray-700 text-lg mb-8 max-w-xl">
            We don't just connect people – we manage the entire process to ensure successful partnerships and profitable outcomes for everyone involved.
          </p>
          <div className="space-y-7">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 rounded-lg p-3">
                <FiStar className="text-yellow-500 text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Verified Partners</h3>
                <p className="text-gray-700">
                  All individuals, cooperatives, and government entities are thoroughly vetted.
                </p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <FiTrendingUp className="text-gray-900 text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Group Investment Support</h3>
                <p className="text-gray-700">
                  Facilitate group investments and cooperative financing for large-scale projects.
                </p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 rounded-lg p-3">
                <FaUsersCog className="text-yellow-500 text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Full-Service Management</h3>
                <p className="text-gray-700">
                  From matching to completion, we manage individual, group, and government projects.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Right: CTA Card */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-2xl p-8 w-full max-w-md shadow-lg flex flex-col justify-center">
            <h3 className="text-white font-bold text-2xl mb-3">Ready to Start?</h3>
            <p className="text-gray-200 mb-6">
              Join individuals, cooperatives, and government entities in successful partnerships and unlock the potential of your real estate ventures.
            </p>
            <a
              href="#get-started"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-5 py-3 rounded-lg transition-colors flex items-center justify-center w-fit"
            >
              Get Started Now &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}