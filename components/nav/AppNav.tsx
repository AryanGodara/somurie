'use client'

import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import { Home, Activity, Search, Gift } from "lucide-react"

const AppNav = () => {
  const router = useRouter()
  return(
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      
      <div className="flex justify-around py-2">
      <Button variant="ghost" className="flex flex-col items-center p-3 text-green-600" onClick={() => router.push('/home')}>
        <Home className="w-6 h-6" />
        <span className="text-xs mt-1">Home</span>
      </Button>
      <Button variant="ghost" className="flex flex-col items-center p-3 text-gray-400" onClick={() => router.push('/leaderboard')}>
        <Activity className="w-6 h-6" />
        <span className="text-xs mt-1">Leaderboard</span>
      </Button>
      <Button variant="ghost" className="flex flex-col items-center p-3 text-gray-400" onClick={() => router.push('/profile')}>
        <Search className="w-6 h-6" />
        <span className="text-xs mt-1">Profile</span>
      </Button>
      <Button variant="ghost" className="flex flex-col items-center p-3 text-gray-400" onClick={() => router.push('/score')}>
        <Gift className="w-6 h-6" />
        <span className="text-xs mt-1">Score</span>
      </Button>
    </div>
    </div>
  )
}

export default AppNav;