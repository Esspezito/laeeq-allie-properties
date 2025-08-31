"use client";

import { Property } from '@/types/property';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bed, Bath, Maximize2, MapPin, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const statusColors = {
    'available': 'bg-green-500',
    'under-offer': 'bg-yellow-500',
    'sold': 'bg-red-500'
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
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 z-10 space-x-2">
            <Badge className={`${statusColors[property.status || 'available']} text-white`}>
              {property.status === 'under-offer' ? 'Under Offer' : property.status === 'sold' ? 'SOLD' : 'Available'}
            </Badge>
            <Badge variant="secondary" className="bg-black/80 text-white border-white/20">
              {property.source === 'property24' ? 'Property24' : 'Private Property'}
            </Badge>
          </div>
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
          <motion.h3 
            className="font-semibold font-poppins text-lg mb-2 line-clamp-2 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            whileHover={{ 
              letterSpacing: '0.02em',
              transition: { duration: 0.2 }
            }}
          >
            {property.title}
          </motion.h3>
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
              asChild
            >
              <a 
                href={property.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                View on {property.source === 'property24' ? 'Property24' : 'Private Property'}
                <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}