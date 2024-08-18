import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useNetwork } from "wagmi";
import { parseEther } from 'viem';
import abi from "../../contracts/abi/RentDistribution.json";

const properties = [
  { id: 1, name: "Amar Serenity" },
];

export default function PayRent() {
  const { toast } = useToast()

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rentAmount, setRentAmount] = useState('');
  
  const { address, isConnected } = useAccount();

  const contractAddress = '0xD88868c2B705E71c045702a51150Eda8a1542c71';

  const { writeContract, data: hash, error: writeError, isPending: isWritePending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handlePropertySelect = (propertyId) => {
    const property = properties.find(p => p.id.toString() === propertyId);
    setSelectedProperty(property);
    console.log('Selected property:', property);
  };

  const handlePayRent = async () => {
    console.log('Pay Rent clicked');
    console.log('isConnected:', isConnected);
    console.log('selectedProperty:', selectedProperty);
    console.log('rentAmount:', rentAmount);

    if (isConnected && selectedProperty && rentAmount) {
      try {
        console.log('Attempting to write contract');
        const result = await writeContract({
          address: contractAddress,
          abi: abi,
          functionName: 'distributeRent',
          args: [BigInt(selectedProperty.id)],
          value: parseEther(rentAmount),
        });
        console.log('Write contract result:', result);
      } catch (error) {
        console.error("Transaction Error:", error);
        toast({
          title: "Transaction Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      console.log('Invalid input');
      toast({
        title: "Invalid Input",
        description: "Please select a property and enter a valid rent amount.",
        variant: "destructive",
      });
    }
  };

  const handleShowOnEtherscan = () => {
    if (hash) {
      const baseUrl = 'https://sepolia.etherscan.io';
      window.open(`${baseUrl}/tx/${hash}`, '_blank');
    }
  };



  useEffect(() => {
    console.log('isConfirmed:', isConfirmed);
    if (isConfirmed) {
      toast({
        title: "Payment Successful",
        description: "Your rent payment has been confirmed.",
        action: <ToastAction altText="View on Etherscan" onClick={handleShowOnEtherscan}>View <ExternalLink className='ml-2 h-4 w-4' /></ToastAction>,
      });
    }
  }, [isConfirmed]);

  useEffect(() => {
    console.log('writeError:', writeError);
    if (writeError) {
      toast({
        title: "Error",
        description: writeError.message,
        variant: "destructive",
      });
    }
  }, [writeError]);

  function showToast(){
    toast({
      title: "Error",
      description: "lol",
      variant: "destructive",
    });
  }

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
              Rent Amount (in ETH)
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
            disabled={!selectedProperty || !rentAmount || isWritePending || isConfirming}
            onClick={handlePayRent}
          >
            {isWritePending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Pay Rent'}
          </Button>
        </CardContent>
      </Card>    
    </div>
  );
}