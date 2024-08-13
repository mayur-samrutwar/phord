import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PropertyDetails({ property }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative h-96 lg:h-full">
          <img src={property.image} alt={property.name} layout="fill" objectFit="cover" className="rounded-xl" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{property.name}</h1>
          <p className="text-xl text-gray-600 mb-6">{property.location}</p>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Price per share</p>
                  <p className="text-2xl font-bold">${property.pricePerShare.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Available shares</p>
                  <p className="text-2xl font-bold">{property.availableShares.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total shares</p>
                  <p className="text-2xl font-bold">{property.totalShares.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Annual yield</p>
                  <p className="text-2xl font-bold">{property.annualYield}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button size="lg" className="w-full mb-8">Invest Now</Button>
          <h2 className="text-2xl font-bold mb-4">About this property</h2>
          <p className="text-gray-600 mb-6">{property.description}</p>
          <h2 className="text-2xl font-bold mb-4">Amenities</h2>
          <ul className="grid grid-cols-2 gap-2">
            {property.amenities.map((amenity, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {amenity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
