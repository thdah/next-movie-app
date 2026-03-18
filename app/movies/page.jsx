"use client";

import MediaDisplay from "@/components/MediaDisplay";
import Pagination from "@/components/Pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState, useEffectEvent } from "react";
import useSWR from "swr";

//create helper function to fetch Json data from url
//use SWR to fetch automatically and cache data
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
})

export default function MoviesPage() {

    const router = useRouter() //to change page url when pagination occurs
    const pathname = usePathname() //to get the current page path
    const searchParams = useSearchParams() //to read the current url query (like: ?page=2)

    //to get current page number from url and update page state (default is 1 if missing or invalid)
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    //define TMDB API url for a list of popular movies
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}&sort_by=popularity.desc`

    //use SWR to fetch and cache movie data
    const {data: movieData, error} = useSWR(apiUrl, fetcher)

    //update the url with the new page number when navigation to different page
    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", newPage.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    //if data is still loading, show loading message
    if(!movieData) {
        return <div>Loading...</div>
    }

    //get the total number of pages from API response and fallback 1 if unavailable
    const totalPages = movieData?.total_pages || 1
    const movies = movieData.results || []

    return (
        <div className="container mx-auto px-4">
            {/* pass movie data result to media display components */}
            <MediaDisplay items={movies} />

            {/* show pagination only if there are enough results */}
            {movies.length >= 15 && totalPages > 1 && (
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
        </div>
    )
}