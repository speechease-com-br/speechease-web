"use client"

import React, { useState, useEffect, ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

interface CustomTooltipProps {
  children: ReactNode
  content: ReactNode
  delay?: number
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ children, content, delay = 100 }) => {
  const [open, setOpen] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (shouldShow) {
      timer = setTimeout(() => setOpen(true), delay)
    } else {
      setOpen(false)
    }
    return () => clearTimeout(timer)
  }, [shouldShow, delay])

  return (
    <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger asChild>
          <div
            onMouseEnter={() => setShouldShow(true)}
            onMouseLeave={() => setShouldShow(false)}
          >
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}