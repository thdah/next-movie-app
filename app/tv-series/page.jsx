"use client";

import FilterSection from "@/components/FilterSection";
import MediaDisplay from "@/components/MediaDisplay";
import Pagination from "@/components/Pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState, useEffectEvent, useMemo } from "react";
import useSWR from "swr";

//create helper function to fetch Json data from url
//use SWR to fetch automatically and cache data
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
})

// -filter section- step 1: define fixed year ranges for filtering released date
const yearRanges = {
    2025: { gte: "2025-01-01", lte: "2025-12-31" },
    2024: { gte: "2024-01-01", lte: "2024-12-31" },
    "2020-now": { gte: "2020-01-01"},
    "2010-2019": { gte: "2010-01-01", lte: "2019-12-31" },
    "2000-2009": { gte: "2000-01-01", lte: "2009-12-31" },
    "1990-1999": { gte: "1990-01-01", lte: "1999-12-31" }
}

export default function MoviesPage() {

    const router = useRouter() //to change page url when pagination occurs
    const pathname = usePathname() //to get the current page path
    const searchParams = useSearchParams() //to read the current url query (like: ?page=2)

    //to get current page number from url and update page state (default is 1 if missing or invalid)
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    // -filter section- step 2: extract filter values from the url (default to "All")
    const genre = searchParams.get("genre") || "all"
    const year = searchParams.get("year") || "all"
    const rating = searchParams.get("rating") || "all"
    const language = searchParams.get("language") || "all"
    const sortBy = searchParams.get("sortBy") || "popularity.desc"
    const query = searchParams.get("query") || ""

    // -filter section- step 3: convert the selected year to date range object for filtering
    const yearRange = yearRanges[year] || {}

    // -filter section- step 4: modify the API URL to support both to discover and to search mode for query presence
    const baseUrl = query
    ? `https:/api.themoviedb.org/3/search/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    : `https:/api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`

    // -filter section- step 5: apply filter parameter to API URL in discover mode
    const apiUrl = new URL(baseUrl)
    apiUrl.searchParams.set("page", page)
    if(!query) {
        if(genre !== "all") apiUrl.searchParams.set("with_genres", genre)
        if(language !== "all") apiUrl.searchParams.set("with_original_languages", language)
        if(rating !== "all") apiUrl.searchParams.set("vote_average.gte", rating)
        if(sortBy) apiUrl.searchParams.set("sort_by", sortBy)
        if(yearRange.gte) apiUrl.searchParams.set("first_air_date.gte", yearRange.gte)
        if(yearRange.lte) apiUrl.searchParams.set("first_air_date.lte", yearRange.lte)
    }

    //use SWR to fetch and cache movie data
    const {data: seriesData} = useSWR(apiUrl.toString(), fetcher)

    // -filter section- step 6: fetch genres and languagues for filter dropdown options
    const {data: languagesData} = useSWR(
        `https://api.themoviedb.org/3/configuration/languages?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        fetcher
    )

    const {data: genresData} = useSWR(
        `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en_US`,
        fetcher
    )

    // -filter section- step 7: add helper function to filter movies manually in search mode
    // (because TMDB search params does not support search params)
    function filterSeries(series, {genre, yearRange, language, rating}) {
        return series.filter((show) => {
            const date = new Date(show.first_air_date || "")
            return (
                (genre === "all" || show.genre_ids.includes(Number(genre))) && 
                (language === "all" || show.original_language === language) &&
                (rating === "all" || show.vote_average >= Number(rating)) &&
                (!yearRange.gte || date >= new Date(yearRange.gte)) &&
                (!yearRange.lte || date <= new Date(yearRange.lte))
            )
        })
    }

    // -filter section- step 8: apply manual filtering in search mode using useMemo to optimize performance
    const filteredSeries = useMemo(() => {
        if (!seriesData?.results) return []
        return query
        ? filterSeries(seriesData?.results || [], { genre, yearRange, rating, language })
        : seriesData?.results || []
    }, [seriesData, query, genre, yearRange, rating, language])

    //get the total number of pages from API response and fallback 1 if unavailable
    const totalPages = seriesData?.total_pages || 1

    // -filter section- step 9: extract genre and languages for filter section components, default to empty array
    const genres = genresData?.genres || []
    const languages = languagesData || []

    //update the url with the new page number when navigation to different page
    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", newPage.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    // -filter section- step 10: update the loading state to include genres and lanuages data
    //if data is still loading, show loading message
    if(!seriesData, !genresData, !languagesData) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto px-4">
            {/* -filter section- step 11: add fileter section component to render filter UI with genres and languages */}
            <FilterSection genres={genres} languages={languages} placeholder="Search Movies" />

            {/* used filtered movies in media display components */}
            <MediaDisplay items={filteredSeries} />

            {/* show pagination only if there are enough results -update pagination to reflect filtered movies length */}
            {filteredSeries.length >= 15 && totalPages > 1 && (
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
        </div>
    )
}