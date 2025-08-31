"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface FilterProps {
  onFilterChange: (filters: any) => void;
}

export default function PropertyFilters({ onFilterChange }: FilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedBedrooms, setSelectedBedrooms] = useState('all');

  const applyFilters = () => {
    onFilterChange({
      search: searchTerm,
      status: selectedStatus,
      type: selectedType,
      priceRange,
      bedrooms: selectedBedrooms
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedType('all');
    setPriceRange({ min: '', max: '' });
    setSelectedBedrooms('all');
    onFilterChange({});
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by location, property type..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onFilterChange({
                  search: e.target.value,
                  status: selectedStatus,
                  type: selectedType,
                  priceRange,
                  bedrooms: selectedBedrooms
                });
              }}
              className="pl-10"
            />
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex items-center gap-4">
          <Tabs value={selectedStatus} onValueChange={(value) => {
            setSelectedStatus(value);
            onFilterChange({
              search: searchTerm,
              status: value,
              type: selectedType,
              priceRange,
              bedrooms: selectedBedrooms
            });
          }}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="under-offer">Under Offer</TabsTrigger>
              <TabsTrigger value="available">Available</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" onClick={clearFilters} size="sm">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>

        {/* Mobile Filter Sheet */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Properties</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                {/* Status Filter */}
                <div>
                  <Label>Status</Label>
                  <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="mt-2">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="under-offer">Under Offer</TabsTrigger>
                      <TabsTrigger value="available">Available</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Property Type */}
                <div>
                  <Label>Property Type</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['all', 'apartment', 'studio', 'penthouse', 'villa'].map((type) => (
                      <Badge
                        key={type}
                        variant={selectedType === type ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedType(type)}
                      >
                        {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <Label>Bedrooms</Label>
                  <div className="flex gap-2 mt-2">
                    {['all', '1', '2', '3', '4+'].map((beds) => (
                      <Button
                        key={beds}
                        variant={selectedBedrooms === beds ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedBedrooms(beds)}
                      >
                        {beds === 'all' ? 'Any' : beds}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Apply Filters */}
                <div className="flex gap-2">
                  <Button onClick={applyFilters} className="flex-1">
                    Apply Filters
                  </Button>
                  <Button onClick={clearFilters} variant="outline">
                    Clear
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}