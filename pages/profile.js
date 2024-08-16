import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import ShareCard from '@/components/marketplace/ShareCard'
import { userShares } from '@/lib/mockData'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Profile() {
  const { address, isConnected } = useAccount()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isConnected && address) {
      fetchUserData(address)
    } else {
      setUser(null)
      setIsLoading(false)
    }
  }, [isConnected, address])

  const fetchUserData = async (walletAddress) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/user?walletAddress=${walletAddress}`)
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        console.error('Failed to fetch user data')
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!isConnected || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="mb-4">Please log in to view your profile.</p>
            {/* <Button>
              <w3m-button label="Login" balance="hide" />
            </Button> */}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2"><strong>Wallet Address:</strong> {user.walletAddress || 'failed to load'}</p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString() || 'failed to load'}</p>
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