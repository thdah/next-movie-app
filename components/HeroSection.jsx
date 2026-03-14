import HeroSlider from "./HeroSlider"

//fetch three trending movies from TMDB and their extra details for hero section
async function fetchTrendingMovies() {
    //get the api key
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
    //fetch past week trending movies
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`)
    //if the response fails, return empty list
    if(!res.ok) return []
    //covert the response to json and display only 3 movies
    const data = await res.json()
    const movies = data.results ? data.results.slice(0,3) : []

    //fetch extra details from each movie
    const detailedMovies = await Promise.all(
        movies.map(async (movie) => {
            if(movie.media_type === "movie") {
                const detailedRes = await fetch(
                    `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`
                );
                //if detailes are successfully fetched, add them to the movie
                if(detailedRes.ok) {
                    const detailedData = await detailedRes.json()
                    return {
                        ...movie,
                        genres: detailedData.genres,
                        runtime: detailedData.runtime
                    }
                }
            }
            //if details are not fetched, return movie as is
            return movie
        })
    );
    //return final list of movies with detailed information
    return detailedMovies
};

export default async function HeroSection() {

    const movies = await fetchTrendingMovies();

    return (
        <HeroSlider movies={movies} />
    )
}