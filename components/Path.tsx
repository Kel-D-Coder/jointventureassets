import { FiMapPin, FiBriefcase, FiUsers } from "react-icons/fi";

export default function Path() {
    return (
      <section className="w-full flex flex-col items-center mt-16 mb-10 px-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
          Choose Your Path
        </h2>
        <p className="text-gray-700 text-base sm:text-lg mb-10 text-center max-w-2xl">
          Whether you own land, have capital, or facilitate deals, we have the perfect solution for you.
        </p>
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl justify-center">
          {/* Landowner Card */}
          <div className="bg-green-50 rounded-xl p-7 flex-1 max-w-sm flex flex-col items-start shadow">
            <div className="bg-yellow-500 rounded-lg p-3 mb-4">
              <FiMapPin className="text-white text-2xl" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">I'm a Landowner</h3>
            <p className="text-gray-700 mb-4">
              Individual, cooperative, or government entity with land seeking partners to unlock development potential. Connect with verified investors and developer groups.
            </p>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">&#10003;</span>
                Connect with individual & group investors
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">&#10003;</span>
                Retain ownership while building
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">&#10003;</span>
                Professional project management
              </li>
            </ul>
            <a
              href="#landowner"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              Join as Landowner &rarr;
            </a>
          </div>
          {/* Investor/Developer Card */}
          <div className="bg-gray-100 rounded-xl p-7 flex-1 max-w-sm flex flex-col items-start shadow">
            <div className="bg-gray-900 rounded-lg p-3 mb-4">
              <FiBriefcase className="text-white text-2xl" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">I'm an Investor/Developer</h3>
            <p className="text-gray-700 mb-4">
              Individual investor, investment group, cooperative, or government entity with capital seeking land. Form investor groups for larger projects and shared financing.
            </p>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-gray-900">&#10003;</span>
                Access vetted land opportunities
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-900">&#10003;</span>
                Form or join investor groups
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-900">&#10003;</span>
                Streamlined partnership process
              </li>
            </ul>
            <a
              href="#investor"
              className="bg-gray-900 hover:bg-yellow-500 text-white hover:text-gray-900 font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              Join as Investor &rarr;
            </a>
          </div>
          {/* Mandate Card */}
          <div className="bg-yellow-100 rounded-xl p-7 flex-1 max-w-sm flex flex-col items-start shadow">
            <div className="bg-yellow-500 rounded-lg p-3 mb-4">
              <FiUsers className="text-white text-2xl" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">I'm a Mandate</h3>
            <p className="text-gray-700 mb-4">
              Individual, firm, or organization facilitating deals between landowners and investor groups. Specialize in large-scale government and cooperative projects.
            </p>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">&#10003;</span>
                Access to both sides of deals
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">&#10003;</span>
                Competitive commission structure
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">&#10003;</span>
                Professional support system
              </li>
            </ul>
            <a
              href="#mandate"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              Join as Mandate &rarr;
            </a>
          </div>
        </div>
      </section>
    )
}