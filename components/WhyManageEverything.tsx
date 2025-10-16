import { FiShield, FiTrendingUp, FiUsers, FiUserCheck } from "react-icons/fi";

export default function WhyManageEverything() {
  return (
    <section className="w-full py-16 bg-white flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Why We Manage Everything</h2>
      <p className="text-gray-700 text-lg mb-10 text-center max-w-2xl">
        Joint Venture Assets acts as the trusted middle-party to ensure successful outcomes
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl mb-12">
        {/* Legal Protection */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-yellow-500 rounded-full p-4 mb-4">
            <FiShield className="text-white text-2xl" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Legal Protection</h3>
          <p className="text-gray-700 text-sm">
            Specialized agreements for individuals, groups, cooperatives, and government entities
          </p>
        </div>
        {/* Risk Management */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-gray-900 rounded-full p-4 mb-4">
            <FiTrendingUp className="text-white text-2xl" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Risk Management</h3>
          <p className="text-gray-700 text-sm">
            Tailored risk assessment for different entity types and group structures
          </p>
        </div>
        {/* Conflict Resolution */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-yellow-500 rounded-full p-4 mb-4">
            <FiUserCheck className="text-white text-2xl" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Conflict Resolution</h3>
          <p className="text-gray-700 text-sm">
            Multi-party mediation for complex group and institutional partnerships
          </p>
        </div>
        {/* Expert Guidance */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-gray-900 rounded-full p-4 mb-4">
            <FiUsers className="text-white text-2xl" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Expert Guidance</h3>
          <p className="text-gray-700 text-sm">
            Specialized expertise in individual, group, cooperative, and government projects
          </p>
        </div>
      </div>
    </section>
  );
}
