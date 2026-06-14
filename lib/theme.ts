/** RotaFlow app UI tokens — dark glass theme (matches landing page) */

export const lux = {
  shell: "landing-theme relative min-h-screen overflow-x-hidden bg-background text-foreground",

  main: "relative z-10 min-h-screen bg-transparent",

  card: "glass-card rounded-3xl p-6",

  cardInteractive:
    "glass-card rounded-3xl p-6 transition-all duration-200 hover:border-white/20",

  btnPrimary:
    "btn-glow inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50",

  btnSecondary:
    "inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-muted-foreground transition duration-200 hover:border-white/20 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50",

  btnDanger:
    "inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50",

  input:
    "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",

  inputError:
    "w-full rounded-2xl border border-red-500/40 bg-white/5 px-4 py-3 text-sm text-foreground focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/20",

  pageTitle: "font-display text-4xl tracking-tight text-foreground sm:text-[2.75rem]",

  pageSubtitle: "mt-2 text-sm font-normal leading-relaxed text-muted-foreground",

  sectionTitle: "font-display text-xl tracking-tight text-foreground",

  sectionSubtitle: "mt-1 text-xs font-normal text-muted-foreground",

  pageHeader: "mb-8 border-b border-white/10 pb-8",

  link: "font-medium text-primary transition hover:text-foreground",

  linkArrow: "font-medium text-primary transition hover:text-foreground",

  bannerWarning:
    "rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-normal text-amber-200",

  bannerError:
    "rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300",

  alertWarning:
    "rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200",

  tooltip: "glass-card rounded-2xl px-3 py-2 text-sm",

  navActive:
    "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-foreground",

  navInactive:
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground",

  tableHead:
    "border-b border-white/10 text-xs font-medium uppercase tracking-wider text-muted-foreground",

  tableRow: "border-b border-white/5",

  iconBadge: "rounded-2xl p-2",

  eyebrow:
    "inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground",
} as const;
