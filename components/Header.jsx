"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, scale } from "framer-motion";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Header() {

    const pathname = usePathname(); //using path name to highlight the active navigation link
    const [isMenuOpen, setIsMenuOpen] = useState(false); //state for controll mobile menu
    const [isSearchOpen, setIsSearchOpen] = useState(false); //state for controll the search visibility
    const [searchTerm, setSearchTerm] = useState(""); //state to store search input value
    const [suggestions, setSuggestions] = useState([]); //state to store search suggestion results
    const [isLoading, setIsLoading] = useState(false); //state to track loading status

    //Navigation links
    const navLinks = [
        {name: "Home", href: "/"},
        {name: "Movies", href: "/movies"},
        {name: "TV Series", href: "/tv-series"}
    ];

    //fetch search suggestions from TMDB based on input value
    const fetchSuggestions = async (query) => {
        //clear suggestions if query is empty or spaces
        if(!query.trim()) {
            setSuggestions([])
            return
        }
        //show loading indicator before starting api call
        try {
            //get TMDB api key from .env.local
            const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
            //build API URL with encoded query for safe URL formatting
            const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
            //fetch search results without caching for fresh data
            const res = await fetch(url, {cache: "no-store"})
            if(res.ok) {
                //convert json data
                const data = await res.json()
                //keey only movies and tv series and limit to 5 results
                const filteredResults = data.results?.filter((item) => 
                    item.media_type === "movie" || item.media_type === "tv").slice(0,5) || [] 

                //update suggestions with filter results
                setSuggestions(filteredResults)
            } else {
                //clear suggestions if API call fail
                setSuggestions([])
            }
        } catch(error) {
            //log error and clear suggestions on API call failure
            console.log(error)
            setSuggestions([])
        } finally {
            //hide loading after API call finished
            setIsLoading(false)
        }
    };

    //handle search button click behavior
    const handleSearchClick = () => {
        //if search is open and suggestions exists, close search and reset
        if(isSearchOpen && suggestions.length > 0) {
            setIsSearchOpen(false)
            setSearchTerm("")
            setSuggestions([])
        } else if(searchTerm.trim()) {
            //if searchTerm exists, open search and fetch suggestions
            setIsSearchOpen(true)
            fetchSuggestions(searchTerm)
        }
    };

    return (
        <motion.header
            className="bg-transparent text-white py-2 px-4 w-full z-50 md:px-10 xl:px-36 absolute top-0 left-0"
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: 0.5}}
        >
            {/* desktop design screen */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* logo section */}
                <div className="flex items-center justify-between w-full md:w-auto">
                    <Link href="/" className="flex flex-col items-center">
                        <span className="text-2xl md:text-xl lg:text-3xl font-bold text-red-500">
                            ENJOY
                        </span>
                        <span className="text-xs lg:text-base text-white">
                            Movies & TV Series
                        </span>
                    </Link>

                    {/* mobile menu toggle button */}
                    <motion.button 
                     className="md:hidden text-white hover:text-white/80 cursor-pointer"
                     onClick={() => setIsMenuOpen(!isMenuOpen)}
                     whileTap={{ scale: 0.9 }}
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6"/>
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </motion.button>
                </div>

                {/* Search Bar */}
                <motion.div className="relative w-full md:w-1/3 md:mx-8 hidden md:block">
                    <input 
                        type="text"
                        placeholder="Quick Search"
                        className="w-full text-sm text-gray-500 bg-white px-4 lg:px-3 py-1.5 
                        focus:outline-none placeholder-gray-500 rounded-xl border border-gray-500
                        focus:border-white pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                    <button 
                     className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-default"
                     onClick={handleSearchClick}>
                        {isLoading ? (
                            //show loading spinner during API call
                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"/>
                        ) : isSearchOpen && suggestions.length > 0 ? (
                            //show close icon
                            <X className="w-5 h-5 text-gray-500" />
                        ) : (
                            //show search icon
                            <Search className="w-5 h-5 text-gray-500" />
                        )}
                    </button>

                    {/* animated suggestions dropdown */}
                    <AnimatePresence>
                        {isSearchOpen && (
                            <motion.div
                             className="absolute mt-1 top-full w-full bg-[#18181b] border border-gray-500 rounded-lg
                             shadow-lg z-50"
                             initial={{ y: -10, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             exit={{ y: -10, opacity: 0 }}
                             transition={{ duration: 0.2}}
                            >
                                {/* render suggestions or no result found message */}
                                {suggestions.length > 0 ? 
                                    suggestions.map((item) => (
                                        <Link key={item.id} href={"/"}>
                                            <div className="flex items-center gap-2 p-2 hover:bg-[#252525] rounded-lg cursor-pointer">
                                                <Image 
                                                 src={ item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : `/default_poster.jpg`} 
                                                 alt="" width={32} height={48}
                                                 className="w-8 object-center rounded aspect-2/3"/>
                                                 <div className="flex-1">
                                                    <h3 className="text-sm text-white line-clamp-2 h-10">
                                                        {item.title || item.name || "Unnamed"}
                                                    </h3>
                                                    <p>
                                                        {(item.release_date || item.first_air_date)?.split("-")[0] || "N/A"}
                                                    </p>
                                                 </div>
                                            </div>
                                        </Link>
                                    ))
                                : (
                                    //No result found message
                                    <div className="p-2 text-gray-400 text-sm text-center">No Results Found</div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Navigation Links */}
                <nav className="hidden md:flex md:items-center md:space-x-6">
                    {navLinks.map((links) => (
                        <Link
                            key={links.name}
                            href={links.href}
                            className={`text-xs sm:text-base font-medium text-white relative 
                            ${pathname === links.href ? "text-white" : "hover:text-white/80"}
                            `}
                        >
                            {links.name}

                            {/* underline for active link */}
                            {pathname === links.href && (
                                <motion.span 
                                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-500"
                                    layoutId="underline"
                                    transition={{ duration: 0.3}}
                                />
                            )}
                        </Link>   
                    ))}
                </nav>
            </div>

            {/* mobile menu */}
            <motion.div
             className={`md:hidden backdrop-blur-xs bg-[rgba(24,24,27,0.6)] z-50 absolute left-0 w-full
             px-4 py-4 ${isMenuOpen ? "block" : "hidden"}`}
             initial={{ y: -20, opacity: 0}}
             animate={isMenuOpen ? {y: 0, opacity: 1} : {y: -20, opacity: 0}}
             transition={{ duration: 0.3}}
            >
                {/* mobile search bar */}
                <motion.div className="w-full relative mb-4">
                    <input type="text" placeholder="Quick Search..."
                     className="w-full px-4 py-2 bg-white text-gray-500 placeholder-gray-500
                     rounded-xl border border-gray-500 focus:outline-none focus:border-white pr-10"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                     onClick={handleSearchClick}
                    >
                        {isLoading ? (
                            //show loading spinner during API call
                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"/>
                        ) : isSearchOpen && suggestions.length > 0 ? (
                            //show close icon
                            <X className="w-5 h-5 text-gray-500" />
                        ) : (
                            //show search icon
                            <Search className="w-5 h-5 text-gray-500" />
                        )}
                    </button>

                    {/* animated suggestions dropdown */}
                    <AnimatePresence>
                        {isSearchOpen && (
                            <motion.div
                             className="absolute mt-1 top-full w-full bg-[#18181b] border border-gray-500 rounded-lg
                             shadow-lg z-50"
                             initial={{ y: -10, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             exit={{ y: -10, opacity: 0 }}
                             transition={{ duration: 0.2}}
                            >
                                {/* render suggestions or no result found message */}
                                {suggestions.length > 0 ? 
                                    suggestions.map((item) => (
                                        <Link key={item.id} href={"/"}>
                                            <div className="flex items-center gap-2 p-2 hover:bg-[#252525] rounded-lg cursor-pointer">
                                                <Image 
                                                 src={ item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : `/default_poster.jpg`} 
                                                 alt="" width={32} height={48}
                                                 className="w-8 object-center rounded aspect-2/3"/>
                                                 <div className="flex-1">
                                                    <h3 className="text-sm text-white line-clamp-2 h-10">
                                                        {item.title || item.name || "Unnamed"}
                                                    </h3>
                                                    <p>
                                                        {(item.release_date || item.first_air_date)?.split("-")[0] || "N/A"}
                                                    </p>
                                                 </div>
                                            </div>
                                        </Link>
                                    ))
                                : (
                                    //No result found message
                                    <div className="p-2 text-gray-400 text-sm text-center">No Results Found</div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* mobile navigation links */}
                <nav className="flex flex-col items-center gap-2">
                    {navLinks.map((links) => (
                        <Link
                            key={links.name}
                            href={links.href}
                            className="block text-white text-base hover:text-white/80"
                        >{links.name}</Link>
                    ))}
                </nav>
            </motion.div>
        </motion.header>
    )

}