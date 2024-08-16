import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Upload } from 'lucide-react';

export default function ListYourProperty() {
  const [amenities, setAmenities] = useState(['']);
  const [images, setImages] = useState([]);

  const addAmenity = () => {
    setAmenities([...amenities, '']);
  };

  const removeAmenity = (index) => {
    const newAmenities = amenities.filter((_, i) => i !== index);
    setAmenities(newAmenities);
  };

  const handleAmenityChange = (index, value) => {
    const newAmenities = [...amenities];
    newAmenities[index] = value;
    setAmenities(newAmenities);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted');
  }; 

  return (
    <div className="mx-auto px-4 py-8 max-w-5xl">
      <Card className="bg-white">
        <CardHeader className="">
          <CardTitle className="text-3xl font-bold">List Your Property</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buildingName">Building Name</Label>
                  <Input id="buildingName" placeholder="Enter building name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" placeholder="Enter street address" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Enter city" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="Enter state" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input id="zipCode" placeholder="Enter ZIP code" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Property Value ($)</Label>
                  <Input id="value" type="number" placeholder="Enter property value" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualYield">Annual Yield (%)</Label>
                  <Input id="annualYield" type="number" step="0.1" placeholder="Enter annual yield" required />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="about">About the Property</Label>
                  <Textarea id="about" placeholder="Describe your property" rows={4} required />
                </div>

                <div className="space-y-2">
                  <Label>Property Images</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Label htmlFor="images" className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400">
                      <Upload className="w-6 h-6 mr-2" />
                      <span>Upload Images</span>
                    </Label>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={URL.createObjectURL(image)} alt={`Property ${index + 1}`} className="w-full h-24 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document">Property Document</Label>
                  <Input id="document" type="file" accept=".pdf,.doc,.docx" required />
                </div>

                <div className="space-y-2">
                  <Label>Amenities</Label>
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2 mt-2">
                      <Input
                        value={amenity}
                        onChange={(e) => handleAmenityChange(index, e.target.value)}
                        placeholder="Enter an amenity"
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeAmenity(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAmenity}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Amenity
                  </Button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#FF4D5F] text-white hover:bg-[#FF7679]">
              Submit Property
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}