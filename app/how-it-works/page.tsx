
import Process from "@/components/Process";
import WhyManageEverything from "@/components/WhyManageEverything";
import GetStartedCTA from "@/components/GetStartedCTA";

export default function HowItWorks() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 py-16 px-4 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">How Joint Venture Assets Works</h1>
        <p className="text-gray-200 text-lg mb-2 text-center max-w-2xl">
          A comprehensive guide to our proven process for individual, group, cooperative, and government partnerships
        </p>
      </section>

  {/* Process Section */}
  <Process />
  <WhyManageEverything />
  <GetStartedCTA />
    </div>
  );
}
