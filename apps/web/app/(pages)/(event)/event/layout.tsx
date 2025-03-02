"use client";

import { useState, useEffect } from "react";
import { BreadcrumbDynamic } from "@/components/breadcrumb";
import Header from "@/components/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Header />
      <div className="container mt-10 flex flex-col gap-10 p-8">
        <BreadcrumbDynamic />
        {children}
      </div>
    </main>
  );
}
