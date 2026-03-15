import Card from "./Card"

//fetch the trending tv series of the week from TMDB
async function fetchTrendingTvSeries() {
    //get api key
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY

    //make api request to get the trending tv series
    const res = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`)

    //return empty array if the request fails
    if(!res.ok) return []

    //if request ok, convert it as JSON and display only 5 tv series
    const data = await res.json()
    const series = data.results ? data.results.slice(0,5) : []

    //return the series list
    return series
}

export default async function TrendingTvSeries() {

    const series = await fetchTrendingTvSeries()

    return (
        <section className="py-8 px-4 sm:px-8 md:px-20 bg-black text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500 mb-4">
                Trending TV Series
            </h2>
            <div className="flex overflow-x-auto pb-4 gap-13">
                {series.length > 0 ? (
                    series.map((item) => <Card key={item.id} media={item} />)
                ) : (
                    <p className="text-gray-400">No Trending TV Series Found</p>
                )}
            </div>
        </section>
    )
}