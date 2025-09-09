"use client";

import { useState } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bed, Bath, Maximize2, MapPin, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const statusColors = {
    'available': 'bg-green-500',
    'under-offer': 'bg-yellow-500',
    'sold': 'bg-red-500'
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 10
      }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col group cursor-pointer">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={property.images[currentImageIndex]}
            alt={`${property.title} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 z-10 space-x-2">
            <Badge className={`${statusColors[property.status || 'available']} text-white`}>
              {property.status === 'under-offer' ? 'Under Offer' : property.status === 'sold' ? 'SOLD' : 'Available'}
            </Badge>
            <Badge variant="secondary" className="bg-black/80 text-white border-white/20">
              {property.source === 'property24' ? 'Property24' : property.source === 'greeff' ? 'Greeff' : 'Private Property'}
            </Badge>
          </div>
          
          {/* Image counter */}
          {property.images.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          )}
          
          {/* Navigation arrows */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
          {property.status === 'sold' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-red-600 text-white px-8 py-3 rounded-lg rotate-[-15deg] text-2xl font-bold shadow-lg">
                SOLD
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <motion.h3 
              className="text-2xl font-bold font-poppins text-white tracking-tight"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: index * 0.1 + 0.2,
                type: "spring",
                stiffness: 200
              }}
            >
              {property.price}
            </motion.h3>
          </div>
        </div>
        
        <CardContent className="flex-grow p-4">
          <h3 className="font-semibold font-poppins text-lg mb-2 line-clamp-2 tracking-tight">
            {property.title}
          </h3>
          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            {property.bedrooms && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            {property.area && (
              <div className="flex items-center">
                <Maximize2 className="h-4 w-4 mr-1" />
                <span>{property.area}</span>
              </div>
            )}
          </div>

          {property.features && (
            <div className="mt-3 flex flex-wrap gap-1">
              {property.features.slice(0, 3).map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          {property.status === 'sold' ? (
            <Button 
              className="w-full" 
              variant="secondary"
              disabled
            >
              Property Sold
            </Button>
          ) : (
            <Button 
              className="w-full group/btn bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-md font-poppins font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-lg" 
              onClick={() => {
                // Open in new tab using redirect API to avoid referrer issues
                window.open(`/api/redirect?url=${encodeURIComponent(property.sourceUrl)}`, '_blank');
              }}
            >
              View on {property.source === 'property24' ? 'Property24' : property.source === 'greeff' ? 'Greeff' : 'Private Property'}
              <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}