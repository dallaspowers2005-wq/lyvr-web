import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-sky-50 to-blue-50/30 relative overflow-hidden">
      {/* Subtle Wave Background */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.15]">
        <svg className="absolute top-[10%] left-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60" fill="none" stroke="#0ea5e9" strokeWidth="3"/>
        </svg>
        <svg className="absolute top-[25%] left-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C150,20 350,100 550,60 C750,20 950,100 1200,60" fill="none" stroke="#38bdf8" strokeWidth="2.5"/>
        </svg>
        <svg className="absolute top-[40%] left-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C250,100 450,20 650,60 C850,100 1050,20 1200,60" fill="none" stroke="#0ea5e9" strokeWidth="2"/>
        </svg>
        <svg className="absolute top-[55%] left-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C180,20 380,100 580,60 C780,20 980,100 1200,60" fill="none" stroke="#38bdf8" strokeWidth="2.5"/>
        </svg>
        <svg className="absolute top-[70%] left-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C220,100 420,20 620,60 C820,100 1020,20 1200,60" fill="none" stroke="#0ea5e9" strokeWidth="2"/>
        </svg>
        <svg className="absolute top-[85%] left-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60" fill="none" stroke="#38bdf8" strokeWidth="1.5"/>
        </svg>
      </div>
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-100/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="rounded-2xl overflow-hidden shadow-2xl transform rotate-1">
                <img 
                  src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80"
                  alt="Family enjoying vacation"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
              </div>
              
              {/* Overlapping smaller image */}
              <div className="absolute -bottom-8 -right-8 w-48 md:w-56 rounded-xl overflow-hidden shadow-xl transform -rotate-3 border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80"
                  alt="Luxury home"
                  className="w-full h-32 md:h-40 object-cover"
                />
              </div>

              {/* Decorative heart */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span 
              className="text-amber-600 text-lg"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              Our Story
            </span>

            <h2 
              className="text-3xl md:text-4xl text-stone-800 mt-4 mb-8 leading-tight"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Where Families Come Together to Make Memories
            </h2>

            <div className="space-y-6 text-stone-600 leading-relaxed">
              <p>
                We believe families deserve more than just a place to sleep. They deserve spaces 
                where laughter echoes through grand living rooms, where grandparents watch grandchildren 
                splash in sun-drenched pools, and where evening meals become cherished traditions.
              </p>

              <p>
                Every home in our collection has been carefully chosen — not by algorithms, but by 
                people who understand what multi-generational families truly need. We look for homes 
                that spark joy, foster connection, and create the perfect backdrop for your family's story.
              </p>

              <p>
                Our commitment goes beyond luxury. We seek out private sanctuaries where your family 
                can truly exhale — away from crowds, wrapped in comfort, and surrounded by 
                breathtaking natural beauty.
              </p>


            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="w-12 h-0.5 bg-amber-400" />
              <span className="text-amber-700 font-medium tracking-wide">Hospitality with Heart</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}