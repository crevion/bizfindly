import { places } from "@/lib/mockData";

const pool = places.map((p) => p.image);
const heights = ["h-56", "h-72", "h-64", "h-80", "h-60", "h-72", "h-52", "h-64"];

function Column({
  images,
  anim,
}: {
  images: string[];
  anim: "marquee-up" | "marquee-down" | "marquee-up-slow";
}) {
  const doubled = [...images, ...images];
  return (
    <div className="mask-fade-y relative h-full overflow-hidden">
      <div className={`flex flex-col gap-3 ${anim}`}>
        {doubled.map((src, i) => (
          <div
            key={i}
            className={`${heights[i % heights.length]} w-full overflow-hidden rounded-2xl bg-muted shadow-soft`}
          >
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnimatedGallery() {
  const c1 = pool.filter((_, i) => i % 3 === 0);
  const c2 = pool.filter((_, i) => i % 3 === 1);
  const c3 = pool.filter((_, i) => i % 3 === 2);

  return (
    <div className="relative h-[560px] w-full">
      <div className="grid h-full grid-cols-3 gap-3">
        <Column images={c1} anim="marquee-up" />
        <Column images={c2} anim="marquee-down" />
        <Column images={c3} anim="marquee-up-slow" />
      </div>
    </div>
  );
}
