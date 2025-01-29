"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeaderMenu from "../components/header.menu";
import HeaderMobileMenu from "../components/header.mobile.menu";
import SearchInput from "./input.search";

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="border-b dark:border-b-white">
      <header className="relative flex h-16 items-center justify-between px-4 sm:px-12">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              width={100}
              height={100}
              alt="Image Logo"
              className="inline-block h-[100px] w-[50px]"
            />
          </Link>

          {/* Search Bar */}
          <SearchInput />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="focus:outline-none lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Mobile Menu */}
        <div
          className={`absolute right-4 top-16 z-10 w-[300px] rounded-lg bg-slate-50 p-4 shadow-2xl transition-all duration-300 ease-in-out dark:bg-white lg:hidden ${
            isMobileMenuOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-4 scale-95 opacity-0"
          }`}
        >
          <HeaderMobileMenu />
        </div>

        {/* Desktop Navigation */}
        <HeaderMenu />
      </header>
    </div>
  );
}
