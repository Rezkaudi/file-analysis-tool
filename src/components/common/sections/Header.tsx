"use client"

import Link from "next/link";

const Header: React.FC = () => {

    return (
        <header className="w-full h-16 lg:h-20 sticky top-0 z-50 bg-[#8926a4] text-white" aria-label="Website Header">
            <div className=" px-4 lg:px-7 flex overflow-y-auto items-center justify-between lg:justify-start gap-8 h-full relative ">

                {/* logo */}
                <Link href={"/"} className=" relative block text-xl lg:text-3xl font-black">
                    File Analysis Tool
                </Link>

            </div>
        </header>
    )
};

export default Header;
