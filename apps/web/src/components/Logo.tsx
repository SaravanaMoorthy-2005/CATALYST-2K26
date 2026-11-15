import React from 'react'

interface LogoProps {
  className?: string
  size?: number
  showText?: boolean
  textColor?: string
}

export function Logo({
  className = '',
  size = 40,
  showText = false,
  textColor = 'text-cc-ink',
}: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-label="CareCircle Logo"
        role="img"
      >
        <title>CareCircle Logo</title>
        {/* Soft circle base */}
        <rect width="64" height="64" rx="18" fill="#11141A" />
        
        {/* Outer connected caring circle */}
        <circle cx="32" cy="32" r="22" stroke="#B2D8DD" strokeWidth="3" strokeDasharray="6 3" />
        
        {/* Interlocking community nodes: Elder (Lemon), Caregiver (Powder), Family (Ivory) */}
        <circle cx="32" cy="14" r="5" fill="#FFF25C" />
        <circle cx="47" cy="40" r="5" fill="#B2D8DD" />
        <circle cx="17" cy="40" r="5" fill="#F9F5F1" />
        
        {/* Central Heart & Shield motif */}
        <path
          d="M32 23.5C29.5 20.5 25.5 21 23.5 23.8C21.2 27 24 32.5 32 38.5C40 32.5 42.8 27 40.5 23.8C38.5 21 34.5 20.5 32 23.5Z"
          fill="#FFF25C"
        />
        <path
          d="M32 26V36M27 31H37"
          stroke="#11141A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-headline font-bold text-lg leading-tight tracking-tight ${textColor}`}>
            CareCircle
          </span>
          <span className="text-[11px] text-cc-muted font-body tracking-wider uppercase">
            Connected Care
          </span>
        </div>
      )}
    </div>
  )
}
