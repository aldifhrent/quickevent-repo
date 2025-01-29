import { Search } from "lucide-react";
import { Input } from "./ui/input";

export default function SearchInput() {
  return (
    <div className="relative flex items-center rounded-full">
      <Input
        type="text"
        className="2xl:full h-10 w-[300px] rounded-full border-2 px-4 pl-12 shadow-2xl outline-none placeholder:text-slate-300 placeholder-shown:text-slate-500 sm:w-[300px] md:w-[600px] lg:w-[600px] xl:w-[800px]"
        placeholder="Search events..."
      />
      <div className="absolute left-0 rounded-l-full bg-black p-2 shadow-xl dark:bg-white">
        <Search className="text-white dark:text-black" size={24} />
      </div>
      <p className="right-6 hidden cursor-pointer text-slate-200 hover:text-slate-400 md:absolute">
        CTRL + K
      </p>
    </div>
  );
}
