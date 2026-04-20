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
  Drumstick,
  Milk,
  Package,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

/* ─── Data ─── */
const stats = [
  { value: "200+", label: "Produits frais" },
  { value: "30+", label: "Agriculteurs" },
  { value: "98%", label: "Satisfaction" },
  { value: "500+", label: "Acheteurs actifs" },
];

const categories = [
  {
    icon: Apple,
    label: "Fruits",
    value: "FRUITS",
    bg: "from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
    border: "border-red-100 dark:border-red-900/40",
  },
  {
    icon: Sprout,
    label: "Légumes",
    value: "VEGETABLES",
    bg: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    border: "border-green-100 dark:border-green-900/40",
  },
  {
    icon: Wheat,
    label: "Céréales",
    value: "CEREALS",
    bg: "from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
    border: "border-amber-100 dark:border-amber-900/40",
  },
  {
    icon: Drumstick,
    label: "Viande",
    value: "MEAT",
    bg: "from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20",
    border: "border-rose-100 dark:border-rose-900/40",
  },
  {
    icon: Milk,
    label: "Laitiers",
    value: "DAIRY",
    bg: "from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20",
    border: "border-sky-100 dark:border-sky-900/40",
  },
  {
    icon: Package,
    label: "Autre",
    value: "OTHER",
    bg: "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20",
    border: "border-violet-100 dark:border-violet-900/40",
  },
];

const features = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Agriculteurs vérifiés",
    desc: "Chaque fermier est contrôlé et certifié. Vous savez exactement d'où vient votre nourriture.",
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/30",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Livraison directe",
    desc: "Du champ à votre porte. Commandez aujourd'hui, recevez demain avec livraison à domicile.",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/30",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Avis authentiques",
    desc: "Des évaluations vérifiées par de vrais acheteurs. Choisissez en toute confiance.",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/30",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Circuit court",
    desc: "Soutenez l'agriculture locale. Chaque achat va directement à un agriculteur de votre région.",
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/30",
  },
];

const testimonials = [
  {
    name: "Marie K.",
    role: "Acheteur fidèle",
    text: "Les tomates de Monsieur Adjo sont incroyables. Je ne comprends pas comment j'achetais en supermarché avant.",
    avatar: "👩🏾",
    rating: 5,
  },
  {
    name: "Kofi A.",
    role: "Agriculteur bio",
    text: "AgriConnect m'a permis de vendre directement sans intermédiaire. Mes revenus ont doublé en 3 mois.",
    avatar: "👨🏿",
    rating: 5,
  },
  {
    name: "Fatou D.",
    role: "Acheteur premium",
    text: "La qualité est au rendez-vous à chaque commande. Le service client est excellent et la livraison toujours à l'heure.",
    avatar: "👩🏾",
    rating: 5,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Hide the placeholder hero image once React loads
    const placeholder = document.querySelector(
      'div[style*="position: fixed"]',
    ) as HTMLElement;
    if (placeholder) {
      placeholder.style.display = "none";
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>AgriConnect – Du champ à votre table</title>
      </Helmet>

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200&q=60&auto=format&fit=crop"
            srcSet="
    https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=640&q=60&auto=format&fit=crop 640w,
    https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=828&q=60&auto=format&fit=crop 828w,
    https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200&q=60&auto=format&fit=crop 1200w
  "
            sizes="100vw"
            alt="Champs agricoles"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            width="1200"
            height="800"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Marketplace 100% locale · Bénin
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6"
            >
              Du champ
              <br />
              <span className="text-green-400">directement</span>
              <br />à votre table.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base sm:text-lg text-white/80 max-w-lg leading-relaxed mb-10"
            >
              AgriConnect connecte les meilleurs agriculteurs locaux aux
              acheteurs exigeants. Produits frais, traçables, livrés chez vous.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={() => navigate("/products")}
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-green-900/30 hover:shadow-xl hover:-translate-y-0.5 text-base"
              >
                Explorer le catalogue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {!isAuthenticated && (
                <button
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-bold rounded-2xl transition-all duration-200 text-base"
                >
                  Rejoindre AgriConnect
                </button>
              )}
              {isAuthenticated && user?.role === "FARMER" && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-bold rounded-2xl transition-all duration-200 text-base"
                >
                  Mon tableau de bord
                </button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 z-10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-t-2xl px-4 sm:px-6 py-4 sm:py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x divide-white/20">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xl sm:text-3xl font-bold text-white">
                    {s.value}
                  </div>
                  <div className="text-xs text-white/70 mt-0.5 font-medium">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-28 right-8 hidden lg:flex flex-col items-center gap-1 text-white/50"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* TRUST BAND — clés uniques corrigées */}
      <section className="bg-green-700 dark:bg-green-900 py-3.5 overflow-hidden">
        <div
          className="flex gap-12 whitespace-nowrap"
          style={{ animation: "marquee 22s linear infinite" }}
        >
          {[...Array(2)].flatMap((_, repeatIdx) =>
            [
              "🌿 100% Local",
              "✅ Certifié",
              "🚚 Livraison rapide",
              "⭐ Meilleurs agriculteurs",
              "🌱 Agriculture durable",
              "🤝 Circuit court",
              "🔒 Sécurisé",
              "📦 Fraîcheur garantie",
            ].map((t) => (
              <span
                key={`${t}-${repeatIdx}`}
                className="text-white/90 text-sm font-semibold shrink-0"
              >
                {t}
              </span>
            )),
          )}
        </div>
      </section>

      {/* CATÉGORIES — avec icônes Lucide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-bold tracking-widest uppercase mb-3">
              <Leaf className="w-4 h-4" /> Nos produits
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100">
              Tout ce dont vous avez besoin,
              <br className="hidden sm:block" /> directement des fermiers
            </h2>
            <p className="text-stone-500 dark:text-stone-400 mt-3 text-sm sm:text-base">
              Parcourez librement notre catalogue. Connectez-vous uniquement
              pour commander.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.value}
                  variants={fadeUp}
                  whileHover={{ y: -6, scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/products?category=${cat.value}`)}
                  className={`bg-gradient-to-br ${cat.bg} border ${cat.border} rounded-2xl p-3 sm:p-5 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-md`}
                >
                  <Icon
                    className="w-7 h-7 sm:w-8 sm:h-8 text-stone-700 dark:text-stone-200"
                    strokeWidth={1.5}
                  />
                  <span className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-200">
                    {cat.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* SPLIT SECTION — inchangée */}
      <section className="bg-stone-50 dark:bg-stone-900/50 py-16 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative order-2 lg:order-1"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=800&q=60&auto=format&fit=crop"
                  alt="Agriculteur dans son champ"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -bottom-5 -right-3 sm:-right-8 bg-white dark:bg-stone-900 rounded-2xl shadow-xl p-4 sm:p-5 border border-stone-100 dark:border-stone-800 w-44 sm:w-52"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <span className="text-xl sm:text-2xl">👨🏿‍🌾</span>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-100">
                      Kofi Adjo
                    </p>
                    <p className="text-[10px] sm:text-xs text-stone-400">
                      Fermier vérifié
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-amber-400 text-xs sm:text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 mt-1">
                  42 avis · Cotonou
                </p>
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-1 lg:order-2"
            >
              <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-bold tracking-widest uppercase mb-4">
                <Zap className="w-4 h-4" /> Notre mission
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100 leading-tight mb-5">
                Connecter la ferme à votre cuisine, simplement.
              </h2>
              <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base leading-relaxed mb-6">
                AgriConnect est né d'une conviction : les meilleurs produits
                viennent directement des champs. Nous éliminons les
                intermédiaires pour que vous mangiez mieux et que les
                agriculteurs gagnent plus.
              </p>
              <div className="space-y-3 sm:space-y-4">
                {[
                  {
                    emoji: "🌱",
                    title: "Fraîcheur garantie",
                    desc: "Récolté le matin, livré chez vous le soir.",
                  },
                  {
                    emoji: "💰",
                    title: "Prix justes",
                    desc: "Sans intermédiaires, les agriculteurs et les acheteurs y gagnent.",
                  },
                  {
                    emoji: "📍",
                    title: "Local & traçable",
                    desc: "Connaissez l'origine exacte de chaque produit.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-base sm:text-lg shrink-0">
                      {item.emoji}
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800 dark:text-stone-100 text-sm">
                        {item.title}
                      </p>
                      <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/products")}
                className="mt-8 inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-green-700 hover:bg-green-600 text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Voir les produits <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-bold tracking-widest uppercase mb-3">
              <ShieldCheck className="w-4 h-4" /> Pourquoi nous ?
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100">
              Une expérience pensée pour vous
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 group"
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-200`}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2 text-sm sm:text-base">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PHOTO MOSAIC */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 rounded-3xl overflow-hidden"
        >
          {[
            {
              src: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500&q=60&auto=format&fit=crop",
              alt: "Légumes frais",
              cls: "",
            },
            {
              src: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=60&auto=format&fit=crop",
              alt: "Tomates",
              cls: "",
            },
            {
              src: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&q=60&auto=format&fit=crop",
              alt: "Fruits",
              cls: "hidden sm:block",
            },
            {
              src: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=500&q=60&auto=format&fit=crop",
              alt: "Marché",
              cls: "hidden sm:block",
            },
            {
              src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=60&auto=format&fit=crop",
              alt: "Ferme",
              cls: "hidden sm:block",
            },
          ].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`overflow-hidden rounded-2xl aspect-square ${img.cls}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-stone-50 dark:bg-stone-900/50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div
              variants={fadeUp}
              className="text-center mb-10 sm:mb-14"
            >
              <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-bold tracking-widest uppercase mb-3">
                <Star className="w-4 h-4" /> Témoignages
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100">
                Ils nous font confiance
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {testimonials.map((t) => (
                <motion.div
                  key={t.name}
                  variants={fadeUp}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 sm:p-6 shadow-sm"
                >
                  <div className="flex gap-0.5 mb-3 sm:mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 italic">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl">{t.avatar}</span>
                    <div>
                      <p className="font-bold text-stone-800 dark:text-stone-100 text-xs sm:text-sm">
                        {t.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-stone-400">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA FINAL */}
      {!isAuthenticated && (
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-stone-900 dark:bg-stone-800"
            >
              <img
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=60&auto=format&fit=crop"
                alt="Champ agricole"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-stone-900/60" />

              <div className="relative z-10 px-6 sm:px-14 py-12 sm:py-20 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
                <div className="text-center lg:text-left max-w-xl">
                  <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
                    Prêt à manger local ?
                  </h2>
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                    Rejoignez des centaines d'acheteurs et d'agriculteurs qui
                    font confiance à AgriConnect chaque jour pour une
                    alimentation saine et locale.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => navigate("/register?role=BUYER")}
                    className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 bg-white text-stone-900 font-bold rounded-2xl hover:bg-stone-100 transition-all duration-200 text-sm shadow-lg hover:-translate-y-0.5"
                  >
                    🛒 Je suis acheteur
                  </button>
                  <button
                    onClick={() => navigate("/register?role=FARMER")}
                    className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-all duration-200 text-sm shadow-lg hover:-translate-y-0.5"
                  >
                    👨‍🌾 Je suis agriculteur
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
