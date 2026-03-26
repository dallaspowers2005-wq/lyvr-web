import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Footer from '@/components/home/Footer';

const blogContent = {
  1: {
    title: "The Art of Multi-Generational Travel: Creating Memories That Span Ages",
    category: "Family Travel",
    date: "March 15, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1200&q=80",
    content: `
      <p>There's something magical about watching three generations share a moment together — grandparents teaching grandchildren to swim, parents finally relaxing while the kids play nearby, and everyone gathering for sunset dinners on a private patio.</p>

      <h2>Why Multi-Generational Travel Matters</h2>
      <p>In our increasingly busy world, finding quality time with extended family can feel nearly impossible. That's why multi-generational vacations have become one of the fastest-growing travel trends. These trips offer a rare opportunity to disconnect from daily routines and truly connect with the people who matter most.</p>

      <p>Studies show that children who spend quality time with grandparents develop stronger emotional resilience, better social skills, and a deeper sense of family identity. For adults, these trips provide a chance to see their parents in a new light — relaxed, playful, and fully present.</p>

      <h2>Planning for All Ages</h2>
      <p>The key to a successful multi-generational trip lies in thoughtful planning. Here are our top recommendations:</p>

      <h3>1. Choose the Right Accommodation</h3>
      <p>Forget cramped hotel rooms. A spacious vacation home with multiple bedrooms, common areas for gathering, and private spaces for downtime is essential. Look for properties with amenities that appeal to all ages — a pool for the kids, comfortable seating for grandparents, and maybe even a game room for everyone.</p>

      <h3>2. Balance Activity and Rest</h3>
      <p>Young children have endless energy; grandparents may need afternoon naps. Build flexibility into your schedule with "choose your own adventure" days where family members can opt in or out of activities based on their energy levels.</p>

      <h3>3. Create Shared Experiences</h3>
      <p>Plan at least one or two activities that everyone can enjoy together — a family cooking class, a scenic drive, or simply watching the sunset from your vacation home's patio. These shared moments become the stories you'll tell for years to come.</p>

      <h2>The Power of Private Pool Time</h2>
      <p>There's a reason our properties feature resort-quality pools. Water has a unique way of bringing families together. Kids splash and play, parents relax poolside, and grandparents watch the joy unfold. Some of the best family memories happen in and around the pool.</p>

      <h2>Making Meals Memorable</h2>
      <p>Vacation kitchens aren't just about saving money on dining out — they're about creating opportunities for connection. Imagine grandma teaching the grandkids her secret pancake recipe, or everyone pitching in to make tacos on Taco Tuesday. These moments of collaboration and shared meals are what family vacations are all about.</p>

      <p>Ready to create your own multi-generational memories? Explore our collection of family-friendly homes, each designed with gathering spaces that bring generations together.</p>
    `
  },
  2: {
    title: "Hidden Gems: Discovering Nature's Beauty Beyond the Tourist Crowds",
    category: "Destinations",
    date: "March 8, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=1200&q=80",
    content: `
      <p>Some of the most breathtaking destinations aren't found in travel guides. They're the quiet canyons, the hidden overlooks, and the local spots that only those who truly know an area can share.</p>

      <h2>The Magic of Off-the-Beaten-Path</h2>
      <p>There's something special about discovering a place that feels like your own secret. Away from the crowds, you can truly appreciate nature's beauty — the way light plays on rock formations, the sound of wind through ancient trees, or the perfect stillness of a desert sunset.</p>

      <h2>How to Find Hidden Gems</h2>
      <p>The best discoveries often come from local knowledge. Talk to property owners, ask at small cafes, or simply drive down that road you've always wondered about. Some of our favorite spots were found by families who took a "wrong turn" and stumbled upon something magical.</p>

      <h3>Tips for Exploration</h3>
      <ul>
        <li>Start early — the best light and smallest crowds come at sunrise</li>
        <li>Bring plenty of water and snacks, especially if traveling with kids</li>
        <li>Download offline maps — cell service can be spotty in remote areas</li>
        <li>Leave no trace — help preserve these special places for future families</li>
      </ul>

      <h2>Creating Your Own Adventure</h2>
      <p>Every family vacation should include at least one day of unplanned exploration. Pack a picnic, fill up the tank, and see where the road takes you. These spontaneous adventures often become the most treasured memories.</p>

      <p>Our vacation homes are perfectly positioned as base camps for exploration. Return each evening to your private oasis, share stories of the day's discoveries, and plan tomorrow's adventure.</p>
    `
  },
  3: {
    title: "5 Pool Games the Whole Family Will Love",
    category: "Activities",
    date: "February 28, 2024",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
    content: `
      <p>A private pool is more than a place to cool off — it's a playground for all ages. Here are five games that will have your whole family laughing, splashing, and creating memories together.</p>

      <h2>1. Marco Polo with a Twist</h2>
      <p>Everyone knows classic Marco Polo, but try adding a twist: the person who's "it" can call out "fish out of water" at any time. Anyone not in the pool at that moment becomes the new seeker. It keeps everyone on their toes and adds excitement for all ages.</p>

      <h2>2. Pool Basketball</h2>
      <p>Set up a floating or poolside basketball hoop and let the games begin. Create teams that mix ages — pair grandparents with grandkids against parents. The water equalizes abilities and keeps competition friendly.</p>

      <h2>3. Treasure Dive</h2>
      <p>Toss a variety of sinking toys into the pool. Assign point values based on difficulty (deeper items = more points). Kids love the treasure hunt aspect, and it's great swimming practice. For non-swimmers, keep treasures in the shallow end.</p>

      <h2>4. Noodle Jousting</h2>
      <p>Each player rides a pool noodle like a horse and tries to knock opponents off balance using another noodle. Create a tournament bracket for larger families. It's silly, active, and guaranteed to produce laughter.</p>

      <h2>5. Sharks and Minnows</h2>
      <p>One person is the shark in the middle of the pool. Everyone else (minnows) must swim from one side to the other without being tagged. Tagged minnows become sharks. Last minnow swimming wins!</p>

      <h2>Tips for Inclusive Pool Play</h2>
      <p>Remember that not everyone swims at the same level. Create roles for non-swimmers (scorekeeper, referee, DJ) and keep some games in the shallow end. The goal is family fun, not competition stress.</p>

      <p>Our properties feature private pools perfect for family game time. No sharing with strangers, no limited hours — just your family, making memories together.</p>
    `
  },
  4: {
    title: "The Perfect Family Dinner: Recipes for Your Vacation Kitchen",
    category: "Recipes",
    date: "February 20, 2024",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
    content: `
      <p>Vacation cooking should be relaxed, fun, and bring everyone together. Here are three crowd-pleasing recipes that work for families of all sizes and can get everyone involved in the kitchen.</p>

      <h2>Build-Your-Own Taco Bar</h2>
      <p>Nothing brings a family together like tacos. The beauty is in the simplicity and customization — everyone gets exactly what they want.</p>

      <h3>Ingredients:</h3>
      <ul>
        <li>2 lbs ground beef or chicken</li>
        <li>Taco seasoning</li>
        <li>Corn and flour tortillas</li>
        <li>Shredded cheese, lettuce, tomatoes</li>
        <li>Sour cream, guacamole, salsa</li>
        <li>Black beans and rice for sides</li>
      </ul>

      <p><strong>Kid job:</strong> Setting up the toppings bar<br/>
      <strong>Grandparent job:</strong> Warming tortillas<br/>
      <strong>Parent job:</strong> Cooking the protein</p>

      <h2>One-Pan Mediterranean Chicken</h2>
      <p>This elegant dish looks impressive but requires minimal effort — perfect when you want a nice dinner without spending your vacation in the kitchen.</p>

      <h3>Ingredients:</h3>
      <ul>
        <li>6-8 chicken thighs</li>
        <li>Cherry tomatoes, olives, artichoke hearts</li>
        <li>Feta cheese</li>
        <li>Olive oil, garlic, lemon</li>
        <li>Fresh herbs (oregano, basil)</li>
      </ul>

      <p>Arrange everything in one pan, roast at 400°F for 40 minutes. Serve with crusty bread and a simple salad.</p>

      <h2>Campfire S'mores Bar (Poolside Edition)</h2>
      <p>Many of our properties have fire pits or outdoor grills perfect for this classic treat. Set up a s'mores station and let everyone create their perfect combination.</p>

      <h3>Beyond Basic S'mores:</h3>
      <ul>
        <li>Reese's cups instead of chocolate</li>
        <li>Nutella and banana</li>
        <li>Caramel and apple slices</li>
        <li>Cookie butter and strawberries</li>
      </ul>

      <h2>The Secret Ingredient: Togetherness</h2>
      <p>The best vacation meals aren't about perfect execution — they're about the conversations over chopping vegetables, the laughter when something goes slightly wrong, and the satisfaction of sitting down together to enjoy what you've created.</p>

      <p>Our vacation kitchens are fully equipped for family cooking adventures. Large islands for gathering, multiple ovens for big groups, and outdoor grills for those perfect evening barbecues.</p>
    `
  }
};

export default function BlogPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = parseInt(urlParams.get('id')) || 1;
  const post = blogContent[postId];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-stone-800 mb-4">Post not found</h1>
          <Link to={createPageUrl('Blog')} className="text-amber-600 hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

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

      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh]">
        <img 
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-6 -mt-32 relative z-10">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
        >
          <span className="text-amber-600 text-sm font-medium uppercase tracking-wider">
            {post.category}
          </span>
          
          <h1 
            className="text-3xl md:text-4xl text-stone-800 mt-4 mb-6"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-stone-500 text-sm mb-8 pb-8 border-b border-stone-200">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
          </div>

          <div 
            className="prose prose-stone prose-lg max-w-none
              prose-headings:font-serif prose-headings:text-stone-800
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-stone-600 prose-p:leading-relaxed
              prose-ul:text-stone-600
              prose-li:my-1
              prose-strong:text-stone-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-8 border-t border-stone-200">
            <Link 
              to={createPageUrl('Blog')}
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Stories
            </Link>
          </div>
        </motion.article>
      </div>

      <div className="py-20" />

      <Footer />
    </div>
  );
}