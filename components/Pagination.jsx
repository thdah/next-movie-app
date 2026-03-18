export default function Pagination({currentPage, totalPages, onPageChange}) {

    //check if the current page is first page
    const isFirstPage = currentPage === 1

    //check if the current page is last page
    const isLastPage = currentPage >= totalPages

    //maximum number of page button to display in pagination
    const maxPageToShow = 5

    //calculate first page number to display
    const startPage = Math.max(1, currentPage - Math.floor(maxPageToShow / 2))

    //calculate last page number to display
    const endPage = Math.min(totalPages, startPage + maxPageToShow - 1)

    //create page number array from start page to end page
    const pages = Array.from(
        {length: endPage - startPage + 1},
        (_, i) => startPage + i
    )

    return (
        <div className="flex justify-center items-center gap-2 py-6">
            {/* previous button */}
            <button className={`px-4 py-2 rounded-md text-white font-semibold border border-[#252525]
            transition bg-black hover:bg-red-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#252525]`}
             disabled={isFirstPage}
             onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
            >
                Previous
            </button>

            {/* page number */}
            {pages.map((page) => (
                <button
                 key={page}
                 onClick={() => onPageChange(page)}
                 className={`px-4 py-2 rounded-md text-white font-semibold border border-[#252525]
                    ${
                        page === currentPage
                        ? "bg-red-500"
                        : "bg-black hover:bg-red-500"
                    }`}
                >
                    {page}
                </button>
            ))}

            {/* next button */}
            <button className={`px-4 py-2 rounded-md text-white font-semibold border border-[#252525]
            transition bg-black hover:bg-red-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#252525]`}
             disabled={isLastPage}
             onClick={() => !isLastPage && onPageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    )
}