import React from "react";
import { motion } from 'framer-motion';

const activities = [
  {
    quote:
      "Indulge in world-class dining, shopping, and entertainment in Scottsdale and Phoenix. From luxury boutiques to local artisan markets, the area offers endless opportunities for exploration.",
    name: "Urban Exploration",
    designation: "Scottsdale & Downtown Phoenix",
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop"
  },

  {
    quote:
      "Discover authentic Southwestern cuisine and farm-to-table dining experiences. From upscale restaurants to local food trucks, taste the unique flavors of the Arizona culinary scene.",
    name: "Culinary Experiences",
    designation: "Southwestern Flavors",
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop"
  },
  {
    quote:
      "Experience thrilling off-road adventures through rugged desert terrain. Rent ATVs or join guided tours to explore hidden canyons and remote desert landscapes.",
    name: "ATV & Desert Tours",
    designation: "Off-Road Adventures",
    src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693113f3a59cea8a7e5c0a56/2b060134b_Screenshot2026-02-09at110018PM.png"
  }
];

export default function AreaActivitiesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-amber-700 text-lg block mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Discover Your Next Adventure
          </span>
          <h2 className="text-stone-800 text-3xl md:text-4xl mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Things To Do Around The Area
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            From outdoor adventures to urban experiences, explore the best activities the Southwest has to offer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={activity.src} 
                  alt={activity.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl text-stone-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  {activity.name}
                </h3>
                <p className="text-amber-700 text-sm mb-3">{activity.designation}</p>
                <p className="text-stone-600 leading-relaxed">{activity.quote}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}