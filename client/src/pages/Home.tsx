import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-5 bg-white"></div>
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          >
            Rent a Vibe, Not a Date 💫
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl mb-8 text-white/90"
          >
            Your plus-one for every occasion. Find your perfect companion for events, hangouts, or just someone awesome to vibe with. 100% platonic, 100% fun! 🎉
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/explore" className="btn btn-primary text-lg px-8 py-4">
              Find Your Tribe 🔥
            </Link>
            <Link to="#how-it-works" className="btn btn-secondary text-lg px-8 py-4">
              How It Works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-neutral-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-dark mb-4">
              How VibeTribe Works
            </h2>
            <p className="text-xl text-neutral-gray">
              Getting your perfect companion is easier than ordering food! 🍕
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="card p-8 text-center"
            >
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-neutral-dark mb-4">Find Your Vibe</h3>
              <p className="text-neutral-gray">
                Browse through our amazing companions and find someone who matches your energy and interests.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card p-8 text-center"
            >
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-neutral-dark mb-4">Chat & Connect</h3>
              <p className="text-neutral-gray">
                Message your chosen companion, discuss your plans, and set expectations for your hangout.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card p-8 text-center"
            >
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-neutral-dark mb-4">Book & Chill</h3>
              <p className="text-neutral-gray">
                Confirm your booking, meet up, and enjoy quality time with your new companion!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-dark mb-4">
              Why Choose VibeTribe?
            </h2>
            <p className="text-xl text-neutral-gray">
              We're not just another app - we're your gateway to meaningful connections! ✨
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-pink to-primary-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-dark mb-2">Safe & Verified</h3>
              <p className="text-neutral-gray text-sm">
                All companions are background-verified and safety-checked
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-purple to-primary-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-dark mb-2">Quality Companions</h3>
              <p className="text-neutral-gray text-sm">
                Curated companions with diverse interests and personalities
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-blue to-primary-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-dark mb-2">Instant Booking</h3>
              <p className="text-neutral-gray text-sm">
                Book your companion in minutes with our streamlined process
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-yellow to-primary-pink rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💜</span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-dark mb-2">100% Platonic</h3>
              <p className="text-neutral-gray text-sm">
                All interactions are strictly platonic and friendship-focused
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
          >
            Ready to Find Your Perfect Companion? 🚀
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/90 mb-8"
          >
            Join thousands of users who have found amazing companions for their adventures!
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/explore" className="btn bg-white text-primary-purple hover:bg-gray-100 text-lg px-8 py-4">
              Start Exploring Now 🔥
            </Link>
            <Link to="/signup" className="btn btn-secondary text-lg px-8 py-4">
              Create Account
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 