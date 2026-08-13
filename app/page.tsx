"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import type { ReactNode } from "react";

import {
  ArrowRight,
  Play,
  ShieldCheck,
  LockKeyhole,
  Zap,
  Sparkles,
  UploadCloud,
  ClipboardCheck,
  Gauge,
  LayoutDashboard,
  FileText,
  Check,
  Mail,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";

import { useSession } from "next-auth/react";
import { toast } from "sonner";

/* =========================================================
   NAVIGATION
========================================================= */

const navItems = [
  {
    label: "How it works",
    id: "how-it-works",
  },
  {
    label: "Pricing",
    id: "pricing",
  },
  {
    label: "Contact",
    id: "contact",
  },
];

/* =========================================================
   LANDING PAGE
========================================================= */

export default function LandingPage() {
  const reduceMotion = useReducedMotion();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;

  /* =======================================================
     SMOOTH SCROLL
  ======================================================= */

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* =======================================================
     HERO REVEAL
  ======================================================= */

  const reveal = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 18,
    },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.75,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <main
      id="top"
      className="
        min-h-screen
        overflow-x-hidden
        bg-white
        text-slate-950
      "
    >
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-[1380px] px-5 pt-4 sm:px-6">
          <div
            className="
              relative
              flex
              h-[64px]
              items-center
              rounded-full
              border
              border-slate-200/80
              bg-white/80
              px-3
              shadow-[0_8px_30px_rgba(15,23,42,0.06)]
              backdrop-blur-2xl
            "
          >
            {/* =================================================
                LOGO
            ================================================= */}

            <button
              type="button"
              onClick={() => scrollTo("top")}
              className="
                group
                flex
                items-center
                gap-3
                rounded-full
                px-2
                outline-none
              "
            >
              <span
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-[11px]
                  bg-[#0f172a]
                  text-[13px]
                  font-bold
                  tracking-[-0.04em]
                  text-white
                  shadow-[0_4px_12px_rgba(15,23,42,0.15)]
                  transition-transform
                  duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover:scale-[1.04]
                "
              >
                IF
              </span>

              <span
                className="
                  text-[18px]
                  font-semibold
                  tracking-[-0.035em]
                  text-slate-950
                "
              >
                InvoiceFlow
              </span>
            </button>

            {/* =================================================
                CENTER NAV
            ================================================= */}

            <nav
              className="
                absolute
                left-1/2
                hidden
                -translate-x-1/2
                items-center
                gap-0.5
                rounded-full
                bg-slate-100/80
                p-1
                lg:flex
              "
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className="
                    relative
                    flex
                    h-9
                    items-center
                    justify-center
                    whitespace-nowrap
                    rounded-full
                    px-4
                    text-[13px]
                    font-medium
                    text-slate-600
                    outline-none
                    transition-all
                    duration-300
                    ease-out
                    hover:bg-white
                    hover:text-slate-950
                    hover:shadow-[0_2px_8px_rgba(15,23,42,0.06)]
                    active:scale-[0.97]
                  "
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* =================================================
                RIGHT
            ================================================= */}

            <div className="ml-auto flex items-center gap-1">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="
                    group
                    flex
                    h-10
                    items-center
                    gap-2
                    rounded-full
                    bg-[#0f172a]
                    px-5
                    text-[13px]
                    font-semibold
                    text-white
                    shadow-[0_5px_18px_rgba(15,23,42,0.14)]
                    transition-all
                    duration-300
                    ease-out
                    hover:bg-[#1e293b]
                    hover:shadow-[0_8px_24px_rgba(15,23,42,0.20)]
                    active:scale-[0.97]
                  "
                >
                  Dashboard
                  <ArrowRight
                    size={15}
                    strokeWidth={2}
                    className="
                      transition-transform
                      duration-300
                      ease-out
                      group-hover:translate-x-0.5
                    "
                  />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="
                      hidden
                      rounded-full
                      px-4
                      py-2.5
                      text-[13px]
                      font-medium
                      text-slate-700
                      transition-colors
                      duration-300
                      hover:text-slate-950
                      sm:block
                    "
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/signup"
                    className="
                      group
                      flex
                      h-10
                      items-center
                      gap-2
                      rounded-full
                      bg-[#0f172a]
                      px-5
                      text-[13px]
                      font-semibold
                      text-white
                      shadow-[0_5px_18px_rgba(15,23,42,0.14)]
                      transition-all
                      duration-300
                      ease-out
                      hover:bg-[#1e293b]
                      hover:shadow-[0_8px_24px_rgba(15,23,42,0.20)]
                      active:scale-[0.97]
                    "
                  >
                    Get started

                    <ArrowRight
                      size={15}
                      strokeWidth={2}
                      className="
                        transition-transform
                        duration-300
                        ease-out
                        group-hover:translate-x-0.5
                      "
                    />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          PAGE 1 — HERO
      ===================================================== */}

      <section
        id="hero"
        className="
          relative
          min-h-screen
          overflow-hidden
          px-5
          pb-24
          pt-[150px]
          sm:px-6
          sm:pb-32
        "
      >
        {/* =================================================
            BACKGROUND ATMOSPHERE
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[270px]
            h-[650px]
            w-[1050px]
            -translate-x-1/2
            rounded-full
            bg-blue-100/70
            blur-[135px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[440px]
            h-[520px]
            w-[850px]
            -translate-x-1/2
            rounded-full
            bg-indigo-100/50
            blur-[125px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[430px]
            h-[700px]
            w-[1450px]
            -translate-x-1/2
            rounded-[50%]
            border
            border-blue-100/70
          "
        />

        {/* =================================================
            HERO CONTENT
        ================================================= */}

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-[1200px]
            text-center
          "
        >
          {/* BADGE */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={reveal}
            className="
              mx-auto
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-blue-200/80
              bg-white/75
              px-4
              py-2
              text-[12px]
              font-medium
              text-blue-600
              shadow-[0_5px_25px_rgba(37,99,235,0.07)]
              backdrop-blur-xl
            "
          >
            <Sparkles
              size={14}
              strokeWidth={1.8}
            />

            Modern invoice processing, reimagined
          </motion.div>

          {/* HEADING */}

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{
              delay: reduceMotion ? 0 : 0.06,
            }}
            className="
              mx-auto
              mt-7
              max-w-[1050px]
              text-[58px]
              font-semibold
              leading-[0.98]
              tracking-[-0.065em]
              text-[#080d18]
              sm:text-[76px]
              md:text-[90px]
              lg:text-[104px]
            "
          >
            Every invoice.
            <br />

            <span
              className="
                bg-gradient-to-r
                from-[#126cff]
                via-[#3964ff]
                to-[#6547f5]
                bg-clip-text
                text-transparent
              "
            >
              One workflow.
            </span>
          </motion.h1>

          {/* DESCRIPTION */}

          <motion.p
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{
              delay: reduceMotion ? 0 : 0.12,
            }}
            className="
              mx-auto
              mt-7
              max-w-[620px]
              text-[16px]
              leading-7
              text-slate-500
              sm:text-[18px]
            "
          >
            Upload CSV files, validate invoice data,
            detect errors, and process thousands of
            invoices with speed, accuracy, and confidence.
          </motion.p>

          {/* CTA */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{
              delay: reduceMotion ? 0 : 0.18,
            }}
            className="
    mt-8
    flex
    flex-col
    items-center
    justify-center
    gap-3
    sm:flex-row
  "
          >
            <Link
              href="/signup"
              className="
      group
      flex
      h-12
      items-center
      gap-2
      rounded-[14px]
      bg-[#0f172a]
      px-6
      text-[14px]
      font-semibold
      text-white
      shadow-[0_10px_30px_rgba(15,23,42,0.16)]
      transition-all
      duration-300
      ease-out
      hover:-translate-y-0.5
      hover:bg-[#1e293b]
      hover:shadow-[0_14px_35px_rgba(15,23,42,0.20)]
      active:scale-[0.98]
    "
            >
              Get started for free

              <ArrowRight
                size={16}
                strokeWidth={2}
                className="
        transition-transform
        duration-300
        group-hover:translate-x-0.5
      "
              />
            </Link>
          </motion.div>

          {/* TRUST */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{
              delay: reduceMotion ? 0 : 0.24,
            }}
            className="
              mt-8
              flex
              flex-wrap
              items-center
              justify-center
              gap-x-7
              gap-y-3
              text-[12px]
              text-slate-500
            "
          >
            <TrustItem
              icon={<ShieldCheck size={17} />}
              text="No credit card required"
            />

            <span className="hidden h-4 w-px bg-slate-200 sm:block" />

            <TrustItem
              icon={<LockKeyhole size={16} />}
              text="Bank-level security"
            />

            <span className="hidden h-4 w-px bg-slate-200 sm:block" />

            <TrustItem
              icon={<Zap size={17} />}
              text="Setup in 60 seconds"
            />
          </motion.div>

          {/* DASHBOARD */}

          <motion.div
            id="dashboard"
            initial={{
              opacity: 0,
              y: reduceMotion ? 0 : 35,
              scale: reduceMotion ? 1 : 0.985,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              delay: reduceMotion ? 0 : 0.3,
              duration: reduceMotion ? 0 : 0.9,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="
              relative
              mx-auto
              mt-14
              max-w-[1280px]
              scroll-mt-28
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -inset-14
                rounded-[60px]
                bg-gradient-to-b
                from-blue-300/25
                via-indigo-200/20
                to-transparent
                blur-[75px]
              "
            />

            <div
              className="
                relative
                overflow-hidden
                rounded-[26px]
                border
                border-slate-200/80
                bg-white
                shadow-[0_45px_120px_rgba(15,23,42,0.15)]
                transition-transform
                duration-700
                ease-[cubic-bezier(0.22,1,0.36,1)]
                hover:-translate-y-1
              "
            >
              <Image
                src="/images/dashboard.png"
                alt="InvoiceFlow dashboard"
                width={1544}
                height={1019}
                priority
                sizes="(max-width: 640px) 94vw, (max-width: 1280px) 94vw, 1280px"
                className="
                  block
                  h-auto
                  w-full
                "
              />
            </div>
          </motion.div>
        </div>
      </section>



      {/* =====================================================
          PAGE 3 — HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="
          relative
          scroll-mt-24
          overflow-hidden
          bg-[#f8fafc]
          px-5
          pb-32
          pt-32
          sm:px-6
          sm:pb-40
        "
      >
        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[180px]
            h-[650px]
            w-[1100px]
            -translate-x-1/2
            rounded-full
            bg-blue-100/60
            blur-[140px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[620px]
            h-[550px]
            w-[900px]
            -translate-x-1/2
            rounded-full
            bg-indigo-100/50
            blur-[140px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[380px]
            h-[650px]
            w-[1500px]
            -translate-x-1/2
            rounded-[50%]
            border
            border-blue-100/70
          "
        />

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-[1200px]
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: reduceMotion ? 0 : 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.75,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="text-center"
          >
            <div
              className="
                mx-auto
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-blue-200/80
                bg-white/80
                px-4
                py-2
                text-[12px]
                font-medium
                text-blue-600
                shadow-[0_5px_25px_rgba(37,99,235,0.06)]
                backdrop-blur-xl
              "
            >
              <Zap
                size={14}
                strokeWidth={1.8}
              />

              How it works
            </div>

            <h2
              className="
                mx-auto
                mt-7
                max-w-[900px]
                text-[48px]
                font-semibold
                leading-[1.02]
                tracking-[-0.055em]
                text-[#080d18]
                sm:text-[60px]
                lg:text-[70px]
              "
            >
              From CSV to processed
              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-[#126cff]
                  via-[#3964ff]
                  to-[#6547f5]
                  bg-clip-text
                  text-transparent
                "
              >
                in minutes.
              </span>
            </h2>

            <p
              className="
                mx-auto
                mt-7
                max-w-[620px]
                text-[16px]
                leading-7
                text-slate-500
                sm:text-[17px]
              "
            >
              A simple workflow designed to take your
              invoice data from upload to completion
              without the manual work.
            </p>
          </motion.div>

          {/* =================================================
              FOUR STEPS
          ================================================= */}

          <div className="relative mt-20">
            {/* Connecting line */}

            <div
              className="
                absolute
                left-[12.5%]
                right-[12.5%]
                top-[43px]
                hidden
                h-px
                bg-gradient-to-r
                from-transparent
                via-blue-200
                to-transparent
                lg:block
              "
            />

            <div
              className="
                grid
                gap-5
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >
              <HowItWorksStep
                id="upload"
                number="01"
                title="Upload"
                description="Drop your CSV file into InvoiceFlow and start processing instantly."
                icon={<UploadCloud size={25} />}
                iconClass="bg-blue-50 text-blue-600"
                delay={0}
              />

              <HowItWorksStep
                id="validation"
                number="02"
                title="Validate"
                description="InvoiceFlow checks every row for missing data, errors, and invalid information."
                icon={<ClipboardCheck size={25} />}
                iconClass="bg-violet-50 text-violet-600"
                delay={0.08}
              />

              <HowItWorksStep
                id="processing"
                number="03"
                title="Process"
                description="Thousands of valid invoices are processed automatically through one workflow."
                icon={<Gauge size={25} />}
                iconClass="bg-indigo-50 text-indigo-600"
                delay={0.16}
              />

              <HowItWorksStep
                id="invoices"
                number="04"
                title="Review"
                description="See results, errors, success rates, and processing activity from your dashboard."
                icon={<LayoutDashboard size={25} />}
                iconClass="bg-emerald-50 text-emerald-600"
                delay={0.24}
              />
            </div>
          </div>

          {/* =================================================
              LARGE WORKFLOW CARD
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: reduceMotion ? 0 : 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.8,
              delay: reduceMotion ? 0 : 0.15,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="
              relative
              mt-8
              overflow-hidden
              rounded-[28px]
              border
              border-slate-200/80
              bg-white
              shadow-[0_25px_70px_rgba(15,23,42,0.08)]
            "
          >
            {/* Background glow */}

            <div
              className="
                pointer-events-none
                absolute
                right-[-120px]
                top-[-160px]
                h-[400px]
                w-[400px]
                rounded-full
                bg-blue-100/60
                blur-[100px]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-[-180px]
                left-[-100px]
                h-[400px]
                w-[400px]
                rounded-full
                bg-indigo-100/50
                blur-[100px]
              "
            />

            <div
              className="
                relative
                grid
                min-h-[390px]
                lg:grid-cols-[0.85fr_1.15fr]
              "
            >
              {/* =================================================
                  LEFT
              ================================================= */}

              <div
                className="
                  flex
                  flex-col
                  justify-center
                  p-8
                  sm:p-10
                  lg:p-14
                "
              >
                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-[15px]
                    bg-blue-50
                    text-blue-600
                  "
                >
                  <Zap
                    size={24}
                    strokeWidth={1.8}
                  />
                </div>

                <h3
                  className="
                    mt-6
                    max-w-[430px]
                    text-[30px]
                    font-semibold
                    leading-[1.08]
                    tracking-[-0.045em]
                    text-slate-950
                    sm:text-[36px]
                  "
                >
                  Everything happens
                  <br />

                  <span
                    className="
                      bg-gradient-to-r
                      from-blue-600
                      to-indigo-600
                      bg-clip-text
                      text-transparent
                    "
                  >
                    in one workflow.
                  </span>
                </h3>

                <p
                  className="
                    mt-5
                    max-w-[430px]
                    text-[14px]
                    leading-6
                    text-slate-500
                    sm:text-[15px]
                  "
                >
                  No spreadsheets scattered across folders.
                  No repetitive validation. No guessing what
                  happened to your invoices.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  <WorkflowPill text="Automatic validation" />
                  <WorkflowPill text="Real-time progress" />
                  <WorkflowPill text="Error detection" />
                </div>
              </div>

              {/* =================================================
                  RIGHT VISUAL
              ================================================= */}

              <div
                className="
                  relative
                  flex
                  min-h-[340px]
                  items-center
                  justify-center
                  overflow-hidden
                  border-t
                  border-slate-100
                  bg-slate-50/60
                  p-8
                  lg:border-l
                  lg:border-t-0
                "
              >
                {/* Outer circle */}

                <div
                  className="
                    absolute
                    h-[310px]
                    w-[310px]
                    rounded-full
                    border
                    border-blue-100
                    bg-white/60
                    shadow-[0_20px_60px_rgba(37,99,235,0.08)]
                  "
                />

                {/* Inner circle */}

                <div
                  className="
                    absolute
                    h-[220px]
                    w-[220px]
                    rounded-full
                    border
                    border-blue-100/80
                  "
                />

                {/* Workflow */}

                <div
                  className="
                    relative
                    z-10
                    flex
                    max-w-full
                    items-center
                    gap-2
                    sm:gap-4
                  "
                >
                  <WorkflowNode
                    icon={<UploadCloud size={20} />}
                    label="Upload"
                    active
                  />

                  <ArrowRight
                    size={16}
                    className="shrink-0 text-blue-300"
                  />

                  <WorkflowNode
                    icon={<ClipboardCheck size={20} />}
                    label="Validate"
                    active
                  />

                  <ArrowRight
                    size={16}
                    className="shrink-0 text-blue-300"
                  />

                  <WorkflowNode
                    icon={<Gauge size={20} />}
                    label="Process"
                    active
                  />

                  <ArrowRight
                    size={16}
                    className="shrink-0 text-blue-300"
                  />

                  <WorkflowNode
                    icon={<FileText size={20} />}
                    label="Done"
                    success
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* =================================================
              BOTTOM STATS
          ================================================= */}

          <div
            className="
              mt-6
              grid
              overflow-hidden
              rounded-[22px]
              border
              border-slate-200/80
              bg-white
              sm:grid-cols-3
            "
          >
            <WorkflowStat
              value="60 sec"
              label="Average setup time"
            />

            <WorkflowStat
              value="100%"
              label="Automated validation"
              border
            />

            <WorkflowStat
              value="10K+"
              label="Invoices processed"
              border
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          PAGE 4 — PRICING
      ===================================================== */}

      <section
        id="pricing"
        className="
          relative
          scroll-mt-24
          overflow-hidden
          bg-white
          px-5
          pb-32
          pt-32
          sm:px-6
          sm:pb-40
        "
      >
        {/* Apple-style atmosphere */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[180px]
            h-[600px]
            w-[1050px]
            -translate-x-1/2
            rounded-full
            bg-blue-50/80
            blur-[130px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[420px]
            h-[480px]
            w-[800px]
            -translate-x-1/2
            rounded-full
            bg-indigo-50/60
            blur-[130px]
          "
        />

        <div className="relative z-10 mx-auto max-w-[1120px]">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: reduceMotion ? 0 : 0.75,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="text-center"
          >
            <div
              className="
                mx-auto flex w-fit items-center gap-2 rounded-full
                border border-blue-200/80 bg-white/80 px-4 py-2
                text-[12px] font-medium text-blue-600
                shadow-[0_5px_25px_rgba(37,99,235,0.06)]
                backdrop-blur-xl
              "
            >
              <Sparkles size={14} strokeWidth={1.8} />
              Simple pricing
            </div>

            <h2
              className="
                mx-auto mt-7 max-w-[820px]
                text-[48px] font-semibold leading-[1.02]
                tracking-[-0.055em] text-[#080d18]
                sm:text-[60px] lg:text-[68px]
              "
            >
              Start simple.
              <br />
              <span
                className="
                  bg-gradient-to-r from-[#126cff] via-[#3964ff] to-[#6547f5]
                  bg-clip-text text-transparent
                "
              >
                Scale when you need to.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-[590px] text-[16px] leading-7 text-slate-500 sm:text-[17px]">
              Everything you need to process invoices without complicated
              pricing or unnecessary features.
            </p>
          </motion.div>

          <div className="mx-auto mt-16 grid max-w-[900px] gap-5 md:grid-cols-2">
            <PricingCard
              name="Starter"
              description="For individuals and small teams getting started."
              price="Free"
              suffix="forever"
              features={[
                "CSV invoice uploads",
                "Basic invoice validation",
                "Dashboard overview",
                "Invoice history",
                "Secure account",
              ]}
              button="Get started free"
              href={status === "loading" ? "#" : (isAuthenticated ? "/dashboard" : "/signup")}
            />

            <PricingCard
              featured
              name="Pro"
              description="For teams processing invoices at scale."
              price="₹999"
              suffix="/ month"
              features={[
                "Everything in Starter",
                "Large CSV processing",
                "Advanced validation",
                "Detailed processing insights",
                "Priority support",
              ]}
              button="Start with Pro"
              href={status === "loading" ? "#" : (isAuthenticated ? "#" : "/signup")}
              onClick={
                isAuthenticated
                  ? (e) => {
                      e.preventDefault();
                      toast.info("Pro plan is not available yet");
                    }
                  : undefined
              }
            />
          </div>

          <p className="mt-7 text-center text-[12px] text-slate-400">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* =====================================================
          PAGE 5 — CONTACT
      ===================================================== */}

      <section
        id="contact"
        className="
          relative
          scroll-mt-24
          overflow-hidden
          bg-white
          px-5
          pb-32
          pt-32
          sm:px-6
          sm:pb-40
        "
      >
        <div
          className="
            pointer-events-none absolute left-1/2 top-[120px]
            h-[620px] w-[1000px] -translate-x-1/2
            rounded-full bg-blue-100/60 blur-[140px]
          "
        />

        <div className="relative z-10 mx-auto max-w-[1120px]">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: reduceMotion ? 0 : 0.75,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="text-center"
          >
            <div
              className="
                mx-auto flex w-fit items-center gap-2 rounded-full
                border border-blue-200/80 bg-white/80 px-4 py-2
                text-[12px] font-medium text-blue-600
                shadow-[0_5px_25px_rgba(37,99,235,0.06)]
                backdrop-blur-xl
              "
            >
              <MessageSquare size={14} strokeWidth={1.8} />
              Contact
            </div>

            <h2
              className="
                mx-auto mt-7 max-w-[800px]
                text-[48px] font-semibold leading-[1.02]
                tracking-[-0.055em] text-[#080d18]
                sm:text-[60px] lg:text-[68px]
              "
            >
              Let’s build a better
              <br />
              <span
                className="
                  bg-gradient-to-r from-[#126cff] via-[#3964ff] to-[#6547f5]
                  bg-clip-text text-transparent
                "
              >
                invoice workflow.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-[590px] text-[16px] leading-7 text-slate-500 sm:text-[17px]">
              Have a question, need help, or want to talk about InvoiceFlow?
              We’d love to hear from you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: reduceMotion ? 0 : 0.75,
              delay: reduceMotion ? 0 : 0.08,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="
              mx-auto mt-14 grid max-w-[960px] overflow-hidden
              rounded-[28px] border border-slate-200/80 bg-white
              shadow-[0_25px_80px_rgba(15,23,42,0.08)]
              lg:grid-cols-[0.85fr_1.15fr]
            "
          >
            {/* Contact information */}

            <div className="relative overflow-hidden border-b border-slate-100 bg-slate-50/70 p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
              <div
                className="
                  pointer-events-none absolute -right-20 -top-20
                  h-64 w-64 rounded-full bg-blue-100/70 blur-3xl
                "
              />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-[15px] border border-blue-100 bg-blue-50 text-blue-600 shadow-[0_8px_22px_rgba(37,99,235,0.08)]">
                  <Mail size={22} strokeWidth={1.8} />
                </div>

                <h3 className="mt-7 text-[30px] font-semibold tracking-[-0.04em] text-slate-950">
                  We’re here to help.
                </h3>

                <p className="mt-4 max-w-[340px] text-[14px] leading-6 text-slate-500">
                  Have a question, need help, or want to learn more about
                  InvoiceFlow? Send us a message and we’ll get back to you.
                </p>

                <div className="mt-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
                    Email us
                  </p>

                  <a
                    href="mailto:hello@invoiceflow.com"
                    className="
                      group mt-2 inline-flex items-center gap-2
                      text-[14px] font-semibold text-slate-900
                      transition-colors duration-300 hover:text-blue-600
                    "
                  >
                    hello@invoiceflow.com
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </a>
                </div>

                <div className="mt-10 flex flex-wrap gap-2">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600">
                    Product support
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600">
                    General questions
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}

            <form
              onSubmit={(event) => event.preventDefault()}
              className="p-7 sm:p-10 lg:p-12"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <ContactField label="Name" placeholder="Your name" />
                <ContactField label="Email" placeholder="you@company.com" />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-[12px] font-medium text-slate-700">
                  Message
                </label>

                <textarea
                  rows={5}
                  placeholder="How can we help?"
                  className="
                    w-full resize-none rounded-[16px] border border-slate-200
                    bg-white px-4 py-3.5 text-[14px] text-slate-900
                    outline-none transition-all duration-200
                    placeholder:text-slate-400
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  group mt-5 flex h-11 w-full items-center justify-center gap-2
                  rounded-full bg-[#0f172a] px-5 text-[13px] font-semibold
                  text-white shadow-[0_6px_20px_rgba(15,23,42,0.14)]
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:bg-[#1e293b]
                  active:scale-[0.98]
                "
              >
                Send message
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   TRUST ITEM
========================================================= */

function TrustItem({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-blue-600">
        {icon}
      </span>

      <span>{text}</span>
    </div>
  );
}



/* =========================================================
   HOW IT WORKS STEP
========================================================= */

function HowItWorksStep({
  id,
  number,
  title,
  description,
  icon,
  iconClass,
  delay,
}: {
  id?: string;
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
  iconClass: string;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      id={id}
      initial={{
        opacity: 0,
        y: reduceMotion ? 0 : 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: reduceMotion ? 0 : 0.65,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      className="
        group
        relative
        scroll-mt-28
        rounded-[22px]
        border
        border-slate-200/80
        bg-white/90
        p-6
        shadow-[0_8px_30px_rgba(15,23,42,0.04)]
        backdrop-blur-xl
        transition-all
        duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:-translate-y-1
        hover:border-slate-200
        hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]
      "
    >
      {/* Number */}

      <span
        className="
          absolute
          right-5
          top-5
          text-[11px]
          font-semibold
          tracking-[0.08em]
          text-slate-300
        "
      >
        {number}
      </span>

      {/* Icon */}

      <div
        className={`
          flex
          h-[52px]
          w-[52px]
          items-center
          justify-center
          rounded-[15px]
          ${iconClass}
          transition-transform
          duration-500
          group-hover:scale-[1.05]
        `}
      >
        {icon}
      </div>

      {/* Text */}

      <h3
        className="
          mt-6
          text-[18px]
          font-semibold
          tracking-[-0.025em]
          text-slate-950
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-2
          text-[13px]
          leading-6
          text-slate-500
        "
      >
        {description}
      </p>
    </motion.div>
  );
}

/* =========================================================
   WORKFLOW NODE
========================================================= */

function WorkflowNode({
  icon,
  label,
  active = false,
  success = false,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  success?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3">
      <div
        className={`
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-[15px]
          border
          bg-white
          shadow-[0_8px_20px_rgba(15,23,42,0.06)]
          ${success
            ? "border-emerald-200 text-emerald-600"
            : active
              ? "border-blue-200 text-blue-600"
              : "border-slate-200 text-slate-400"
          }
        `}
      >
        {icon}
      </div>

      <span
        className={`
          text-[11px]
          font-medium
          ${success
            ? "text-emerald-600"
            : active
              ? "text-slate-700"
              : "text-slate-400"
          }
        `}
      >
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   WORKFLOW PILL
========================================================= */

function WorkflowPill({
  text,
}: {
  text: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
        rounded-full
        border
        border-slate-200
        bg-slate-50
        px-3
        py-1.5
        text-[11px]
        font-medium
        text-slate-600
      "
    >
      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

      {text}
    </div>
  );
}

/* =========================================================
   PRICING CARD
========================================================= */

function PricingCard({
  name,
  description,
  price,
  suffix,
  features,
  button,
  href,
  onClick,
  featured = false,
}: {
  name: string;
  description: string;
  price: string;
  suffix: string;
  features: string[];
  button: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  featured?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
      className={`
        relative rounded-[26px] border p-7 sm:p-8
        ${featured
          ? "border-blue-200 bg-white shadow-[0_22px_65px_rgba(37,99,235,0.12)]"
          : "border-slate-200/80 bg-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
        }
      `}
    >
      {featured && (
        <span className="absolute right-6 top-6 rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-semibold text-blue-600">
          Most popular
        </span>
      )}

      <p className="text-[15px] font-semibold tracking-[-0.02em] text-slate-900">
        {name}
      </p>

      <p className="mt-2 max-w-[300px] text-[13px] leading-5 text-slate-500">
        {description}
      </p>

      <div className="mt-7 flex items-end gap-1">
        <span className="text-[42px] font-semibold leading-none tracking-[-0.05em] text-slate-950">
          {price}
        </span>
        <span className="mb-1 text-[12px] text-slate-400">{suffix}</span>
      </div>

      <Link
        href={href}
        onClick={onClick}
        className={`
          mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-full
          text-[13px] font-semibold transition-all duration-300 active:scale-[0.98]
          ${featured
            ? "bg-[#0f172a] text-white hover:bg-[#1e293b]"
            : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
          }
        `}
      >
        {button}
        <ArrowRight size={15} />
      </Link>

      <div className="mt-7 space-y-3.5">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <span
              className={`
                flex h-5 w-5 shrink-0 items-center justify-center rounded-full
                ${featured ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600"}
              `}
            >
              <Check size={12} strokeWidth={2.5} />
            </span>

            <span className="text-[13px] text-slate-600">{feature}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* =========================================================
   CONTACT FIELD
========================================================= */

function ContactField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-medium text-slate-700">
        {label}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        className="
          h-11 w-full rounded-[14px] border border-slate-200 bg-white
          px-4 text-[14px] text-slate-900 outline-none transition-all duration-200
          placeholder:text-slate-400
          focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
        "
      />
    </div>
  );
}

/* =========================================================
   WORKFLOW STAT
========================================================= */

function WorkflowStat({
  value,
  label,
  border = false,
}: {
  value: string;
  label: string;
  border?: boolean;
}) {
  return (
    <div
      className={`
        flex
        flex-col
        items-center
        justify-center
        px-6
        py-7
        text-center
        ${border
          ? "border-t border-slate-100 sm:border-l sm:border-t-0"
          : ""
        }
      `}
    >
      <span
        className="
          text-[25px]
          font-semibold
          tracking-[-0.04em]
          text-slate-950
        "
      >
        {value}
      </span>

      <span
        className="
          mt-1
          text-[12px]
          text-slate-400
        "
      >
        {label}
      </span>
    </div>
  );
}