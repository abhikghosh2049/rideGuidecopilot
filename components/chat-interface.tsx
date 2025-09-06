"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Car, Bot, User, MapPin, Users, Clock, Zap, RotateCcw } from "lucide-react"

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

const mockRides: RideOption[] = [
  {
    id: "1",
    service: "Ola",
    logo: "/ola-cab-service-green-logo.jpg",
    fare: 100,
    estimatedTime: "15 mins",
    rating: 4.5,
    vehicleType: "Mini",
    appUrl: "https://play.google.com/store/apps/details?id=com.olacabs.customer",
  },
  {
    id: "2",
    service: "Uber",
    logo: "/uber-black-logo-ride-sharing.jpg",
    fare: 120,
    estimatedTime: "20 mins",
    rating: 4.7,
    vehicleType: "Sedan",
    appUrl: "https://play.google.com/store/apps/details?id=com.ubercab",
  },
  {
    id: "3",
    service: "InDrive",
    logo: "/indrive-orange-logo-ride-hailing.jpg",
    fare: 90,
    estimatedTime: "10 mins",
    rating: 4.8,
    vehicleType: "Mini",
    appUrl: "https://play.google.com/store/apps/details?id=sinet.startup.inDriver",
  },
  {
    id: "4",
    service: "Rapido",
    logo: "/rapido-yellow-bike-taxi-logo.jpg",
    fare: 110,
    estimatedTime: "18 mins",
    rating: 4.6,
    vehicleType: "SUV",
    appUrl: "https://play.google.com/store/apps/details?id=com.rapido.passenger",
  },
  {
    id: "5",
    service: "Ola Bike",
    logo: "/ola-cab-service-green-logo.jpg",
    fare: 45,
    estimatedTime: "8 mins",
    rating: 4.3,
    vehicleType: "Bike",
    appUrl: "https://play.google.com/store/apps/details?id=com.olacabs.customer",
  },
  {
    id: "6",
    service: "Uber Moto",
    logo: "/uber-black-logo-ride-sharing.jpg",
    fare: 50,
    estimatedTime: "10 mins",
    rating: 4.4,
    vehicleType: "Bike",
    appUrl: "https://play.google.com/store/apps/details?id=com.ubercab",
  },
  {
    id: "7",
    service: "Rapido Bike",
    logo: "/rapido-yellow-bike-taxi-logo.jpg",
    fare: 40,
    estimatedTime: "7 mins",
    rating: 4.5,
    vehicleType: "Bike",
    appUrl: "https://play.google.com/store/apps/details?id=com.rapido.passenger",
  },
]

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
    "pickup" | "dropoff" | "passengers" | "searching" | "results" | "completed"
  >("pickup")
  const [rideData, setRideData] = useState<{ pickup: string; dropoff: string; passengers: number }>({
    pickup: "",
    dropoff: "",
    passengers: 1,
  })
  const [isTyping, setIsTyping] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const [showBookAgain, setShowBookAgain] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
          addMessage("🎯 Perfect! Now, where would you like to go? Please enter your drop-off location.", "bot")
          setConversationState("dropoff")
        })
        break

      case "dropoff":
        setRideData((prev) => ({ ...prev, dropoff: userInput }))
        simulateTyping(() => {
          addMessage("✨ Excellent! How many passengers will be traveling?\n(Enter a number between 1-8)", "bot")
          setConversationState("passengers")
        })
        break

      case "passengers":
        const passengerCount = Number.parseInt(userInput)
        if (isNaN(passengerCount) || passengerCount < 1 || passengerCount > 8) {
          simulateTyping(() => {
            addMessage("❌ Please enter a valid number of passengers (1-8).", "bot")
          })
          return
        }

        setRideData((prev) => ({ ...prev, passengers: passengerCount }))
        setConversationState("searching")

        simulateTyping(() => {
          addMessage(
            "🔍 Searching for the best ride options...\nAnalyzing prices from Ola, Uber, InDrive & Rapido",
            "bot",
          )

          setTimeout(() => {
            const filteredRides = mockRides
              .filter((ride) => (passengerCount === 1 ? true : ride.vehicleType !== "Bike"))
              .sort((a, b) => a.fare - b.fare)

            const resultsMessage = `🎉 Found ${filteredRides.length} ride options! Here are your choices sorted by price:`
            addMessage(resultsMessage, "bot")

            filteredRides.forEach((ride, index) => {
              setTimeout(() => {
                const vehicleEmoji = ride.vehicleType === "Bike" ? "🏍️" : "🚗"
                const rideMessage = `${index + 1}. **${ride.service}**
💰 **₹${ride.fare}** • ⏱️ ${ride.estimatedTime} • ⭐ ${ride.rating}/5
${vehicleEmoji} ${ride.vehicleType} ${index === 0 ? "🏆 **Best Price!**" : index === filteredRides.length - 1 ? "⚡ **Premium Choice!**" : "✨ **Great Option!**"}`

                addMessage(rideMessage, "bot")

                if (index === filteredRides.length - 1) {
                  setTimeout(() => {
                    const bookingMessage =
                      passengerCount === 1
                        ? "🚀 **Ready to book?** Just type the number (1, 2, 3...) or service name!\n\n💡 **Quick tip:** I've included both car and bike options for you - bikes are faster and cheaper! 🏍️"
                        : "🚀 **Ready to book?** Just type the number (1, 2, 3...) or service name!\n\n💡 **Quick tip:** Type '1' for the cheapest option or service name like 'Uber'"

                    addMessage(bookingMessage, "bot")
                    setConversationState("results")
                  }, 500)
                }
              }, index * 600)
            })
          }, 2000)
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
              `🎉 Perfect choice! Redirecting you to ${selectedRide.service}...\n\n📍 From: ${rideData.pickup}\n📍 To: ${rideData.dropoff}\n👥 Passengers: ${rideData.passengers}\n💰 Fare: ₹${selectedRide.fare}\n\nHave a safe trip! 🚗✨`,
              "bot",
            )
            setConversationState("completed")
            setTimeout(() => {
              onBookRide(selectedRide.id, selectedRide.appUrl)
              setTimeout(() => {
                addMessage(
                  "🚗 Hope you had a great ride! Need another trip? I'm here to help you find the best options again! 😊",
                  "bot",
                )
                setShowBookAgain(true)
              }, 3000)
            }, 1500)
          })
        } else {
          simulateTyping(() => {
            addMessage(
              "🤔 I didn't understand that. Please try:\n• Type a number (1, 2, 3...)\n• Or service name (Ola, Uber, InDrive, Rapido)",
              "bot",
            )
          })
        }
        break
    }
  }

  const handleBookAgain = () => {
    setMessages([
      {
        id: Date.now().toString(),
        type: "bot",
        content: "🎉 Welcome back! Ready for another ride? Let's start fresh - where would you like to be picked up?",
        timestamp: new Date(),
      },
    ])
    setConversationState("pickup")
    setRideData({ pickup: "", dropoff: "", passengers: 1 })
    setCurrentInput("")
    setShowBookAgain(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[700px] max-w-2xl mx-auto bg-card rounded-xl border shadow-2xl overflow-hidden">
      <div className="flex items-center space-x-3 p-5 border-b bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 text-white">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
          <Car className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">RideGuide Copilot</h3>
          <p className="text-violet-100 text-sm flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Your AI ride assistant • Online
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-violet-200">Powered by AI</div>
          <div className="text-xs text-violet-100">Compare • Book • Save</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-violet-50/30 via-white to-violet-50/20">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
              message.type === "user" ? "flex-row-reverse" : "flex-row"
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 ${
                message.type === "user"
                  ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white border-violet-300"
                  : "bg-gradient-to-br from-white to-violet-50 text-violet-600 border-violet-200"
              }`}
            >
              {message.type === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            <div className={`max-w-[80%] relative ${message.type === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`p-4 rounded-2xl whitespace-pre-line shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                  message.type === "user"
                    ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-br-md border-violet-400/30 shadow-violet-200"
                    : "bg-white text-gray-800 rounded-bl-md border-violet-100 shadow-violet-100"
                }`}
              >
                {message.content}
              </div>
              <div
                className={`text-xs text-muted-foreground mt-2 flex items-center gap-1 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Clock className="w-3 h-3" />
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3 animate-in slide-in-from-bottom-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-white to-violet-50 text-violet-600 border-2 border-violet-200 shadow-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white text-foreground p-4 rounded-2xl rounded-bl-md shadow-lg border border-violet-100">
              <div className="flex space-x-1">
                <div className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2.5 h-2.5 bg-violet-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-5 border-t bg-gradient-to-r from-violet-50 to-purple-50 border-violet-100">
        {showBookAgain && (
          <div className="mb-3 animate-in slide-in-from-bottom-2">
            <Button
              onClick={handleBookAgain}
              className="w-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Book Another Ride
            </Button>
          </div>
        )}

        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => {
                setInputFocused(true)
              }}
              onBlur={() => {
                setInputFocused(false)
              }}
              placeholder={
                conversationState === "pickup"
                  ? "Enter pickup location..."
                  : conversationState === "dropoff"
                    ? "Enter drop-off location..."
                    : conversationState === "passengers"
                      ? "Number of passengers..."
                      : "Type your message..."
              }
              className={`rounded-full border-2 transition-all duration-300 bg-white shadow-sm pl-12 ${
                inputFocused
                  ? "border-violet-400 shadow-lg shadow-violet-100"
                  : "border-violet-200 hover:border-violet-300"
              }`}
              disabled={isTyping || (conversationState === "completed" && showBookAgain)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -mt-2 text-violet-400 pointer-events-none">
              {conversationState === "pickup" || conversationState === "dropoff" ? (
                <MapPin className="w-4 h-4" />
              ) : conversationState === "passengers" ? (
                <Users className="w-4 h-4" />
              ) : null}
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!currentInput.trim() || isTyping || (conversationState === "completed" && showBookAgain)}
            size="icon"
            className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
