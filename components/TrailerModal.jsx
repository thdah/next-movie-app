'use client'

import { useEffect } from 'react'

export default function TrailerModal({ isOpen, onClose, trailerUrl, title }) {
  //handle escapse key to close the modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
    }
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50'
      onClick={onClose}
      role='dialog'
      aria-label='Trailer Modal'
    >
      <div
        className='bg-[#18181b] p-4 rounded-lg w-full max-w-3xl'
        onClick={(e) => e.stopPropagation()} //prevent closing when clicking inside the modal
      >
        {trailerUrl ? (
          <div className='relative w-full' style={{ paddingTop: '56.25%' }}>
            <iframe
              src={trailerUrl}
              title={`${title} Trailer`}
              allow='autoplay; encrypted-media'
              allowFullScreen
              className='absolute top-0 left-0 w-full h-full rounded-lg'
            />
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-60 text-white'>
            <p className='text-xl font-semibold'>No Trailer Available</p>
            <p className='text-sm text-gray-400 mt-2'>
              This movie does not have a trailer yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
