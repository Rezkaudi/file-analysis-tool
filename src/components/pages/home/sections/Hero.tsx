import Image from "next/image";
import Link from "next/link";

const Hero: React.FC = () => {
    return (
        <section aria-label="Hero section with business highlights" className="relative px-4 w-full h-[410px] lg:h-[640px] 2xl:h-[calc(100vh-64px)]">
            <Image className="absolute -z-10 top-0 left-0 object-cover" fill src={"/images/hero-file-analysis-tool.png"} quality={100} alt="hero-background-hadis" />

            <div className="text-white lg:w-1/2 h-full flex items-start justify-center flex-col lg:px-6 gap-6">
                <h1 className="text-2xl lg:text-5xl  xl:text-7xl font-black">File Analysis Tool</h1>
                <p className="max-w-[80%] line-clamp-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, fugit? Quas sit nesciunt dolorem consectetur, exercitationem, debitis eaque, pariatur saepe quibusdam voluptatibus quidem architecto officia vitae tempora distinctio magnam perferendis.</p>
                <Link href={"/profile"} className="rounded bg-white text-base lg:text-xl font-black text-[#8926a4] py-4 px-6">Get Started for Free</Link>
            </div>

        </section>
    )
};

export default Hero;
