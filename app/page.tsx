"use client"

import { VehicleLogo } from "@/components/vehicle-logo"
import { ChatInterface } from "@/components/chat-interface"

export default function RideGuidePage() {
  const handleBookRide = (rideId: string, appUrl: string) => {
    // Open the ride-hailing app
    window.open(appUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-3">
            <VehicleLogo />
            <h1 className="text-3xl font-bold text-foreground">RideGuide</h1>
          </div>
          <p className="text-center text-muted-foreground mt-2">Your AI-powered ride comparison copilot</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ChatInterface onBookRide={handleBookRide} />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 RideGuide. Compare rides, save money, travel smart.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="#" className="hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
