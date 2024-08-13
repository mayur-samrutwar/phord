import PropertyCard from '@/components/properties/PropertyCard'
import { properties } from '@/lib/mockData'

export default function FeaturedProperties() {
  const featuredProperties = properties.slice(0, 4)

  return (
    <div className="bg-[#FFF5E4]">
    <div className="bg-[#FFF5E4] container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {featuredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
    </div>
  )
}