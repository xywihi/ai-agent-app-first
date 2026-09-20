"use client";
import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import Image from "next/image";
import {
  //   Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
const CarouselComponent = dynamic(
  () => import("@/components/ui/carousel").then((mod) => mod.Carousel),
  {
    loading: () => null,
    ssr: false,
  }
);
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import dynamic from "next/dynamic";
export const PortfoliosCarousel = ({
  portfolios,
}: {
  portfolios: ProcessedPortfolioWork[];
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const autoplayPlugin = Autoplay({
    delay: 3500,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
  });
  useEffect(() => {
    if (!api) {
      return;
    }
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };
    const getApi = async () => {
      const snapList = api.scrollSnapList();
      setCount(snapList.length);
      api.on("select", onSelect);
    };
    const timer = setTimeout(() => {
      getApi();
    }, 100);
    getApi();
    return () => {
      clearTimeout(timer);
      api?.off("select", onSelect);
    };
    // queueMicrotask(() => {
    //微任务
    // });
  }, [api]);
  return (
    <div className="relative xl:max-h-[20vh] min-h-52.5 flex">
      <CarouselComponent
        className="w-full flex-1 overflow-auto flex"
        plugins={[autoplayPlugin]}
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          dragFree: false, // 阻止拖拽
        }}
      >
        <CarouselContent className="flex-1">
          {portfolios &&
            portfolios.map((item: ProcessedPortfolioWork, index: number) => (
              <CarouselItem key={index}>
                <Link href={`/design/detail/${item.id}`}>
                  <Image
                    width={800}
                    height={600}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"} // 预加载
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={item.portfolio_work_images?.[0]?.image_url}
                    alt="Event cover"
                    className="relative z-20 aspect-video w-full object-cover object-top cursor-pointer"
                  />
                </Link>
              </CarouselItem>
            ))}
        </CarouselContent>
      </CarouselComponent>
      <div className="absolute bottom-2 left-2 text-white">
        {count}/<b className="text-lg ml-1">{current}</b>
      </div>
    </div>
  );
};
