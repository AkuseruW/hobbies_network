'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from "lucide-react"
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

const ToggleTheme = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return null
  }


  return (
    <Button
      aria-label='Toggle Dark Mode'
      variant="outline" size="icon"
      className='flex items-center justify-center rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700'
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className='h-5 w-5 text-orange-300' />
      ) : (
        <Moon className='h-5 w-5 text-slate-800' />
      )}
    </Button>
  )
}

export default ToggleTheme

export const ToggleThemeMobile = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {

    return null
  }

  return (
    <button
      aria-label='Toggle Dark Mode'
      className="rounded-full px-3 py-2"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className='w-6 h-6 text-orange-300' onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} />
      ) : (
        <Moon className='w-6 h-6 text-white' onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} />
      )}
    </button>
  )
}