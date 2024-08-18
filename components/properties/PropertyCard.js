import React from 'react';
import Link from 'next/link';

export default function PropertyCard({ property, index }) {
  // Convert BigInt to number and format the price
  const formatPrice = (priceInWei) => {
  
    // Convert Wei to Ether (1 Ether = 1e18 Wei)
    const priceInEther = Number(priceInWei) / 1e18;
    const priceInUSD = priceInEther * 2600
    // Format the price with 2 decimal places
    return (priceInUSD).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Link href={`/properties/${index+1}`}>
      <div className='w-80'>
        <img 
          className='w-80 rounded-2xl' 
          src={`https://picsum.photos/seed/${property.id}s2/400/400`} 
          alt={property.name}
        />
        <div className='flex justify-between mt-4 text-sm'>
          <p className=''>{property.name}</p>
          <p className=''>{property.remainingShares.toLocaleString()} Shares left</p>
        </div>
        <p className="mt-1 text-gray-500 text-sm">Delhi, India</p>
        <p className='mt-2 text-sm font-semibold'>
          USD {formatPrice(property.pricePerShareInWei).toLocaleString()} <span className='text-gray-500 font-normal'>per share</span>
        </p>
      </div>
    </Link>
  );
}