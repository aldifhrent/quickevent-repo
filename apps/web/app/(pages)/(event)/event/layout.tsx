"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { BreadcrumbDynamic } from "@/components/breadcrumb";
import Header from "@/components/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [pageTitle, setPageTitle] = useState("Default Title");

  useEffect(() => {
    // Mengambil data dari API
    fetch("http://localhost:9000/api/v1/events")
      .then((res) => res.json())
      .then((data) => {
        // Misalkan data API mengandung title atau event name yang akan digunakan
        const eventTitle = data?.title || "Default Event Title"; // Sesuaikan dengan struktur data API
        setPageTitle(eventTitle);
      })
      .catch((error) => {
        console.error("Error fetching title:", error);
      });
  }, []);

  return (
    <main>
      {/* Mengatur title halaman dinamis berdasarkan data API */}
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Header />
      <div className="container mt-10 flex flex-col gap-10">
        <BreadcrumbDynamic />
        {children}
      </div>
    </main>
  );
}
