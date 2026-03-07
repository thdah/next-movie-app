import { usePathname } from "next/navigation";

export default function Header() {

    const pathname = usePathname(); //using path name to highlight the active navigation link
    
    //Navigation links
    const navLinks = [
        {name: "Home", href: "/"},
        {name: "Movies", href: "/movies"},
        {name: "TV Series", href: "/tv-series"}
    ]
}