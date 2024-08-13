import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function PropertyCard({ property }) {
  return (
    <Link href={`/properties/${property.id}`}>
      
        <Card className="overflow-hidden transition-transform hover:scale-105">
          <div className="relative h-48">
            <img src={property.image} alt={property.name} layout="fill" objectFit="cover" />
          </div>
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold mb-2">{property.name}</h3>
            <p className="text-gray-600 mb-4">{property.location}</p>
          </CardContent>
          <CardFooter className="bg-gray-50 px-4 py-3 flex justify-between items-center">
            <span className="text-indigo-600 font-bold">${property.pricePerShare.toLocaleString()}/share</span>
            <span className="text-gray-500">{property.availableShares.toLocaleString()} shares left</span>
          </CardFooter>
        </Card>
      
    </Link>
  )
}