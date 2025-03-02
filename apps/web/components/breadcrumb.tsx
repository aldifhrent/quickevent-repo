"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

// Fungsi untuk memformat slug menjadi lebih terbaca
const formatSlug = (slug: string) => {
  // Jika slug adalah nama event yang terdiri dari beberapa kata
  if (slug.includes("-")) {
    // Mengganti tanda hubung dengan spasi dan mengkapitalkan huruf pertama dari setiap kata
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  // Untuk slug lainnya, cukup mengganti tanda hubung dengan spasi dan kapitalisasi huruf pertama
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

export function BreadcrumbDynamic() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          const isLast = index === pathSegments.length - 1;
          const formattedSegment = formatSlug(segment);

          return (
            <div key={href} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>
                    {formattedSegment}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
