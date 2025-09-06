"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, ExternalLink } from "lucide-react"

interface RideOption {
  id: string
  service: string
  logo: string
  fare: number
  estimatedTime: string
  rating: number
  vehicleType: string
  appUrl: string
}

interface FareComparisonProps {
  rides: RideOption[]
  pickup: string
  dropoff: string
}

export function FareComparison({ rides, pickup, dropoff }: FareComparisonProps) {
  const handleBookNow = (appUrl: string, service: string) => {
    // In a real app, this would construct deep links to the respective apps
    window.open(appUrl, "_blank")
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center mb-2">Available Rides</h2>
        <p className="text-muted-foreground text-center">
          From <span className="font-medium">{pickup}</span> to <span className="font-medium">{dropoff}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rides.map((ride) => (
          <Card key={ride.id} className="relative hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold">{ride.service.charAt(0)}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{ride.service}</CardTitle>
                    <p className="text-sm text-muted-foreground">{ride.vehicleType}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {ride.rating}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-primary">₹{ride.fare}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {ride.estimatedTime}
                </div>
              </div>

              <Button
                onClick={() => handleBookNow(ride.appUrl, ride.service)}
                className="w-full bg-accent hover:bg-accent/90"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
