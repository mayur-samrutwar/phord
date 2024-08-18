import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Minus, MapPin, ExternalLink, Check } from "lucide-react";
import { Map, Marker } from "pigeon-maps";
import { properties } from "@/lib/mockData";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { parseEther } from "viem";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import abi from "../../contracts/abi/FractionalNFT.json";

export default function PropertyDetails({ propertyId }) {
  const { toast } = useToast();
  const [shareCount, setShareCount] = useState(1);
  const [property, setProperty] = useState(null);
  const [shareholders, setShareholders] = useState([]);
  const [isPurchaseLoading, setIsPurchaseLoading] = useState(false);
  const contractAddress = "0x50f1C0C64BD8270A10ecbE23f1D307ea5405D53d";
  const { address, isConnected } = useAccount();

  const {
    data: readData,
    error: readError,
    isLoading: readIsLoading,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: "properties",
    args: propertyId ? [BigInt(propertyId)] : undefined,
    enabled: !!propertyId,
  });

  const { data: shareholderData } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: "getShareholders",
    args: propertyId ? [BigInt(propertyId)] : undefined,
    enabled: !!propertyId,
  });

  const {
    writeContract,
    data: hash,
    error: writeError,
    isPending: isWritePending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

    useEffect(() => {
      if (isWritePending || isConfirming) {
        setIsPurchaseLoading(true);
      } else {
        setIsPurchaseLoading(false);
      }
    }, [isWritePending, isConfirming]);

  useEffect(() => {
    console.log("Property ID:", propertyId);
    console.log("Read Data:", readData);

    if (readData) {
      setProperty({
        id: propertyId,
        name: readData[0],
        pricePerShareInWei: readData[2],
        remainingShares: readData[3],
      });
    }
  }, [readData, propertyId]);

  useEffect(() => {
    if (shareholderData) {
      console.log("Shareholder Data:", shareholderData);
      setShareholders(shareholderData);
    }
  }, [shareholderData]);

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Purchase Successful",
        description: "Your share purchase has been confirmed.",
        action: (
          <ToastAction
            altText="View on Etherscan"
            onClick={handleShowOnEtherscan}
          >
            View <ExternalLink className="ml-2 h-4 w-4" />
          </ToastAction>
        ),
      });
      refetch(); // Refetch property data to update remaining shares
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (writeError) {
      toast({
        title: "Error",
        description: writeError.message,
        variant: "destructive",
      });
    }
  }, [writeError]);

  const formatPrice = (priceInWei) => {
    const priceInEther = Number(priceInWei) / 1e18;
    const priceInUSD = priceInEther * 2600;
    return priceInUSD.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const incrementShares = () => {
    if (property && shareCount < Number(property.remainingShares)) {
      setShareCount(shareCount + 1);
    }
  };

  const decrementShares = () => {
    if (shareCount > 1) {
      setShareCount(shareCount - 1);
    }
  };

  const handlePurchaseShares = async () => {
    if (isConnected && property) {
      try {
        const totalPrice =
          BigInt(property.pricePerShareInWei) * BigInt(shareCount);
        await writeContract({
          address: contractAddress,
          abi: abi,
          functionName: "purchaseShares",
          args: [BigInt(propertyId), BigInt(shareCount)],
          value: totalPrice,
        });
      } catch (error) {
        console.error("Transaction Error:", error);
        toast({
          title: "Transaction Error",
          description: error.message,
          variant: "destructive",
        });
        setIsPurchaseLoading(false);
      }
    } else {
      toast({
        title: "Error",
        description:
          "Please connect your wallet and ensure a property is selected.",
        variant: "destructive",
      });
    }
  };


  const handleShowOnEtherscan = () => {
    if (hash) {
      const baseUrl = "https://sepolia.etherscan.io";
      window.open(`${baseUrl}/tx/${hash}`, "_blank");
    }
  };

  const truncateAddress = (address) => {
    return `${address.toLocaleString().slice(0, 6)}...${address
      .toLocaleString()
      .slice(-4)}`;
  };

  // Dummy coordinates - replace with actual property coordinates
  const position = [51.505, -0.09];

  if (readIsLoading) return <div>Loading...</div>;
  if (readError) return <div>Error: {readError.message}</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="relative h-[400px] rounded-2xl overflow-hidden">
            <img
              src={`https://picsum.photos/seed/${property.id}/400/400`}
              alt={property.name}
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div className="rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Location</h2>
            <Map
              height={400}
              width={400}
              center={position}
              zoom={14}
              attribution={false}
              provider={(x, y, z) =>
                `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`
              }
            >
              <Marker width={50} anchor={position} color="#FF4D5F" />
            </Map>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-[#FF4D5F]" />
            <span>San Francisco</span>
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{property.name}</h1>
            <p className="text-xl text-gray-600">San Francisco, California</p>
          </div>
          <Card className="bg-[#FFF5E4] border-none shadow-none">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Price per share</p>
                  <p className="text-2xl font-semibold">
                    ${formatPrice(property.pricePerShareInWei)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Available shares</p>
                  <p className="text-2xl font-semibold">
                    {Number(property.remainingShares).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total shares</p>
                  <p className="text-2xl font-semibold">1000</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Annual yield</p>
                  <p className="text-2xl font-semibold">12%</p>
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
              onChange={(e) =>
                setShareCount(
                  Math.min(
                    Math.max(1, parseInt(e.target.value) || 1),
                    Number(property.remainingShares)
                  )
                )
              }
              className="w-20 text-center"
            />
            <Button variant="outline" size="icon" onClick={incrementShares}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            size="lg"
            className="w-full bg-[#FF4D5F] text-[#FFF5E4] hover:bg-[#FF7679]"
            onClick={handlePurchaseShares}
            disabled={!isConnected || isWritePending || isConfirming}
          >
            {isWritePending
              ? "Confirming..."
              : isConfirming
              ? "Processing..."
              : `Invest Now ($${formatPrice(
                  BigInt(property.pricePerShareInWei) * BigInt(shareCount)
                )})`}
          </Button>
          <div>
            <h2 className="text-2xl font-bold mb-4">About Property</h2>
            <p className="mb-8 text-gray-600">{properties[0].description}</p>
            <h2 className="text-2xl font-bold mb-4">Current Owners</h2>
            <Table className="border mb-8">
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Shares</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shareholders[0].map((shareholder, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {index == 0 ? "Available" : truncateAddress(shareholder)}
                    </TableCell>
                    <TableCell>{shareholders[1][index].toString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <Dialog open={isPurchaseLoading} onOpenChange={setIsPurchaseLoading}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex space-x-4 items-center justify-center p-4">
            <p className="text-center text-gray-600">
              Purchase in progress
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
