import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="bg-[#FFF5E4]">
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">Afford the Premium Real Estate</h1>
        <p className="text-xl mb-12 max-w-2xl text-gray-500">Own shares in high-value properties. Start building your real estate portfolio today with Phord.</p>
        <Button size="lg" className="bg-[#FF4D5F] text-[#FFF5E4] hover:bg-[#FF7679]">Start Investing</Button>
        <img className="mt-16" src="/home.png" />
      </div>
      
    </div>
  )
}