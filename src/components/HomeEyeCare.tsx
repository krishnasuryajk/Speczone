import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { 
  Sparkles, 
  ChevronDown, 
  UserCheck, 
  Play, 
  Pause, 
  ShieldCheck, 
  Clock, 
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Info
} from "lucide-react";

interface HomeEyeCareProps {
  onClose?: () => void;
  initialNotes?: string;
  initialType?: string;
}

interface TimelineStepData {
  title: string;
  prefix: string;
  highlightTerm: string;
  suffix: string;
  tooltipTitle: string;
  tooltipText: string;
}

const timelineData: Record<"HEC" | "TYL", TimelineStepData[]> = {
  HEC: [
    {
      title: "Gather Personal Details",
      prefix: "Collect profile info & ",
      highlightTerm: "medical history",
      suffix: ".",
      tooltipTitle: "Medical Profile",
      tooltipText: "Captures pre-existing conditions and allergies."
    },
    {
      title: "Confirm Checkup Order",
      prefix: "Verify selected ",
      highlightTerm: "packages",
      suffix: " and payment.",
      tooltipTitle: "Checkup Order",
      tooltipText: "Includes comprehensive lab test suites."
    },
    {
      title: "Assign Specialist",
      prefix: "Allocate a certified ",
      highlightTerm: "doctor",
      suffix: " to the order.",
      tooltipTitle: "Specialist",
      tooltipText: "Board-certified medical practitioner matched to profile."
    },
    {
      title: "Get Location",
      prefix: "Pinpoint residential ",
      highlightTerm: "GPS coordinates",
      suffix: ".",
      tooltipTitle: "GPS Address",
      tooltipText: "Ensures accurate dispatch for doorstep visit."
    },
    {
      title: "Consultation",
      prefix: "In-person visit at your ",
      highlightTerm: "home location",
      suffix: ".",
      tooltipTitle: "Home Visit",
      tooltipText: "Complete physical exam in the comfort of home."
    }
  ],
  TYL: [
    {
      title: "Gather Personal Details",
      prefix: "Log style preference & ",
      highlightTerm: "face shape",
      suffix: ".",
      tooltipTitle: "Facial Profile",
      tooltipText: "Analyzes dimensions to recommend best frame fit."
    },
    {
      title: "Suggest Frames",
      prefix: "Curate tailored ",
      highlightTerm: "eyewear frames",
      suffix: ".",
      tooltipTitle: "Personalized Frames",
      tooltipText: "Curated selection tailored to facial geometry."
    },
    {
      title: "Suggest Looks",
      prefix: "Recommend full ",
      highlightTerm: "aesthetic styles",
      suffix: ".",
      tooltipTitle: "Personalized Looks",
      tooltipText: "Combines apparel, frames, and color palettes."
    },
    {
      title: "Projection of Looks",
      prefix: "Generate 3D ",
      highlightTerm: "AR simulation",
      suffix: ".",
      tooltipTitle: "AR Projection",
      tooltipText: "Augmented Reality preview overlay on live camera."
    },
    {
      title: "Confirmation of Order",
      prefix: "Finalize cart and ",
      highlightTerm: "checkout",
      suffix: " details.",
      tooltipTitle: "Order Confirmation",
      tooltipText: "Locks in inventory and schedules delivery."
    }
  ]
};

export default function HomeEyeCare({ onClose, initialNotes = "", initialType = "HEC" }: HomeEyeCareProps) {
  const [selectedTrack, setSelectedTrack] = useState<"HEC" | "TYL">(
    initialType?.toLowerCase().includes("transform") || initialType === "TYL" ? "TYL" : "HEC"
  );
  const [custRefId, setCustRefId] = useState("CUST-98420");
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeTooltipStep, setActiveTooltipStep] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initial type prop
  useEffect(() => {
    if (initialType?.toLowerCase().includes("transform") || initialType === "TYL") {
      setSelectedTrack("TYL");
    }
  }, [initialType]);

  // Handle timeline playback
  const runSequence = () => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    setActiveStep(1);
    setIsPlaying(true);

    let step = 1;
    animationTimerRef.current = setInterval(() => {
      step++;
      if (step > 5) {
        if (animationTimerRef.current) clearInterval(animationTimerRef.current);
        setIsPlaying(false);
      } else {
        setActiveStep(step);
      }
    }, 1200);
  };

  useEffect(() => {
    runSequence();
    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, [selectedTrack]);

  const togglePlay = () => {
    if (isPlaying) {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
      setIsPlaying(false);
    } else {
      if (activeStep >= 5) {
        runSequence();
      } else {
        setIsPlaying(true);
        animationTimerRef.current = setInterval(() => {
          setActiveStep((prev) => {
            if (prev >= 5) {
              if (animationTimerRef.current) clearInterval(animationTimerRef.current);
              setIsPlaying(false);
              return 5;
            }
            return prev + 1;
          });
        }, 1200);
      }
    }
  };

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as "HEC" | "TYL";
    setSelectedTrack(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    runSequence();

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#4f46e5", "#10b981", "#38bdf8"]
      });
    } catch (err) {
      console.warn("Confetti failed", err);
    }
  };

  // Step percentage mapping for progress line width
  const progressPercentages = ["0%", "23%", "48%", "73%", "94%"];
  const currentProgressWidth = progressPercentages[activeStep - 1] || "0%";

  const stepsData = timelineData[selectedTrack];

  return (
    <section 
      id="home-eye-care"
      className="bg-[#0b0f19] text-slate-100 font-sans min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden antialiased selection:bg-indigo-500 selection:text-white"
    >
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* MAIN GLASS CONTAINER */}
      <div className="w-full max-w-7xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-indigo-950/20 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px] relative z-10">

        {/* LEFT PANEL: FORM */}
        <div className="lg:col-span-4 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col justify-between bg-slate-950/40">
          <div>
            {/* Header & Back Action */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Workflow Manager
              </div>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 text-xs font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">Service Request</h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Select your service package to initiate the 5-stage sequential roadmap.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Dropdown Field */}
              <div className="space-y-2 mb-6">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Service Process
                </label>
                <div className="relative">
                  <select
                    id="track-select"
                    value={selectedTrack}
                    onChange={handleTrackChange}
                    className="w-full appearance-none bg-slate-900/80 border border-slate-700/80 text-slate-200 text-sm rounded-xl px-4 py-3.5 pr-10 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-medium"
                  >
                    <option value="HEC">Health Evaluation Checkup (HEC)</option>
                    <option value="TYL">Try Your Look (TYL)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Input Field */}
              <div className="space-y-2 mb-8">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Customer Reference ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={custRefId}
                    onChange={(e) => setCustRefId(e.target.value)}
                    placeholder="e.g., CUST-98420"
                    className="w-full bg-slate-900/80 border border-slate-700/80 text-slate-200 text-sm rounded-xl px-4 py-3.5 pr-10 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 font-medium"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-500">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="trigger-btn"
                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.99] cursor-pointer"
              >
                <span>Re-animate Timeline</span>
                <Play className="w-4 h-4 transition-transform group-hover:translate-x-0.5 fill-white" />
              </button>
            </form>

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Workflow request for <strong>{custRefId}</strong> initialized successfully!</span>
              </motion.div>
            )}
          </div>

          {/* Footer Info */}
          <div className="pt-8 border-t border-slate-800/60 flex items-center gap-3 text-slate-500 text-xs mt-6 lg:mt-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dynamic real-time execution engine</span>
          </div>
        </div>

        {/* RIGHT PANEL: ALTERNATING HORIZONTAL ANIMATED TIMELINE */}
        <div className="lg:col-span-8 p-6 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-slate-900/40 via-slate-900/10 to-indigo-950/20 overflow-x-auto">
          
          {/* Top Title Bar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Process Flowchart</h2>
              <p className="text-slate-400 text-xs mt-1">Hover over underlined terms to inspect step details</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Play / Pause toggle */}
              <button
                type="button"
                onClick={togglePlay}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={runSequence}
                className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
                title="Restart Sequence"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span id="step-counter">Step {activeStep} of 5</span>
              </div>
            </div>
          </div>

          {/* ALTERNATING TIMELINE WRAPPER */}
          <div className="relative py-28 min-w-[700px] my-auto">
            
            {/* Center Track Background Line */}
            <div className="absolute top-1/2 -translate-y-1/2 left-8 right-8 h-[3px] bg-slate-800 rounded-full z-0" />

            {/* Animated Glowing Progress Line */}
            <motion.div
              id="timeline-progress"
              animate={{ width: currentProgressWidth }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute top-1/2 -translate-y-1/2 left-8 h-[3px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-400 rounded-full z-0 shadow-[0_0_15px_rgba(99,102,241,0.8)]"
            />

            {/* 5 ALTERNATING TIMELINE NODES */}
            <div className="relative z-10 grid grid-cols-5 gap-4">
              {stepsData.map((stepData, idx) => {
                const stepNum = idx + 1;
                const isPassed = stepNum <= activeStep;
                const isActive = stepNum === activeStep;
                const isTopCard = stepNum % 2 === 0; // Steps 2 & 4 are top cards, 1, 3, 5 are bottom cards

                return (
                  <div
                    key={idx}
                    className={`timeline-step flex flex-col items-center group relative cursor-pointer ${
                      isTopCard ? "card-top" : "card-bottom"
                    }`}
                    onClick={() => {
                      setActiveStep(stepNum);
                    }}
                  >
                    {/* TOP CARD LAYOUT (Steps 2 & 4) */}
                    {isTopCard && (
                      <motion.div
                        initial={{ opacity: 0, y: -25, scale: 0.9 }}
                        animate={{
                          opacity: isPassed ? 1 : 0.4,
                          y: isPassed ? 0 : -10,
                          scale: isActive ? 1.05 : 1
                        }}
                        transition={{ duration: 0.35, ease: "backOut" }}
                        className={`step-card absolute bottom-14 w-[160px] sm:w-[175px] bg-slate-800/90 backdrop-blur-md border p-3.5 rounded-2xl shadow-2xl text-center transition-colors ${
                          isActive
                            ? "border-indigo-400 shadow-indigo-500/20 ring-1 ring-indigo-500/30"
                            : isPassed
                            ? "border-slate-700/80 text-slate-200"
                            : "border-slate-800 text-slate-500"
                        }`}
                      >
                        <h3 className={`card-title font-semibold text-xs mb-1 ${isActive ? "text-indigo-300 font-bold" : "text-slate-100"}`}>
                          {stepData.title}
                        </h3>
                        <p className="card-desc text-[11px] text-slate-400 leading-normal">
                          {stepData.prefix}
                          <span 
                            className="relative inline-block cursor-pointer text-indigo-400 font-semibold border-b border-dashed border-indigo-400 hover:text-indigo-300"
                            onMouseEnter={() => setActiveTooltipStep(stepNum)}
                            onMouseLeave={() => setActiveTooltipStep(null)}
                          >
                            {stepData.highlightTerm}

                            {/* TOOLTIP OPENING DOWNWARDS FOR TOP CARDS */}
                            <AnimatePresence>
                              {activeTooltipStep === stepNum && (
                                <motion.div
                                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute top-[140%] left-1/2 -translate-x-1/2 w-48 bg-slate-950 border border-slate-700 text-slate-300 p-2.5 rounded-xl shadow-2xl font-normal text-left z-50 pointer-events-none"
                                >
                                  <strong className="text-indigo-400 block mb-0.5 text-xs font-bold">
                                    {stepData.tooltipTitle}
                                  </strong>
                                  <span className="text-[10px] text-slate-300 leading-tight block">
                                    {stepData.tooltipText}
                                  </span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </span>
                          {stepData.suffix}
                        </p>
                      </motion.div>
                    )}

                    {/* NODE CIRCLE */}
                    <motion.div
                      animate={{
                        scale: isActive ? 1.15 : isPassed ? 1.0 : 0.85
                      }}
                      transition={{ duration: 0.25, ease: "backOut" }}
                      className={`node-circle w-11 h-11 rounded-2xl font-bold text-sm flex items-center justify-center transition-all duration-300 shadow-xl z-10 ${
                        isActive
                          ? "bg-indigo-600 border-2 border-indigo-400 text-white shadow-lg shadow-indigo-500/50 [box-shadow:0_0_25px_-5px_rgba(99,102,241,0.5)]"
                          : isPassed
                          ? "bg-indigo-950 border-2 border-indigo-500/80 text-indigo-300"
                          : "bg-slate-900 border-2 border-slate-700 text-slate-500"
                      }`}
                    >
                      {stepNum}
                    </motion.div>

                    {/* BOTTOM CARD LAYOUT (Steps 1, 3 & 5) */}
                    {!isTopCard && (
                      <motion.div
                        initial={{ opacity: 0, y: 25, scale: 0.9 }}
                        animate={{
                          opacity: isPassed ? 1 : 0.4,
                          y: isPassed ? 0 : 10,
                          scale: isActive ? 1.05 : 1
                        }}
                        transition={{ duration: 0.35, ease: "backOut" }}
                        className={`step-card absolute top-14 w-[160px] sm:w-[175px] bg-slate-800/90 backdrop-blur-md border p-3.5 rounded-2xl shadow-2xl text-center transition-colors ${
                          isActive
                            ? "border-indigo-400 shadow-indigo-500/20 ring-1 ring-indigo-500/30"
                            : isPassed
                            ? "border-slate-700/80 text-slate-200"
                            : "border-slate-800 text-slate-500"
                        }`}
                      >
                        <h3 className={`card-title font-semibold text-xs mb-1 ${isActive ? "text-indigo-300 font-bold" : "text-slate-100"}`}>
                          {stepData.title}
                        </h3>
                        <p className="card-desc text-[11px] text-slate-400 leading-normal">
                          {stepData.prefix}
                          <span 
                            className="relative inline-block cursor-pointer text-indigo-400 font-semibold border-b border-dashed border-indigo-400 hover:text-indigo-300"
                            onMouseEnter={() => setActiveTooltipStep(stepNum)}
                            onMouseLeave={() => setActiveTooltipStep(null)}
                          >
                            {stepData.highlightTerm}

                            {/* TOOLTIP OPENING UPWARDS FOR BOTTOM CARDS */}
                            <AnimatePresence>
                              {activeTooltipStep === stepNum && (
                                <motion.div
                                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute bottom-[140%] left-1/2 -translate-x-1/2 w-48 bg-slate-950 border border-slate-700 text-slate-300 p-2.5 rounded-xl shadow-2xl font-normal text-left z-50 pointer-events-none"
                                >
                                  <strong className="text-indigo-400 block mb-0.5 text-xs font-bold">
                                    {stepData.tooltipTitle}
                                  </strong>
                                  <span className="text-[10px] text-slate-300 leading-tight block">
                                    {stepData.tooltipText}
                                  </span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </span>
                          {stepData.suffix}
                        </p>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Bar Status */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-6 border-t border-slate-800/60 mt-auto">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>Framework: React + Motion + Tailwind</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Estimated duration: 2-3 Days
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
