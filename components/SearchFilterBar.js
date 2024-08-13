import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, DollarSign, Home, MapPin, ThumbsUp, TrendingUp, TrendingDown, Clock, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

const SearchFilterBar = () => {
  const [activeFilters, setActiveFilters] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSort, setSelectedSort] = useState('Recommended');

  const propertyTypes = ['House', 'Apartment', 'Villa', 'Condo'];
  const sortOptions = [
    { label: 'Recommended', icon: <ThumbsUp className="h-4 w-4 mr-2" /> },
    { label: 'Price: Low to High', icon: <TrendingUp className="h-4 w-4 mr-2" /> },
    { label: 'Price: High to Low', icon: <TrendingDown className="h-4 w-4 mr-2" /> },
    { label: 'Newest', icon: <Clock className="h-4 w-4 mr-2" /> },
  ];

  const toggleFilter = (filter) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  const handlePriceChange = (newValues) => {
    setPriceRange(newValues);
  };

  return (
    <div className="bg-white mb-4 w-full">
      <div className="py-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search properties..."
              className="placeholder:text-sm pl-12 pr-4 py-3 w-full border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full px-6 py-3">
                <SlidersHorizontal className="mr-2 h-5 w-5" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-6">
              <div className="space-y-6">
                <h4 className="text-xl font-semibold mb-4">Filters</h4>
                <div>
                  <label className="text-sm font-medium flex items-center mb-3">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Price Range
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}+</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium flex items-center mb-3">
                    <Home className="mr-2 h-4 w-4" />
                    Property Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {propertyTypes.map((type) => (
                      <Badge 
                        key={type} 
                        variant={activeFilters.includes(type) ? "default" : "outline"}
                        className="px-3 py-1 cursor-pointer transition-colors"
                        onClick={() => toggleFilter(type)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium flex items-center mb-3">
                    <MapPin className="mr-2 h-4 w-4" />
                    Location
                  </label>
                  <Input placeholder="Enter location" className="w-full rounded-lg" />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full px-6 py-3">
                <ArrowUpDown className="mr-2 h-5 w-5" />
                {selectedSort}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold mb-3">Sort by</h4>
                {sortOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant="ghost"
                    className={`w-full justify-start text-left rounded-lg py-2 px-3 transition-colors ${selectedSort === option.label ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedSort(option.label)}
                  >
                    {option.icon}
                    {option.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap gap-2 mt-4"
            >
              {activeFilters.map(filter => (
                <Badge 
                  key={filter}
                  variant="secondary"
                  className="px-3 py-1 flex items-center space-x-1"
                >
                  <span>{filter}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleFilter(filter)}
                  />
                </Badge>
              ))}
              {priceRange[0] !== 0 || priceRange[1] !== 1000 ? (
                <Badge 
                  variant="secondary"
                  className="px-3 py-1 flex items-center space-x-1"
                >
                  <span>${priceRange[0]} - ${priceRange[1]}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setPriceRange([0, 1000])}
                  />
                </Badge>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchFilterBar;