import { Globe, Twitter } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="container mt-10 p-4">
      <div className="flex justify-between">
        <div className="flex flex-col items-start">
          <div className="mb-6 ml-0.5 flex w-fit space-x-4 rounded-full bg-black px-3 py-2 text-white dark:bg-white dark:text-black">
            <Link href="/" className="hover:animate-shake">
              <Globe />
            </Link>
            <Link href="#" className="hover:animate-shake">
              <Twitter />
            </Link>
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-nowrap p-2 text-7xl font-bold hover:cursor-pointer hover:rounded-lg hover:bg-black hover:text-white hover:dark:bg-white dark:hover:text-black xl:text-8xl">
              Buy.
            </h1>

            <h1 className="text-nowrap p-2 text-7xl font-bold hover:cursor-pointer hover:rounded-lg hover:bg-black hover:text-white hover:dark:bg-white dark:hover:text-black xl:text-8xl">
              Ticket.
            </h1>
            <p className="p-2 text-2xl font-semibold cursor-text">
              in a single marketplace.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
