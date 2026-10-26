"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { FiChevronLeft, FiChevronRight, FiImage, FiMaximize2, FiPlay, FiX } from "react-icons/fi";
import { cx } from "@/lib/format";
import { isVideoUrl } from "@/lib/videoWatermark";

/** How many photos sit in the column beside the main one; the last shows "+N more photos". */
const SIDE_TILES = 4;

/**
 * A listing's photos (and its video, if it has one): a large slider with a column
 * of thumbnails beside it, and a full-screen viewer for browsing every photo.
 */
export function ListingGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const count = images.length;
  const side = images.slice(1, 1 + SIDE_TILES);
  // As on property sites: everything not in the side column is counted on its last tile.
  const more = count - SIDE_TILES;

  const show = (next: number) => setIndex(((next % count) + count) % count);
  const openViewer = (at = index) => {
    show(at);
    setViewerOpen(true);
  };

  if (!count) return null;

  return (
    <>
      <div className={cx("grid gap-2.5", side.length ? "lg:grid-cols-[minmax(0,1fr)_16rem]" : "")}>
        <Slider images={images} title={title} index={index} onIndex={show} onOpen={() => openViewer()} />

        {side.length ? (
          <ul className="hidden h-[32rem] flex-col gap-2.5 lg:flex">
            {side.map((src, i) => {
              const slide = i + 1;
              const isLast = i === side.length - 1 && more > 0 && count > SIDE_TILES + 1;
              return (
                <li key={src + slide} className="min-h-0 flex-1">
                  <button
                    type="button"
                    onClick={() => (isLast ? openViewer(slide) : show(slide))}
                    aria-label={isLast ? `View all ${count} photos` : isVideoUrl(src) ? "Show the video" : `Show photo ${slide + 1}`}
                    className={cx(
                      "group relative h-full w-full overflow-hidden rounded-2xl bg-ivory ring-2 transition",
                      slide === index ? "ring-gold" : "ring-transparent hover:ring-gold/50",
                    )}
                  >
                    <Media src={src} alt="" sizes="256px" />
                    {isLast ? (
                      <span className="absolute inset-0 grid place-items-center bg-ink/65 text-white transition group-hover:bg-ink/75">
                        <span className="text-center">
                          <span className="block font-display text-3xl leading-none">+{more}</span>
                          <span className="mt-1 block text-sm font-semibold">more photos</span>
                        </span>
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {viewerOpen ? <Viewer images={images} title={title} index={index} onIndex={show} onClose={() => setViewerOpen(false)} /> : null}
    </>
  );
}

/** A photo, or a play badge for the video. */
function Media({ src, alt, sizes, priority = false }: { src: string; alt: string; sizes: string; priority?: boolean }) {
  if (isVideoUrl(src)) {
    return (
      <span className="grid h-full w-full place-items-center bg-ink text-gold">
        <FiPlay aria-hidden="true" className="h-6 w-6" />
      </span>
    );
  }
  return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} quality={90} className="object-cover" />;
}

/** Swipe and arrow-key handling shared by the slider and the full-screen viewer. */
function useSwipe(index: number, onIndex: (next: number) => void) {
  const touchStart = useRef<number | null>(null);
  return {
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "ArrowLeft") onIndex(index - 1);
      if (event.key === "ArrowRight") onIndex(index + 1);
    },
    onTouchStart: (event: TouchEvent) => {
      touchStart.current = event.touches[0]!.clientX;
    },
    onTouchEnd: (event: TouchEvent) => {
      if (touchStart.current === null) return;
      const distance = event.changedTouches[0]!.clientX - touchStart.current;
      if (Math.abs(distance) > 40) onIndex(distance < 0 ? index + 1 : index - 1);
      touchStart.current = null;
    },
  };
}

function Arrow({ direction, onClick, label, large = false }: { direction: "left" | "right"; onClick: () => void; label: string; large?: boolean }) {
  const Icon = direction === "left" ? FiChevronLeft : FiChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cx(
        "absolute top-1/2 z-10 grid -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition hover:bg-white",
        large ? "h-12 w-12" : "h-11 w-11",
        direction === "left" ? "left-4" : "right-4",
      )}
    >
      <Icon aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}

/** The large photo with its counter, arrows and "View all photos". */
function Slider({ images, title, index, onIndex, onOpen }: { images: string[]; title: string; index: number; onIndex: (next: number) => void; onOpen: () => void }) {
  const track = useRef<HTMLDivElement>(null);
  const count = images.length;
  const swipe = useSwipe(index, onIndex);

  // Moving to another slide pauses the video.
  useEffect(() => {
    track.current?.querySelectorAll("video").forEach((video, i) => {
      if (i !== index) video.pause();
    });
  }, [index]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`Photos of ${title}`}
      tabIndex={0}
      {...swipe}
      className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ivory focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none sm:aspect-[16/10] lg:aspect-auto lg:h-[32rem]"
    >
      <div ref={track} className="flex h-full transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {images.map((src, slide) => (
          <div key={src + slide} className="relative h-full w-full shrink-0" role="group" aria-roledescription="slide" aria-label={`${slide + 1} of ${count}`} aria-hidden={slide !== index}>
            {isVideoUrl(src) ? (
              <video src={src} controls playsInline preload="metadata" aria-label={`Video of ${title}`} className="h-full w-full bg-ink object-contain" />
            ) : (
              <Image
                src={src}
                alt={slide === 0 ? title : `${title}, photo ${slide + 1}`}
                fill
                priority={slide === 0}
                sizes="(min-width: 1280px) 920px, 100vw"
                quality={90}
                className="object-cover"
              />
            )}
          </div>
        ))}
      </div>

      <p className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-xs font-semibold text-white" aria-live="polite">
        <FiImage aria-hidden="true" /> {index + 1} / {count}
      </p>

      {count > 1 ? (
        <>
          <Arrow direction="left" onClick={() => onIndex(index - 1)} label="Previous photo" />
          <Arrow direction="right" onClick={() => onIndex(index + 1)} label="Next photo" />
        </>
      ) : null}

      <button
        type="button"
        onClick={onOpen}
        className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-ink shadow-lg transition hover:bg-white"
      >
        <FiMaximize2 aria-hidden="true" /> View all photos
      </button>
    </div>
  );
}

/** Full-screen viewer: every photo, arrows, thumbnails; Escape or the close button leaves it. */
function Viewer({ images, title, index, onIndex, onClose }: { images: string[]; title: string; index: number; onIndex: (next: number) => void; onClose: () => void }) {
  const count = images.length;
  const swipe = useSwipe(index, onIndex);
  const closeButton = useRef<HTMLButtonElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const src = images[index]!;

  // Lock the page behind it, focus it, and let Escape close it.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (event: globalThis.KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Keep the current thumbnail in view.
  useEffect(() => {
    strip.current?.querySelector<HTMLElement>(`[data-slide="${index}"]`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`All photos of ${title}`} className="fixed inset-0 z-[100] flex flex-col bg-ink/95 text-white" {...swipe} tabIndex={-1}>
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="min-w-0 truncate text-sm font-semibold">
          {title} <span className="ml-2 font-normal text-white/60">{index + 1} / {count}</span>
        </p>
        <button ref={closeButton} type="button" onClick={onClose} aria-label="Close" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20">
          <FiX aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        {isVideoUrl(src) ? (
          <video key={src} src={src} controls playsInline autoPlay className="absolute inset-0 h-full w-full object-contain" />
        ) : (
          <Image key={src} src={src} alt={`${title}, photo ${index + 1}`} fill sizes="100vw" quality={90} className="object-contain" />
        )}
        {count > 1 ? (
          <>
            <Arrow direction="left" onClick={() => onIndex(index - 1)} label="Previous photo" large />
            <Arrow direction="right" onClick={() => onIndex(index + 1)} label="Next photo" large />
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div ref={strip} className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {images.map((thumb, slide) => (
            <button
              key={thumb + slide}
              type="button"
              data-slide={slide}
              onClick={() => onIndex(slide)}
              aria-label={isVideoUrl(thumb) ? "Show the video" : `Show photo ${slide + 1}`}
              aria-current={slide === index}
              className={cx(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-2 transition",
                slide === index ? "ring-gold" : "opacity-60 ring-transparent hover:opacity-100",
              )}
            >
              <Media src={thumb} alt="" sizes="96px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
