"use client";

import { motion } from "framer-motion";
import {
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_TEL_LINK,
  SUPPORT_WHATSAPP_LINK,
} from "@/constants/support";

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
      Need help? Call{" "}
      <a
        href={SUPPORT_TEL_LINK}
        className="text-gold font-semibold no-underline hover:underline"
      >
        {SUPPORT_PHONE_DISPLAY}
      </a>{" "}
      or{" "}
      <a
        href={SUPPORT_WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gold font-semibold no-underline hover:underline"
      >
        WhatsApp us
      </a>
    </span>
  </motion.footer>
);

export default Footer;
