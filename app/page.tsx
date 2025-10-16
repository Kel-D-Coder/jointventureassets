import Image from "next/image";
import Navbar from "../components/Navbar";
import { FiMapPin, FiBriefcase, FiUsers } from "react-icons/fi";
import Path from "@/components/Path";
import ThreeStepProcess from "@/components/ThreeStepProcess";
import WhyJVA from "@/components/WhyJVA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-24 py-32 ">
      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left max-w-xl lg:max-w-5xl w-full gap-12">
        {/* Left Side (Text) */}
        <div className="flex flex-col items-center lg:items-start w-full lg:w-1/2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 lg:mb-4">
            Where Land Meets{" "}
            <span className="text-yellow-400">Capital & Vision</span>
          </h1>
          <p className="text-gray-200 text-base sm:text-lg lg:text-xl mb-8 lg:mb-10 max-w-md lg:max-w-lg">
            Connect landowners, individual & group investors, cooperatives,
            government entities, and mandates for profitable real estate joint
            ventures. We manage the process, you reap the rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs lg:max-w-md">
            <a
              href="#get-started"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg shadow transition-colors flex items-center justify-center"
            >
              Get Started Today &rarr;
            </a>
            <a
              href="#how-it-works"
              className="border border-white text-white font-medium py-3 px-6 rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              Learn How It Works
            </a>
          </div>
        </div>
        {/* Right Side (Optional Image for Desktop) */}
        <div className="hidden lg:flex w-1/2 justify-center items-center">
          {/* Replace with your own image if desired */}
          <Image
            src="/hero-real-estate.jpg"
            alt="Real Estate Joint Venture"
            width={400}
            height={400}
            className="rounded-xl shadow-lg object-cover"
            priority
          />
        </div>
      </main>
    </div>
    <Path />
    <ThreeStepProcess />
    <WhyJVA />
    </>
  );
}
