import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Check, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Footer from '@/components/home/Footer';

const teamMembers = [
  {
    name: 'Casey Blue',
    role: 'General Property Manager',
    location: 'Arizona',
    phone: '+1 (480) 467-8760',
    email: 'Bluecasey22@gmail.com',
    image: 'https://le-de.cdn-website.com/5e84c417a30c4704a18ef1db9ac0fc14/dms3rep/multi/opt/Keith-f158fe42-1920w.jpg',
    isPrimary: true
  },
  {
    name: 'Jessica Darley',
    role: 'LYVR Property Manager',
    location: 'East Valley, AZ',
    phone: '+1 (480) 580-1102',
    email: 'jdarley17@gmail.com',
    image: 'https://le-de.cdn-website.com/5e84c417a30c4704a18ef1db9ac0fc14/dms3rep/multi/opt/Jessica-9ffe43ab-1920w.jpg'
  },
  {
    name: 'Tara Hill',
    role: 'LYVR Property Manager / Payson Wedding Venue Manager',
    location: 'Payson, AZ',
    phone: '+1 (928) 978-3042',
    email: 'thill595@yahoo.com',
    image: null
  },
  {
    name: 'Keirjsten Adams',
    role: 'LYVR Property Manager',
    location: 'Eden, UT',
    phone: '+1 (801) 628-7017',
    email: 'jkadams00@aol.com',
    image: null
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    selectedManager: 'Casey Blue'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const manager = teamMembers.find(m => m.name === formData.selectedManager) || teamMembers[0];

    // Open mailto with the selected manager's email
    const subject = encodeURIComponent(`Inquiry from ${formData.name} — LoveYourVacationRental.com`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${manager.email}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to={createPageUrl('Home')}
              onClick={() => window.scrollTo(0, 0)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-full transition-all duration-300 font-medium text-sm border border-amber-200"
            >
              ← Back to Home
            </Link>
            <Link to={createPageUrl('Home')} onClick={() => window.scrollTo(0, 0)} className="text-stone-800 font-light tracking-wide">
              LoveYourVacationRentals.com
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-amber-50 to-stone-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className="text-3xl md:text-5xl text-stone-800 mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Get in Touch
            </h1>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg">
              Our team of local property managers is here to help you find and plan the perfect family getaway.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2
          className="text-2xl md:text-3xl text-stone-800 text-center mb-4"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Meet Our Team
        </h2>
        <p className="text-stone-500 text-center mb-12 max-w-xl mx-auto">
          Each manager is local to their area and knows the best spots, restaurants, and activities.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${member.isPrimary ? 'ring-2 ring-amber-400' : ''}`}
            >
              {/* Photo */}
              <div className="h-56 bg-stone-200 overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-stone-200">
                    <User className="w-16 h-16 text-stone-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                {member.isPrimary && (
                  <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full mb-2">
                    Primary Contact
                  </span>
                )}
                <h3 className="text-lg font-semibold text-stone-800">{member.name}</h3>
                <p className="text-amber-700 text-sm mb-3" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  {member.role}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-stone-600">
                    <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0" />
                    {member.location}
                  </div>
                  <a href={`tel:${member.phone.replace(/\D/g, '')}`} className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition-colors">
                    <Phone className="w-4 h-4 text-stone-400 flex-shrink-0" />
                    {member.phone}
                  </a>
                  <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition-colors break-all">
                    <Mail className="w-4 h-4 text-stone-400 flex-shrink-0" />
                    {member.email}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <h2
              className="text-2xl text-stone-800 mb-2 text-center"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Send Us a Message
            </h2>
            <p className="text-stone-500 text-center mb-8">
              We'll get back to you within 24 hours.
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl text-stone-800 mb-2">Message Ready!</h3>
                <p className="text-stone-600 text-sm">Your email client should have opened with the message. If not, feel free to call or email directly.</p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', message: '', selectedManager: 'Casey Blue' });
                  }}
                >
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Your Name</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Smith"
                      required
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Send To</label>
                    <select
                      value={formData.selectedManager}
                      onChange={(e) => setFormData({ ...formData, selectedManager: e.target.value })}
                      className="w-full h-12 px-3 rounded-md border border-stone-200 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      {teamMembers.map(m => (
                        <option key={m.name} value={m.name}>
                          {m.name} — {m.location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your trip — dates, group size, what you're looking for..."
                    rows={5}
                    required
                    className="w-full px-3 py-3 rounded-md border border-stone-200 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSending}
                  className="w-full h-14 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-medium text-lg transition-all duration-300"
                >
                  {isSending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message
                      <Send className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
