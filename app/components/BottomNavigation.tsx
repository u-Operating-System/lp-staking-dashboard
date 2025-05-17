"use client"

import Link from "next/link"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export default function BottomNavigation() {
  return (
    <div className="w-full fixed bottom-0 left-0 right-0 bg-[#111111] py-4 md:py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-0.5 md:gap-0">
          <div className="flex gap-0.5 justify-center md:justify-start">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-0.5 hover:text-gray-300 transition-colors bg-black text-white rounded-full shadow-lg px-2 py-0.5">
                Community
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px] md:w-[240px]">
                {/* Social Media */}
                <DropdownMenuItem asChild>
                  <Link
                    href="https://twitter.com/your-handle"
                    className="flex items-center gap-1 md:gap-2 text-xs md:text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
                    Twitter/X
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="https://medium.com/@your-handle"
                    className="flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    Medium
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="https://warpcast.com/your-handle"
                    className="flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    Warpcast
                  </Link>
                </DropdownMenuItem>

                {/* Community Platforms */}
                <DropdownMenuItem asChild>
                  <Link
                    href="https://discord.gg/your-invite-code"
                    className="flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    Discord
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="https://t.me/your-community"
                    className="flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    Telegram
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-0.5 hover:text-gray-300 transition-colors bg-black text-white rounded-full shadow-lg px-2 py-0.5">
                <span className="bg-gradient-to-r from-green-700 via-green-300 to-green-700 text-transparent bg-clip-text font-semibold animate-pulse">$TOKEN</span>
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px] md:w-[240px]">
                <DropdownMenuItem asChild>
                  <Link
                    href="https://app.example.com/swap"
                    className="flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    BASE
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Desktop Docs and Github - Only show on desktop */}
          <div className="hidden md:flex gap-2 justify-end">
            <Link
              href="https://docs.example.com"
              className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ArrowUpRight className="w-4 h-4" />
              Docs
            </Link>
            <Link
              href="https://github.com/your-org/your-repo"
              className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ArrowUpRight className="w-4 h-4" />
              Github
            </Link>
          </div>
        </div>
        
        {/* Mobile Docs and Github - Bottom Row */}
        <div className="flex justify-between mt-3 md:hidden">
          <Link
            href="https://docs.example.com"
            className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors text-xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ArrowUpRight className="w-3 h-3" />
            Docs
          </Link>
          <Link
            href="https://github.com/your-org/your-repo"
            className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors text-xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ArrowUpRight className="w-3 h-3" />
            Github
          </Link>
        </div>
      </div>
    </div>
  )
} 