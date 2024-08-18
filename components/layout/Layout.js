import Navbar from './Navbar'
import Footer from './Footer'
import { Toaster } from "@/components/ui/toaster"
export default function Layout({ children }) {
  return (
    <div className="bg-[#] flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Toaster />
      <Footer />
    </div>
  )
}
