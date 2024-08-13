import ShareCard from '@/components/marketplace/ShareCard'
import { userShares } from '@/lib/mockData'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Profile() {
  const user = { name: 'John Doe', email: 'john@example.com' }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2"><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </CardContent>
      </Card>
      <h2 className="text-2xl font-semibold mb-4">Your Shares</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {userShares.map((share) => (
          <ShareCard key={share.id} share={share} isOwned={true} />
        ))}
      </div>
    </div>
  )
}
