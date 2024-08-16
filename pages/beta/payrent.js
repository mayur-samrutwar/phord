import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from 'lucide-react';

// Mock data for properties and their rents
const properties = [
  { id: 1, name: "Sunset Apartments", rent: 1500 },
  { id: 2, name: "Mountain View Condos", rent: 1800 },
  { id: 3, name: "Riverside Townhouses", rent: 2000 },
  { id: 4, name: "Urban Loft Spaces", rent: 2200 },
];

export default function PayRent() {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handlePropertySelect = (propertyId) => {
    const property = properties.find(p => p.id.toString() === propertyId);
    setSelectedProperty(property);
  };

  const handlePayRent = () => {
    // Here you would typically integrate with a payment gateway
    alert(`Processing payment of $${selectedProperty.rent} for ${selectedProperty.name}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Pay Your Rent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="property-select" className="text-sm font-medium text-gray-700">
              Select Your Property
            </label>
            <Select onValueChange={handlePropertySelect}>
              <SelectTrigger id="property-select">
                <SelectValue placeholder="Choose a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id.toString()}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProperty && (
            <Card className="bg-[#FFF5E4] border-none shadow-none">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Rent Amount:</span>
                  <span className="text-2xl font-bold text-[#FF4D5F]">
                    ${selectedProperty.rent}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            className="w-full bg-[#FF4D5F] text-white hover:bg-[#FF7679]"
            disabled={!selectedProperty}
            onClick={handlePayRent}
          >
            <DollarSign className="mr-2 h-5 w-5" />
            Pay Rent
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}