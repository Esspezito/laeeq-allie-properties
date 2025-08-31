"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone, Mail, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface HeroProps {
  agentName: string;
  agentTitle: string;
  agentCompany: string;
  agentPhone: string;
  agentEmail: string;
}

export default function Hero({ agentName, agentTitle, agentCompany, agentPhone, agentEmail }: HeroProps) {
  const scrollToListings = () => {
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&h=1080&fit=crop&q=80"
          alt="Cape Town City Bowl and Table Mountain"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Agent Profile Image */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotateY: 180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ delay: 0.1, duration: 0.8, type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
              <Image
                src="/laeeq-headshot.jpg"
                alt="La'eeq Allie - Real Estate Professional"
                fill
                className="object-cover rounded-full border-4 border-white/20 shadow-2xl"
                priority
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold font-poppins text-white mb-4 perspective-1000 tracking-tight"
              initial={{ rotateX: -90, opacity: 0, z: -100 }}
              animate={{ 
                rotateX: 0, 
                opacity: 1, 
                z: 0,
              }}
              transition={{ 
                duration: 1.2, 
                ease: "easeOut",
                delay: 0.3 
              }}
              style={{ 
                transformStyle: 'preserve-3d',
                textShadow: '0 10px 40px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              {agentName.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.5 + index * 0.05,
                    type: "spring",
                    damping: 12,
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.2, 
                    rotateZ: [-5, 5, -5, 0],
                    color: '#fbbf24',
                    transition: { duration: 0.3 }
                  }}
                  style={{ display: 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl font-raleway font-light text-white/90 mb-2 tracking-wide"
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                delay: 0.8, 
                type: "spring",
                stiffness: 60
              }}
              whileHover={{ letterSpacing: '0.05em' }}
            >
              {agentTitle}
            </motion.p>
            <motion.p 
              className="text-lg font-montserrat text-white/80 tracking-wide"
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                delay: 0.9, 
                type: "spring",
                stiffness: 60
              }}
            >
              {agentCompany}
            </motion.p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          >
            Specializing in sectional-title and freehold residential properties across 
            Cape Town's City Bowl, Gardens, and Woodstock. Your trusted partner in finding the perfect property.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg font-poppins font-semibold tracking-wide transition-all duration-300 hover:scale-105"
              onClick={scrollToListings}
            >
              View All Listings
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
            <div className="flex gap-4">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-secondary bg-black/40 backdrop-blur-sm text-white hover:bg-secondary hover:text-primary font-poppins font-medium tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
                asChild
              >
                <a href={`tel:${agentPhone}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-secondary bg-black/40 backdrop-blur-sm text-white hover:bg-secondary hover:text-primary font-poppins font-medium tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
                asChild
              >
                <a href={`mailto:${agentEmail}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  Email
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="h-8 w-8 text-white animate-bounce" />
        </motion.div>
      </div>
    </div>
  );
}