import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import abi from "../../contracts/abi/FractionalNFT.json";

export default function AdminPropertyManagement() {
  const { toast } = useToast();
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const contractAddress = "0x50f1C0C64BD8270A10ecbE23f1D307ea5405D53d";
  const { address } = useAccount();

  const {
    data: readData,
    error: readError,
    isLoading: readIsLoading,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: "getAllProperties",
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
    if (readData) {
      if (Array.isArray(readData)) {
        console.log("Read data:", readData);
        setProperties(readData);
      } else {
        console.error("Unexpected data format:", readData);
      }
    }
  }, [readData]);

  useEffect(() => {
    if (isConfirmed) {
      setIsApprovalLoading(false);
      toast({
        title: "Success",
        description: "Property verified successfully.",
      });
      refetch(); // Refetch the properties to update the UI
    }
  }, [isConfirmed, toast, refetch]);

  useEffect(() => {
    if (isWritePending || isConfirming) {
      setIsApprovalLoading(true);
    } else {
      setIsApprovalLoading(false);
    }
  }, [isWritePending, isConfirming]);

  const handleApprove = async (index) => {
    if (address !== "0xF666d492871DdF87792803381394EA135e89b3Ba") {
      toast({
        title: "Error",
        description: "You are not an admin.",
        variant: "destructive",
      });
      return;
    }

    try {
      await writeContract({
        address: contractAddress,
        abi: abi,
        functionName: "approveProperty",
        args: [BigInt(index + 1)], // Using index + 1 as propertyId
      });
    } catch (error) {
      console.error("Transaction Error:", error);
      setIsApprovalLoading(false);
      toast({
        title: "Transaction Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = (id) => {
    // Implement reject functionality if needed
  };

  function getStatus(status) {
    return status === true
      ? "Approved"
      : status === false
      ? "Pending"
      : "Rejected";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Property Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Yield</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell>San Francisco, California</TableCell>
                  <TableCell>USD 1,000,000</TableCell>
                  <TableCell>12%</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        property.isApproved === true
                          ? "bg-green-100 text-green-800"
                          : property.isApproved === false
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {getStatus(property.isApproved)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedProperty(property)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleApprove(index)}
                        disabled={
                          property.isApproved === true ||
                          isWritePending ||
                          isConfirming
                        }
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleReject(property.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Approval Loading Modal */}
      <Dialog open={isApprovalLoading} onOpenChange={setIsApprovalLoading}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader></DialogHeader>
          <div className="flex space-x-4 items-center justify-center p-4">
            <p className="text-center text-gray-600">
              Approval in progress 
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