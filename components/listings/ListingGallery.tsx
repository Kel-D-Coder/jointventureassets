"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { FiChevronLeft, FiChevronRight, FiPlay } from "react-icons/fi";
import { cx } from "@/lib/format";
import { isVideoUrl } from "@/lib/videoWatermark";

/** Swipeable photo slider for a listing (and its video, if it has one): arrows, thumbnails, keyboard and touch. */
export function ListingGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const slider = useRef<HTMLDivElement>(null);
  const count = images.length;

  /** Moving to another slide pauses the video. */
  const show = (next: number) => {
    slider.current?.querySelectorAll("video").forEach((video) => video.pause());
    setIndex(next);
  };
  const go = (next: number) => show((next + count) % count);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") go(index - 1);
    if (event.key === "ArrowRight") go(index + 1);
  };

  const onTouchStart = (event: TouchEvent) => {
    touchStart.current = event.touches[0]!.clientX;
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (touchStart.current === null) return;
    const distance = event.changedTouches[0]!.clientX - touchStart.current;
    if (Math.abs(distance) > 40) go(distance < 0 ? index + 1 : index - 1);
    touchStart.current = null;
  };

  return (
    <div className="space-y-3">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`Photos of ${title}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="group relative aspect-[16/9] overflow-hidden rounded-3xl bg-ivory focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
      >
        <div ref={slider} className="flex h-full transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
          {images.map((src, slide) => (
            <div
              key={src + slide}
              className="relative h-full w-full shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`${slide + 1} of ${count}`}
              aria-hidden={slide !== index}
            >
              {isVideoUrl(src) ? (
                <video src={src} controls playsInline preload="metadata" aria-label={`Video of ${title}`} className="h-full w-full bg-ink object-contain" />
              ) : (
                <Image
                  src={src}
                  alt={slide === 0 ? title : `${title}, photo ${slide + 1}`}
                  fill
                  priority={slide === 0}
                  sizes="(min-width: 1280px) 1216px, 100vw"
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous photo"
              className="absolute top-1/2 left-4 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <FiChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next photo"
              className="absolute top-1/2 right-4 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <FiChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
            <p className="absolute right-4 bottom-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white" aria-live="polite">
              {index + 1} / {count}
            </p>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((src, slide) => (
            <button
              key={src + slide}
              type="button"
              onClick={() => show(slide)}
              aria-label={isVideoUrl(src) ? "Show the video" : `Show photo ${slide + 1}`}
              aria-current={slide === index}
              className={cx(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-32",
                slide === index ? "border-gold" : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              {isVideoUrl(src) ? (
                <span className="grid h-full w-full place-items-center bg-ink text-gold">
                  <FiPlay aria-hidden="true" className="h-5 w-5" />
                </span>
              ) : (
                <Image src={src} alt="" fill sizes="128px" className="object-cover" />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
