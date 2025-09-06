"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Car } from "lucide-react"

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
}

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

interface ChatInterfaceProps {
  onBookRide: (rideId: string, appUrl: string) => void
}

export function ChatInterface({ onBookRide }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hi! I'm RideGuide, your personal ride assistant. I'll help you find the best ride options from Ola, Uber, InDrive, and Rapido. Let's start - where would you like to be picked up?",
      timestamp: new Date(),
    },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [conversationState, setConversationState] = useState<
    "pickup" | "dropoff" | "passengers" | "searching" | "results"
  >("pickup")
  const [rideData, setRideData] = useState<{ pickup: string; dropoff: string; passengers: number }>({
    pickup: "",
    dropoff: "",
    passengers: 1,
  })
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const mockRides: RideOption[] = [
    {
      id: "1",
      service: "InDrive",
      logo: "🚗",
      fare: 110,
      estimatedTime: "10-15 min",
      rating: 4.1,
      vehicleType: "Economy",
      appUrl: "https://play.google.com/store/apps/details?id=sinet.startup.inDriver",
    },
    {
      id: "2",
      service: "Ola",
      logo: "🚕",
      fare: 120,
      estimatedTime: "8-12 min",
      rating: 4.2,
      vehicleType: "Mini",
      appUrl: "https://play.google.com/store/apps/details?id=com.olacabs.customer",
    },
    {
      id: "3",
      service: "Uber",
      logo: "🚙",
      fare: 135,
      estimatedTime: "6-10 min",
      rating: 4.5,
      vehicleType: "UberGo",
      appUrl: "https://play.google.com/store/apps/details?id=com.ubercab",
    },
    {
      id: "4",
      service: "Rapido",
      logo: "🏍️",
      fare: 85,
      estimatedTime: "5-8 min",
      rating: 4.0,
      vehicleType: "Bike",
      appUrl: "https://play.google.com/store/apps/details?id=com.rapido.passenger",
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const addMessage = (content: string, type: "bot" | "user") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const simulateTyping = (callback: () => void, delay = 1000) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      callback()
    }, delay)
  }

  const handleSendMessage = () => {
    if (!currentInput.trim()) return

    addMessage(currentInput, "user")
    const userInput = currentInput.trim()
    setCurrentInput("")

    switch (conversationState) {
      case "pickup":
        setRideData((prev) => ({ ...prev, pickup: userInput }))
        simulateTyping(() => {
          addMessage("Great! Now, where would you like to go? Please enter your drop-off location.", "bot")
          setConversationState("dropoff")
        })
        break

      case "dropoff":
        setRideData((prev) => ({ ...prev, dropoff: userInput }))
        simulateTyping(() => {
          addMessage("Perfect! How many passengers will be traveling? (Enter a number between 1-8)", "bot")
          setConversationState("passengers")
        })
        break

      case "passengers":
        const passengerCount = Number.parseInt(userInput)
        if (isNaN(passengerCount) || passengerCount < 1 || passengerCount > 8) {
          simulateTyping(() => {
            addMessage("Please enter a valid number of passengers (1-8).", "bot")
          })
          return
        }

        setRideData((prev) => ({ ...prev, passengers: passengerCount }))
        setConversationState("searching")

        simulateTyping(() => {
          addMessage("Excellent! Let me search for the best ride options for you...", "bot")

          // Simulate search delay
          setTimeout(() => {
            const filteredRides = mockRides
              .filter((ride) => (passengerCount === 1 ? true : ride.vehicleType !== "Bike"))
              .sort((a, b) => a.fare - b.fare)

            const resultsMessage = `Found ${filteredRides.length} ride options for you! Here are your choices sorted by price:`
            addMessage(resultsMessage, "bot")

            // Add ride options as separate messages
            filteredRides.forEach((ride, index) => {
              setTimeout(() => {
                const rideMessage = `${index + 1}. ${ride.service} ${ride.logo}\n💰 ₹${ride.fare}\n⏱️ ${ride.estimatedTime}\n⭐ ${ride.rating}/5\n🚗 ${ride.vehicleType}`
                addMessage(rideMessage, "bot")

                if (index === filteredRides.length - 1) {
                  setTimeout(() => {
                    addMessage(
                      "Which ride would you like to book? Just type the number (1, 2, 3, etc.) or say 'book [service name]'",
                      "bot",
                    )
                    setConversationState("results")
                  }, 500)
                }
              }, index * 300)
            })
          }, 1500)
        }, 800)
        break

      case "results":
        const rideNumber = Number.parseInt(userInput)
        const filteredRides = mockRides
          .filter((ride) => (rideData.passengers === 1 ? true : ride.vehicleType !== "Bike"))
          .sort((a, b) => a.fare - b.fare)

        let selectedRide: RideOption | null = null

        if (!isNaN(rideNumber) && rideNumber >= 1 && rideNumber <= filteredRides.length) {
          selectedRide = filteredRides[rideNumber - 1]
        } else {
          // Try to match by service name
          const serviceName = userInput.toLowerCase()
          selectedRide =
            filteredRides.find(
              (ride) =>
                ride.service.toLowerCase().includes(serviceName) || serviceName.includes(ride.service.toLowerCase()),
            ) || null
        }

        if (selectedRide) {
          simulateTyping(() => {
            addMessage(
              `Great choice! I'll redirect you to ${selectedRide.service} to complete your booking for ₹${selectedRide.fare}. Have a safe trip!`,
              "bot",
            )
            setTimeout(() => {
              onBookRide(selectedRide.id, selectedRide.appUrl)
            }, 1000)
          })
        } else {
          simulateTyping(() => {
            addMessage(
              "I didn't understand that selection. Please type a number (1, 2, 3, etc.) or the service name (Ola, Uber, InDrive, Rapido).",
              "bot",
            )
          })
        }
        break
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto bg-card rounded-lg border">
      {/* Chat Header */}
      <div className="flex items-center space-x-3 p-4 border-b bg-primary/5 rounded-t-lg">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <Car className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">RideGuide Copilot</h3>
          <p className="text-sm text-muted-foreground">Your personal ride assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${
                message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button onClick={handleSendMessage} disabled={!currentInput.trim() || isTyping} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
