import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';

const reviews = [
  { name: "Azaria", text: "Everything was absolutely outstanding! Our family of 22 ages 2–65 had plenty of room. Stunning home, spotless, fully stocked, and far better than the photos. Would 10/10 recommend and absolutely stay again.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
  { name: "Sarah", text: "Seven families stayed here for a celebration of life and it couldn't have been a better choice. Comfortable beds, amazing pillows, chef-ready kitchen, and we truly felt like we were staying at a private resort.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" },
  { name: "Jeremy", text: "Unbelievable group stay. Spacious, beautifully designed, slept our full group without feeling crowded. Pool, hot tub, basketball, pickleball, mini-golf, volleyball, fire pits — there was always something to do. We never needed to leave.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  { name: "Tim", text: "This huge resort home was even better than the photos. Perfect for our multi-generational family gathering with endless outdoor activities and massive indoor spaces across all buildings.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { name: "Elan", text: "Hands-down the best Airbnb experience I've ever had. Gorgeous house with EVERY amenity you could imagine — games, fire pits, golf, billiards, toys, coffee supplies — everything was already there. Worth every penny.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Amy", text: "Absolutely AMAZING. Clean, organized, and perfect for our pickleball getaway. We had so much fun we booked again for next year immediately.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { name: "Casey", text: "Exceeded expectations in every way. Amazing backyard and pool, endless games, fully stocked kitchen, and memorable family meals together. Will absolutely be back.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Hannah", text: "Perfect for a big group — spacious, spotless, and packed with activities like pickleball and pool. Comfortable base for everyone to relax together.", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face" },
  { name: "Nicole", text: "Spectacular stay — pool, sauna, pickleball, fire pits, amazing kitchen, cozy beds. Perfect for large groups and families. Would stay again without hesitation.", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face" },
  { name: "Lavon", text: "Hosted our family wedding here — something for everyone from ping pong to basketball to the pool and yard. Large enough that nobody ever felt crowded.", avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop&crop=face" },
  { name: "Vicki", text: "Perfect reunion house — beautiful home with everything we needed for our group gathering. Would highly recommend.", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
  { name: "Bradley", text: "Massive home with space for everyone. Pool was the highlight and sleeping arrangements were perfect for the whole group.", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face" },
  { name: "Lequetta", text: "Spacious, ultra-clean, stayed cool even in extreme heat, amazing games, pool, spa, pickleball, and grill area. We loved it and would absolutely come back.", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face" },
  { name: "Lori", text: "High-end furnishings and linens, spotless bathrooms, welcoming open kitchen setup, and a dreamy outdoor space with pickleball, pool, tables, and seating.", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face" },
  { name: "Colby", text: "Five-night golf trip with our group — huge house, everyone had their own bedroom, patio firepit was the nightly hangout spot.", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face" },
  { name: "Trina", text: "Backyard paradise — pickleball court, pool, hot tub, outdoor kitchen, ping pong tables, sectional lounge area. Truly \"has it all.\"", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
  { name: "Donna", text: "Fantastic time — pickleball, swimming, coffee walks — beautifully updated and spotless. Perfect for hosting large groups.", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face" },
  { name: "Jazmin", text: "Five families together for a wedding weekend and everyone had space. Kids loved the outdoor amenities and adults enjoyed the fire pit.", avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&h=100&fit=crop&crop=face" },
  { name: "Karen", text: "Family reunion for twelve — loved the pool, hot tub, basketball, pickleball, cornhole, comfy beds, and fully stocked home.", avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=face" },
  { name: "Paula", text: "Perfect spot for two families celebrating a wedding — loved the activities and outdoor hangout areas.", avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=100&h=100&fit=crop&crop=face" },
  { name: "James", text: "Golf group of eight — massive space with entertainment for off-days and pickleball court was a huge bonus.", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face" },
  { name: "Travis", text: "Even bigger and better than photos — massive outdoor activity area, comfortable beds, endless seating, beautiful neighborhood.", avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=100&h=100&fit=crop&crop=face" },
  { name: "Brian", text: "Incredibly clean with a huge kitchen and BBQ space — pickleball court was outstanding. Great location close to everything.", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face" },
  { name: "Andrew", text: "The house is a vacation itself — you don't need to leave.", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=face" },
  { name: "Bryanne", text: "Perfect family gathering — spacious layout, impeccably clean, shaded yard and endless outdoor activities.", avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&h=100&fit=crop&crop=face" },
  { name: "Becky", text: "HIGHLY recommend — weeklong friend trip with pool, pickleball, hot tub, outdoor kitchen, billiards, and string lights. Magical evenings.", avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100&h=100&fit=crop&crop=face" },
  { name: "Trisha", text: "Didn't leave the house once — games, pool, and big grass field kept kids and adults happy all week.", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop&crop=face" },
  { name: "Sean", text: "Incredible property — slept 12 comfortably with nonstop outdoor activities.", avatar: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=100&h=100&fit=crop&crop=face" },
  { name: "Liam", text: "Beautiful home with perfect activity setups — pool kept us busy nonstop.", avatar: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=100&h=100&fit=crop&crop=face" },
  { name: "Kyle", text: "Amazing place — comfortable lounging plus nonstop entertainment.", avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop&crop=face" },
  { name: "Zack", text: "Awesome for large groups with spa, pool, and full backyard hang space.", avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop&crop=face" },
  { name: "Amanda", text: "Spacious home with an incredible dining table. Endless on-site activities — couldn't recommend more.", avatar: "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=100&h=100&fit=crop&crop=face" },
  { name: "Hussein", text: "Perfect golf trip property with tons of space and amenities. We will return.", avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop&crop=face" },
  { name: "Ryan", text: "Everything was exactly as advertised — wonderful stay from start to finish.", avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face" },
  { name: "Michael", text: "Group of 16 using all amenities — golf, pickleball, soccer, volleyball and hot tub — spotless, new, and flawless.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Shannon", text: "8 families fit comfortably — beautiful pool area and kitchen stocked with everything imaginable.", avatar: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=100&h=100&fit=crop&crop=face" },
  { name: "Jessica", text: "Four generations traveled together and the house fit every personality perfectly — we couldn't imagine a better setup.", avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face" },
  { name: "Adam", text: "Perfect laid-back golf retreat filled with games and entertainment — already planning our return.", avatar: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop&crop=face" },
  { name: "Russell", text: "Leadership retreat venue — amazing layout and amenities for team gatherings.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
  { name: "Maureen", text: "Belated family Christmas — huge home stocked with everything and endless fun activities.", avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop&crop=face" },
  { name: "Rhonda", text: "We never left the property — pool, volleyball, basketball kept everyone busy.", avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face" },
  { name: "Melissa", text: "5 couples and 7 kids had non-stop fun. So much room for both play and relaxation.", avatar: "https://images.unsplash.com/photo-1558898479-33c0057a5d12?w=100&h=100&fit=crop&crop=face" },
  { name: "Chris", text: "One-of-a-kind — better than pictures. Hosted 16 people flawlessly.", avatar: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=100&h=100&fit=crop&crop=face" },
  { name: "Anh", text: "Absolutely stunning and comfortable — would stay again 100%.", avatar: "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=100&h=100&fit=crop&crop=face" },
  { name: "Sabrina", text: "Huge family stay with endless activities for everyone.", avatar: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=100&h=100&fit=crop&crop=face" },
  { name: "Mara", text: "Staff retreat hosted here — tons of space and incredible entertainment.", avatar: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=100&h=100&fit=crop&crop=face" },
  { name: "Nathan", text: "Unbelievable yard and amenities — flawless stay.", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face" },
  { name: "Brian R", text: "Resort-style home — massive kitchen, pristine pool, incredible relaxation experience.", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face" },
  { name: "Tami", text: "Rave-worthy home with perfect kitchen, laundry setup, and entertaining space — our top choice going forward.", avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop&crop=face" },
  { name: "Vincent", text: "Guys golf trip — more space than we needed this trip and already booking next year.", avatar: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=100&h=100&fit=crop&crop=face" },
  { name: "Chad", text: "Fantastic property packed with activities.", avatar: "https://images.unsplash.com/photo-1500049242364-5f500807cdd7?w=100&h=100&fit=crop&crop=face" },
  { name: "Andrea", text: "Group of 10 + guest house — endless space, fully stocked kitchen, tons of outdoor fun.", avatar: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=100&h=100&fit=crop&crop=face" },
  { name: "Andrea M", text: "Massive home for our huge family — pool, hot tub, seating, chef kitchen — perfection.", avatar: "https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?w=100&h=100&fit=crop&crop=face" },
  { name: "Jake", text: "Backyard felt like a resort — beautiful property and accessories galore.", avatar: "https://images.unsplash.com/photo-1542178243-bc20acff4c9b?w=100&h=100&fit=crop&crop=face" },
  { name: "Heneliaka", text: "Spacious, spotless, fully stocked — absolutely unforgettable.", avatar: "https://images.unsplash.com/photo-1508243771214-6e95d137426b?w=100&h=100&fit=crop&crop=face" },
  { name: "Steve", text: "Outdoor area for everyone — private, relaxing grand oasis.", avatar: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=100&h=100&fit=crop&crop=face" },
  { name: "Jessica C", text: "Matched photos perfectly — resort-level pool and mini golf made the stay unforgettable.", avatar: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=100&h=100&fit=crop&crop=face" },
  { name: "Jaskiran", text: "Beautiful, spotless home — games everywhere, heated pool and fire pits were incredible.", avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=100&h=100&fit=crop&crop=face" },
  { name: "Julie", text: "Endless activities kept 19-26yo kids occupied constantly — outdoor TVs, kitchen layout, seating was brilliant.", avatar: "https://images.unsplash.com/photo-1508186225823-0963cf9ab0de?w=100&h=100&fit=crop&crop=face" },
  { name: "Heather", text: "Kitchen island brought everyone together — better than photos — definitely returning.", avatar: "https://images.unsplash.com/photo-1509868918748-a554ad25f858?w=100&h=100&fit=crop&crop=face" },
  { name: "Kelly", text: "Amazing home for a large family — the backyard was spectacular.", avatar: "https://images.unsplash.com/photo-1513207565459-d7f36bfa1222?w=100&h=100&fit=crop&crop=face" },
  { name: "Robbie", text: "Awesome house with flawless communication.", avatar: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=100&h=100&fit=crop&crop=face" },
  { name: "Catherine", text: "Cleanest Airbnb I've ever stayed in — peaceful oasis minutes from downtown.", avatar: "https://images.unsplash.com/photo-1512361436605-a484bdb34b5f?w=100&h=100&fit=crop&crop=face" },
  { name: "Ryan S", text: "Photos don't do it justice — outdoor spaces entertained everyone for our whole stay.", avatar: "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=100&h=100&fit=crop&crop=face" },
  { name: "Grace", text: "Immaculate décor and stunning furniture — amazing outdoor seating.", avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop&crop=face" },
  { name: "Kimberly", text: "Wonderful stay — beautifully decorated and perfectly maintained with fun outdoor setup.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Sarah M", text: "Jaw-dropping arrival and perfect space for large groups.", avatar: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?w=100&h=100&fit=crop&crop=face" },
  { name: "Angelica", text: "Girls' getaway highlight — pool was unbeatable and everyone loved the amenities.", avatar: "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=100&h=100&fit=crop&crop=face" },
  { name: "Shawnna", text: "Clean, safe, fully stocked — nothing else we could have asked for.", avatar: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=100&h=100&fit=crop&crop=face" },
  { name: "Tara", text: "Grand oasis gem with world-class amenities — you won't want to leave.", avatar: "https://images.unsplash.com/photo-1592621385612-4d7129426394?w=100&h=100&fit=crop&crop=face" },
  { name: "Javier", text: "Best property we've stayed in — clean and packed with outdoor activities.", avatar: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=100&h=100&fit=crop&crop=face" },
  { name: "Patricia", text: "AC issue handled immediately — fantastic hosts and huge family fun property.", avatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=100&h=100&fit=crop&crop=face" },
  { name: "David", text: "Beautiful landscaped yard with privacy, pool, hot tub, and spacious home.", avatar: "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=100&h=100&fit=crop&crop=face" },
  { name: "Jezreel", text: "Birthday weekend perfection — exceeded expectations across pool, kitchen, and lounge.", avatar: "https://images.unsplash.com/photo-1488426862511-27cd6a012a3e?w=100&h=100&fit=crop&crop=face" },
  { name: "Alma", text: "Peaceful and relaxing large-group oasis with amazing pool setup.", avatar: "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=100&h=100&fit=crop&crop=face" },
  { name: "Jeffrey", text: "Excellent for friend and family trips with nonstop hang zones and games.", avatar: "https://images.unsplash.com/photo-1556474835-b0f3ac40d4d1?w=100&h=100&fit=crop&crop=face" },
  { name: "Jared", text: "Perfect design and location — something engaging for everyone.", avatar: "https://images.unsplash.com/photo-1624224971170-2f84fed5eb5e?w=100&h=100&fit=crop&crop=face" },
  { name: "Kristin", text: "Wonderful reunion venue — easy for groups of 12.", avatar: "https://images.unsplash.com/photo-1596215143922-eedeaba0d91c?w=100&h=100&fit=crop&crop=face" },
  { name: "Connor", text: "Everything exceeded expectations — ideal outdoor entertainment areas.", avatar: "https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=100&h=100&fit=crop&crop=face" },
  { name: "Gar", text: "Amazing house — fully stocked with anything you need.", avatar: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=100&h=100&fit=crop&crop=face" },
  { name: "Dan", text: "Perfect space for couples getaway — highly recommend.", avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65adc9?w=100&h=100&fit=crop&crop=face" },
  { name: "Jenny", text: "Fun, beautiful house — already planning next trip.", avatar: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=100&h=100&fit=crop&crop=face" },
  { name: "Holly", text: "Truly magical — feels like your own private resort.", avatar: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=100&h=100&fit=crop&crop=face" },
  { name: "Clark", text: "10/10 stay — superb communication and will return.", avatar: "https://images.unsplash.com/photo-1507152927068-f603e9938998?w=100&h=100&fit=crop&crop=face" },
  { name: "Ross", text: "Fantastic amenities and games made the stay unforgettable.", avatar: "https://images.unsplash.com/photo-1600878459138-e1123b37cb30?w=100&h=100&fit=crop&crop=face" },
  { name: "Anne", text: "Stunning home — can't wait to return again.", avatar: "https://images.unsplash.com/photo-1546539782-6fc531453083?w=100&h=100&fit=crop&crop=face" },
];

function ReviewCard({ review, offset = 0, onClick }) {
  return (
    <div 
      className="flex-shrink-0 w-48 md:w-72 bg-white rounded-2xl p-3 md:p-5 shadow-lg mx-1 md:mx-2 cursor-pointer hover:shadow-xl transition-shadow min-h-[120px] md:min-h-[140px]"
      style={{ marginTop: offset }}
      onClick={() => onClick(review)}
    >
      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
        <img 
          src={review.avatar} 
          alt={review.name}
          className="w-8 h-8 md:w-9 md:h-9 min-w-[32px] min-h-[32px] rounded-full object-cover flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="font-medium text-stone-800 text-xs md:text-sm truncate">{review.name}</p>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 md:w-3 md:h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-stone-600 text-xs leading-relaxed line-clamp-3">
        "{review.text}"
      </p>
    </div>
  );
}

export default function ReviewsSection() {
  const [selectedReview, setSelectedReview] = useState(null);
  
  const totalReviews = reviews.length;
  const third = Math.ceil(totalReviews / 3);
  const row1 = reviews.slice(0, third);
  const row2 = reviews.slice(third, third * 2);
  const row3 = reviews.slice(third * 2);

  // Generate offset pattern for wood floor effect
  const getOffset = (index) => {
    const pattern = [0, 28, 56, 14, 42, 8, 36, 50, 20, 44];
    return pattern[index % pattern.length];
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-amber-50/30 overflow-hidden relative">
      {/* Fade gradients on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white via-white/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-amber-50/30 via-amber-50/20 to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 md:mb-12">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span 
            className="text-amber-700 text-base md:text-lg"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
          >
            Real Stories, Real Memories
          </span>
          <h2 
            className="text-2xl md:text-4xl text-stone-800 mt-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Why Guests Love Us
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4 md:mt-6" />
        </motion.div>
      </div>

      {/* Row 1 */}
      <div className="relative mb-3 md:mb-4 py-4 md:py-8">
        <motion.div 
          className="flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }
          }}
          style={{ willChange: "transform" }}
        >
          {[...row1, ...row1, ...row1].map((review, index) => (
            <ReviewCard key={`row1-${index}`} review={review} offset={getOffset(index)} onClick={setSelectedReview} />
          ))}
        </motion.div>
      </div>

      {/* Row 2 */}
      <div className="relative mb-3 md:mb-4 py-4 md:py-8">
        <motion.div 
          className="flex"
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            x: {
              duration: 32.5,
              repeat: Infinity,
              ease: "linear",
            }
          }}
          style={{ willChange: "transform" }}
        >
          {[...row2, ...row2, ...row2].map((review, index) => (
            <ReviewCard key={`row2-${index}`} review={review} offset={getOffset(index + 3)} onClick={setSelectedReview} />
          ))}
        </motion.div>
      </div>

      {/* Row 3 */}
      <div className="relative py-4 md:py-8">
        <motion.div 
          className="flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }
          }}
          style={{ willChange: "transform" }}
        >
          {[...row3, ...row3, ...row3].map((review, index) => (
            <ReviewCard key={`row3-${index}`} review={review} offset={getOffset(index + 7)} onClick={setSelectedReview} />
          ))}
        </motion.div>
      </div>

      {/* Expanded Review Modal */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedReview.avatar} 
                    alt={selectedReview.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-stone-800 text-lg">{selectedReview.name}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedReview(null)}
                  className="p-1 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
              <p className="text-stone-600 leading-relaxed">
                "{selectedReview.text}"
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </section>
  );
}