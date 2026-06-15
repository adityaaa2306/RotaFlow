/** RotaFlow app UI tokens — light theme for app pages; landing uses dark gradient separately */

export const lux = {
  shell: "min-h-screen bg-neutral-50",

  main: "min-h-screen bg-neutral-50",

  card: "rounded-[1.75rem] border border-slate-200/60 bg-white p-6 shadow-lux",

  cardInteractive:
    "rounded-[1.75rem] border border-slate-200/60 bg-white p-6 shadow-lux transition-all duration-200 hover:border-slate-300/80 hover:shadow-lux-lg",

  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-[#2A85FF] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(42,133,255,0.35)] transition duration-200 hover:bg-[#2270E0] disabled:cursor-not-allowed disabled:opacity-50",

  btnSecondary:
    "inline-flex items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white px-6 py-2.5 text-sm font-medium text-[#334155] transition duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50",

  btnDanger:
    "inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50",

  input:
    "w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-slate-400 transition focus:border-[#2A85FF] focus:outline-none focus:ring-2 focus:ring-[#2A85FF]/15",

  inputError:
    "w-full rounded-2xl border border-red-300 bg-white px-4 py-3 text-sm text-[#1A1A1A] focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20",

  pageTitle: "text-4xl font-bold tracking-tight text-ink sm:text-[2.75rem]",

  pageSubtitle: "mt-2 text-sm font-normal leading-relaxed text-flow-navy/70",

  sectionTitle: "text-xl font-semibold tracking-tight text-ink",

  sectionSubtitle: "mt-1 text-xs font-normal text-slate-500",

  pageHeader: "mb-8 border-b border-slate-200/60 pb-8",

  link: "font-medium text-flow-navy transition hover:text-rota-blue",

  linkArrow: "font-medium text-flow-navy transition hover:text-rota-blue",

  bannerWarning:
    "rounded-full border border-amber-200/80 bg-amber-50 px-5 py-2.5 text-sm font-normal text-amber-900",

  bannerError:
    "rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700",

  alertWarning:
    "rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800",

  tooltip:
    "rounded-2xl border border-slate-200/60 bg-white px-3 py-2 text-sm shadow-lux",

  navActive:
    "inline-flex items-center gap-2 rounded-full bg-[#334155] px-4 py-2 text-sm font-medium text-white shadow-sm",

  navInactive:
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-flow-navy",

  tableHead:
    "border-b border-slate-200/60 text-xs font-medium uppercase tracking-wider text-slate-500",

  tableRow: "border-b border-slate-100/80",

  iconBadge: "rounded-2xl p-2",

  eyebrow:
    "inline-flex rounded-full border border-slate-200/80 bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-slate-500",

  label: "mb-1 block text-sm font-medium text-slate-700",

  labelRequired: "ml-0.5 text-red-500",

  fieldError: "mt-1 text-xs text-red-500",

  formTitle: "mb-4 text-base font-semibold tracking-tight text-neutral-900",

  tag:
    "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700",

  mutedText: "text-sm text-slate-500",

  divider: "h-px flex-1 bg-slate-200",
} as const;
