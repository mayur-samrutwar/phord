import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className='flex items-center'>
        {/* <img src='/logo.png' className='h-16' /> */}
          <p className="text-2xl font-bold text-gray-900">phord</p>
        </Link>
        <div className="flex items-center space-x-8">
          <Link href="/properties"><p className="text-gray-800 hover:text-gray-700">Explore</p></Link>
          <Link href="/marketplace"><p className="text-gray-800 hover:text-gray-700">Marketplace</p></Link>
          <Link href="/profile"><p className="text-gray-800 hover:text-gray-700">Profile</p></Link>
          <Link href="/profile"><p className="text-gray-800 hover:text-gray-700">List Your Property</p></Link>
          <Button className="px-6">Log in</Button>
        </div>
      </div>
    </nav>
  )
}