"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search } from "lucide-react";

export default function Header() {

    const pathname = usePathname(); //using path name to highlight the active navigation link
    
    //Navigation links
    const navLinks = [
        {name: "Home", href: "/"},
        {name: "Movies", href: "/movies"},
        {name: "TV Series", href: "/tv-series"}
    ];

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
                </div>

                {/* Search Bar */}
                <motion.div className="relative w-full md:w-1/3 md:mx-8 hidden md:block">
                    <input 
                        type="text"
                        placeholder="Quick Search"
                        className="w-full text-sm text-gray-500 bg-white px-4 lg:px-3 py-1.5 
                        focus:outline-none placeholder-gray-500 rounded-xl border border-gray-500
                        focus:border-white pr-10"
                     />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-default">
                        <Search className="w-5 h-5 text-gray-500" />
                    </button>
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
        </motion.header>
    )

}