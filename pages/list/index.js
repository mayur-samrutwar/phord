import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from 'viem';
import abi from "../../contracts/abi/FractionalNFT.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";

export default function ListYourProperty() {
  const { toast } = useToast();
  const [amenities, setAmenities] = useState([""]);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    buildingName: "",
    city: "",
    sharesListing: "",
    propertyValue: "",
    annualYield: "",
    about: "",
  });
  const [isListingLoading, setIsListingLoading] = useState(false);

  const contractAddress = "0x50f1C0C64BD8270A10ecbE23f1D307ea5405D53d"; // Replace with your actual contract address

  const { writeContract, data: hash, error: writeError, isPending: isWritePending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isWritePending || isConfirming) {
      setIsListingLoading(true);
    } else {
      setIsListingLoading(false);
    }
  }, [isWritePending, isConfirming]);

  const addAmenity = () => {
    setAmenities([...amenities, ""]);
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.buildingName || !formData.sharesListing) {
      toast({
        title: "Error",
        description: "Please fill in at least the Building Name and Amount of Shares Listing",
        variant: "destructive",
      });
      return;
    }

    try {
      await writeContract({
        address: contractAddress,
        abi: abi,
        functionName: 'createProperty',
        args: [formData.buildingName, 1, BigInt(formData.sharesListing)],
      });
    } catch (error) {
      console.error("Transaction Error:", error);
      toast({
        title: "Transaction Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Success",
        description: "Property submitted for inspection.",
      });
    }
  }, [isConfirmed, toast]);

  return (
    <div className="mx-auto px-4 py-8 max-w-5xl">
      <Card className="bg-white">
        <CardHeader className="">
          <CardTitle className="text-3xl font-bold">
            List Your Property
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buildingName">Building Name</Label>
                  <Input
                    id="buildingName"
                    placeholder="Hogwarts"
                    required
                    value={formData.buildingName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    placeholder="Wakanda" 
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sharesListing">Amount of Shares Listing</Label>
                  <Input
                    id="sharesListing"
                    placeholder="Max 1000"
                    required
                    value={formData.sharesListing}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyValue">Property Value (in USD)</Label>
                  <Input
                    id="propertyValue"
                    type="number"
                    placeholder="Enter property value"
                    value={formData.propertyValue}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualYield">Annual Yield (in %)</Label>
                  <Input
                    id="annualYield"
                    type="number"
                    step="0.1"
                    placeholder="Enter annual yield"
                    value={formData.annualYield}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="about">About the Property</Label>
                  <Textarea
                    id="about"
                    placeholder="Describe your property"
                    rows={4}
                    value={formData.about}
                    onChange={handleInputChange}
                  />
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
                    <Label
                      htmlFor="images"
                      className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400"
                    >
                      <Upload className="w-6 h-6 mr-2" />
                      <span>Upload Images</span>
                    </Label>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Property ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
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
                  <Input
                    id="document"
                    type="file"
                    accept=".pdf,.doc,.docx"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Amenities</Label>
                  {amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mt-2"
                    >
                      <Input
                        value={amenity}
                        onChange={(e) =>
                          handleAmenityChange(index, e.target.value)
                        }
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


            <Button
              type="submit"
              className="w-full bg-[#FF4D5F] text-white hover:bg-[#FF7679]"
              disabled={isWritePending || isConfirming}
            >
              {isWritePending || isConfirming ? 'Processing...' : 'Submit Property'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Listing Progress Dialog */}
      <Dialog open={isListingLoading} onOpenChange={setIsListingLoading}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader></DialogHeader>
          <div className="flex space-x-4 items-center justify-center p-4">
            <p className="text-center text-gray-600">
              Listing in progress 
            </p>
            <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}