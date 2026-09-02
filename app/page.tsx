"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import logo from "../assets/singh-electronics-logo.png";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export default function Home() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-[radial-gradient(circle_at_50%_-12%,rgba(224,37,60,0.38),transparent_48%),linear-gradient(180deg,#0e0f13_0%,#05070b_50%,#04060b_100%)]">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,0,48,0.23),transparent_30%),radial-gradient(circle_at_50%_20%,rgba(176,13,32,0.18),transparent_45%)]"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.9),rgba(0,0,0,0.35))]" />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-[760px] px-4 pb-[18px] pt-2 sm:w-[92vw] sm:px-0 sm:pb-[22px] sm:pt-3"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <motion.div
          className="mx-auto mb-6 max-w-[600px] sm:mb-[26px]"
          variants={fadeUp}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Image
            src={logo}
            alt="Singh Electronics"
            className="block h-auto w-full"
            priority
          />
        </motion.div>

        <motion.p
          className="mb-3 text-center text-[0.63rem] font-semibold uppercase tracking-[0.25em] text-[#ff3d5d] sm:text-[0.67rem] sm:tracking-[0.32em]"
          variants={fadeUp}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          Internal Tools Portal
        </motion.p>
        <motion.h1
          className="m-0 text-center text-[2.22rem] leading-[1.15] font-[660] text-[#f4f7fb] sm:text-[clamp(2rem,4.5vw,2.8rem)]"
          variants={fadeUp}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          Singh Electronics
        </motion.h1>
        <motion.p
          className="mt-2 mb-5 text-center text-base text-[#aeb6c2] sm:mb-[30px] sm:text-[1.06rem]"
          variants={fadeUp}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          Select a tool to get started
        </motion.p>

        <motion.section
          className="mb-4 rounded-[18px] border border-[rgba(122,132,148,0.32)] bg-[linear-gradient(145deg,rgba(18,21,27,0.96),rgba(8,10,13,0.96))] p-6 shadow-[0_24px_45px_rgba(0,0,0,0.42),inset_0_0_0_1px_rgba(255,255,255,0.05)] sm:mb-5 sm:rounded-[20px] sm:p-7"
          variants={fadeUp}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div
            className="mb-[18px] grid h-[42px] w-[42px] place-items-center rounded-[11px] border border-white/15 bg-white/[0.045] text-[1.35rem]"
            aria-hidden="true"
          >
            🧮
          </div>
          <h2 className="m-0 text-[2rem] leading-[1.2] -tracking-[0.02em] sm:text-[clamp(1.55rem,2.8vw,2rem)]">
            Pricing Calculators
          </h2>
          <p className="mt-3 max-w-[50ch] text-base leading-[1.7] text-[#a8b0bc] sm:text-[1.04rem]">
            Retail, Discount, Price Match &amp; Wholesale pricing tools for the
            Canadian market.
          </p>
          <Link
            className="mt-[22px] inline-flex items-center gap-2.5 rounded-[11px] border border-[#f7294e] bg-[linear-gradient(90deg,#ef173f_0%,#f72348_100%)] px-4 py-3 text-[0.95rem] font-[620] text-white no-underline shadow-[0_12px_24px_rgba(239,23,63,0.35)] transition hover:-translate-y-px hover:opacity-95 sm:px-[18px] sm:py-[13px] sm:text-base"
            href="/calculators"
          >
            Go to Calculators <span aria-hidden="true">→</span>
          </Link>
        </motion.section>

        <motion.section
          className="mb-4 rounded-[18px] border border-[rgba(122,132,148,0.32)] bg-[linear-gradient(145deg,rgba(18,21,27,0.96),rgba(8,10,13,0.96))] p-6 shadow-[0_24px_45px_rgba(0,0,0,0.42),inset_0_0_0_1px_rgba(255,255,255,0.05)] sm:mb-5 sm:rounded-[20px] sm:p-7"
          variants={fadeUp}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div
            className="mb-[18px] grid h-[42px] w-[42px] place-items-center rounded-[11px] border border-white/15 bg-white/[0.045] text-[1.35rem]"
            aria-hidden="true"
          >
            📦
          </div>
          <h2 className="m-0 text-[2rem] leading-[1.2] -tracking-[0.02em] sm:text-[clamp(1.55rem,2.8vw,2rem)]">
            Return Requests
          </h2>
          <p className="mt-3 max-w-[50ch] text-base leading-[1.7] text-[#a8b0bc] sm:text-[1.04rem]">
            Step-by-step return authorization and warranty claim assistant with
            email templates.
          </p>
          <Link
            className="mt-[22px] inline-flex items-center gap-2.5 rounded-[11px] border border-[rgba(128,137,151,0.55)] bg-white/[0.01] px-4 py-3 text-[0.95rem] font-[620] text-[#ebeff5] no-underline transition hover:-translate-y-px hover:border-[rgba(186,194,205,0.76)] hover:opacity-95 sm:px-[18px] sm:py-[13px] sm:text-base"
            href="/returns"
          >
            Go to Returns <span aria-hidden="true">→</span>
          </Link>
        </motion.section>

        <motion.section
          className="mb-4 rounded-[18px] border border-[rgba(122,132,148,0.32)] bg-[linear-gradient(145deg,rgba(18,21,27,0.96),rgba(8,10,13,0.96))] p-6 shadow-[0_24px_45px_rgba(0,0,0,0.42),inset_0_0_0_1px_rgba(255,255,255,0.05)] sm:mb-5 sm:rounded-[20px] sm:p-7"
          variants={fadeUp}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div
            className="mb-[18px] grid h-[42px] w-[42px] place-items-center rounded-[11px] border border-white/15 bg-white/[0.045] text-[1.35rem]"
            aria-hidden="true"
          >
            🏷️
          </div>
          <h2 className="m-0 text-[2rem] leading-[1.2] -tracking-[0.02em] sm:text-[clamp(1.55rem,2.8vw,2rem)]">
            Return Request — Open Box Items
          </h2>
          <p className="mt-3 max-w-[50ch] text-base leading-[1.7] text-[#a8b0bc] sm:text-[1.04rem]">
            Step-by-step return and warranty authorization for open box items sold on Best Buy, Walmart, Website, and Amazon.
          </p>
          <Link
            className="mt-[22px] inline-flex items-center gap-2.5 rounded-[11px] border border-[rgba(128,137,151,0.55)] bg-white/[0.01] px-4 py-3 text-[0.95rem] font-[620] text-[#ebeff5] no-underline transition hover:-translate-y-px hover:border-[rgba(186,194,205,0.76)] hover:opacity-95 sm:px-[18px] sm:py-[13px] sm:text-base"
            href="/open-box"
          >
            Go to Open Box Returns <span aria-hidden="true">→</span>
          </Link>
        </motion.section>

        <motion.section
          className="mb-4 rounded-[18px] border border-[rgba(122,132,148,0.32)] bg-[linear-gradient(145deg,rgba(18,21,27,0.96),rgba(8,10,13,0.96))] p-6 shadow-[0_24px_45px_rgba(0,0,0,0.42),inset_0_0_0_1px_rgba(255,255,255,0.05)] sm:mb-5 sm:rounded-[20px] sm:p-7"
          variants={fadeUp}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div
            className="mb-[18px] grid h-[42px] w-[42px] place-items-center rounded-[11px] border border-white/15 bg-white/[0.045] text-[1.35rem]"
            aria-hidden="true"
          >
            📋
          </div>
          <h2 className="m-0 text-[2rem] leading-[1.2] -tracking-[0.02em] sm:text-[clamp(1.55rem,2.8vw,2rem)]">
            PM Calculator
          </h2>
          <p className="mt-3 max-w-[50ch] text-base leading-[1.7] text-[#a8b0bc] sm:text-[1.04rem]">
            Calculate profit margin for Website, Amazon, Best Buy, and Walmart orders with auto-generated order notes.
          </p>
          <Link
            className="mt-[22px] inline-flex items-center gap-2.5 rounded-[11px] border border-[rgba(128,137,151,0.55)] bg-white/[0.01] px-4 py-3 text-[0.95rem] font-[620] text-[#ebeff5] no-underline transition hover:-translate-y-px hover:border-[rgba(186,194,205,0.76)] hover:opacity-95 sm:px-[18px] sm:py-[13px] sm:text-base"
            href="/pm-calculator"
          >
            Go to PM Calculator <span aria-hidden="true">→</span>
          </Link>
        </motion.section>

        <motion.footer
          className="mt-5 text-center text-[0.7rem] tracking-[0.11em] text-[rgba(169,176,188,0.55)] sm:text-[0.77rem] sm:tracking-[0.14em]"
          variants={fadeUp}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          Singh Electronics · Internal Tools Portal · v2.1
        </motion.footer>
      </motion.div>
    </main>
  );
}
