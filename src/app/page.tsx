"use client";

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import InteractiveFeatures from '@/components/InteractiveFeatures';
import { agentProfile } from '@/lib/mockData';
import { Property } from '@/types/property';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      const data = await response.json();
      if (data.success) {
        setProperties(data.properties);
        setFilteredProperties(data.properties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...properties];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.type.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(property => 
        property.status === filters.status
      );
    }

    // Type filter
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(property =>
        property.type.toLowerCase() === filters.type
      );
    }

    // Bedrooms filter
    if (filters.bedrooms && filters.bedrooms !== 'all') {
      if (filters.bedrooms === '4+') {
        filtered = filtered.filter(property =>
          property.bedrooms && property.bedrooms >= 4
        );
      } else {
        filtered = filtered.filter(property =>
          property.bedrooms === parseInt(filters.bedrooms)
        );
      }
    }

    setFilteredProperties(filtered);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <Hero
        agentName={agentProfile.name}
        agentTitle={agentProfile.title}
        agentCompany={agentProfile.company}
        agentPhone={agentProfile.phone}
        agentEmail={agentProfile.email}
      />

      <section id="listings" className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <motion.h2 
              className="text-4xl font-bold font-poppins mb-4 inline-block tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              Current Listings
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Explore {filteredProperties.length} exclusive properties in Cape Town's most sought-after locations
            </motion.p>
          </motion.div>

          <PropertyFilters onFilterChange={handleFilterChange} />

          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground text-lg">
                  No properties found matching your criteria. Try adjusting your filters.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotateZ: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h3 
                className="text-3xl font-bold text-primary"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.1 }}
              >
                R2.6M+
              </motion.h3>
              <p className="text-muted-foreground">Starting From</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, rotateZ: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h3 
                className="text-3xl font-bold text-primary"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                R95M
              </motion.h3>
              <p className="text-muted-foreground">Luxury Estates</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, rotateZ: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h3 
                className="text-3xl font-bold text-primary"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.3 }}
              >
                20+
              </motion.h3>
              <p className="text-muted-foreground">Years Experience</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, rotateZ: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h3 
                className="text-3xl font-bold text-primary"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.4 }}
              >
                100%
              </motion.h3>
              <p className="text-muted-foreground">Client Satisfaction</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">
              © 2024 {agentProfile.name} - {agentProfile.company}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              All listings sourced from Property24.com and PrivateProperty.co.za
            </p>
          </div>
        </div>
      </footer>

      {/* Interactive Features */}
      <InteractiveFeatures />
    </main>
  );
}