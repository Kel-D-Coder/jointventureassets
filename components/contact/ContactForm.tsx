"use client";

import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useAppSelector } from "@/hooks/hooks";
import { sendContactMessage } from "@/lib/api/contact";
import { errorMessage } from "@/lib/api/errors";
import { Alert, Field, Select, SubmitButton, inputClass } from "@/components/ui/form";

const emptyForm = {
  fullName: "",
  emailAddress: "",
  phoneNumber: "",
  consultationType: "",
  subject: "",
  message: "",
};

const consultationTypes = ["General Inquiry", "Landowner Consultation", "Investor/Developer Consultation", "Buyer Consultation"];

export default function ContactForm() {
  const token = useAppSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");
      const response = await sendContactMessage(formData, token);
      setSuccessMsg(response.message);
      setFormData(emptyForm);
    } catch (error: unknown) {
      setErrorMsg(errorMessage(error, "Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-white p-6 shadow-[0_18px_40px_-28px_rgb(14_17_22/0.35)] sm:p-8">
      <h2 className="font-display text-2xl text-ink">Send us a message</h2>
      <p className="mt-1 text-sm text-muted">Fields marked * are required.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="fullName" required>
          <input id="fullName" name="fullName" type="text" autoComplete="name" required value={formData.fullName} onChange={handleChange} className={inputClass} />
        </Field>
        <Field label="Email address" htmlFor="emailAddress" required>
          <input id="emailAddress" name="emailAddress" type="email" autoComplete="email" required value={formData.emailAddress} onChange={handleChange} className={inputClass} />
        </Field>
        <Field label="Phone number" htmlFor="phoneNumber">
          <input id="phoneNumber" name="phoneNumber" type="tel" autoComplete="tel" value={formData.phoneNumber} onChange={handleChange} className={inputClass} />
        </Field>
        <Field label="What's it about?" htmlFor="consultationType">
          <Select id="consultationType" name="consultationType" value={formData.consultationType} onChange={handleChange} options={consultationTypes} placeholder="Select an option" />
        </Field>
        <Field label="Subject" htmlFor="subject" required className="sm:col-span-2">
          <input id="subject" name="subject" type="text" required value={formData.subject} onChange={handleChange} className={inputClass} placeholder="e.g. Joint venture on my land in Ikorodu" />
        </Field>
        <Field label="Message" htmlFor="message" required className="sm:col-span-2">
          <textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleChange} className={inputClass} placeholder="Tell us about your project, what you need, or any questions." />
        </Field>
      </div>

      {successMsg ? <Alert tone="success" className="mt-6">{successMsg}</Alert> : null}
      {errorMsg ? <Alert tone="error" className="mt-6">{errorMsg}</Alert> : null}

      <div className="mt-6 sm:w-60">
        <SubmitButton loading={loading} loadingText="Sending…">
          Send message <FiArrowRight aria-hidden="true" />
        </SubmitButton>
      </div>
    </form>
  );
}
