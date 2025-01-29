import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export default function CarouselViewer() {
  return (
    <section className="max-w-[900px] p-4">
      <Carousel
        className="mt-8 w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          <CarouselItem>
            <Image
              src="https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp"
              alt="Carousel"
              width={500}
              height={800}
              className="w-full"
            />
          </CarouselItem>
          <CarouselItem>
            {" "}
            <Image
              src="https://cdn.evbstatic.com/s3-build/fe/build/images/0205288125d365f93edf9b62837de839-nightlife_desktop.webp"
              alt="Carousel"
              width={500}
              height={500}
              className="w-full"
            />
          </CarouselItem>
          <CarouselItem>
            {" "}
            <Image
              src="https://cdn.evbstatic.com/s3-build/fe/build/images/389ece7b7e2dc7ff8d28524bad30d52c-dsrp_desktop.webp"
              alt="Carousel"
              width={500}
              height={500}
              className="w-full"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
