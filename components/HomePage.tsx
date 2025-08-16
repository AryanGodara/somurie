'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function HomePage() {
  const [usernameQuery, setUsernameQuery] = useState('')
  const [creators, setCreators] = useState([{
    creatorRank: '',
    creatorName: '',
    creatorScore: 0
  }])
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 flex flex-col">
      <div className="flex-1 p-4">
        <div className="max-w-sm mx-auto space-y-6">
          {/* Header with Logo and Vines */}
          <div className="relative pt-8 pb-4">
            {/* Decorative vines */}
            <div className="absolute top-4 left-4 text-green-600">
              <svg width="40" height="30" viewBox="0 0 40 30" className="fill-current">
                <path d="M5 15 Q15 5, 25 15 T35 15" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="10" cy="10" r="1.5" />
                <circle cx="20" cy="20" r="1.5" />
                <circle cx="30" cy="10" r="1.5" />
              </svg>
            </div>
            <div className="absolute top-4 right-4 text-green-600">
              <svg width="40" height="30" viewBox="0 0 40 30" className="fill-current">
                <path d="M5 15 Q15 5, 25 15 T35 15" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="10" cy="20" r="1.5" />
                <circle cx="20" cy="10" r="1.5" />
                <circle cx="30" cy="20" r="1.5" />
              </svg>
            </div>

            {/* Logo */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-teal-700 text-white px-4 py-2 rounded-full font-bold text-lg">
                Somurie
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-teal-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="space-y-3">
            <Input
              placeholder="Find creator"
              className="bg-white border-gray-200 py-3 text-gray-600 placeholder:text-gray-400"
              onChange={(e:any) => setUsernameQuery(e.target.value)} 
            />
            <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-3">
              Calculate creator score
            </Button>
          </div>

          {/* Today's Top Creators */}
          <Card className="p-4 bg-white/80 backdrop-blur-sm">
            <h3 className="font-medium text-gray-700 mb-4">Today's Top Creators</h3>
            <div className="space-y-3">
              {creators.map((i) => (
                <div key={i.creatorName} className="flex items-center gap-3">
                  {/* Rank badge */}
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-yellow-800">
                    {i.creatorRank}
                  </div>

                 
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="text-xs">O</AvatarFallback>
                  </Avatar>

                 
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{i.creatorName}</span>
                    <span className="text-teal-700 font-bold text-lg">{i.creatorScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Mascot Character */}
          <div className="flex justify-center pb-20">
            <div className="relative">
              <div className="w-24 h-24 bg-teal-400 rounded-full relative">
                {/* Character body */}
                <div className="absolute inset-1.5 bg-teal-300 rounded-full">
                  {/* Eyes */}
                  <div className="absolute top-4 left-4 w-3 h-3 bg-black rounded-full"></div>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-black rounded-full"></div>
                  {/* Eye highlights */}
                  <div className="absolute top-4.5 left-4.5 w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="absolute top-4.5 right-4.5 w-1.5 h-1.5 bg-white rounded-full"></div>
                  {/* Smile */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-3 h-1.5 border-b-2 border-black rounded-full"></div>
                  {/* Eyebrows */}
                  <div className="absolute top-3 left-3.5 w-4 h-0.5 bg-teal-500 rounded-full transform -rotate-12"></div>
                  <div className="absolute top-3 right-3.5 w-4 h-0.5 bg-teal-500 rounded-full transform rotate-12"></div>
                </div>
                {/* Feet */}
                <div className="absolute -bottom-1 left-6 w-3 h-6 bg-teal-600 rounded-full"></div>
                <div className="absolute -bottom-1 right-6 w-3 h-6 bg-teal-600 rounded-full"></div>
              </div>

              {/* Ground/grass effect */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gradient-to-t from-green-400 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-sm mx-auto">
          <div className="flex justify-around items-center">
            <button className="flex flex-col items-center gap-1 py-2">
              <div className="w-6 h-6 bg-teal-700 rounded-full"></div>
              <span className="text-xs text-teal-700 font-medium">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <span className="text-xs text-gray-400">Activity</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <span className="text-xs text-gray-400">Explore</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <span className="text-xs text-gray-400">Rewards</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
