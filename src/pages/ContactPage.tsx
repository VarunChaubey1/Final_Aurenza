import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Consultation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      showToast('Thank you! Our skin specialist will respond within 24 hours.', 'success');
    }
  };

  return (
    <div className="bg-[#FFF9F4] dark:bg-[#121816] transition-colors py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#D6A34A] block">
            Dedicated Customer Care
          </span>
          <h1 className="font-serif text-4xl font-bold text-[#2F5D50] dark:text-white">
            Get In Touch
          </h1>
          <p className="text-xs text-gray-500">
            Have questions about ingredient layering, order tracking, or skin diagnostics?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info Card */}
          <div className="lg:col-span-5 bg-[#2F5D50] text-white p-8 rounded-[32px] shadow-xl space-y-6 border border-white/10">
            <h3 className="font-serif text-2xl font-bold text-[#D6A34A]">Aurenza Concierge</h3>
            <p className="text-xs text-white/80 leading-relaxed font-light">
              Our clinical consultation desk is available 6 days a week to guide your skincare regimen choices.
            </p>

            <div className="space-y-4 pt-4 text-xs">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D6A34A]" />
                <span>care@aurenza.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D6A34A]" />
                <span>+91 1800 287 369 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#D6A34A]" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM IST</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D6A34A] flex-shrink-0" />
                <span>Aurenza Botanical Science Park, Cyber City Phase II, Gurugram, India</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1B2320] p-8 rounded-[32px] border border-[#E8DFD8] dark:border-[#2C3834] shadow-md">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#2F5D50] dark:text-[#D6A34A] mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-[#1F1F1F] dark:text-white">Message Dispatched!</h3>
                <p className="text-xs text-gray-500">
                  We received your message regarding "{subject}". A skin concierge specialist will reply to {email}.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-[#2F5D50] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="w-full p-3 text-xs bg-[#FFF9F4] dark:bg-[#121816] rounded-xl border border-[#E8DFD8] dark:border-[#2C3834]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full p-3 text-xs bg-[#FFF9F4] dark:bg-[#121816] rounded-xl border border-[#E8DFD8] dark:border-[#2C3834]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full p-3 text-xs bg-[#FFF9F4] dark:bg-[#121816] rounded-xl border border-[#E8DFD8] dark:border-[#2C3834] font-bold"
                  >
                    <option value="Product Consultation">Product / Regimen Consultation</option>
                    <option value="Order Tracking">Order & Delivery Status</option>
                    <option value="Dermatologist Inquiry">Dermatologist Inquiry</option>
                    <option value="Press / Media">Press / Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Message</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={4}
                    required
                    placeholder="How can our skin specialist assist you today?"
                    className="w-full p-3 text-xs bg-[#FFF9F4] dark:bg-[#121816] rounded-xl border border-[#E8DFD8] dark:border-[#2C3834]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2F5D50] hover:bg-[#1f4238] text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Send className="w-4 h-4 text-[#D6A34A]" /> Send Message
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
