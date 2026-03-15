import Card from "./Card"

//fetch the trending movies of the week from TMDB
async function fetchTrendingMovies() {
    //get api key
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY

    //make api request to get the trending movies
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`)

    //return empty array if the request fails
    if(!res.ok) return []

    //if request ok, convert it as JSON and display only 5 movies from index 3
    const data = await res.json()
    const movies = data.results ? data.results.slice(3,8) : []

    //return the movie list
    return movies
}

export default async function TrendingMovies() {

    const movies = await fetchTrendingMovies()

    return (
        <section className="py-8 px-4 sm:px-8 md:px-20 bg-black text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500 mb-4">
                Trending Movies
            </h2>
            <div className="flex overflow-x-auto pb-4 gap-13">
                {movies.length > 0 ? (
                    movies.map((movie) => <Card key={movie.id} media={movie} />)
                ) : (
                    <p className="text-gray-400">No Trending Movies Found</p>
                )}
            </div>
        </section>
    )
}