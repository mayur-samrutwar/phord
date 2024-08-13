import PropertyCard from '@/components/properties/PropertyCard'
import { properties } from '@/lib/mockData'
import SearchFilterBar from '@/components/SearchFilterBar';

export default function Properties() {
  return (
    <div className="container mx-auto px-4 py-8 border-t">
      <h1 className="text-3xl font-bold mb-4">Explore Properties</h1>
     <SearchFilterBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  )
}