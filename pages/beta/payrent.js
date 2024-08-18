import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data for properties and their rents
const properties = [
  { id: 1, name: "Sunset Apartments" },
  { id: 2, name: "Mountain View Condos" },
  { id: 3, name: "Riverside Townhouses" },
  { id: 4, name: "Urban Loft Spaces" },
];

export default function PayRent() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [rentAmount, setRentAmount] = useState(null);

  const handlePropertySelect = (propertyId) => {
    const property = properties.find(p => p.id.toString() === propertyId);
    setSelectedProperty(property);
    setPaymentCompleted(false);
  };

  const handlePayRent = () => {
    setTimeout(() => {
      setPaymentCompleted(true);
    }, 1000); 
  };

  const handleShowOnEtherscan = () => {
    alert('Opening Etherscan...');
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Card className="w-full max-w-xl bg-white -mt-40">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">Pay Your Rent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="property-select" className="text-sm font-medium text-gray-700">
              Select Your Property
            </label>
            <Select onValueChange={handlePropertySelect}>
              <SelectTrigger id="property-select" className="w-full">
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
          
          <div className='space-y-2'>
          <label htmlFor="rent-amount" className="text-sm font-medium text-gray-700">
              Rent Amount (in USD)
            </label>
               <Input
        type="text"
        value={rentAmount}
        onChange={(e) => setRentAmount(e.target.value)}
        placeholder="Enter rent amount to pay"
      />
          </div>
         
          <Button
            className="w-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            disabled={!selectedProperty || paymentCompleted}
            onClick={handlePayRent}
          >
            {paymentCompleted ? 'Payment Completed' : 'Pay Rent'}
          </Button>
          
        </CardContent>
      </Card>
      {paymentCompleted && (
            <Button
              className="mt-20 text-white hover:bg-gray-700 transition-colors px-10 text-xs"
              onClick={handleShowOnEtherscan}
            >
              
              Show on Etherscan
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          )}
    </div>
  );
}