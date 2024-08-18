import React, { useState, useEffect } from "react";
import PropertyCard from '@/components/properties/PropertyCard'
import SearchFilterBar from '@/components/SearchFilterBar';
import { useReadContract } from "wagmi";
import abi from "../../contracts/abi/FractionalNFTCore.json";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const contractAddress = "0x1F0964788D36619169D0ea2F0bC00B5dc0fA9239";
  
  const { data: readData, error: readError, isLoading: readIsLoading, refetch } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: "getAllProperties",
  });

  useEffect(() => {
    if (readData) {
      // Ensure readData is an array before setting it to state
      if (Array.isArray(readData)) {
        setProperties(readData);
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
      <button onClick={handleRead} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
        Refresh Properties
      </button>
      {readError && <p className="text-red-500">Error: {readError.message}</p>}
      {readIsLoading && <p>Loading properties...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  )
}