"use client"

import Link from "next/link";

const Footer: React.FC = () => {

    return (
        <footer aria-label="Website Footer">
            <div className="bg-[#8926a4] py-10 px-4 space-y-5 lg:space-y-6 font-medium text-sm lg:text-base text-white flex items-center justify-center w-full flex-col">

                {/* logo */}
                <Link href={"/"} className="block">
                    File Analysis Tool
                </Link>

                {/* copyright */}
                <span className="text-xs text-[#eabbff]">
                    Copyright © File Analysis Tool. All rights reserved.
                </span>

            </div>
        </footer>
    )
};

export default Footer;
