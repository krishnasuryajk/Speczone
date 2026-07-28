import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowRight, Sparkles, CheckCircle, Smartphone, User, Phone, Calendar } from "lucide-react";
import heroVideo from "/assets/hero-video.mp4";


interface HeroSectionProps {
  onScrollDown: () => void;
}

export default function HeroSection({ onScrollDown }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Minimal lead capture states on Slide 3
  const [slideLeadName, setSlideLeadName] = useState("");
  const [slideLeadPhone, setSlideLeadPhone] = useState("");
  const [isSlideSubmitted, setIsSlideSubmitted] = useState(false);

  // Parallax scroll and mouse springs
  const mouseXSpring = useSpring(0, { damping: 35, stiffness: 45 });
  const mouseYSpring = useSpring(0, { damping: 35, stiffness: 45 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMousePosition({ x, y });
      mouseXSpring.set(x);
      mouseYSpring.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseXSpring, mouseYSpring]);

  // Slide Auto-Rotation (every 7 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      // Don't auto-rotate if the user is actively filling out the Slide 3 form
      if (currentSlide === 2 && (slideLeadName || slideLeadPhone)) {
        return;
      }
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 8500);
    return () => clearInterval(timer);
  }, [currentSlide, slideLeadName, slideLeadPhone]);

  const { scrollY } = useScroll();
  const smoothedScrollY = useSpring(scrollY, { damping: 35, stiffness: 75, mass: 0.5 });
  const bgY = useTransform(smoothedScrollY, [0, 800], [0, 150]);
  const opacity = useTransform(smoothedScrollY, [0, 600], [1, 0]);

  const glassesMouseX = useTransform(mouseXSpring, (val) => val * -40);
  const glassesMouseY = useTransform(mouseYSpring, (val) => val * -40);

  // Handle slide form submit
  const handleSlideFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideLeadName || !slideLeadPhone) {
      alert("Please provide your Name and Phone Number.");
      return;
    }
    setIsSlideSubmitted(true);

    // Auto-create a WhatsApp redirect template for maximum responsiveness
    const waText = `Hi Spectacal Zone! I'm requesting a Home Eye Care appointment via the hero banner form.%0A%0AName: ${slideLeadName}%0APhone: ${slideLeadPhone}`;
    setTimeout(() => {
      window.open(`https://wa.me/919442009991?text=${waText}`, "_blank");
    }, 1500);
  };

  // Scroll callback helper
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const slidesData = [
    {
      id: 0,
      badge: "ESTABLISHED 1959 : SIX DECADES OF TRUST",
      title_line1: "CURATORS OF",
      title_line2: "PRECISION VISION",
      subtitle: "Opticals",
      tagline: "Sunglasses / Audiology",
      description: "Custom digital progressive lens design and curated international luxury frames tailored specifically to your ocular visage and distinctive look.",
      ctaPrimary: "Shop Elite Frames",
      ctaPrimaryAction: () => scrollToId("opticals-shop"),
      ctaSecondary: "Book Consultation",
      ctaSecondaryAction: () => scrollToId("home-eye-care"),
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Glasses_with_black_frames.png"
    },
    {
      id: 1,
      badge: "SARTORIAL EYEWEAR : LUXURY SUN PROTECTION",
      title_line1: "HIGH-FASHION",
      title_line2: "UV SUNGLASSES",
      subtitle: "Sunglasses",
      tagline: "Bespoke Contours / Polarized Lenses",
      description: "Curated sunglasses designed to block 100% of UVA/UVB blue-violet scatter, hand-finished in Milan, Tokyo, and Paris for leaders worldwide.",
      ctaPrimary: "View Sunglasses",
      ctaPrimaryAction: () => {
        scrollToId("opticals-shop");
      },
      ctaSecondary: "Explore Brands",
      ctaSecondaryAction: () => scrollToId("brands"),
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Aviator_sunglasses_transparent.png"
    },
    {
      id: 2,
      badge: "MOBILE CLINICAL LABORATORY",
      title_line1: "DOORSTEP FOR",
      title_line2: "LUXURY COMFORT",
      subtitle: "Home Ocular Care",
      tagline: "Mobile Refractionist & 100+ Frames",
      description: "Can't visit our showroom? Schedule a qualified senior optometrist diagnostic check and frame trials at your home or office.",
      ctaPrimary: "", // Handled by minimal lead form instead
      ctaPrimaryAction: () => { },
      ctaSecondary: "",
      ctaSecondaryAction: () => { },
      image: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Glasses_PNG_Clip_Art-2415.png"
    }
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-zinc-950 flex flex-col justify-between overflow-hidden px-6 md:px-12 py-24"
    >
      {/* Background Theater Video */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen scale-105"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* Vignette & Gradients to blend video smoothly */}
        <div className="absolute inset-0 bg-zinc-950/40"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-zinc-950 to-transparent"></div>
        {/* Left fade so the text remains very readable */}
        <div className="absolute inset-y-0 left-0 w-1/2 lg:w-2/3 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
      </div>

      {/* Decorative Red Concentric Arches on the top-left */}
      <div
        id="hero-red-curves"
        className="absolute top-0 left-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] pointer-events-none opacity-40 z-0"
        style={{
          transform: `translate(${mousePosition.x * 12}px, ${mousePosition.y * 12}px)`,
          transition: "transform 0.4s ease-out"
        }}
      >
        <svg viewBox="0 0 500 500" className="w-full h-full text-brand-blue">
          <circle cx="0" cy="0" r="450" fill="none" stroke="currentColor" strokeWidth="12" className="opacity-15" />
          <circle cx="0" cy="0" r="350" fill="none" stroke="currentColor" strokeWidth="24" className="opacity-20" />
          <circle cx="0" cy="0" r="230" fill="currentColor" className="opacity-10" />
          <circle cx="0" cy="0" r="100" fill="#09090b" />
        </svg>
      </div>

      {/* Parallax Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[
          { top: "20%", left: "10%", size: 6 },
          { top: "65%", left: "80%", size: 8 },
          { top: "80%", left: "20%", size: 5 },
          { top: "30%", left: "75%", size: 7 },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-brand-blue/30 border border-brand-blue/10 animate-pulse"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              transform: `translate(${mousePosition.x * (p.size * 2)}px, ${mousePosition.y * (p.size * 2)}px)`,
              transition: "transform 0.3s ease-out"
            }}
          />
        ))}
      </div>



      {/* Main Core Slider Slider Viewport */}
      <div className="max-w-7xl mx-auto w-full z-10 my-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Slide Content (Slides carousel) */}
        <div className="lg:col-span-8 lg:col-start-1 relative min-h-[480px] sm:min-h-[440px] flex items-center w-full">
          <AnimatePresence mode="wait">
            {slidesData.map((slide) => {
              if (slide.id !== currentSlide) return null;
              return (
                <motion.div
                  key={slide.id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0, x: 50 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: {
                        type: "spring",
                        stiffness: 80,
                        damping: 18,
                        staggerChildren: 0.15
                      }
                    },
                    exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeInOut" } }
                  }}
                  className="w-full space-y-6 text-left py-8 relative"
                >
                  {/* High-Tech Rotating Lens Grid/Ring on left side */}
                  <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-80 h-80 pointer-events-none z-0">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border border-brand-blue/15 rounded-full border-dashed opacity-45"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-6 border border-white/5 rounded-full opacity-35"
                    />
                  </div>

                  <div className="relative z-10 space-y-6">
                    <motion.span
                      variants={{
                        hidden: { opacity: 0, y: -15 },
                        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                      }}
                      className="font-mono text-xs tracking-[0.3em] text-brand-blue block uppercase font-bold"
                    >
                      [ {slide.badge} ]
                    </motion.span>

                    <div className="space-y-1 overflow-hidden">
                      <motion.h1
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
                        }}
                        className="font-serif text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter"
                      >
                        {slide.title_line1} <br />
                        <span className="text-zinc-400 italic font-black">{slide.title_line2}</span>
                      </motion.h1>
                    </div>

                    <motion.p
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                      }}
                      className="font-sans text-sm text-zinc-300 leading-relaxed font-light max-w-xl"
                    >
                      {slide.description}
                    </motion.p>

                    {/* Render buttons if Slide 1 or 2 */}
                    {slide.id !== 2 ? (
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 15 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                        }}
                        className="flex flex-wrap gap-4 pt-2"
                      >
                        <motion.button
                          onClick={slide.ctaPrimaryAction}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-8 py-4 bg-brand-blue text-white hover:bg-white hover:text-black font-display text-[11px] font-black tracking-widest uppercase rounded-xl transition-all duration-300 shadow-xl cursor-pointer"
                        >
                          {slide.ctaPrimary}
                        </motion.button>
                        <motion.button
                          onClick={slide.ctaSecondaryAction}
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                          whileTap={{ scale: 0.95 }}
                          className="px-8 py-4 bg-zinc-900/40 hover:bg-white/[0.02] text-zinc-200 font-mono text-[10px] tracking-wider uppercase border border-white/10 backdrop-blur-sm rounded-xl transition-all cursor-pointer"
                        >
                          {slide.ctaSecondary}
                        </motion.button>
                      </motion.div>
                    ) : (
                      /* Minimal Lead Form directly on Slide 3 */
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 15 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                        }}
                        className="pt-2 max-w-md w-full"
                      >
                        <AnimatePresence mode="wait">
                          {!isSlideSubmitted ? (
                            <motion.form
                              key="slide-mini-form"
                              onSubmit={handleSlideFormSubmit}
                              className="bg-zinc-900/60 border border-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6 space-y-4"
                            >
                              <div className="flex gap-2 items-center border-b border-white/5 pb-2">
                                <Sparkles size={12} className="text-brand-blue animate-spin" style={{ animationDuration: "6s" }} />
                                <span className="font-mono text-[9px] text-zinc-400 tracking-widest uppercase font-bold">REQUEST DOORSTEP SERVICE INCUBATION</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                                    <User size={12} />
                                  </span>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Full Name"
                                    value={slideLeadName}
                                    onChange={(e) => setSlideLeadName(e.target.value)}
                                    className="w-full bg-zinc-950/40 border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-blue transition-all backdrop-blur-sm"
                                  />
                                </div>

                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                                    <Phone size={12} />
                                  </span>
                                  <input
                                    type="tel"
                                    required
                                    placeholder="Mobile Contact"
                                    value={slideLeadPhone}
                                    onChange={(e) => setSlideLeadPhone(e.target.value)}
                                    className="w-full bg-zinc-950/40 border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-blue transition-all backdrop-blur-sm"
                                  />
                                </div>
                              </div>

                              <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 rounded-xl bg-brand-blue hover:bg-white hover:text-black text-white font-display text-[10px] font-black tracking-widest uppercase transition-all cursor-pointer"
                              >
                                REQUEST VISITATION ATELIER →
                              </motion.button>
                            </motion.form>
                          ) : (
                            <motion.div
                              key="slide-mini-success"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-green-950/20 border border-green-500/25 rounded-2xl p-6 text-center space-y-3"
                            >
                              <div className="w-10 h-10 rounded-full bg-green-950/60 flex items-center justify-center mx-auto text-green-400 border border-green-900">
                                <CheckCircle size={20} />
                              </div>
                              <h4 className="font-serif text-lg font-bold text-white uppercase tracking-tight">VISITATION REQUEST LOGGED</h4>
                              <p className="font-sans text-[11px] text-zinc-350 leading-relaxed font-light">
                                Thank you, {slideLeadName}. Initiating secure audiology & wavefront testing scheduling templates via WhatsApp...
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}

                    {/* Active Three-Slide Carousel Indicator Dots */}
                    <div className="flex gap-3 pt-6 z-20 relative">
                      {[0, 1, 2].map((dotIndex) => (
                        <button
                          key={dotIndex}
                          onClick={() => setCurrentSlide(dotIndex)}
                          className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${currentSlide === dotIndex ? "w-8 bg-brand-blue" : "w-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                            }`}
                          aria-label={`Go to slide ${dotIndex + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

    </section>
  );
}
