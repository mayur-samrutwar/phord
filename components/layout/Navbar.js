import Link from "next/link";
import { useAccount } from 'wagmi'
import { useEffect } from 'react';

export default function Navbar() {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      handleLogin(address);
    }
  }, [isConnected, address]);

  const handleLogin = async (walletAddress) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });
      if (response.ok) {
        const userData = await response.json();
        console.log('Login successful:', userData);
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <img src="/phord.png" className="h-8" />
        </Link>
        <div className="flex items-center space-x-8">
          <Link href="/properties">
            <p className="text-gray-800 hover:text-gray-700">Properties</p>
          </Link>
          <Link href="/marketplace">
            <p className="text-gray-800 hover:text-gray-700">Sell</p>
          </Link>

          <Link href="/list">
            <p className="text-gray-800 hover:text-gray-700">
              List Your Property
            </p>
          </Link>
          <Link href="/profile">
            <p className="text-gray-800 hover:text-gray-700">Profile</p>
          </Link>
          <w3m-button label="Login" balance="hide" />
        </div>
      </div>
    </nav>
  );
}
