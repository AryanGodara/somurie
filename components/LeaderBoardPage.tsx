'use client'

import { useState, useEffect} from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Home, Activity, Search, Gift } from "lucide-react"
import AppNav from '@/components/nav/AppNav'

interface LeaderboardUser {
  id: string
  rank: number
  username: string
  score: number
  avatar: string
  isCurrentUser?: boolean
}

interface LeaderboardData {
  topThree: LeaderboardUser[]
  otherRanks: LeaderboardUser[]
}

export default function LeaderboardPage() {
  // Example: const data = await fetch('/api/leaderboard').then(res => res.json())
  const leaderboardData: LeaderboardData = {
    topThree: [
      { id: "1", rank: 2, username: "@xishika", score: 40, avatar: "/diverse-woman-smiling.png" },
      { id: "2", rank: 1, username: "@xishika", score: 40, avatar: "/bearded-man-portrait.png" },
      { id: "3", rank: 3, username: "@xishika", score: 40, avatar: "/smiling-man.png" },
    ],
    otherRanks: [
      { id: "4", rank: 6, username: "You", score: 34, avatar: "/diverse-user-avatars.png", isCurrentUser: true },
      { id: "5", rank: 4, username: "@xishika", score: 36, avatar: "/diverse-profile-avatars.png" },
      { id: "6", rank: 4, username: "@xishika", score: 36, avatar: "/diverse-profile-avatars.png" },
      { id: "7", rank: 4, username: "@xishika", score: 36, avatar: "/diverse-profile-avatars.png" },
      { id: "8", rank: 4, username: "@xishika", score: 36, avatar: "/diverse-profile-avatars.png" },
      { id: "9", rank: 4, username: "@xishika", score: 36, avatar: "/diverse-profile-avatars.png" },
    ],
  }

  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-green-500 border-green-500"
      case 2:
        return "bg-gray-400 border-gray-200"
      case 3:
        return "bg-orange-400 border-orange-400"
      default:
        return "bg-gray-400 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="text-center pt-8 pb-6">
        <h1 className="text-2xl font-semibold text-green-600">Leaderboard</h1>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex border-b border-gray-200 w-full max-w-md">
          <button className="flex-1 pb-3 text-sm font-medium text-gray-900 border-b-2 border-green-600">
            All Time
          </button>
          <button className="flex-1 pb-3 text-sm font-medium text-gray-500">This Week</button>
          <button className="flex-1 pb-3 text-sm font-medium text-gray-500">Friends</button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end mb-8 px-4">
        {leaderboardData.topThree.map((user) => (
          <div key={user.id} className="flex flex-col items-center mx-4">
            <div className="relative">
              <Avatar
                className={`${user.rank === 1 ? "w-24 h-24" : "w-20 h-20"} border-4 ${getRankBadgeStyle(user.rank)}`}
              >
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.rank} place`} />
                <AvatarFallback>{user.rank}</AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${getRankBadgeStyle(user.rank)} text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold`}
              >
                {user.rank}
              </div>
            </div>
            <div className="text-center mt-3">
              <p className="font-semibold text-sm">{user.username}</p>
              <p className="text-sm text-gray-600">{user.score}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Other Rankings */}
      <div className="px-4 pb-20">
        <div className="bg-green-50 rounded-2xl p-4 space-y-3">
          {leaderboardData.otherRanks.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-3 rounded-xl ${
                user.isCurrentUser ? "bg-green-400 text-white" : "bg-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`font-bold text-lg ${user.isCurrentUser ? "text-white" : "text-gray-700"}`}>
                  {user.rank}
                </span>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <span className={`font-medium ${user.isCurrentUser ? "text-white" : "text-gray-900"}`}>
                  {user.username}
                </span>
              </div>
              <span className={`font-bold text-lg ${user.isCurrentUser ? "text-white" : "text-gray-700"}`}>
                {user.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <AppNav />
    </div>
  )
}
