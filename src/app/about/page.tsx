"use client";

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import InteractiveFeatures from '@/components/InteractiveFeatures';
import { agentProfile } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Award, Building, Target, Users, Star, Quote } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="mb-8"
            >
              <div className="relative w-40 h-40 mx-auto">
                <Image
                  src={agentProfile.profileImage}
                  alt={agentProfile.name}
                  fill
                  className="object-cover object-center rounded-full border-4 border-primary/20 shadow-2xl"
                  style={{ objectPosition: '50% 30%' }}
                  priority
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary/10 to-transparent" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{agentProfile.name}</h1>
            <p className="text-xl text-foreground/80 mb-2">{agentProfile.title}</p>
            <p className="text-lg text-foreground/70 mb-6">{agentProfile.company}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href={`tel:${agentProfile.phone}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={`mailto:${agentProfile.email}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  Send Email
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">About La'eeq</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {agentProfile.bio}
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-primary" />
                      Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {agentProfile.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      Service Areas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {agentProfile.areas.map((area, index) => (
                        <Badge key={index} variant="outline">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Achievements */}
                {agentProfile.achievements && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-primary" />
                      Achievements & Credentials
                    </h3>
                    <ul className="space-y-2">
                      {agentProfile.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span className="text-muted-foreground">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Get In Touch</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">{agentProfile.phone}</p>
                  {agentProfile.officePhone && (
                    <p className="text-muted-foreground text-sm mt-1">
                      Office: {agentProfile.officePhone}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">{agentProfile.email}</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Building className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Office</h3>
                  <p className="text-muted-foreground text-sm">
                    {agentProfile.address?.split(',').slice(0, 2).join(',')}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {agentProfile.address?.split(',').slice(2).join(',')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Michael */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-8">Why Choose La'eeq Allie?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Global Network</h3>
                <p className="text-muted-foreground text-sm">
                  Access to Christie's International Real Estate's exclusive global buyer network
                </p>
              </div>
              
              <div>
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Local Expertise</h3>
                <p className="text-muted-foreground text-sm">
                  Deep knowledge of Cape Town's City Bowl, Gardens & Woodstock markets
                </p>
              </div>
              
              <div>
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Premium Service</h3>
                <p className="text-muted-foreground text-sm">
                  Sophisticated marketing and personalized attention for every client
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-12 text-center">What Clients Say</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Quote className="h-6 w-6 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">
                      "La'eeq made the entire property buying process seamless. His deep knowledge of the City Bowl area and professional approach made all the difference. Highly recommend!"
                    </p>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="/api/placeholder/40/40" />
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">Sarah M.</p>
                        <p className="text-xs text-muted-foreground">Apartment Buyer, City Centre</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Quote className="h-6 w-6 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">
                      "Exceptional service from start to finish. La'eeq understood exactly what we were looking for and found us the perfect investment property in Woodstock. His market insights were invaluable."
                    </p>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="/api/placeholder/40/40" />
                        <AvatarFallback>DK</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">David K.</p>
                        <p className="text-xs text-muted-foreground">Property Investor, Woodstock</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Quote className="h-6 w-6 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">
                      "La'eeq's attention to detail and personalized approach made selling our Gardens apartment stress-free. His Christie's network brought serious international buyers quickly."
                    </p>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="/api/placeholder/40/40" />
                        <AvatarFallback>RT</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">Rachel T.</p>
                        <p className="text-xs text-muted-foreground">Seller, Gardens</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Quote className="h-6 w-6 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">
                      "As first-time buyers, we were nervous about the process. La'eeq guided us every step of the way with patience and expertise. We couldn't be happier with our new home!"
                    </p>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="/api/placeholder/40/40" />
                        <AvatarFallback>AP</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">Alex P.</p>
                        <p className="text-xs text-muted-foreground">First-time Buyer, De Waterkant</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Quote className="h-6 w-6 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">
                      "La'eeq's market knowledge is outstanding. He identified the perfect studio apartment for my Airbnb investment and negotiated a great deal. Truly professional service."
                    </p>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="/api/placeholder/40/40" />
                        <AvatarFallback>MH</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">Maria H.</p>
                        <p className="text-xs text-muted-foreground">Airbnb Investor, City Centre</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Quote className="h-6 w-6 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">
                      "Working with La'eeq was a pleasure. His communication was excellent, and he went above and beyond to ensure our property sale was completed efficiently. Highly recommended!"
                    </p>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="/api/placeholder/40/40" />
                        <AvatarFallback>JL</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">James L.</p>
                        <p className="text-xs text-muted-foreground">Seller, Vredehoek</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
            <p className="text-lg mb-8 opacity-90">
              Let La'eeq guide you through Cape Town's diverse property market
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href="/">View Properties</a>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
                <a href={`tel:${agentProfile.phone}`}>Schedule Consultation</a>
              </Button>
            </div>
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
          </div>
        </div>
      </footer>

      {/* Interactive Features */}
      <InteractiveFeatures />
    </main>
  );
}