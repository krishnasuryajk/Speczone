import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { 
  Check, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  CheckCircle, 
  Sparkles, 
  Stethoscope, 
  Clock, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Eye,
  Activity,
  HeartHandshake,
  Star,
  AlertCircle,
  Play,
  Pause,
  RefreshCw
} from "lucide-react";

interface HomeEyeCareProps {
  onClose?: () => void;
}

const homeEyeCheckMilestones = [
  { percentage: 0.10, year: "STEP 1", title: "Secure Digital Registration", desc: "Your clinical profile, prescription history, and preferred slot are safely logged in our HIPAA-compliant database." },
  { percentage: 0.26, year: "STEP 2", title: "Optometrist Assigned", desc: "A certified expert optometrist from our premium clinical network is designated to your customized service visit." },
  { percentage: 0.42, year: "STEP 3", title: "Precision Kit Calibration", desc: "Advanced wavefront refractometers and mobile test devices are sterilized and calibrated to zero-tolerance." },
  { percentage: 0.58, year: "STEP 4", title: "Smart Dispatch & Route", desc: "Our custom medical diagnostic van launches with real-time ETA tracking shared directly to your device." },
  { percentage: 0.74, year: "STEP 5", title: "Doorstep Clinical Scan", desc: "A complete diagnostic suite (refractometry, eye pressure, retina check) is carried out inside your living room." },
  { percentage: 0.90, year: "STEP 6", title: "Customized Lenses Ordered", desc: "Custom ophthalmic measurements are securely synced to our state-of-the-art lens crafting facility." }
];

const transformLookMilestones = [
  { percentage: 0.10, year: "PHASE 1", title: "AI Aesthetic Profiling", desc: "Our visual facial scanner assesses your bone structure, skin tone, and style aesthetic preferences." },
  { percentage: 0.30, year: "PHASE 2", title: "Couture Frame Selection", desc: "We pre-curate over 50+ luxury frames, including exclusive boutique designer models, to bring on-site." },
  { percentage: 0.50, year: "PHASE 3", title: "Stylist Dispatch", desc: "A personal fashion optician and optical styling kit are dispatched to your precise location." },
  { percentage: 0.70, year: "PHASE 4", title: "Home Try-On Consultation", desc: "Enjoy a relaxed, private fashion consultation with premium frame trials in your natural lighting." },
  { percentage: 0.90, year: "PHASE 5", title: "Bespoke Delivery & Fit", desc: "Bespoke lenses are cut, premium coatings applied, and hand-delivered with lifetime adjustment guarantees." }
];

export default function HomeEyeCare({ onClose }: HomeEyeCareProps) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Chennai",
    preferredDate: "",
    notes: "",
    serviceType: "Home Eye Check"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingPassNo, setBookingPassNo] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValidationError(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.name.trim()) {
      setValidationError("Please enter your full name.");
      return;
    }
    if (!formData.phone.trim()) {
      setValidationError("Please enter your active WhatsApp mobile number.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      const pass = "SZ-" + Math.floor(100000 + Math.random() * 900000);
      setBookingPassNo(pass);

      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.75 },
          colors: ["#0a64ff", "#10b981", "#3b82f6", "#111827"]
        });
      } catch (err) {
        console.warn("Confetti failed", err);
      }
    }, 1500);
  };

  const handleWhatsAppShare = () => {
    const message = `Hi Spectacal Zone! I'd like to book a ${formData.serviceType}:%0A%0A` +
      `*Pass No:* ${bookingPassNo}%0A` +
      `*Service:* ${formData.serviceType}%0A` +
      `*Name:* ${formData.name}%0A` +
      `*WhatsApp Mobile:* ${formData.phone}%0A` +
      `*Email:* ${formData.email || "Not Provided"}%0A` +
      `*City:* ${formData.city}%0A` +
      `*Preferred Date:* ${formData.preferredDate || "To be discussed"}%0A` +
      `*Notes:* ${formData.notes || "None"}`;

    window.open(`https://wa.me/919442009991?text=${message}`, "_blank");
  };

  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      city: "Chennai",
      preferredDate: "",
      notes: "",
      serviceType: "Home Eye Check"
    });
    setValidationError(null);
    setIsSuccess(false);
  };

  // Winding wave function with elegant U-turn bends (high-contrast curves from 65px to 235px vertical)
  const getBezierPoint = (p: number): { x: number; y: number } => {
    const x = p * 1000;
    // Elegant sinusoidal bends that look organic and clinically high-tech
    const y = 150 + Math.sin(p * Math.PI * 3.2) * 85;
    return { x, y };
  };

  const milestones = formData.serviceType === "Home Eye Check" ? homeEyeCheckMilestones : transformLookMilestones;

  // Track path rendering helper by sampling the curve function
  const pathPoints = Array.from({ length: 121 }, (_, i) => {
    const p = i / 120;
    const pt = getBezierPoint(p);
    return `${pt.x},${pt.y}`;
  });
  const trackPathD = `M ${pathPoints.join(" L ")}`;

  // Curved timeline states
  const [progress, setProgress] = useState(0.10);
  const [isPaused, setIsPaused] = useState(false);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);
  const [activeMilestone, setActiveMilestone] = useState<any>(null);

  const progressRef = useRef(0.10);
  const isPausedRef = useRef(false);
  const activeMilestoneIndexRef = useRef(0);

  // When service type switches, reset the interactive timeline state
  useEffect(() => {
    const defaultPercentage = milestones[0]?.percentage || 0.10;
    progressRef.current = defaultPercentage;
    isPausedRef.current = false;
    activeMilestoneIndexRef.current = 0;
    setProgress(defaultPercentage);
    setIsPaused(false);
    setActiveMilestoneIndex(0);
    setActiveMilestone(milestones[0] || null);
  }, [formData.serviceType]);

  // Autoplay effect - transitions from step to step cleanly
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveMilestoneIndex((prev) => {
        const next = prev + 1;
        if (next >= milestones.length) {
          return 0; // seamlessly wrap around to STEP 1
        }
        return next;
      });
    }, 4500); // 4.5s per step for professional readability

    return () => clearInterval(interval);
  }, [isPaused, milestones.length]);

  // Handle smooth transition of the active timeline marker glide along the curve
  useEffect(() => {
    if (activeMilestoneIndex >= 0 && activeMilestoneIndex < milestones.length) {
      const target = milestones[activeMilestoneIndex].percentage;
      setActiveMilestone(milestones[activeMilestoneIndex]);
      activeMilestoneIndexRef.current = activeMilestoneIndex;
      
      let animationFrame: number;
      const startTime = performance.now();
      const startProgress = progress;
      const duration = 1000; // Smooth 1-second slide glide between nodes

      const animateTransition = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        
        // Custom ease out cubic easing
        const easeOutCubic = 1 - Math.pow(1 - t, 3);
        const currentProgress = startProgress + (target - startProgress) * easeOutCubic;
        
        setProgress(currentProgress);
        progressRef.current = currentProgress;
        
        if (t < 1) {
          animationFrame = requestAnimationFrame(animateTransition);
        }
      };
      
      animationFrame = requestAnimationFrame(animateTransition);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [activeMilestoneIndex, milestones]);

  return (
    <section
      id="home-eye-care"
      className="relative min-h-0 bg-zinc-950 py-6 md:py-10 px-4 md:px-8 lg:px-12 border-b border-white/5 overflow-hidden flex items-center justify-center"
    >
      {/* 1. CREATIVE FLUID BACKGROUND BLOBS & GLOW SPHERES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 60, -30, 0], 
            y: [0, -80, 40, 0],
            scale: [1, 1.15, 0.9, 1] 
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-12 -left-20 w-[450px] h-[450px] bg-brand-blue/10 rounded-full blur-[110px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -50, 60, 0], 
            y: [0, 80, -60, 0],
            scale: [1, 0.9, 1.1, 1] 
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-[420px] h-[420px] bg-emerald-500/8 rounded-full blur-[110px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.25, 0.95, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/3 w-[320px] h-[320px] bg-indigo-500/5 rounded-full blur-[100px]"
        />
        {/* Fine background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="w-full max-w-[1400px] z-10 space-y-6">
        
        {/* Main Layout Grid: Left column for Wizard (Sticky Container-Fluid), Right column for luxury vertical timelines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: THE BOOKING FORM (Translucent Fluid Card, Sticky Left) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl p-5 md:p-6 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative z-20 flex flex-col justify-between overflow-hidden group/form">
            
            {/* Glowing border highlight indicator on hover */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-brand-blue/60 to-transparent opacity-0 group-hover/form:opacity-100 transition-all duration-700" />
            
            <div>
              <div className="mb-3.5 pb-2.5 border-b border-white/5 flex items-center justify-between relative">
                {onClose ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-1.5 text-zinc-450 hover:text-brand-blue text-[9px] font-mono uppercase tracking-widest transition-colors cursor-pointer group"
                  >
                    <ArrowLeft size={10} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to Boutique</span>
                  </button>
                ) : (
                  <span className="font-mono text-[8px] text-brand-blue tracking-[0.2em] uppercase font-black">
                    [ CARE MODULE ]
                  </span>
                )}
                
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-brand-blue animate-pulse" />
                  <span className="font-mono text-[8px] text-zinc-400 uppercase tracking-wider font-semibold">Home Appointment</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <form onSubmit={handleSubmit} className="space-y-3.5">

                    {/* CUSTOM SERVICE SELECTOR: Home Eye Check & Transform Your Look */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-[8px] text-zinc-400 tracking-wider uppercase font-black">
                        [ Choose Care Module ]
                      </label>
                      
                      <div className="relative p-1 bg-zinc-950/60 rounded-xl border border-white/5 grid grid-cols-2 gap-1.5 font-sans overflow-hidden">
                        
                        {/* Selector Tab 1: Home Eye Check */}
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, serviceType: "Home Eye Check" }))}
                          className="relative py-2.5 px-2 rounded-lg text-center font-bold text-[9px] uppercase tracking-wider transition-all duration-300 z-10 focus:outline-none cursor-pointer"
                        >
                          {formData.serviceType === "Home Eye Check" && (
                            <motion.div
                              layoutId="activeServiceTab"
                              transition={{ type: "spring", stiffness: 350, damping: 28 }}
                              className="absolute inset-0 bg-brand-blue rounded-lg shadow-lg shadow-brand-blue/20"
                            />
                          )}
                          <span className={`relative z-20 transition-colors duration-300 ${
                            formData.serviceType === "Home Eye Check" ? "text-white" : "text-zinc-500 hover:text-white"
                          }`}>
                            Home Eye Check
                          </span>
                        </button>

                        {/* Selector Tab 2: Transform Your Look */}
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, serviceType: "Transform Your Look" }))}
                          className="relative py-2.5 px-2 rounded-lg text-center font-bold text-[9px] uppercase tracking-wider transition-all duration-300 z-10 focus:outline-none cursor-pointer"
                        >
                          {formData.serviceType === "Transform Your Look" && (
                            <motion.div
                              layoutId="activeServiceTab"
                              transition={{ type: "spring", stiffness: 350, damping: 28 }}
                              className="absolute inset-0 bg-brand-blue rounded-lg shadow-lg shadow-brand-blue/20"
                            />
                          )}
                          <span className={`relative z-20 transition-colors duration-300 ${
                            formData.serviceType === "Transform Your Look" ? "text-white" : "text-zinc-500 hover:text-white"
                          }`}>
                            Transform Your Look
                          </span>
                        </button>

                      </div>
                    </div>
                    
                    {/* INPUT 1: Full Name */}
                    <div className="relative group/field">
                      <label className="block font-mono text-[8px] text-zinc-400 tracking-wider uppercase font-black mb-0.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none group-focus-within/field:text-brand-blue transition-colors">
                          <User size={12} />
                        </span>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="E.g., Madhavan S"
                          className="peer w-full bg-zinc-950/20 border-b border-white/10 focus:border-brand-blue/40 py-2 pl-8 pr-4 text-xs text-white placeholder-zinc-650 focus:outline-none transition-all font-sans"
                        />
                        {/* Underline Indicator */}
                        <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-brand-blue to-cyan-400 peer-focus:w-full transition-all duration-500 ease-out" />
                      </div>
                    </div>

                    {/* INPUT 2: WhatsApp */}
                    <div className="relative group/field">
                      <label className="block font-mono text-[8px] text-zinc-400 tracking-wider uppercase font-black mb-0.5">
                        WhatsApp Mobile *
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none group-focus-within/field:text-brand-blue transition-colors">
                          <Phone size={12} />
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="E.g., +91 98400 12345"
                          className="peer w-full bg-zinc-950/20 border-b border-white/10 focus:border-brand-blue/40 py-2 pl-8 pr-4 text-xs text-white placeholder-zinc-650 focus:outline-none transition-all font-sans"
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-brand-blue to-cyan-400 peer-focus:w-full transition-all duration-500 ease-out" />
                      </div>
                    </div>

                    {/* INPUT 3: Email Address */}
                    <div className="relative group/field">
                      <label className="block font-mono text-[8px] text-zinc-400 tracking-wider uppercase font-black mb-0.5">
                        Email Address (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none group-focus-within/field:text-brand-blue transition-colors">
                          <Mail size={12} />
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="E.g., name@domain.com"
                          className="peer w-full bg-zinc-950/20 border-b border-white/10 focus:border-brand-blue/40 py-2 pl-8 pr-4 text-xs text-white placeholder-zinc-650 focus:outline-none transition-all font-sans"
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-brand-blue to-cyan-400 peer-focus:w-full transition-all duration-500 ease-out" />
                      </div>
                    </div>

                    {/* SELECT: City & Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="relative group/field">
                        <label className="block font-mono text-[8px] text-zinc-400 tracking-wider uppercase font-black mb-0.5">
                          Covered City
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                            <MapPin size={12} />
                          </span>
                          <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full bg-zinc-950/20 border-b border-white/10 py-2 pl-8 pr-4 text-xs text-zinc-300 focus:outline-none focus:border-brand-blue transition-all font-sans cursor-pointer"
                          >
                            <option value="Chennai" className="bg-zinc-900">Chennai</option>
                            <option value="Coimbatore" className="bg-zinc-900">Coimbatore</option>
                            <option value="Bangalore" className="bg-zinc-900">Bangalore</option>
                          </select>
                        </div>
                      </div>

                      <div className="relative group/field">
                        <label className="block font-mono text-[8px] text-zinc-400 tracking-wider uppercase font-black mb-1">
                          Preferred Date
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                            <Calendar size={12} />
                          </span>
                          <input
                            type="date"
                            name="preferredDate"
                            min={new Date().toISOString().split("T")[0]}
                            value={formData.preferredDate}
                            onChange={handleChange}
                            className="w-full bg-zinc-950/20 border-b border-white/10 py-1.5 pl-8 pr-4 text-xs text-white focus:outline-none focus:border-brand-blue transition-all font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    {/* TEXTAREA: Ocular history / requirements */}
                    <div className="relative group/field">
                      <label className="block font-mono text-[8px] text-zinc-400 tracking-wider uppercase font-black mb-0.5">
                        Ocular History / Special Requests
                      </label>
                      <div className="relative">
                        <span className="absolute top-2.5 left-3 text-zinc-500 pointer-events-none group-focus-within/field:text-brand-blue transition-colors">
                          <FileText size={12} />
                        </span>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder="E.g., Computer stress, high eye power, dry eye screening details..."
                          rows={1}
                          className="peer w-full bg-zinc-950/20 border-b border-white/10 focus:border-brand-blue/40 py-2 pl-8 pr-4 text-xs text-white placeholder-zinc-650 focus:outline-none transition-all font-sans resize-none"
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-brand-blue to-cyan-400 peer-focus:w-full transition-all duration-500 ease-out" />
                      </div>
                    </div>

                    {/* Validation Error Banner */}
                    {validationError && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-2 bg-red-950/40 border border-red-900/50 text-red-400 rounded-lg text-[10px] font-sans text-left flex items-center gap-1.5"
                      >
                        <AlertCircle size={12} className="shrink-0" />
                        <span>{validationError}</span>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full py-3 px-5 rounded-xl bg-brand-blue hover:bg-white hover:text-black text-white font-display text-[9px] tracking-widest uppercase font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-brand-blue/20 disabled:opacity-50"
                      >
                        {isSubmitting ? "Registering Profile..." : "SUBMIT & BOOK FREE VISIT"}
                        <CheckCircle size={12} />
                      </motion.button>
                      
                      <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                        <ShieldCheck size={11} className="text-brand-blue" />
                        <span>FREE PORTABLE CLINICAL VAN DELIVERY</span>
                      </div>
                    </div>

                  </form>
                ) : (
                  // SUCCESS STATE CARD
                  <motion.div
                    key="form-success-wizard"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6 space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-950/40 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-900/50 shadow-inner">
                      <CheckCircle size={28} className="stroke-[2.5]" />
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-mono text-[8px] text-emerald-400 tracking-widest uppercase font-black">
                        [ APPOINTMENT SECURED ]
                      </span>
                      <h3 className="font-serif text-2xl font-black text-white uppercase tracking-tight">
                        REQUEST REGISTERED!
                      </h3>
                      <p className="font-sans text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto font-light">
                        Excellent, <span className="font-semibold text-white">{formData.name}</span>. Your portal reservation is logged.
                      </p>
                    </div>

                    {/* Summary ticket */}
                    <div className="p-4 rounded-xl bg-zinc-950/40 backdrop-blur-sm border border-white/10 space-y-3 max-w-sm mx-auto text-left text-xs">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase">PASS ID</span>
                        <span className="font-mono text-[9px] text-brand-blue font-bold">{bookingPassNo}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-3 text-[10px]">
                        <div>
                          <span className="block font-mono text-[7px] text-zinc-500 uppercase">WhatsApp</span>
                          <span className="font-bold text-white">{formData.phone}</span>
                        </div>
                        <div>
                          <span className="block font-mono text-[7px] text-zinc-500 uppercase">Destination</span>
                          <span className="font-bold text-brand-blue uppercase">{formData.city}</span>
                        </div>
                        <div>
                          <span className="block font-mono text-[7px] text-zinc-500 uppercase">Schedule Preference</span>
                          <span className="font-semibold text-white">{formData.preferredDate || "TBD (WhatsApp)"}</span>
                        </div>
                        <div>
                          <span className="block font-mono text-[7px] text-zinc-500 uppercase">Email</span>
                          <span className="font-semibold text-white truncate max-w-[120px] block">{formData.email || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    <p className="font-sans text-[11px] text-zinc-400 leading-relaxed max-w-xs mx-auto font-light">
                      We will initiate contact through WhatsApp to verify coordinates and dispatch our mobile diagnostic van. You can also chat with us immediately:
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2.5 justify-center max-w-xs mx-auto">
                      <button
                        onClick={handleWhatsAppShare}
                        className="w-full py-3.5 px-4 rounded-xl bg-brand-blue hover:bg-white hover:text-black text-white font-display text-[9px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-brand-blue/15"
                      >
                        <Sparkles size={11} />
                        CHAT ON WHATSAPP NOW
                      </button>
                      
                      <button
                        onClick={handleReset}
                        className="w-full py-2.5 px-4 rounded-xl border border-white/10 hover:border-white/15 hover:bg-zinc-900/40 backdrop-blur-sm text-zinc-400 font-mono text-[8px] tracking-wider uppercase transition-colors cursor-pointer"
                      >
                        New Appointment Request
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* RIGHT COLUMN: CURVED AUTO-LOADING TIMELINE */}
          <div className="lg:col-span-7 flex flex-col justify-between self-stretch bg-white/[0.01] border border-white/10 backdrop-blur-xl p-5 md:p-6 rounded-2xl relative overflow-hidden group/panel">
            {/* Glowing background light */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[60px] pointer-events-none group-hover/panel:bg-cyan-500/10 transition-all duration-700" />
            
            {/* Minimal and elegant header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-950/40 border border-cyan-900/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner group-hover/panel:scale-110 transition-transform duration-300">
                  <Activity size={16} />
                </div>
                <div>
                  <span className="block font-mono text-[8px] tracking-[0.25em] text-cyan-400 uppercase font-extrabold">
                    [ Interactive Care Journey ]
                  </span>
                  <h3 className="font-serif text-xs font-light text-white uppercase tracking-wider">
                    {formData.serviceType === "Home Eye Check" ? "Clinical Operations Roadmap" : "Bespoke Styling Sequence"}
                  </h3>
                </div>
              </div>
              
              {/* Timeline Status controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    isPausedRef.current = !isPausedRef.current;
                    setIsPaused(isPausedRef.current);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-350 hover:text-white transition-all text-[8px] font-mono uppercase tracking-wider cursor-pointer"
                >
                  {isPaused ? (
                    <>
                      <Play size={9} className="fill-current text-cyan-400" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause size={9} className="fill-current text-amber-400" />
                      Pause
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    const defaultPct = milestones[0]?.percentage || 0.10;
                    progressRef.current = defaultPct;
                    isPausedRef.current = false;
                    activeMilestoneIndexRef.current = 0;
                    setProgress(defaultPct);
                    setIsPaused(false);
                    setActiveMilestoneIndex(0);
                    setActiveMilestone(milestones[0]);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-350 hover:text-white transition-all text-[8px] font-mono uppercase tracking-wider cursor-pointer"
                >
                  <RefreshCw size={9} />
                  Restart
                </button>
              </div>
            </div>

            {/* CURVED SVG TIMELINE CONTAINER (vertically centered in remaining space) */}
            <div className="flex-1 flex items-center justify-center relative w-full my-4 min-h-[300px]">
              <div className="relative w-full h-[280px]">
                {/* Curved SVG Track System */}
                <svg className="absolute w-full h-full top-0 left-0" viewBox="0 0 1000 300" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="timeline-track-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#18181b" />
                      <stop offset="50%" stopColor="#27272a" />
                      <stop offset="100%" stopColor="#18181b" />
                    </linearGradient>
                    <linearGradient id="timeline-progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="40%" stopColor="#6366f1" />
                      <stop offset="70%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  
                  {/* Base track line style with sampled custom bends */}
                  <path
                    d={trackPathD}
                    fill="none"
                    stroke="url(#timeline-track-gradient)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  {/* The glowing loading line that fills up */}
                  <path
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset={1 - progress}
                    d={trackPathD}
                    fill="none"
                    stroke="url(#timeline-progress-gradient)"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    className="transition-[stroke-dashoffset] duration-75 ease-linear"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(99, 102, 241, 0.6))",
                    }}
                  />
                </svg>

                {/* Real-time Gliding Active Orb with dynamic tracking along the spline */}
                {progress > 0 && progress < 0.99 && (() => {
                  const pt = getBezierPoint(progress);
                  const ptLeft = (pt.x / 1000) * 100;
                  const ptTop = (pt.y / 300) * 100;
                  return (
                    <div
                      style={{
                        left: `${ptLeft}%`,
                        top: `${ptTop}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-cyan-400/20 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.8)] z-20 pointer-events-none flex items-center justify-center"
                    >
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  );
                })()}

                {/* HTML Node layer mapped coordinates onto the path dynamically */}
                <div className="absolute inset-0 pointer-events-auto">
                  {milestones.map((milestone, idx) => {
                    const point = getBezierPoint(milestone.percentage);
                    const leftPercent = (point.x / 1000) * 100;
                    const topPercent = (point.y / 300) * 100;
                    const isPassed = progress >= milestone.percentage;
                    const isActive = idx === activeMilestoneIndex;
                    const isTop = idx % 2 === 0;

                    // Custom horizontal alignment offsets to prevent screen edge overflow
                    let cardAlignClass = "left-1/2 -translate-x-1/2";
                    if (idx === 0) cardAlignClass = "left-0 translate-x-0 sm:left-1/2 sm:-translate-x-1/4";
                    if (idx === milestones.length - 1) cardAlignClass = "right-0 translate-x-0 sm:left-1/2 sm:-translate-x-3/4";

                    return (
                      <div
                        key={idx}
                        style={{
                          left: `${leftPercent}%`,
                          top: `${topPercent}%`,
                        }}
                        className="absolute"
                      >
                        {/* Interactive Node Dot */}
                        <button
                          type="button"
                          className={`absolute -translate-x-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full border-[3px] transition-all duration-500 z-10 flex items-center justify-center cursor-pointer ${
                            isPassed
                              ? "border-white bg-cyan-500 shadow-[0_0_12px_#06b6d4] scale-125"
                              : "border-zinc-750 bg-zinc-950 hover:border-zinc-500 scale-100"
                          }`}
                          onClick={() => {
                            progressRef.current = milestone.percentage;
                            setProgress(milestone.percentage);
                            activeMilestoneIndexRef.current = idx;
                            setActiveMilestoneIndex(idx);
                            setActiveMilestone(milestone);
                            isPausedRef.current = true;
                            setIsPaused(true);
                          }}
                        >
                          {isActive && (
                            <span className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-75 pointer-events-none" />
                          )}
                        </button>

                        {/* Static Mini Title for Inactive State */}
                        {!isActive && (
                          <span
                            className={`absolute left-1/2 -translate-x-1/2 font-mono text-[8px] font-bold tracking-wider whitespace-nowrap transition-colors duration-300 pointer-events-none ${
                              isTop ? "-top-6" : "top-3"
                            } ${isPassed ? "text-cyan-400 font-extrabold" : "text-zinc-500"}`}
                          >
                            {milestone.year}
                          </span>
                        )}

                        {/* TOP STEP DETAILS CARD (Even Indices: Step 1, 3, 5) */}
                        {isTop && (
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.92 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.92 }}
                                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                                className={`absolute bottom-5 z-30 w-44 sm:w-56 pointer-events-none ${cardAlignClass}`}
                              >
                                <div className="bg-zinc-950/95 border border-cyan-500/30 rounded-xl p-3 shadow-[0_8px_30px_rgba(6,182,212,0.25)] text-left relative backdrop-blur-md">
                                  {/* Neon mini accent line */}
                                  <div className="absolute top-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                                  
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span className="block font-mono text-[7px] tracking-[0.2em] text-cyan-400 uppercase font-black">
                                      {milestone.year}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                  </div>
                                  <h4 className="font-serif text-[11px] text-white uppercase tracking-wider font-semibold mt-1 leading-tight">
                                    {milestone.title}
                                  </h4>
                                  <p className="font-sans text-[9px] text-zinc-400 mt-1 leading-relaxed font-light">
                                    {milestone.desc}
                                  </p>
                                </div>
                                {/* Dynamic visual connection stem */}
                                <div className="w-[1.5px] h-5 bg-gradient-to-t from-cyan-500/80 to-transparent mx-auto relative mt-[-1px]">
                                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}

                        {/* BOTTOM STEP DETAILS CARD (Odd Indices: Step 2, 4, 6) */}
                        {!isTop && (
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, y: -15, scale: 0.92 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.92 }}
                                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                                className={`absolute top-5 z-30 w-44 sm:w-56 pointer-events-none ${cardAlignClass}`}
                              >
                                {/* Dynamic visual connection stem */}
                                <div className="w-[1.5px] h-5 bg-gradient-to-b from-cyan-500/80 to-transparent mx-auto relative mb-[-1px]">
                                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
                                </div>
                                
                                <div className="bg-zinc-950/95 border border-cyan-500/30 rounded-xl p-3 shadow-[0_8px_30px_rgba(6,182,212,0.25)] text-left relative backdrop-blur-md">
                                  {/* Neon mini accent line */}
                                  <div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                                  
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span className="block font-mono text-[7px] tracking-[0.2em] text-cyan-400 uppercase font-black">
                                      {milestone.year}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                  </div>
                                  <h4 className="font-serif text-[11px] text-white uppercase tracking-wider font-semibold mt-1 leading-tight">
                                    {milestone.title}
                                  </h4>
                                  <p className="font-sans text-[9px] text-zinc-400 mt-1 leading-relaxed font-light">
                                    {milestone.desc}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Google Trustpilot Badge Strip - full width across bottom span */}
            <div className="border-t border-white/5 pt-3 mt-3 flex justify-between items-center text-[8px] text-zinc-500 uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-zinc-450">Google Rating</span>
                <div className="flex text-amber-500 gap-0.5">
                  <Star size={7} className="fill-amber-500 text-amber-500" />
                  <Star size={7} className="fill-amber-500 text-amber-500" />
                  <Star size={7} className="fill-amber-500 text-amber-500" />
                  <Star size={7} className="fill-amber-500 text-amber-500" />
                  <Star size={7} className="fill-amber-500 text-amber-500" />
                </div>
                <span className="font-bold text-white">4.8 / 5</span>
              </div>
              <div className="h-3 w-[1px] bg-white/5" />
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-black">★ Trustpilot</span>
                <span className="font-bold text-white">4.7 / 5</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
