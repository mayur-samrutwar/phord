import React from 'react';
import Link from 'next/link';

export default function PropertyCard({ property }) {
  // Convert BigInt to number and format the price
  const formatPrice = (priceInWei) => {
    if (typeof priceInWei !== 'bigint' && typeof priceInWei !== 'number') {
      return '0.00';
    }
    // Convert Wei to Ether (1 Ether = 1e18 Wei)
    const priceInEther = Number(priceInWei) / 1e18;
    // Format the price with 2 decimal places
    return (priceInEther / 1000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <div className='w-80'>
        <img 
          className='w-80 rounded-2xl' 
          src={`https://picsum.photos/seed/${property.id}sd/400/400`} 
          alt={property.name}
        />
        <div className='flex justify-between mt-4 text-sm'>
          <p className=''>{property.name}</p>
          <p className=''>1234 Shares left</p>
        </div>
        <p className="mt-1 text-gray-500 text-sm">Delhi, India</p>
        <p className='mt-2 text-sm font-semibold'>
          ${formatPrice(property.price)} <span className='text-gray-500 font-normal'>per share</span>
        </p>
      </div>
    </Link>
  );
}