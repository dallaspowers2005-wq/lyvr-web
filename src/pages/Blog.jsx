import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Footer from '@/components/home/Footer';

const blogPosts = [
  {
    id: 1,
    title: "The Art of Multi-Generational Travel: Creating Memories That Span Ages",
    excerpt: "Discover how to plan the perfect family vacation that keeps grandparents comfortable, parents relaxed, and kids entertained.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80",
    date: "March 15, 2024",
    readTime: "8 min read",
    category: "Family Travel"
  },
  {
    id: 2,
    title: "Hidden Gems: Discovering Nature's Beauty Beyond the Tourist Crowds",
    excerpt: "From mystical red rocks to luxury retreats, explore the best-kept secrets and hidden destinations.",
    image: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=800&q=80",
    date: "March 8, 2024",
    readTime: "6 min read",
    category: "Destinations"
  },
  {
    id: 3,
    title: "5 Pool Games the Whole Family Will Love",
    excerpt: "Turn your poolside afternoons into unforgettable fun with these games that work for ages 5 to 85.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    date: "February 28, 2024",
    readTime: "4 min read",
    category: "Activities"
  },
  {
    id: 4,
    title: "The Perfect Family Dinner: Recipes for Your Vacation Kitchen",
    excerpt: "Easy, crowd-pleasing recipes that bring everyone together around the table — no stress required.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    date: "February 20, 2024",
    readTime: "10 min read",
    category: "Recipes"
  }
];

export default function Blog() {
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
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BookOpen className="w-12 h-12 text-amber-600 mx-auto mb-6" />
            <h1 
              className="text-4xl md:text-5xl text-stone-800 mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Stories & Inspiration
            </h1>
            <p className="text-stone-600 text-lg max-w-xl mx-auto">
              Family vacation tips, destination guides, and heartwarming stories 
              to inspire your next great escape.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Featured Post */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link 
            to={createPageUrl('BlogPost') + '?id=' + blogPosts[0].id}
            onClick={() => window.scrollTo(0, 0)}
            className="block"
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group">
              <div className="grid lg:grid-cols-2">
                <div className="h-64 lg:h-auto overflow-hidden">
                  <img 
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <span className="text-amber-600 text-sm font-medium uppercase tracking-wider">
                    {blogPosts[0].category}
                  </span>
                  <h2 
                    className="text-2xl lg:text-3xl text-stone-800 mt-3 mb-4 group-hover:text-amber-700 transition-colors"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-stone-600 mb-6">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-stone-500 text-sm mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {blogPosts[0].date}
                    </span>
                  </div>
                  <span className="flex items-center gap-2 text-amber-600 font-medium group-hover:gap-3 transition-all">
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <h3 
          className="text-2xl text-stone-800 mb-8"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          More Stories
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Link 
                to={createPageUrl('BlogPost') + '?id=' + post.id}
                onClick={() => window.scrollTo(0, 0)}
                className="group cursor-pointer block"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-amber-600 text-xs font-medium uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h4 
                      className="text-lg text-stone-800 mt-2 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {post.title}
                    </h4>
                    <p className="text-stone-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-stone-400 text-xs">
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}