import { useRouter } from 'next/router'
import PropertyDetails from '@/components/properties/PropertyDetails'
import { properties } from '@/lib/mockData'

export default function PropertyPage() {
  const router = useRouter()
  const { id } = router.query
  const property = properties.find(p => p.id === parseInt(id))

  if (!property) return <div>Property not found</div>

  return <PropertyDetails property={property} />
}
