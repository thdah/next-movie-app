"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react"
import Dropdown from "./Dropdown";

export default function FilterSection({
    genres = [],
    languages = [],
    placeholder
}) {
    //sync filter state with URL query parameters on mount
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState(() => ({
    genres: searchParams.get("genre") || "",
    year: searchParams.get("year") || "",
    rating: searchParams.get("rating") || "",
    language: searchParams.get("language") || "",
    sortBy: searchParams.get("sortBy") || "",
    query: searchParams.get("query") || ""
    }));

    //handle changes to filter inputs and update state
    const handleChange = (e) => {
        const { name, value } = e.target 
        setFilters((prev) => ({...prev, [name]: value})) //update specific filter field
    }

    //handle search button click to update URL with filter values
    const handleSearch = () => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if(value) params.set(key, value) //add non-empty filter values to URL
        })
        params.set("page", "1") //reset to page 1 for new filter results
        window.history.pushState({}, "", `?${params}`) //update URL without reload
    }

    //define static filter options for year, rating and sortBy
    const filterOptions = {
        years: ["2025", "2024", "2020-now", "2010-2019", "2000-2009", "1990-1999"],
        ratings: ["9", "8", "7", "6", "5", "4", "3", "2", "1"],
        sortBy: [
            { label: "Most Popular", value: "popularity.desc" },
            { label: "Newest", value: "release_date.desc" },
            { label: "Oldest", value: "release_date.asc" },
            { label: "Top Rated", value: "vote_average.asc" }
        ]
    }

    
    //render filter UI with search input and dropdowns
    return (
        <section className="bg-black text-white py-6 mt-20">
            <div className="px-4 md:px-10 xl:px-36">
                <div className="mb-6">
                    <label className="block mb-2 ml-1 text-sm font-semibold">Search</label>
                    <input type="text" name="query" placeholder={placeholder} 
                     autoComplete="off" value={filters.query} onChange={handleChange}
                     className="w-full px-4 py-2 bg-[#252525] text-sm text-white placeholder-white
                     rounded-xl focus:outline-none"
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {/* genres dropdown */}
                    <Dropdown
                     name="genre"
                     label="Genre"
                     value={filters.genre}
                     onChange={handleChange}
                     options={genres.map((g) => ({ label: g.name, value: g.id}))}
                    />

                    {/* year dropdown */}
                    <Dropdown
                     name="year"
                     label="Year"
                     value={filters.year}
                     onChange={handleChange}
                     options={filterOptions.years.map((y) => ({ label: y, value: y}))}
                    />

                    {/* rating dropdown */}
                    <Dropdown
                     name="rating"
                     label="Rating"
                     value={filters.rating}
                     onChange={handleChange}
                     options={filterOptions.ratings.map((r) => ({ label: `${r}+`, value: r}))}
                    />

                    {/* language dropdown */}
                    <Dropdown
                     name="language"
                     label="Languages"
                     value={filters.language}
                     onChange={handleChange}
                     options={languages.map((l) => (
                        { label: l.english_name , value: l.iso_639_1}
                    ))}
                    />

                    {/* sortBy dropdown */}
                    <Dropdown
                     name="sortBy"
                     label="Sort By"
                     value={filters.sortBy}
                     onChange={handleChange}
                     options={filterOptions.sortBy}
                    />

                    {/* search button */}
                    <div className="flex items-end">
                        <button 
                        onClick={handleSearch}
                        className="bg-red-500 text-black font-semibold w-full px-5 py-2 rounded-md
                        hover:bg-red-400 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}