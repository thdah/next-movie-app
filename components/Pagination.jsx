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
}