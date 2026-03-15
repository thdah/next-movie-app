"use client";

import { SquarePlay, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import TrailerModal from "./TrailerModal";

//create helper function to fetch Json data from url
//use SWR to fetch automatically and cache data
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
})

export default function Card({ media }) {
    //destructure media properties with fallback values
    const {
        id,
        poster_path: posterPath,
        title,
        name,
        vote_average: voteAverage,
        media_type: mediaType = "movie"
    } = media || {};

    //fallback title if name or title are missing
    const displayTitle = title || name || "Untitled"
    const [isModalOpen, setIsModalOpen] = useState(false) //to control the trailer modal open or not

    const {data: trailerData, error} = useSWR(
        id ? `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en_US` 
        : null,
        fetcher
    )

    //find first trailer for the trailer videos
    const trailer = trailerData?.results?.find(
        (video) => video.site === 'YouTube' && video.type === 'Trailer',
    ) 

    //build youtube embed URL for trailer if found
    const trailerUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
    : null

    //create openModal function
    const openModal = () => {
        if(trailerUrl) return setIsModalOpen(true)
    }
    //create closeModal function
    const closeModal = () => setIsModalOpen(false)

    return (
        <div className="flex-none w-40 sm:w-48 md:w-56 min-w-40 max-w-56 bg-[#18181b]
        rounded-lg overflow-hidden shadow-lg snap-start">
            <Link href={`/details?id=${id}&media_type=${mediaType}`}>
                <div className="relative aspect-2/3 group cursor-pointer">
                    <Image 
                     src={
                        posterPath ? `https://image.tmdb.org/t/p/w500/${posterPath}` : "/default_poster.jpg"
                     } 
                     alt=""
                     fill
                     className="object-cover rounded-t-lg group-hover:brightness-95 transition-all"
                     sizes="33vw"
                     quality={[75, 90]}
                    />
                </div>
            </Link>

            <div className="p-4 flex flex-col gap-2">
                <p className="text-xs sm:text-sm text-yellow-400">
                     ⭐ {voteAverage?.toFixed(1) || "N/A"}
                </p>
                <Link href={`/details?id=${id}&media_type=${mediaType}`}>
                     <h3 className="text-base sm:text-lg my-1 font-semibold 
                     text-white line-clamp-2 h-12 sm:h-14 cursor-pointer hover:underline">
                        {displayTitle}
                     </h3>
                </Link>
                <button 
                onClick={openModal}
                disabled={!trailerUrl}
                className={`flex items-center justify-center gap-1 w-full py-2
                bg-[#18181b] text-white font-bold border border-gray-600 rounded-4xl
                hover:bg-red-500 transition-colors text-sm sm:text-base cursor-pointer
                ${!trailerUrl ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                    <SquarePlay className="w-8 h-6 -mb-px" />
                    Trailer
                </button>
            </div>
            
            <TrailerModal isOpen={isModalOpen} onClose={closeModal} title={displayTitle} trailerUrl={trailerUrl} />
        </div>
    )
}