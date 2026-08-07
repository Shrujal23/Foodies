import React, { useState } from 'react';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
   
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';


export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] px-6 py-16 dark:bg-gray-950 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <div className="mb-12 rounded-[2rem] border border-[#f4ddce] bg-gradient-to-r from-orange-500/10 via-pink-500/5 to-rose-500/10 px-8 py-12 text-center shadow-sm backdrop-blur-sm dark:border-gray-800/30 dark:from-orange-900/20 dark:via-pink-900/10 dark:to-rose-900/20">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 px-6 py-3 text-lg font-semibold text-white shadow-2xl shadow-orange-500/40 animate-pulse-glow">
            We'd Love to Hear From You
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-700 dark:text-gray-300 sm:text-xl">
            Question, recipe idea, or just want to say hello? We’re here — with warmth and a smile.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-2">

          {/* Form */}
          <div className="rounded-[1.5rem] border border-[#f4ddce] bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-10 lg:p-12">
            <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Send us a Message</h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400">We'll get back to you as soon as possible!</p>

            {status === 'success' && (
              <div className="mb-8 rounded-[1.25rem] bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center text-white shadow-lg">
                <CheckCircleIcon className="mx-auto mb-4 h-16 w-16" />
                <p className="text-2xl font-bold">Thanks!</p>
                <p className="text-lg opacity-90">Your message has been sent. We’ll reply soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Your Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-3 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="Priya Singh" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-3 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="priya@example.com" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-3 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="Missing my mom’s aloo paratha recipe..." />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={6} className="w-full resize-none rounded-2xl border border-gray-300 bg-white px-5 py-3 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="Tell us what’s on your mind..." />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-600 to-pink-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-orange-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending...' : (
                  <>
                    Send Message
                    <PaperAirplaneIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            {[
              { icon: EnvelopeIcon, title: "Email Us", text: "namaste@yoursite.com", href: "mailto:namaste@yoursite.com" },
              { icon: PhoneIcon, title: "Call / WhatsApp", text: "+91 98765 43210", href: "https://wa.me/919876543210" },
              { icon: MapPinIcon, title: "Based in", text: "Mumbai, India", href: "#" },
            ].map((item, i) => (
              <a key={i} href={item.href} className="group block rounded-[1.25rem] border border-[#f4ddce] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-center gap-5">
                  <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 p-4 text-white shadow-md transition-transform group-hover:scale-105">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-base font-medium text-orange-600 dark:text-pink-400">{item.text}</p>
                  </div>
                </div>
              </a>
            ))}

            {/* Beautiful Final CTA */}
            <div className="rounded-[1.5rem] border border-[#f4ddce] bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <p className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Your feedback makes our recipes better
              </p>
              <div className="mx-auto inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-pink-600 p-6 text-white shadow-2xl shadow-orange-500/40 animate-pulse-glow">
                <HeartSolid className="h-10 w-10 text-rose-100" />
              </div>
              <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
                From our kitchen to yours — with love
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}