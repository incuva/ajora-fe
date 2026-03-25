"use client";

import { motion } from "framer-motion";

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.6 }}
    className="px-12 py-6 flex items-center justify-between border-t border-grey"
  >
    <span className="text-xs font-normal text-[#b0b0aa]">
      © 2026 Àjọrà by Basorun (Ibadan) Forerunner Interest-Free Cooperative
      Investment and Credit Society Limited
    </span>
    <span className="text-xs font-medium text-text-sec">
      Questions?{" "}
      <a
        href="https://wa.me/+2349130750399"
        className="text-gold no-underline hover:underline"
      >
        09130750399
      </a>
    </span>
  </motion.footer>
);

export default Footer;
