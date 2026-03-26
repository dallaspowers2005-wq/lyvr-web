import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', icon: Home, page: 'Home' },
    { label: 'Properties', icon: Building2, page: 'Properties' }
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-stone-700" />
        ) : (
          <Menu className="w-6 h-6 text-stone-700" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white z-40 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-stone-200">
                  <h2
                    className="text-2xl text-stone-800"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Menu
                  </h2>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 p-6">
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={createPageUrl(item.page)}
                          onClick={() => {
                            setIsOpen(false);
                            window.scrollTo(0, 0);
                          }}
                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-amber-50 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                            <item.icon className="w-5 h-5 text-amber-700" />
                          </div>
                          <span className="text-lg text-stone-700 group-hover:text-amber-700 transition-colors">
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}