"use client"

export default function Loading3D() {
  return (
    <div className="fixed inset-0 -z-10 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="animate-pulse">
        <div className="w-32 h-32 rounded-full bg-indigo-500/30 animate-ping"></div>
      </div>
    </div>
  )
}