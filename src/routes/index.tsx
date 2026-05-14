import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  Menu,
  X,
  ArrowRight,
  ExternalLink,
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Database,
  LineChart,
  ListOrdered,
  Crown,
  Rss,
  Building2,
  PenLine,
  Link2,
  Settings2,
  Infinity as InfinityIcon,
  BarChart3,
  ShieldCheck,
  Megaphone,
  Sparkles,
  Mail,
  CheckCircle2,
  Plus,
  Minus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Олимпиада аналитиков 2026 — конкурс инвестиционных идей" },
      {
        name: "description",
        content:
          "Открытый конкурс аналитиков по российскому фондовому рынку с призовым фондом 5 400 000 рублей.",
      },
      { property: "og:title", content: "Олимпиада аналитиков 2026" },
      {
        property: "og:description",
        content:
          "Конкурс инвестиционных идей по российскому фондовому рынку. Призовой фонд — 5 400 000 рублей.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: LandingPage,
});

const NAV = [
  { id: "about", label: "О конкурсе" },
  { id: "awards", label: "Награды" },
  { id: "format", label: "Формат" },
  { id: "participation", label: "Участие" },
  { id: "faq", label: "FAQ" },
  { id: "ideas", label: "Идеи" },
] as const;

const EXAMPLES_URL = "https://invest-idei.ru";
const MOEX_URL = "https://www.moex.com";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 72;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors theme="dark" />
      <Header />
      <main>
        <Hero />
        <Awards />
        <Format />
        <Participation />
        <Faq />
        <Ideas />
      </main>
      <Footer />
      <MobileApplyBar />
    </div>
  );
}

/* ---------- HEADER ---------- */

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/75 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <button
          onClick={() => scrollToId("about")}
          className="flex items-center gap-2 group"
          aria-label="Олимпиада аналитиков 2026"
        >
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-gradient-primary shadow-glow">
            <Crown className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display font-bold tracking-tight text-base sm:text-lg">
            Олимпиада <span className="text-gradient-primary">2026</span>
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => scrollToId(n.id)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <a
            href={EXAMPLES_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-surface transition-colors"
          >
            Примеры идей
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={() => scrollToId("apply")}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-lg text-sm font-semibold bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 transition"
          >
            Подать заявку
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-border bg-surface/60"
          aria-label="Меню"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => scrollToId(n.id), 50);
                }}
                className="text-left px-3 py-3 rounded-md text-sm text-foreground hover:bg-surface"
              >
                {n.label}
              </button>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-3">
              <a
                href={EXAMPLES_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center gap-1.5 h-11 rounded-lg text-sm font-medium border border-border"
              >
                Примеры идей
              </a>
              <button
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => scrollToId("apply"), 50);
                }}
                className="inline-flex items-center justify-center gap-1.5 h-11 rounded-lg text-sm font-semibold bg-gradient-primary text-primary-foreground"
              >
                Подать заявку
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- HERO ---------- */

function Hero() {
  return (
    <section
      id="about"
      className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-gradient-hero"
    >
      <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <FloatingCards />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/60 backdrop-blur text-xs font-medium text-muted-foreground animate-slide-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75 animate-pulse-dot" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan" />
            </span>
            Регистрация открыта · Старт — июль 2026
          </div>

          <h1
            className="mt-6 font-display font-extrabold leading-[1.05] tracking-tight text-4xl sm:text-6xl lg:text-7xl animate-slide-up"
            style={{ animationDelay: "60ms" }}
          >
            Сделаем <span className="text-gradient-primary">финансовую аналитику</span>{" "}
            великой снова
          </h1>

          <p
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl animate-slide-up"
            style={{ animationDelay: "120ms" }}
          >
            Открытый конкурс аналитики по российскому фондовому рынку.
          </p>

          <div
            className="mt-8 inline-flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-surface/70 backdrop-blur animate-slide-up"
            style={{ animationDelay: "180ms" }}
          >
            <ShieldCheck className="h-5 w-5 text-accent-cyan shrink-0" />
            <p className="text-sm sm:text-[15px] text-foreground/90">
              Организатор: <span className="font-semibold">Invest-idei.ru</span>{" "}
              <span className="text-muted-foreground">при поддержке</span>{" "}
              <span className="font-semibold">ПАО Московская Биржа</span>
            </p>
          </div>

          <div
            className="mt-8 flex flex-col sm:flex-row gap-3 animate-slide-up"
            style={{ animationDelay: "240ms" }}
          >
            <button
              onClick={() => scrollToId("apply")}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-base font-semibold bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 transition"
            >
              Подать заявку
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={EXAMPLES_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-base font-medium border border-border bg-surface/40 hover:bg-surface transition"
            >
              Посмотреть примеры идей
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div
            className="mt-12 grid grid-cols-3 gap-3 sm:gap-6 max-w-xl animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            {[
              { v: "5,4 млн ₽", l: "Призовой фонд" },
              { v: "6", l: "Награждений" },
              { v: "3", l: "Номинации" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl border border-border bg-surface/60 backdrop-blur px-4 py-3"
              >
                <div className="font-display font-bold text-lg sm:text-xl">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingCards() {
  return (
    <div className="hidden lg:block absolute right-4 xl:right-16 top-28 w-[440px] pointer-events-none">
      <div className="relative h-[460px]">
        <div className="absolute top-0 right-0 w-72 rounded-2xl border border-border bg-surface/80 backdrop-blur-xl p-5 shadow-elegant animate-float-slow">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">Лидерборд · Июль</div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-[oklch(0.85_0.12_85)] border border-gold/30">
              LIVE
            </span>
          </div>
          {[
            { n: "AlphaResearch", v: "+18,4%", icon: <Trophy className="h-3.5 w-3.5 text-gold" /> },
            { n: "MOEX Insights", v: "+14,7%", icon: <Medal className="h-3.5 w-3.5 text-silver" /> },
            { n: "Capital Notes", v: "+11,2%", icon: <Award className="h-3.5 w-3.5 text-bronze" /> },
            { n: "TG · @bonds", v: "+9,8%" },
          ].map((r, i) => (
            <div
              key={r.n}
              className="mt-3 flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2">
                <span className="text-muted-foreground w-4 text-xs">{i + 1}</span>
                {r.icon ?? <span className="w-3.5" />}
                <span className="text-foreground/90">{r.n}</span>
              </span>
              <span className="font-semibold text-accent-cyan">{r.v}</span>
            </div>
          ))}
        </div>

        <div
          className="absolute top-44 right-40 w-64 rounded-2xl border border-border bg-surface/80 backdrop-blur-xl p-5 shadow-elegant animate-float-slow"
          style={{ animationDelay: "1.2s" }}
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>SBER · акции</span>
            <span className="text-accent-cyan">+12,3%</span>
          </div>
          <svg viewBox="0 0 200 60" className="mt-3 w-full h-14">
            <defs>
              <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.66 0.16 250)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="oklch(0.66 0.16 250)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,45 L20,40 L40,42 L60,30 L80,32 L100,22 L120,25 L140,15 L160,18 L180,8 L200,12 L200,60 L0,60 Z"
              fill="url(#g1)"
            />
            <path
              d="M0,45 L20,40 L40,42 L60,30 L80,32 L100,22 L120,25 L140,15 L160,18 L180,8 L200,12"
              fill="none"
              stroke="oklch(0.78 0.12 200)"
              strokeWidth="2"
            />
          </svg>
          <div className="mt-2 text-xs text-muted-foreground">
            Идея: лонг · цель 320 ₽
          </div>
        </div>

        <div
          className="absolute bottom-0 right-12 w-60 rounded-2xl border border-border bg-gradient-gold/10 backdrop-blur-xl p-5 shadow-elegant animate-float-slow"
          style={{ animationDelay: "0.6s", background: "linear-gradient(135deg, oklch(0.85 0.14 85 / 0.18), oklch(0.7 0.16 60 / 0.06))" }}
        >
          <Trophy className="h-6 w-6 text-gold" />
          <div className="mt-2 font-display font-bold text-xl">900 000 ₽</div>
          <div className="text-xs text-muted-foreground mt-1">
            Ежемесячный фонд награждения
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- AWARDS ---------- */

function Awards() {
  const months = [
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];
  return (
    <section id="awards" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrow icon={<Trophy className="h-3.5 w-3.5" />}>Призовой фонд</SectionEyebrow>
        <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl">Награды</h2>

        <div className="mt-10 rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-elegant overflow-hidden relative">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-gold opacity-20 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-sm text-muted-foreground">Общий призовой фонд</div>
              <div className="mt-2 font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight text-gradient-gold leading-none">
                5 400 000 ₽
              </div>
              <div className="mt-3 text-sm sm:text-base text-muted-foreground">
                Олимпиада аналитиков 2026
              </div>
              <div className="mt-2 text-base sm:text-lg font-semibold">
                6 ежемесячных награждений × 900 000 ₽
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>Распределение по месяцам</span>
                <span>900 000 ₽ × 6</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {months.map((m, i) => (
                  <div
                    key={m}
                    className="group relative h-24 rounded-lg border border-border bg-background/40 overflow-hidden"
                  >
                    <div
                      className="absolute inset-x-0 bottom-0 bg-gradient-gold opacity-90"
                      style={{ height: `${60 + i * 5}%` }}
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-2">
                      <div className="text-[10px] font-semibold text-background/90">
                        900к
                      </div>
                      <div className="text-[10px] text-background/80">{m}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-background/60 overflow-hidden">
                <div className="h-full w-full bg-gradient-gold" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <h3 className="font-display font-bold text-2xl sm:text-3xl">Ежемесячные награды</h3>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Каждый месяц мы выбираем лучшие инвестиционные идеи по трём
            направлениям и награждаем авторов за точность, качество аналитики и
            результат.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-5">
            <NominationCard
              tier="gold"
              title="Лучшая идея по акциям"
              prize="500 000 ₽"
              description="Золотая медаль и денежный приз за лучшую инвестиционную идею по акциям."
            />
            <NominationCard
              tier="primary"
              title="Лучшая идея по БПИФ"
              prize="350 000 ₽"
              description="Золотая медаль и денежный приз за лучшую инвестиционную идею по биржевым фондам."
            />
            <NominationCard
              tier="bronze"
              title="Лучшая идея по OTC"
              prize="50 000 ₽"
              description="Золотая медаль и денежный приз за лучшую инвестиционную идею по внебиржевому рынку."
            />
          </div>
        </div>

        <div className="mt-10 inline-flex items-center gap-3 px-5 py-3 rounded-full border border-border bg-surface/70 backdrop-blur">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75 animate-pulse-dot" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-cyan" />
          </span>
          <span className="text-sm sm:text-base">
            Ближайшее награждение —{" "}
            <span className="font-semibold">1 июля 2026 года</span>
          </span>
        </div>
      </div>
    </section>
  );
}

function NominationCard({
  tier,
  title,
  prize,
  description,
}: {
  tier: "gold" | "primary" | "bronze";
  title: string;
  prize: string;
  description: string;
}) {
  const tierStyle =
    tier === "gold"
      ? "from-[oklch(0.85_0.14_85)]/25 to-transparent"
      : tier === "primary"
        ? "from-[oklch(0.66_0.16_250)]/25 to-transparent"
        : "from-[oklch(0.65_0.12_55)]/25 to-transparent";
  return (
    <div className="group relative rounded-2xl border border-border bg-surface p-6 overflow-hidden transition hover:-translate-y-1 hover:border-foreground/20 hover:shadow-elegant">
      <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${tierStyle} opacity-80`} />
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <Trophy className="h-5 w-5 text-gold" />
          <Medal className="h-5 w-5 text-silver" />
          <Award className="h-5 w-5 text-bronze" />
        </div>
        <h4 className="mt-5 font-display font-bold text-xl">{title}</h4>
        <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
          1 место
        </div>
        <div className="font-display font-extrabold text-3xl text-gradient-gold mt-1">
          {prize}
        </div>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        <div className="mt-5 pt-4 border-t border-border text-xs text-muted-foreground">
          Серебро и бронза — признание, статус и публичное упоминание.
        </div>
      </div>
    </div>
  );
}

/* ---------- FORMAT ---------- */

function Format() {
  const steps = [
    { icon: <Rss className="h-5 w-5" />, label: "Источник идеи" },
    { icon: <Database className="h-5 w-5" />, label: "Сбор данных" },
    { icon: <LineChart className="h-5 w-5" />, label: "Оценка результата" },
    { icon: <ListOrdered className="h-5 w-5" />, label: "Рейтинг" },
    { icon: <Medal className="h-5 w-5" />, label: "Награждение" },
  ];
  const dates = [
    "1 июля 2026",
    "1 августа 2026",
    "1 сентября 2026",
    "1 октября 2026",
    "1 ноября 2026",
    "1 декабря 2026",
  ];
  return (
    <section id="format" className="py-20 sm:py-28 bg-surface/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrow icon={<TrendingUp className="h-3.5 w-3.5" />}>Механика</SectionEyebrow>
        <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl">Как устроен конкурс</h2>
        <p className="mt-4 max-w-3xl text-muted-foreground text-base sm:text-lg">
          Мы собираем инвестиционные идеи аналитиков из разных источников: блоги,
          каналы, рассылки, сайты и аналитические сервисы. Затем отслеживаем
          результат этих идей, оцениваем их эффективность и каждый месяц
          определяем победителей.
        </p>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-2 items-stretch">
          {steps.map((s, i) => (
            <div key={s.label} className="relative">
              <div className="rounded-xl border border-border bg-background p-4 sm:p-5 h-full">
                <div className="grid place-items-center w-10 h-10 rounded-lg bg-gradient-primary text-primary-foreground">
                  {s.icon}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">Этап {i + 1}</div>
                <div className="mt-1 font-semibold text-sm">{s.label}</div>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="font-display font-bold text-2xl">График награждений</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            6 ежемесячных награждений по 900 000 ₽. Общий фонд — 5 400 000 ₽.
          </p>
          <div className="mt-6 relative">
            <div className="hidden md:block absolute left-0 right-0 top-7 h-px bg-border" />
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {dates.map((d) => (
                <div key={d} className="relative flex md:flex-col gap-3 md:items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-gold ring-4 ring-background mt-1.5 md:mt-0 shrink-0" />
                  <div className="md:text-center">
                    <div className="text-sm font-semibold">{d}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">900 000 ₽</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- PARTICIPATION ---------- */

function Participation() {
  const cards = [
    {
      icon: <Building2 className="h-5 w-5" />,
      title: "Профессиональные аналитики",
      text: "Сотрудники брокеров, управляющих компаний, банков, инвестиционных домов и других профучастников рынка.",
    },
    {
      icon: <PenLine className="h-5 w-5" />,
      title: "Независимые авторы",
      text: "Финансовые блогеры, авторы Telegram-каналов, рассылок, сайтов и аналитических сервисов.",
    },
    {
      icon: <Link2 className="h-5 w-5" />,
      title: "Автоматический сбор идей",
      text: "Вы можете прислать ссылку на ваш ресурс, и мы сможем автоматически забирать ваши идеи из открытых источников.",
    },
    {
      icon: <Settings2 className="h-5 w-5" />,
      title: "Индивидуальная интеграция",
      text: "Можно связаться с нами и настроить удобный формат взаимодействия: фид, рассылка, API, таблица или другой способ передачи идей.",
    },
    {
      icon: <InfinityIcon className="h-5 w-5" />,
      title: "Без ограничения по количеству идей",
      text: "Один участник может отправлять любое количество идей, получать несколько наград и побеждать каждый месяц.",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Акции, БПИФ и OTC",
      text: "Принимаются идеи по акциям и БПИФ, торгуемым на Московской бирже, а также идеи по внебиржевому рынку OTC.",
    },
  ];
  const benefits = [
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Знак качества",
      text: "Независимая оценка вашей аналитики и публичное подтверждение качества инвестиционных идей.",
    },
    {
      icon: <Megaphone className="h-5 w-5" />,
      title: "Продвижение бренда",
      text: "Ваши идеи, имя, канал или компания получают дополнительное внимание профессионального инвестиционного сообщества.",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Награды и признание",
      text: "Денежные призы, медали, статус победителя и регулярное попадание в рейтинг лучших аналитиков рынка.",
    },
  ];
  return (
    <section id="participation" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrow icon={<Crown className="h-3.5 w-3.5" />}>Участие</SectionEyebrow>
        <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl">
          Кто может участвовать
        </h2>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-border bg-surface p-6 transition hover:border-foreground/20 hover:-translate-y-0.5"
            >
              <div className="grid place-items-center w-11 h-11 rounded-lg bg-background border border-border text-accent-cyan">
                {c.icon}
              </div>
              <h3 className="mt-5 font-display font-semibold text-lg">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="font-display font-bold text-2xl sm:text-3xl">Что получает участник</h3>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="relative rounded-2xl border border-border bg-gradient-to-b from-surface-2 to-surface p-6 overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-primary opacity-15 blur-2xl" />
                <div className="relative">
                  <div className="grid place-items-center w-11 h-11 rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
                    {b.icon}
                  </div>
                  <h4 className="mt-5 font-display font-semibold text-lg">{b.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => scrollToId("apply")}
            className="inline-flex items-center gap-2 h-12 px-7 rounded-xl text-base font-semibold bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 transition"
          >
            Подать заявку
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

const FAQ_ITEMS = [
  {
    q: "Как принять участие?",
    a: "Оставьте заявку на сайте и укажите ссылку на ваш блог, канал, сайт, компанию или аналитический сервис. Мы свяжемся с вами и подскажем, как ваши идеи могут попадать в конкурс.",
  },
  {
    q: "Какие идеи принимаются?",
    a: "Мы принимаем инвестиционные идеи по акциям, БПИФ и инструментам внебиржевого рынка OTC, связанным с российским фондовым рынком и Московской биржей.",
  },
  {
    q: "Нужно ли отправлять каждую идею вручную?",
    a: "Не обязательно. Вы можете прислать ссылку на ваш публичный ресурс, и мы сможем настроить автоматический сбор идей. При необходимости можно согласовать отдельный формат передачи данных.",
  },
  {
    q: "Как считается доходность идеи?",
    a: "Доходность идеи оценивается по изменению цены инструмента после публикации идеи с учётом правил конкурса. Детальная методология будет описана в правилах конкурса.",
  },
  {
    q: "Можно ли получить несколько наград?",
    a: "Да. Количество идей не ограничено. Один участник может получить несколько наград в разных номинациях или побеждать в разные месяцы.",
  },
  {
    q: "Кто организатор конкурса?",
    a: "Организатор конкурса — Invest-idei.ru при поддержке ПАО Московская Биржа.",
  },
  {
    q: "Где посмотреть правила конкурса?",
    a: "Правила конкурса будут доступны по отдельной ссылке: «Правила конкурса».",
  },
];

function Faq() {
  const [open, setOpen] = useState<number[]>([0]);
  const toggle = (i: number) =>
    setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  return (
    <section id="faq" className="py-20 sm:py-28 bg-surface/40 border-y border-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrow icon={<Sparkles className="h-3.5 w-3.5" />}>FAQ</SectionEyebrow>
        <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl">
          Справка и частые вопросы
        </h2>

        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open.includes(i);
            return (
              <div
                key={item.q}
                className="rounded-xl border border-border bg-background overflow-hidden"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <h3 className="font-semibold text-base sm:text-lg">{item.q}</h3>
                  <span className="grid place-items-center w-8 h-8 rounded-lg border border-border shrink-0">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- IDEAS + FORM ---------- */

const applicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Введите ваше имя" })
    .max(200, { message: "Имя слишком длинное" }),
  status: z.enum(["Частный аналитик", "Профучастник"], {
    errorMap: () => ({ message: "Выберите статус" }),
  }),
  link: z
    .string()
    .trim()
    .min(1, { message: "Укажите ссылку на ваш ресурс" })
    .max(500, { message: "Ссылка слишком длинная" })
    .url({ message: "Введите корректную ссылку" }),
});

function Ideas() {
  return (
    <section id="ideas" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrow icon={<LineChart className="h-3.5 w-3.5" />}>Идеи</SectionEyebrow>
        <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl">
          Какие идеи участвуют в конкурсе
        </h2>
        <p className="mt-4 max-w-3xl text-muted-foreground text-base sm:text-lg">
          Мы принимаем публичные и партнёрские инвестиционные идеи по акциям,
          БПИФ и OTC-инструментам российского рынка. Идея может быть опубликована
          в Telegram-канале, блоге, рассылке, аналитическом сервисе, на сайте
          компании или передана через согласованный формат.
        </p>

        <div className="mt-6">
          <a
            href={EXAMPLES_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-medium border border-border bg-surface/40 hover:bg-surface transition"
          >
            Посмотреть примеры идей
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <ApplyForm />
      </div>
    </section>
  );
}

function ApplyForm() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = applicationSchema.safeParse({ name, status, link });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("applications").insert({
      name: parsed.data.name,
      status: parsed.data.status,
      link: parsed.data.link,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Не удалось отправить заявку. Попробуйте ещё раз.");
      return;
    }
    setSuccess(true);
    setName("");
    setStatus("");
    setLink("");
    toast.success("Спасибо! Заявка отправлена.");
  };

  return (
    <div
      id="apply"
      className="mt-16 scroll-mt-24 rounded-3xl border border-border bg-surface shadow-elegant overflow-hidden"
    >
      <div className="grid lg:grid-cols-5">
        <div className="lg:col-span-2 p-8 sm:p-10 bg-gradient-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Заявка
            </div>
            <h3 className="mt-5 font-display font-bold text-2xl sm:text-3xl leading-tight">
              Оставить заявку на участие
            </h3>
            <p className="mt-3 text-sm sm:text-base text-primary-foreground/85">
              Расскажите, кто вы и где публикуете свои инвестиционные идеи.
              Мы свяжемся с вами и подскажем следующий шаг.
            </p>
            <div className="mt-8 space-y-3 text-sm text-primary-foreground/85">
              {[
                "Призовой фонд 5 400 000 ₽",
                "6 ежемесячных награждений",
                "Независимая оценка качества",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 p-8 sm:p-10">
          {success ? (
            <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center">
              <div className="grid place-items-center w-14 h-14 rounded-full bg-gradient-gold text-background">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h4 className="mt-5 font-display font-bold text-xl">
                Спасибо! Заявка отправлена.
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Мы свяжемся с вами.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 text-sm text-accent-cyan hover:underline"
              >
                Отправить ещё одну заявку
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} className="space-y-5" noValidate>
              <Field
                id="name"
                label="Ваше имя"
                error={errors.name}
              >
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Иванов"
                  className="w-full h-12 px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                  aria-invalid={!!errors.name}
                  required
                />
              </Field>

              <Field id="status" label="Статус" error={errors.status}>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                  aria-invalid={!!errors.status}
                  required
                >
                  <option value="" disabled>
                    Выберите статус
                  </option>
                  <option value="Частный аналитик">Частный аналитик</option>
                  <option value="Профучастник">Профучастник</option>
                </select>
              </Field>

              <Field
                id="link"
                label="Ссылка на компанию, блог, канал или сайт"
                error={errors.link}
              >
                <input
                  id="link"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://t.me/your_channel"
                  className="w-full h-12 px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                  aria-invalid={!!errors.link}
                  required
                />
              </Field>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl text-base font-semibold bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 transition disabled:opacity-60"
              >
                {submitting ? "Отправляем..." : "Отправить заявку"}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>
              <p className="text-xs text-muted-foreground">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- FOOTER ---------- */

function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <span className="grid place-items-center w-9 h-9 rounded-lg bg-gradient-primary">
                <Crown className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="font-display font-bold text-lg">
                Олимпиада <span className="text-gradient-primary">2026</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              Открытый конкурс аналитики по российскому фондовому рынку.
              Организатор — Invest-idei.ru при поддержке ПАО Московская Биржа.
            </p>
            <a
              href="mailto:konkurs@invest-idei.ru"
              className="mt-5 inline-flex items-center gap-2 text-sm text-foreground hover:text-accent-cyan transition-colors"
            >
              <Mail className="h-4 w-4" />
              konkurs@invest-idei.ru
            </a>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Разделы
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => scrollToId(n.id)}
                    className="text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Документы и ресурсы
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={MOEX_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-foreground/80 hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  Информация на сайте Мосбиржи
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
                  Правила конкурса
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
                  Документация
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
                  Политика обработки персональных данных
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© 2026 Олимпиада аналитиков. Все права защищены.</div>
          <div>Invest-idei.ru × ПАО Московская Биржа</div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- MOBILE STICKY APPLY ---------- */

function MobileApplyBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40">
      <button
        onClick={() => scrollToId("apply")}
        className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold bg-gradient-primary text-primary-foreground shadow-glow"
      >
        Подать заявку
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ---------- helpers ---------- */

function SectionEyebrow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/60 text-xs font-medium text-muted-foreground">
      {icon}
      {children}
    </div>
  );
}
