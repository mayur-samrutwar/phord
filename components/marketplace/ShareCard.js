import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ShareCard({ share, isOwned = false }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{share.propertyName}</h3>
        <p className="text-gray-600 mb-4">{share.location}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-indigo-600 font-bold">${share.pricePerShare.toLocaleString()}/share</span>
          <span className="text-gray-500">{share.quantity} shares</span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4">
        <Button variant={isOwned ? "outline" : "default"} className="w-full">
          {isOwned ? "Sell Shares" : "Buy Shares"}
        </Button>
      </CardFooter>
    </Card>
  )
}