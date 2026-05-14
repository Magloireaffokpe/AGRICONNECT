import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
  Users,
  ChevronDown,
  Leaf,
  Zap,
  Apple,
  Sprout,
  Wheat,
  Beef,
  Milk,
  Package,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle2,
  Quote,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Tractor,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";

/* ══════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════ */

const stats = [
  { value: "200+", label: "Produits frais",   icon: Leaf },
  { value: "30+",  label: "Agriculteurs",     icon: Tractor },
  { value: "98%",  label: "Satisfaction",     icon: Star },
  { value: "500+", label: "Acheteurs actifs", icon: Users },
];

const categories = [
  { icon: Apple,   label: "Fruits",   value: "FRUITS",     color: "text-rose-600",    bg: "bg-rose-50    dark:bg-rose-900/20",    ring: "ring-rose-200    dark:ring-rose-800" },
  { icon: Sprout,  label: "Légumes",  value: "VEGETABLES", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", ring: "ring-emerald-200 dark:ring-emerald-800" },
  { icon: Wheat,   label: "Céréales", value: "CEREALS",    color: "text-amber-600",   bg: "bg-amber-50   dark:bg-amber-900/20",   ring: "ring-amber-200   dark:ring-amber-800" },
  { icon: Beef,    label: "Viande",   value: "MEAT",       color: "text-red-600",     bg: "bg-red-50     dark:bg-red-900/20",     ring: "ring-red-200     dark:ring-red-800" },
  { icon: Milk,    label: "Laitiers", value: "DAIRY",      color: "text-sky-600",     bg: "bg-sky-50     dark:bg-sky-900/20",     ring: "ring-sky-200     dark:ring-sky-800" },
  { icon: Package, label: "Autre",    value: "OTHER",      color: "text-violet-600",  bg: "bg-violet-50  dark:bg-violet-900/20",  ring: "ring-violet-200  dark:ring-violet-800" },
];

const features = [
  { icon: BadgeCheck, title: "Agriculteurs vérifiés", desc: "Chaque fermier est contrôlé et certifié. Vous savez exactement d'où vient votre nourriture.", accent: "emerald" },
  { icon: Truck,      title: "Livraison directe",     desc: "Du champ à votre porte. Commandez aujourd'hui, recevez demain avec livraison à domicile.",   accent: "blue" },
  { icon: Star,       title: "Avis authentiques",     desc: "Des évaluations vérifiées par de vrais acheteurs. Choisissez en toute confiance.",            accent: "amber" },
  { icon: TrendingUp, title: "Circuit court",         desc: "Soutenez l'agriculture locale. Chaque achat va directement à un agriculteur de votre région.", accent: "violet" },
];

const accentMap: Record<string, { wrap: string; icon: string }> = {
  emerald: { wrap: "bg-emerald-50 dark:bg-emerald-900/25 ring-1 ring-emerald-200 dark:ring-emerald-800", icon: "text-emerald-600 dark:text-emerald-400" },
  blue:    { wrap: "bg-blue-50    dark:bg-blue-900/25    ring-1 ring-blue-200    dark:ring-blue-800",    icon: "text-blue-600    dark:text-blue-400" },
  amber:   { wrap: "bg-amber-50   dark:bg-amber-900/25   ring-1 ring-amber-200   dark:ring-amber-800",   icon: "text-amber-600   dark:text-amber-400" },
  violet:  { wrap: "bg-violet-50  dark:bg-violet-900/25  ring-1 ring-violet-200  dark:ring-violet-800",  icon: "text-violet-600  dark:text-violet-400" },
};

const testimonials = [
  {
    name: "Marie K.", role: "Acheteur fidèle", location: "Cotonou",
    text: "Les tomates de Monsieur Adjo sont incroyables. Je ne comprends pas comment j'achetais en supermarché avant.",
    rating: 5, initial: "M", color: "bg-rose-500",
  },
  {
    name: "Kofi A.", role: "Agriculteur bio", location: "Porto-Novo",
    text: "AgriConnect m'a permis de vendre directement sans intermédiaire. Mes revenus ont doublé en 3 mois.",
    rating: 5, initial: "K", color: "bg-emerald-600",
  },
  {
    name: "Fatou D.", role: "Acheteur premium", location: "Abomey-Calavi",
    text: "La qualité est au rendez-vous à chaque commande. Le service client est excellent et la livraison toujours à l'heure.",
    rating: 5, initial: "F", color: "bg-violet-500",
  },
];

const missionPoints = [
  { icon: Leaf,       title: "Fraîcheur garantie", desc: "Récolté le matin, livré chez vous le soir." },
  { icon: TrendingUp, title: "Prix justes",         desc: "Sans intermédiaires, agriculteurs et acheteurs y gagnent." },
  { icon: MapPin,     title: "Local & traçable",    desc: "Connaissez l'origine exacte de chaque produit." },
];

/* ══════════════════════════════════════════════
   HERO IMAGES  — 5 images, zero duplicates
══════════════════════════════════════════════ */
const heroImages = [
  { src: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1920&q=80&auto=format&fit=crop", label: "Champs verts" },
  { src: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80&auto=format&fit=crop", label: "Culture maraîchère" },
  { src: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1920&q=80&auto=format&fit=crop", label: "Récolte" },
  { src: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=1920&q=80&auto=format&fit=crop", label: "Agriculture locale" },
  { src: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80&auto=format&fit=crop", label: "Marché paysan" },
];

/* ══════════════════════════════════════════════
   MOSAIC pools — no overlap between A and B
══════════════════════════════════════════════ */
const mosaicColA = [
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=480&q=70&auto=format&fit=crop",
];

const mosaicColB = [
  "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476842634003-7dcca8f832de?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=480&q=70&auto=format&fit=crop",
];

/* ══════════════════════════════════════════════
   ANIMATION VARIANTS
══════════════════════════════════════════════ */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ══════════════════════════════════════════════
   SCROLL COLUMN
══════════════════════════════════════════════ */
function ScrollColumn({
  images,
  direction,
  duration = 32,
}: {
  images: string[];
  direction: "up" | "down";
  duration?: number;
}) {
  // Triple-duplicate so the loop never shows a gap at any container height
  const items = [...images, ...images, ...images];
  const cls = direction === "up" ? "animate-scroll-up" : "animate-scroll-down";

  return (
    <div className="relative overflow-hidden rounded-2xl h-[440px] sm:h-[560px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-stone-50 dark:from-stone-950 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-stone-50 dark:from-stone-950 to-transparent z-10" />

      <div
        className={`flex flex-col gap-3 ${cls}`}
        style={{ "--scroll-duration": `${duration}s` } as React.CSSProperties}
      >
        {items.map((src, i) => (
          <div key={i} className="shrink-0 w-full overflow-hidden rounded-xl shadow-sm aspect-[3/2]">
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  /*
    ── Carousel logic ──────────────────────────────────────────────────
    Problem with the previous approach:
      • framer-motion opacity animation on a ref value caused stale reads
        because refs don't trigger re-renders → the "previous" slide z-index
        was never updated correctly → black flash every full rotation.

    New approach — pure CSS transitions + React state only:
      • ALL images are stacked in the DOM at z-index 1 (invisible, opacity 0).
      • The CURRENT slide: z-index 3, opacity 1  (on top, fully visible).
      • The PREVIOUS slide: z-index 2, opacity 0  (just below current,
        still painted, fading out) — this prevents any black background
        from showing through during the cross-fade.
      • After the CSS transition duration (1.6 s), we clear `prev` so the
        old slide drops back to z-index 1.
      • `isTransitioning` guard prevents stacking multiple transitions.
    ─────────────────────────────────────────────────────────────────── */
  const [active, setActive] = useState(0);
  const [prev,   setPrev]   = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      if (locked || next === active) return;
      setPrev(active);
      setActive(next);
      setLocked(true);
      setTimeout(() => {
        setPrev(null);
        setLocked(false);
      }, 1600); // must equal the CSS transition duration below
    },
    [active, locked],
  );

  const goNext = useCallback(
    () => goTo((active + 1) % heroImages.length),
    [active, goTo],
  );
  const goPrev = useCallback(
    () => goTo((active - 1 + heroImages.length) % heroImages.length),
    [active, goTo],
  );

  useEffect(() => {
    const id = setInterval(goNext, 5500);
    return () => clearInterval(id);
  }, [goNext]);

  return (
    <>
      <Helmet>
        <title>AgriConnect – Du champ à votre table</title>
      </Helmet>

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <section className="relative min-h-[94vh] flex items-center overflow-hidden bg-stone-950">

        {/* ── Image stack ── */}
        <div className="absolute inset-0">
          {heroImages.map(({ src, label }, idx) => {
            const isCurrent  = idx === active;
            const isPrevious = idx === prev;
            return (
              <div
                key={src}
                aria-hidden={!isCurrent}
                className="absolute inset-0"
                style={{
                  // Layer order:
                  //   3 = active slide (coming in, on top)
                  //   2 = previous slide (still fully visible, being covered)
                  //   1 = all other slides (hidden beneath)
                  zIndex: isCurrent ? 3 : isPrevious ? 2 : 1,
                  // Opacity:
                  //   current  → fade IN  from 0 to 1 (CSS transition)
                  //   previous → stays at 1, fully visible while current fades in over it
                  //   others   → 0, invisible
                  // Result: no black background ever shows — the previous slide acts
                  // as a "carpet" under the incoming slide the entire time.
                  opacity: isCurrent ? 1 : isPrevious ? 1 : 0,
                  transition: isCurrent ? "opacity 1.6s ease-in-out" : "none",
                }}
              >
                {/* Ken Burns zoom on active slide only */}
                <div
                  className="w-full h-full"
                  style={{
                    transform:  isCurrent ? "scale(1.07)" : "scale(1)",
                    transition: isCurrent ? "transform 7s ease-out" : "none",
                  }}
                >
                  <img
                    src={src}
                    alt={label}
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding={idx === 0 ? "sync" : "async"}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            );
          })}

          {/* Cinematic overlays */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/65 via-transparent to-black/10" />
        </div>

        {/* ── Content ── */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-xl">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-7 tracking-wide">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Marketplace 100% locale · Bénin
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-[2.6rem] sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] mb-6 tracking-tight"
            >
              Du champ{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-green-400">directement</span>
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-green-400/35 rounded-full" />
              </span>
              <br />à votre table.
            </motion.h1>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="text-base sm:text-lg text-white/75 leading-relaxed mb-10 max-w-md"
            >
              AgriConnect connecte les meilleurs agriculteurs locaux aux
              acheteurs exigeants. Produits frais, traçables, livrés chez vous.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={() => navigate("/products")}
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-green-900/40 hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <Sparkles className="w-4 h-4" />
                Explorer le catalogue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {!isAuthenticated && (
                <button
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-2xl transition-all duration-200 text-sm sm:text-base"
                >
                  Rejoindre AgriConnect
                </button>
              )}
              {isAuthenticated && user?.role === "FARMER" && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-2xl transition-all duration-200 text-sm sm:text-base"
                >
                  Mon tableau de bord
                </button>
              )}
            </motion.div>

            {/* Indicators + prev/next */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="flex items-center gap-3 mt-10"
            >
              <button
                onClick={goPrev}
                aria-label="Image précédente"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`rounded-full transition-all duration-500 ${
                      idx === active
                        ? "w-7 h-1.5 bg-green-400"
                        : "w-1.5 h-1.5 bg-white/30 hover:bg-white/55"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                aria-label="Image suivante"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="ml-1 text-white/35 text-xs font-mono tabular-nums">
                {String(active + 1).padStart(2, "0")} / {String(heroImages.length).padStart(2, "0")}
              </span>
            </motion.div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute bottom-0 inset-x-0 z-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/8 backdrop-blur-md border-t border-x border-white/12 rounded-t-2xl px-4 sm:px-8 py-4 sm:py-5 grid grid-cols-2 sm:grid-cols-4 sm:divide-x divide-white/10">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center gap-1 py-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-green-400" strokeWidth={2} />
                    <span className="text-xl sm:text-2xl font-bold text-white">{value}</span>
                  </div>
                  <span className="text-[11px] text-white/50 font-medium tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute bottom-28 right-8 hidden lg:flex flex-col items-center gap-1 text-white/30 z-20"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          TRUST BAND
      ════════════════════════════════════════════ */}
      <section className="bg-green-700 dark:bg-green-800 py-3.5 overflow-hidden select-none">
        <div
          className="flex gap-14 whitespace-nowrap"
          style={{ animation: "marquee 26s linear infinite" }}
        >
          {[...Array(2)].flatMap((_, ri) =>
            [
              { icon: CheckCircle2, text: "100% Local" },
              { icon: BadgeCheck,   text: "Certifié" },
              { icon: Truck,        text: "Livraison rapide" },
              { icon: Star,         text: "Meilleurs agriculteurs" },
              { icon: Leaf,         text: "Agriculture durable" },
              { icon: Users,        text: "Circuit court" },
              { icon: ShieldCheck,  text: "Sécurisé" },
              { icon: Clock,        text: "Fraîcheur garantie" },
            ].map(({ icon: Icon, text }) => (
              <span
                key={`${text}-${ri}`}
                className="inline-flex items-center gap-2 text-white/90 text-sm font-semibold shrink-0"
              >
                <Icon className="w-3.5 h-3.5 text-green-200" strokeWidth={2.2} />
                {text}
              </span>
            )),
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CATEGORIES
      ════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs font-bold tracking-[0.18em] uppercase mb-3">
              <Leaf className="w-3.5 h-3.5" /> Nos produits
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100">
              Tout ce dont vous avez besoin,{" "}
              <span className="text-green-600 dark:text-green-400">directement des fermiers</span>
            </h2>
            <p className="text-stone-500 dark:text-stone-400 mt-3 text-sm sm:text-base max-w-lg mx-auto">
              Parcourez librement notre catalogue. Connectez-vous uniquement pour commander.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.value}
                  variants={fadeUp}
                  whileHover={{ y: -5, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/products?category=${cat.value}`)}
                  className={`group flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-2xl ${cat.bg} ring-1 ${cat.ring} transition-all duration-200 hover:shadow-lg`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cat.bg} ring-1 ${cat.ring}`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${cat.color}`} strokeWidth={1.8} />
                  </div>
                  <span className={`text-xs sm:text-sm font-bold ${cat.color}`}>{cat.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          MISSION SPLIT
      ════════════════════════════════════════════ */}
      <section className="bg-stone-50 dark:bg-stone-900/40 py-16 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative order-2 lg:order-1"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=800&q=70&auto=format&fit=crop"
                  alt="Agriculteur dans son champ"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -bottom-6 -right-4 sm:-right-8 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-4 sm:p-5 border border-stone-100 dark:border-stone-800 w-52 sm:w-60"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
                    <Tractor className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800 dark:text-stone-100">Kofi Adjo</p>
                    <div className="flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3 text-emerald-500" />
                      <p className="text-[11px] text-stone-400">Fermier vérifié</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-1.5">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-stone-400 text-[11px]">
                  <MapPin className="w-3 h-3" />
                  <span>Cotonou · 42 avis</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-1 lg:order-2"
            >
              <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs font-bold tracking-[0.18em] uppercase mb-5">
                <Zap className="w-3.5 h-3.5" /> Notre mission
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100 leading-tight mb-5">
                Connecter la ferme à votre cuisine, simplement.
              </h2>
              <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base leading-relaxed mb-8">
                AgriConnect est né d'une conviction : les meilleurs produits viennent directement des champs.
                Nous éliminons les intermédiaires pour que vous mangiez mieux et que les agriculteurs gagnent plus.
              </p>

              <div className="space-y-4">
                {missionPoints.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 ring-1 ring-green-200 dark:ring-green-800 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-green-600 dark:text-green-400" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800 dark:text-stone-100 text-sm mb-0.5">{title}</p>
                      <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/products")}
                className="group mt-8 inline-flex items-center gap-2 px-6 py-3.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold rounded-xl hover:opacity-90 transition-all duration-200 shadow-md hover:-translate-y-0.5 text-sm"
              >
                Voir les produits
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs font-bold tracking-[0.18em] uppercase mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Pourquoi nous ?
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100">
              Une expérience pensée pour vous
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              const a = accentMap[f.accent];
              return (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-11 h-11 rounded-2xl ${a.wrap} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-5 h-5 ${a.icon}`} strokeWidth={1.8} />
                  </div>
                  <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2 text-sm">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          PHOTO MOSAIC
      ════════════════════════════════════════════ */}
      <section className="bg-stone-50 dark:bg-stone-950 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs font-bold tracking-[0.18em] uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Galerie
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100">
              La nature à son meilleur
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            <ScrollColumn images={mosaicColA} direction="up"   duration={32} />
            <ScrollColumn images={mosaicColB} direction="down"  duration={37} />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs font-bold tracking-[0.18em] uppercase mb-3">
                <Star className="w-3.5 h-3.5" /> Témoignages
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100">
                Ils nous font confiance
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((t) => (
                <motion.div
                  key={t.name}
                  variants={fadeUp}
                  className="group relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <Quote className="absolute top-5 right-5 w-8 h-8 text-stone-100 dark:text-stone-800 group-hover:text-green-100 dark:group-hover:text-green-900/40 transition-colors" />

                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-6 italic">
                    "{t.text}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
                    <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center shrink-0`}>
                      <span className="text-white font-bold text-sm">{t.initial}</span>
                    </div>
                    <div>
                      <p className="font-bold text-stone-800 dark:text-stone-100 text-sm">{t.name}</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <p className="text-xs text-stone-400">{t.role} · {t.location}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CTA FINAL
      ════════════════════════════════════════════ */}
      {!isAuthenticated && (
        <section className="pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-stone-900"
            >
              <img
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&q=60&auto=format&fit=crop"
                alt="Champ agricole"
                className="absolute inset-0 w-full h-full object-cover opacity-25"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-stone-900/95 via-stone-900/70 to-green-900/50" />
              {/* Decorative rings */}
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full border border-white/5 pointer-events-none" />

              <div className="relative z-10 px-8 sm:px-14 py-14 sm:py-20 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left max-w-xl">
                  <div className="inline-flex items-center gap-2 text-green-400 text-xs font-bold tracking-widest uppercase mb-4">
                    <Sparkles className="w-3.5 h-3.5" /> Rejoignez-nous
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                    Prêt à manger local ?
                  </h2>
                  <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
                    Rejoignez des centaines d'acheteurs et d'agriculteurs qui font confiance à AgriConnect
                    chaque jour pour une alimentation saine et locale.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => navigate("/register?role=BUYER")}
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-white text-stone-900 font-bold rounded-2xl hover:bg-stone-100 transition-all duration-200 text-sm shadow-lg hover:-translate-y-0.5"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Je suis acheteur
                  </button>
                  <button
                    onClick={() => navigate("/register?role=FARMER")}
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-2xl transition-all duration-200 text-sm shadow-lg hover:-translate-y-0.5"
                  >
                    <Tractor className="w-4 h-4" />
                    Je suis agriculteur
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
