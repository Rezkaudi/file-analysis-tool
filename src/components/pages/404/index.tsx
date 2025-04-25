import Link from "next/link";

const Index: React.FC = () => {

  return (
    <section className="relative w-full py-20 text-center px-5  h-[calc(100vh-60px)] flex items-center justify-center">
      <div>
        <h1 className="text-9xl text-mainPurple font-bold">404</h1>
        <h2 className=" text-[20px] lg:text-[40px] font-bold">
          Opps!
        </h2>
        <p className="text-[16px] lg:text-[25px] font-normal">
          We couldn’t find the page address for you. <Link href="/" className="text-mainPurple underline">Go back to the Home</Link>.
        </p>
      </div>
    </section>
  );
};

export default Index;
