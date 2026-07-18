"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/home/header";
import Footer from "@/components/home/footer";
import Pillar from "@/components/home/pillar";

const pillars = ["Pool Demand", "Earn Dividends", "Full Transparency", "Community First"];

export default function Home() {
  return (
    <>
      <div className="fixed -bottom-30 -right-30 w-120 h-120 rounded-full border border-gold/20 pointer-events-none z-0">
        <div className="absolute inset-8 rounded-full border border-green/10" />
        <div className="absolute inset-16 rounded-full border border-gold/10" />
      </div>

      <div className="fixed -top-20 -left-20 w-80 h-80 rounded-full border border-green/8 pointer-events-none z-0" />

      <div className="relative z-1 min-h-screen flex flex-col">

        <Header />

        <main className="flex-1 flex items-center justify-center px-12 pt-2 pb-15">
          <div className="max-w-screen-sm w-full text-center">

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 bg-green text-gold text-badge font-semibold tracking-badge uppercase px-4.5 py-2 rounded-full mb-9"
            >
              <span className="dot-pulse w-1.5 h-1.5 rounded-full bg-gold" />
              Collective Buying Power (Àjọ = together, Rà = buy)
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="font-playfair text-display font-bold text-green leading-display tracking-tight mb-3"
            >
              Buy{" "}
              <span className="gold-underline text-gold relative inline-block">
                Together
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="font-playfair text-tagline font-normal italic text-gold mb-4"
            >
              Grow Together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
              className="w-12 h-0.5 mx-auto mt-1 mb-11 rounded-sm"
              style={{ background: "linear-gradient(90deg, #C89B3C, #114B3A)" }}
            />

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-base font-light leading-body text-text-sec max-w-120 mx-auto mb-4"
            >
              We&apos;re building a premium, community-driven collective buying platform —{" "}
              where pooled demand meets structured commerce. Be among the first to{" "}
              experience transparent, trust-first cooperative growth.
            </motion.p>

            {/* Pillars */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="flex gap-2 justify-center flex-wrap mb-10"
            >
              {pillars.map((label, i) => (
                <Pillar key={label} label={label} delay={0.5 + i * 0.07} />
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
            >
              <Link
                href="/marketplace/057e326a-0a1c-450a-9515-484264d71f07"
                className="inline-flex items-center gap-2.5 bg-green text-gold-light font-semibold text-sm tracking-wide uppercase px-8 py-4 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Explore the Pool
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </motion.div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
