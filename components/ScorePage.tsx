'use client'

import { useState, useEffect} from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function ScorePage() {
  const [loading, setLoading] = useState('')
  const [creatorUsername, setCreatorUsername] = useState('')
  const [creatorScore, setCreatorScore] = useState(0)
  const [creatorStage, setCreatorStage] = useState('Small Creator' | 'Big Creator')
  const [qualityScore, setQualityScore] = useState(0)
  const [networkScore, setNetworkScore] = useState(0)
  const [growthScore, setGrowthScore] = useState(0)
  const [engagementScore, setEngagementScore] = useStae(0)
  const [consistencyScore, setConsistencyScore] = useState(0)
  const [creatorPercentile, setCreatorPercentil] = useState('')

  const share = () => {
    
  }
  
  const mintNFT = () => {
    
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 p-4">
      <div className="max-w-sm mx-auto space-y-6">
        {/* Main Score Section */}
        <div className="text-center space-y-4 pt-8">
          <div className="text-8xl font-bold text-teal-700">{creatorScore}</div>
          <p className="text-gray-600 text-lg">Your creator score</p>
          <Badge className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2">
            <span className="mr-2">🎯</span>
            {creatorStage}
          </Badge>
        </div>

        {/* Mascot Character */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-teal-400 rounded-full relative">
              {/* Character body */}
              <div className="absolute inset-2 bg-teal-300 rounded-full">
                {/* Eyes */}
                <div className="absolute top-6 left-6 w-4 h-4 bg-black rounded-full"></div>
                <div className="absolute top-6 right-6 w-4 h-4 bg-black rounded-full"></div>
                {/* Eye highlights */}
                <div className="absolute top-7 left-7 w-2 h-2 bg-white rounded-full"></div>
                <div className="absolute top-7 right-7 w-2 h-2 bg-white rounded-full"></div>
                {/* Smile */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-black rounded-full"></div>
                {/* Eyebrows */}
                <div className="absolute top-4 left-5 w-6 h-1 bg-teal-500 rounded-full transform -rotate-12"></div>
                <div className="absolute top-4 right-5 w-6 h-1 bg-teal-500 rounded-full transform rotate-12"></div>
              </div>
              {/* Feet */}
              <div className="absolute -bottom-2 left-8 w-4 h-8 bg-teal-600 rounded-full"></div>
              <div className="absolute -bottom-2 right-8 w-4 h-8 bg-teal-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h3 className="text-gray-600 font-medium mb-4">Score Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: "1. Engagement", score: `${engagementScore}/10` },
              { label: "2. Consistency", score: `${consistencyScore}/10` },
              { label: "3. Growth", score: `${growthScore}/10` },
              { label: "4. Quality", score: `${qualityScore}/10` },
              { label: "5. Network", score: `${networkScore}/10` },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-500">{item.label}</span>
                <span className="text-teal-700 font-medium">{item.score}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-6 font-medium">You are in the {creatorPercentile} of creators!</p>
        </Card>

        {/* Profile Card */}
        <Card className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 border-2 border-teal-400 relative overflow-hidden">
          {/* Decorative vines */}
          <div className="absolute top-2 right-4 text-green-600">
            <svg width="60" height="40" viewBox="0 0 60 40" className="fill-current">
              <path d="M10 20 Q20 10, 30 20 T50 20" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="15" cy="15" r="2" />
              <circle cx="25" cy="25" r="2" />
              <circle cx="35" cy="15" r="2" />
              <circle cx="45" cy="25" r="2" />
            </svg>
          </div>

          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>O</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-gray-700">{creatorUsername}</p>
            </div>
          </div>

          <div className="flex items-end justify-between mt-4">
            <div>
              <div className="text-4xl font-bold text-teal-700">{creatorScore}</div>
              <p className="text-sm text-gray-600">{creatorStage}</p>
            </div>

            {/* Mini mascot */}
            <div className="w-16 h-16 bg-teal-400 rounded-full relative">
              <div className="absolute inset-1 bg-teal-300 rounded-full">
                <div className="absolute top-2 left-2 w-2 h-2 bg-black rounded-full"></div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full"></div>
                <div className="absolute top-2.5 left-2.5 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute top-2.5 right-2.5 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-1 border-b border-black rounded-full"></div>
                <div className="absolute top-1.5 left-1.5 w-3 h-0.5 bg-teal-500 rounded-full transform -rotate-12"></div>
                <div className="absolute top-1.5 right-1.5 w-3 h-0.5 bg-teal-500 rounded-full transform rotate-12"></div>
              </div>
              <div className="absolute -bottom-1 left-2 w-2 h-4 bg-teal-600 rounded-full"></div>
              <div className="absolute -bottom-1 right-2 w-2 h-4 bg-teal-600 rounded-full"></div>
            </div>
          </div>

          {/* Ground/grass effect */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-400 to-transparent"></div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pb-8">
          <Button className="flex-1 bg-orange-400 hover:bg-orange-500 text-white font-medium py-3">Share</Button>
          <Button
            variant="outline"
            className="flex-1 border-2 border-orange-400 text-orange-600 hover:bg-orange-50 font-medium py-3 bg-transparent"
          >
            Mint NFT
          </Button>
        </div>
      </div>
    </div>
  )
}
