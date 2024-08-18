import React, { useState, useEffect } from "react";
import PropertyCard from '@/components/properties/PropertyCard'
import SearchFilterBar from '@/components/SearchFilterBar';
import { useReadContract } from "wagmi";
import abi from "../../contracts/abi/FractionalNFT.json";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const contractAddress = "0x50f1C0C64BD8270A10ecbE23f1D307ea5405D53d";
  
  const { data: readData, error: readError, isLoading: readIsLoading, refetch } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: "getApprovedProperties",
  });

  useEffect(() => {
    if (readData) {
      // Ensure readData is an array before setting it to state
      if (Array.isArray(readData)) {
        console.log("Read data:", readData);
        setProperties(readData);
        console.log("Properties:", readData[0].remainingShares);
      } else {
        console.error("Unexpected data format:", readData);
      }
    }
  }, [readData]);

  function handleRead() {
    refetch();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Explore Properties</h1>
      <SearchFilterBar />
      {readError && <p className="text-red-500">Error: {readError.message}</p>}
      {readIsLoading && <p>Loading properties...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {properties.map((property, index) => (
          <PropertyCard key={index} property={property} index={index} />
        ))}
      </div>
    </div>
  )
}