import * as React from "react"
import { UploadCloud, BarChart3, LayoutGrid, Zap } from "lucide-react"

type Tab = 'upload' | 'myads' | 'analytics'

interface NavbarProps {
  creditBalance: number
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'upload', label: 'Upload', icon: <UploadCloud className="w-4 h-4" /> },
  { id: 'myads', label: 'My Ads', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
]

export default function Navbar({ creditBalance, activeTab, onTabChange }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-medium text-white">
              Ad<span className="text-gradient">Vibe</span>
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-mono text-white">${creditBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
