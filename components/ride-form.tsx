"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, Search } from "lucide-react"

interface RideFormProps {
  onSearch: (data: { pickup: string; dropoff: string; passengers: number }) => void
}

export function RideForm({ onSearch }: RideFormProps) {
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [passengers, setPassengers] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pickup && dropoff) {
      onSearch({ pickup, dropoff, passengers })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold text-foreground">Find Your Ride</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pickup" className="text-sm font-medium">
              Pickup Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="pickup"
                type="text"
                placeholder="Enter pickup address"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoff" className="text-sm font-medium">
              Drop-off Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="dropoff"
                type="text"
                placeholder="Enter destination address"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passengers" className="text-sm font-medium">
              Number of Passengers
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="passengers"
                type="number"
                min="1"
                max="8"
                value={passengers}
                onChange={(e) => setPassengers(Number.parseInt(e.target.value) || 1)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            <Search className="w-4 h-4 mr-2" />
            Search Rides
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
