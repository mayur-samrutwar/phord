import Link from 'next/link'
import { Button } from "@/components/ui/button"
// import { w3mButton } from "appkit"

export default function Navbar() {
  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-8 flex justify-between items-center">
        <Link href="/" className='flex items-center'>
        <img src='/phord.png' className='h-8' />
      
        </Link>
        <div className="flex items-center space-x-8">
          <Link href="/properties"><p className="text-gray-800 hover:text-gray-700">Properties</p></Link>
          <Link href="/marketplace"><p className="text-gray-800 hover:text-gray-700">Sell</p></Link>
          <Link href="/profile"><p className="text-gray-800 hover:text-gray-700">Profile</p></Link>
          <Link href="/list"><p className="text-gray-800 hover:text-gray-700">List Your Property</p></Link>
          <w3m-button label="Login" balance="hide" />
        </div>
      </div>
    </nav>
  )
} 