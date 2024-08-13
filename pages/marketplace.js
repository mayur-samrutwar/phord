import ShareCard from '@/components/marketplace/ShareCard'
import { marketplaceShares } from '@/lib/mockData'

export default function Marketplace() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {marketplaceShares.map((share) => (
          <ShareCard key={share.id} share={share} />
        ))}
      </div>
    </div>
  )
}