import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Check, MapPin } from 'lucide-react';
import { Map, Marker } from 'pigeon-maps';

export default function PropertyDetails({ property }) {
  const [shareCount, setShareCount] = useState(1);

  const incrementShares = () => {
    if (shareCount < property.availableShares) {
      setShareCount(shareCount + 1);
    }
  };

  const decrementShares = () => {
    if (shareCount > 1) {
      setShareCount(shareCount - 1);
    }
  };

  // Dummy coordinates - replace with actual property coordinates
  const position = [51.505, -0.09];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="relative h-[400px] rounded-2xl overflow-hidden">
            <img src={property.image} alt={property.name} layout="fill" objectFit="cover" />
          </div>
          <div className="rounded-2xl">
            <Map 
              height={400}
              width={400} 
              center={position} 
              zoom={14}
              attribution={false}
              provider={(x, y, z) => `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`}
            >
              <Marker 
                width={50} 
                anchor={position} 
                color="#FF4D5F"
              />
            </Map>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-[#FF4D5F]" />
            <span>{property.location}</span>
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{property.name}</h1>
            <p className="text-xl text-gray-600">{property.location}</p>
          </div>
          <Card className="bg-[#FFF5E4] border-none shadow-none">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Price per share</p>
                  <p className="text-2xl font-semibold">${property.pricePerShare.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Available shares</p>
                  <p className="text-2xl font-semibold">{property.availableShares.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total shares</p>
                  <p className="text-2xl font-semibold">{property.totalShares.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Annual yield</p>
                  <p className="text-2xl font-semibold">{property.annualYield}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={decrementShares}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={shareCount}
              onChange={(e) => setShareCount(Math.min(Math.max(1, parseInt(e.target.value) || 1), property.availableShares))}
              className="w-20 text-center"
            />
            <Button variant="outline" size="icon" onClick={incrementShares}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button size="lg" className="w-full bg-[#FF4D5F] text-[#FFF5E4] hover:bg-[#FF7679]">
            Invest Now (${(shareCount * property.pricePerShare).toLocaleString()})
          </Button>
          <div>
            <h2 className="text-2xl font-bold mb-2">About this property</h2>
            <p className="text-gray-600">{property.description}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Amenities</h2>
            <ul className="grid grid-cols-2 gap-y-2">
              {property.amenities.map((amenity, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}