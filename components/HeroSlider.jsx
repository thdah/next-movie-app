"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {Autoplay, EffectFade, Pagination} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";
import { Star } from "lucide-react";
import useSWR from "swr";
import TrailerModal from "./TrailerModal";

//fetch data from url and return as JSON, if request fails throw error
const fetcher = (url) => {
    fetch(url).then((res) => {
        if(!res.ok) {
            throw new Error("Failed to fetch data")
        }
        return res.json()
    })
}

export default function HeroSlider({movies}) {

    const [currentSlide, setCurrentSlide] = useState(0) //to track current slide index
    const [swiperInstance, setSwiperInstance] = useState(null) //to track the slide nav
    const [isModalOpen, setIsModalOpen] = useState(false) //to show or hide trailer modal
    const [selectedMedia, setSelectedMedia] = useState(null) //to store selected media to display trailer 

    //create a function to get the media title
    const getMediaTitle = (media) => {
        return media.media_type === "movie" 
        ? media.title || "Untitled" 
        : media.name || "Unnamed"
    };

    //create a function to get media genres
    const getGenres = (media) => {
        if(media.media_type === "movie" &&
            media.genres && media.genres.length > 0
        ) {
            return media.genres.map((g) => g.name).join(", ")
        }
        return ""
    }

    //create a function to format the movie runtime to hours & minutes
    const formatDuration = (media) => {
        if(media.media_type === "movie" && media.runtime) {
            const h = Math.floor(media.runtime / 60)
            const m = media.runtime % 60
            return `${h}h ${m}m`
        }
        return ""
    }

    //handle button click to switch to specified slide and update current slide
    const handleButtonClick = (index) => {
        if(swiperInstance) {
            swiperInstance.slideToLoop(index)
            setCurrentSlide(index)
        }
    }
    //fetche trailer videos for the selected media using SWR
    const {data: trailerData, error} = useSWR(
        selectedMedia ? `https://api.themoviedb.org/3/${selectedMedia.media_type}/${selectedMedia.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en_US` : null,
        fetcher
    )

    //find first trailer for the trailer videos
    const trailer = trailerData?.results?.find(
        (video) => video.site === "YouTube" && video.type === "Trailer"
    )

    //build youtube embed URL for trailer if found
    const trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1` : null ;

    //open trailer modal and set selected media
    const openModal = (media) => {
        setIsModalOpen(true)
        setSelectedMedia(media)
    }

    //close trailer modal and clear selected media
    const closeModal = (media) => {
        setIsModalOpen(false)
        setSelectedMedia(null)
    }

    return (
        <section className="relative h-screen w-full overflow-hidden">
            <Swiper
             modules={[Autoplay, EffectFade, Pagination]}
             effect="fade"
             autoplay={{delay: 5000, disableOnInteraction: false}}
             loop={movies.length > 1}
             onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
             onSwiper={(swiper) => setSwiperInstance(swiper)}
             className="w-full h-full"
             >
                {/* map through movies to create slide for each movie */}
                {movies.map((media) => (
                    <SwiperSlide key={media.id}>
                        <div className="relative h-screen w-full">
                            <div 
                             className="absolute bg-cover bg-center inset-0"
                             style={{backgroundImage: `url(https://image.tmdb.org/t/p/w1280${media.backdrop_path || "/placeholder.jpg"})`}}
                            ></div>
                            <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/80"></div>
                            <div className="absolute flex inset-0 items-center sm:items-end p-4 sm:p-8 md:p-20
                             text-white max-w-xs sm:max-w-md md:max-w-2xl">
                                <div>
                                    <Link href={`/details?id=${media.id}&media_type=${media.media_type}`}>
                                        <h1 className="text-2xl sm:text-2xl md:text-5xl font-bold leading-tight sm:leading-snug">
                                            {getMediaTitle(media)}
                                        </h1>
                                    </Link>
                                    <p className="text-sm sm:text-sm md:text-lg mt-0.5 text-red-500 font-semibold sm:leading-5">
                                        {getGenres(media)}
                                    </p>
                                    <p className="text-sm sm:text-sm md:text-lg mt-5 line-clamp-5 hidden sm:block sm:leading-5">
                                        {media.overview || "No Descriptions Available"}
                                    </p>
                                    <p className="text-sm sm:text-sm md:text-lg mt-5 sm:leading-5">
                                        <span className="mr-4">
                                            ⭐ {media.vote_average.toFixed(1)}
                                        </span>
                                        {media.media_type === "movie" && (
                                            <>
                                            <span className="mr-4">|</span>
                                            <span>{formatDuration(media)}</span>
                                            </>
                                        )}
                                    </p>
                                    <button 
                                     onClick={() => openModal(media)}
                                     disabled={!media.id}
                                     className={`mt-5 sm:mt-8 inline-block bg-red-500 text-white px-4 py-2 
                                     sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-red-400 
                                     transition text-sm sm:text-base md:text-base ${
                                        !media.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                     }`}>
                                        Watch Trailer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* navigation buttons */}
            {movies.length > 1 && (
                <div className="absolute right-4 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-1">
                    {movies.map((_, index) => (
                        <button key={index}
                         className={`w-4 h-4 rounded-full border-2 transition-colors
                         ${currentSlide === index ? "bg-red-500 border-red-500" : "bg-transparent border-white"}`}
                         onClick={() => handleButtonClick(index)}
                         aria-label={`slide ${index + 1}`}
                        ></button>
                    ))}
                </div>
            )}

            <TrailerModal 
             isOpen={isModalOpen} 
             onClose={closeModal} 
             trailerUrl={trailerUrl} 
             title={selectedMedia ? getMediaTitle(selectedMedia) : "Trailer"}
            />
        </section>
    )
}