import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function PropertyCard({ property }) {
  return (
    <Link href={`/properties/${property.id}`}>
      

        <div className='w-80'>
          <img className='w-80 rounded-2xl' src={property.image} />
          <div className='flex justify-between mt-4 text-sm'>
          <p className=''>{property.name}</p>
          <p className=''>{property.availableShares.toLocaleString()} Shares left</p>
          </div>
          <p className="mt-1 text-gray-500 text-sm">${property.location}</p>
          <p className='mt-2 text-sm font-semibold'>${property.pricePerShare.toLocaleString()} <span className='text-gray-500 font-normal'>per share</span></p>
        </div>    
    </Link>
  )
}