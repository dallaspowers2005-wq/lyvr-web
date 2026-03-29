import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Heart, BookOpen, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await base44.entities.NewsletterSubscriber.create({ email });
    } catch (dbErr) {
      // DB save is optional, continue to Mailchimp
    }

    try {
      const { data } = await base44.functions.invoke('newsletterSubscribe', { email });
      if (data.success) {
        setIsSubmitted(true);
        setEmail('');
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-stone-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-amber-700 to-orange-700 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Mail className="w-12 h-12 mx-auto mb-6 text-white/90" />
            <h3
              className="text-2xl md:text-3xl text-white mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Unlock Exclusive Family Getaway Deals
            </h3>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Sign up to receive special discounts, early access offers, and curated travel inspiration.
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto"
              >
                <Heart className="w-8 h-8 mx-auto mb-3 text-white" />
                <p className="text-white font-medium">Welcome to the family!</p>
              </motion.div>
            ) : (
              <>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-white rounded-xl"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 px-8 bg-white text-amber-700 hover:bg-stone-100 rounded-xl font-medium transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
                        Joining...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Subscribe
                        <Send className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
                {errorMsg && (
                  <p className="text-white/90 text-sm mt-3 bg-red-500/30 rounded-lg px-4 py-2 max-w-md mx-auto">
                    {errorMsg}
                  </p>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="py-16 md:py-20 bg-stone-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <BookOpen className="w-12 h-12 mx-auto mb-6 text-amber-400" />
            <h3
              className="text-2xl md:text-3xl text-white mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Travel Stories & Tips
            </h3>
            <p className="text-stone-300 mb-8 max-w-2xl mx-auto">
              Discover insider tips, family vacation stories, and expert guides to help you plan unforgettable getaways.
            </p>
            <Link
              to={createPageUrl('Blog')}
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explore Our Blog
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="py-12 md:py-16 bg-stone-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3
              className="text-2xl md:text-3xl text-white mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Have Questions? We're Here to Help
            </h3>
            <p className="text-stone-300 mb-8 max-w-lg mx-auto">
              Our team of local property managers is ready to help you plan the perfect getaway.
            </p>
            <Link
              to={createPageUrl('Contact')}
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-800 hover:bg-stone-100 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="py-12 bg-stone-900 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 md:gap-16">
            {/* VRBO PremierHost */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Vrbo</span>
                <span className="text-amber-400 text-lg">PremierHost</span>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Airbnb Superhost */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2.5L9.5 8.5L3 9.5L7.5 14L6.5 20.5L12 17.5L17.5 20.5L16.5 14L21 9.5L14.5 8.5L12 2.5Z" fill="#FF5A5F" />
                </svg>
                <span className="text-xl font-medium text-white">airbnb</span>
                <span className="text-[#FF5A5F] text-lg font-medium">superhost</span>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-500 text-sm">
              © {new Date().getFullYear()} LoveYourVacationRental.com. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to={createPageUrl('Contact')} onClick={() => window.scrollTo(0, 0)} className="text-stone-400 hover:text-white text-sm transition-colors">
                Contact Us
              </Link>
              <Link to={createPageUrl('Home')} className="text-stone-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to={createPageUrl('Home')} className="text-stone-400 hover:text-white text-sm transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}