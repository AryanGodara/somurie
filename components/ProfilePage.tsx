"use client"

import { useState } from "react"
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Home, Activity, Search, Gift, X } from "lucide-react"
import AppNav from '@/components/nav/AppNav'

interface ProfileData {
  level: string
  levelNumber: number
  progress: number
  progressText: string
  isUnlocked: boolean
  benefits: {
    aprRate: string
    loanAmount: string
    gracePeriod: string
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [creatorLevel, setCreatorLevel] = useState('')
  const [creatorLevelNumber, setCreatorNumberLevel] = useState(0)
  const [progress, setProgress] = useState('')
  const [progressText, setProgressText] = useState('')

  // Example: const data = await fetch('/api/profile').then(res => res.json())
  const profileData: ProfileData = {
    level: "Small Creator",
    levelNumber: 1,
    progress: 56,
    progressText: "56% to next level!",
    isUnlocked: true,
    benefits: {
      aprRate: "9.5% APR Interest Rate",
      loanAmount: "Upto $1000 Loan Amount",
      gracePeriod: "30 days grace period",
    },
  }

  const nextLevelData: ProfileData = {
    level: "Medium Creator",
    levelNumber: 2,
    progress: 0,
    progressText: "Complete previous level to unlock this",
    isUnlocked: false,
    benefits: {
      aprRate: "9.5% APR Interest Rate",
      loanAmount: "Upto $1000 Loan Amount",
      gracePeriod: "30 days grace period",
    },
  }

  const scoreImprovementTips = ["8.5% APR Interest Rate", "Upto $1000 Loan Amount", "30 days grace period"]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 relative">
      {/* Header */}
      <div className="text-center pt-8 pb-6">
        <h1 className="text-3xl font-bold text-green-700 tracking-wide">PROFILE</h1>
      </div>

      {/* Character Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <img 
            src="/sprout.png" 
            alt="Sprout mascot" 
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Level Badge */}
        <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
          ✓ {profileData.level}
        </div>

        {/* Progress Bar */}
        <div className="w-80 mb-2">
          <Progress value={profileData.progress} className="h-3 bg-white" />
        </div>
        <p className="text-sm text-gray-600 mb-8">{profileData.progressText}</p>
      </div>

      {/* Benefits Section */}
      <div className="px-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Current Benefits</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-green-600 font-bold mr-2">1.</span>
              <span className="text-gray-700">{profileData.benefits.aprRate}</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-600 font-bold mr-2">1.</span>
              <span className="text-gray-700">{profileData.benefits.loanAmount}</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-600 font-bold mr-2">1.</span>
              <span className="text-gray-700">{profileData.benefits.gracePeriod}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-24 flex gap-4">
        <Button className="flex-1 bg-orange-400 hover:bg-orange-500 text-white rounded-xl py-3">Share Progress</Button>
        <Button
          variant="outline"
          className="flex-1 border-orange-400 text-orange-400 hover:bg-orange-50 rounded-xl py-3 bg-transparent"
          onClick={() => setShowModal(true)}
        >
          Increase My Score
        </Button>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-green-700 mb-6 text-center">
              Here's how you can
              <br />
              increase your score!
            </h3>

            <div className="space-y-4">
              {scoreImprovementTips.map((tip, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-green-600 font-bold mr-3">{index + 1}.</span>
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <AppNav />
    </div>
  )
}
