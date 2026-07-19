import { motion } from "motion/react";

interface BrandLogo {
  name: string;
  image: string;
  origin: string;
  fontStyle: string;
}

const BRAND_LOGOS: BrandLogo[] = [
  {
    name: "Balmain",
    origin: "Paris",
    fontStyle: "font-sans tracking-[0.3em] font-black uppercase text-base",
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "Chopard",
    origin: "Geneva",
    fontStyle: "font-serif italic font-bold tracking-wider text-lg",
    image: "https://images.unsplash.com/photo-1614713570785-11517abdebe2?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "Maybach",
    origin: "Stuttgart",
    fontStyle: "font-display tracking-[0.15em] font-bold uppercase text-base",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "Lindberg",
    origin: "Denmark",
    fontStyle: "font-mono tracking-[0.4em] text-xs font-light uppercase",
    image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "Prada",
    origin: "Milano",
    fontStyle: "font-serif tracking-[0.25em] font-extrabold uppercase text-base",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "Tom Ford",
    origin: "New York",
    fontStyle: "font-sans tracking-[0.2em] font-semibold uppercase text-sm",
    image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "Gucci",
    origin: "Firenze",
    fontStyle: "font-serif tracking-[0.3em] font-medium uppercase text-base",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "Cartier",
    origin: "Paris",
    fontStyle: "font-serif italic tracking-[0.15em] font-semibold text-lg",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "Saint Laurent",
    origin: "Paris",
    fontStyle: "font-sans tracking-[0.35em] font-light uppercase text-xs",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "Bvlgari",
    origin: "Roma",
    fontStyle: "font-serif tracking-[0.2em] font-bold uppercase text-base",
    image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&q=80&w=500"
  }
];

export default function BrandTicker() {
  // Duplicate list to achieve seamless infinite animation translation
  const extendedBrands = [...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS];

  return (
    <section 
      id="brand-ticker-section" 
      className="bg-zinc-950/60 py-14 overflow-hidden relative backdrop-blur-md"
    >
      {/* Decorative gradient overlay bounds for clean luxury fade */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none" />



      {/* Scrolling Marquee Container */}
      <div className="relative flex items-center overflow-x-hidden py-10 bg-zinc-950/20 backdrop-blur-sm">
        <motion.div 
          className="flex gap-16 items-center shrink-0"
          animate={{ x: [0, -2500] }}
          transition={{
            ease: "linear",
            duration: 45,
            repeat: Infinity,
          }}
        >
          {extendedBrands.map((brand, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-16 shrink-0 select-none cursor-pointer"
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span 
                className={`${brand.fontStyle.replace(/text-\w+/g, "")} text-4xl sm:text-6xl lg:text-6xl text-zinc-400 hover:text-white transition-colors duration-300 font-extrabold uppercase tracking-widest hover:drop-shadow-[0_0_15px_rgba(10,100,255,0.6)]`}
              >
                {brand.name}
              </span>
              <span className="text-zinc-800 text-5xl sm:text-5xl font-extralight select-none animate-pulse">•</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
