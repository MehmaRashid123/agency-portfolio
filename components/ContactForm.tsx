"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Settings } from "@/lib/api";

const DEFAULT_SERVICES = ["Graphic Design","Web Development","3D Art & Animation","Other / Multiple"];
const DEFAULT_BUDGETS = ["Under $5,000","$5,000 – $15,000","$15,000 – $30,000","$30,000+","Not sure yet"];

interface FormData { name: string; email: string; service: string; budget: string; message: string }

export default function ContactForm({ settings }: { settings?: Settings }) {
  const [form, setForm] = useState<FormData>({ name: "", email: "", service: "", budget: "", message: "" });
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const serviceOptions = settings?.contact?.serviceOptions?.length ? settings.contact.serviceOptions : DEFAULT_SERVICES;
  const budgetOptions = settings?.contact?.budgetOptions?.length ? settings.contact.budgetOptions : DEFAULT_BUDGETS;
  const successMsg = settings?.contact?.formSuccessMessage || "We'll get back to you within 24 hours.";

  useEffect(() => {
    const fields = formRef.current?.querySelectorAll(".form-field");
    if (!fields) return;
    gsap.fromTo(fields, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out", delay: 0.2 });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setStatus("success"); setForm({ name: "", email: "", service: "", budget: "", message: "" }); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col gap-4 py-12">
        <span className="text-4xl" aria-hidden="true">✓</span>
        <h2 className="heading-md">Message sent.</h2>
        <p className="opacity-60">{successMsg}</p>
        <button onClick={() => setStatus("idle")} className="btn btn-outline self-start mt-4">Send another</button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate aria-label="Contact form">
      <div className="form-field" style={{ opacity: 0 }}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Your name" required autoComplete="name" />
      </div>
      <div className="form-field" style={{ opacity: 0 }}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required autoComplete="email" />
      </div>
      <div className="form-field" style={{ opacity: 0 }}>
        <label htmlFor="service">Service Needed</label>
        <select id="service" name="service" value={form.service} onChange={handleChange} required>
          <option value="" disabled>Select a service</option>
          {serviceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="form-field" style={{ opacity: 0 }}>
        <label htmlFor="budget">Budget Range</label>
        <select id="budget" name="budget" value={form.budget} onChange={handleChange} required>
          <option value="" disabled>Select a budget</option>
          {budgetOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="form-field" style={{ opacity: 0 }}>
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your project..." required rows={5} />
      </div>
      {status === "error" && <p className="text-sm text-red-400" role="alert">Something went wrong. Please try again or email us directly.</p>}
      <button type="submit" className="btn btn-primary self-start" disabled={status === "loading"} aria-busy={status === "loading"} style={{ opacity: 0 }}>
        {status === "loading" ? "Sending..." : "Send Message →"}
      </button>
    </form>
  );
}
