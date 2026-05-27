// src/pages/ContactUs.js
import React, { useState } from 'react';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  SparklesIcon,
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-gray-950 dark:via-gray-900 dark:to-black py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-lg shadow-2xl shadow-pink-500/30 mb-8 animate-pulse-glow">
            <SparklesIcon className="w-7 h-7" />
            We'd Love to Hear From You
          </div>
          <h1 className="text-6xl lg:text-8xl font-extrabold text-gradient mb-6">
            Get in Touch
          </h1>
          <p className="text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Question, recipe idea, or just want to say namaste? We’re here — with chai and a smile
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Form */}
          <div className="glass-card-hover p-10 lg:p-12 rounded-3xl">
            <h2 className="text-4xl font-bold text-gradient mb-10">Send us a Message</h2>

            {status === 'success' && (
              <div className="mb-8 p-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl text-white text-center animate-float">
                <CheckCircleIcon className="w-20 h-20 mx-auto mb-4" />
                <p className="text-2xl font-bold">Dhanyavaad!</p>
                <p className="text-lg opacity-90">Your message has been sent. We’ll reply jaldi!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="form-label">Your Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" placeholder="Priya Singh" />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" placeholder="priya@example.com" />
                </div>
              </div>

              <div>
                <label className="form-label">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="form-input" placeholder="Missing my mom’s aloo paratha recipe..." />
              </div>

              <div>
                <label className="form-label">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={6} className="form-input resize-none" placeholder="Batao na..." />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary w-full text-xl py-6 flex items-center justify-center gap-4 group"
              >
                {status === 'sending' ? 'Sending...' : (
                  <>
                    Send Message
                    <PaperAirplaneIcon className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-12">
            {[
              { icon: EnvelopeIcon, title: "Email Us", text: "namaste@yoursite.com", href: "mailto:namaste@yoursite.com" },
              { icon: PhoneIcon, title: "Call / WhatsApp", text: "+91 98765 43210", href: "https://wa.me/919876543210" },
              { icon: MapPinIcon, title: "Based in", text: "Mumbai, India", href: "#" },
            ].map((item, i) => (
              <a key={i} href={item.href} className="glass-card-hover p-8 rounded-3xl block group transition-all duration-500 hover:shadow-glow-pink">
                <div className="flex items-center gap-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-xl group-hover:scale-110 transition-transform">
                    <item.icon className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-xl text-orange-600 dark:text-pink-400 font-semibold">{item.text}</p>
                  </div>
                </div>
              </a>
            ))}

            {/* Beautiful Final CTA */}
            <div className="text-center py-12">
              <p className="text-3xl font-bold text-gradient mb-8">
                Your feedback makes our recipes better
              </p>
              <div className="inline-flex items-center gap-8 p-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-2xl shadow-pink-500/50 animate-pulse-glow">
                <HeartSolid className="w-16 h-16 text-rose-200" />
                {/* <CurryBowlIcon />
                <IndianFlagIcon /> */}
              </div>
              <p className="text-2xl mt-8 text-gray-700 dark:text-gray-300">
                From our kitchen to yours — with love
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}