import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import ContactForm from "@/components/ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Joint Venture Assets - Get Expert Real Estate Partnership Guidance",
  description: "Ready to start your joint venture journey? Contact Joint Venture Assets for expert guidance on real estate partnerships. Free consultation available for landowners, investors, cooperatives, and government entities.",
  keywords: ["Joint Venture Assets", "JVA", "contact", "real estate partnerships", "joint ventures", "landowners", "investors", "consultation", "property development"],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
    }
  }
};

export default function Contact() {
  return (
    <div
      className="bg-gray-50 min-h-screen py-16 px-4 flex flex-col items-center"
    >
      <h1
        className="text-3xl font-bold text-gray-900 mb-2 text-center"
      >
        Contact Us
      </h1>
      <p
        className="text-gray-700 text-base sm:text-lg mb-10 text-center max-w-xl"
      >
        Ready to start your joint venture journey? Get in touch with our team for expert guidance and consultation.
      </p>
      <div
        className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl"
      >
        {/* Contact Info */}
        <div className="flex-1 flex flex-col gap-6">
          <div
            className="bg-white rounded-xl shadow p-7"
          >
            <h2 className="font-bold text-lg text-gray-900 mb-4">Get in Touch</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <FiPhone className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Phone</div>
                  <div className="text-gray-700 text-sm">+234 8140431570<br />+234 9063665415</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <FiMail className="text-gray-900 text-xl" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Email</div>
                  <div className="text-gray-700 text-sm">
                    info@jointventureassets.com<br />
                    partnerships@jointventureassets.com
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <FiMapPin className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Office</div>
                  <div className="text-gray-700 text-sm">
                    No 2 off Surulere Street,<br />Dopemu, Lagos, Nigeria
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <FiClock className="text-gray-900 text-xl" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Business Hours</div>
                  <div className="text-gray-700 text-sm">
                    Monday - Friday: 8:00 AM - 5:00 PM<br />
                    Saturday: 10:00 AM - 2:00 PM<br />
                    Sunday: Closed
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Why Contact Card */}
          <div
            className="bg-gray-900 rounded-xl p-6 mt-6 text-white shadow flex flex-col gap-3"
          >
            <h3 className="font-bold text-lg mb-2">Why Contact Joint Venture Assets?</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">&#10003;</span>
                Expert guidance on individual, group, and government partnerships
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">&#10003;</span>
                Free initial consultation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">&#10003;</span>
                Access to vetted individual, cooperative, and government partners
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">&#10003;</span>
                Full project management for all partnership types
              </li>
            </ul>
          </div>
        </div>
        {/* Contact Form */}
        <ContactForm />
      </div>
    </div>
  );
}