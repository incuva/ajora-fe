import { Phone } from "lucide-react";
import {
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_TEL_LINK,
  SUPPORT_WHATSAPP_LINK,
} from "@/constants/support";

/**
 * Compact "Need help?" pill for headers. Tapping it starts a call on mobile;
 * the number is always visible (label collapses on very small screens).
 */
export const SupportPill = () => (
  <a
    id="support-phone-link"
    href={SUPPORT_TEL_LINK}
    aria-label={`Call customer support on ${SUPPORT_PHONE_DISPLAY}`}
    className="inline-flex items-center gap-2 rounded-full bg-soft-green pl-1 pr-3 py-1 text-green hover:bg-green hover:text-white transition-colors duration-200"
  >
    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green text-white">
      <Phone className="size-3.5" />
    </span>
    <span className="flex flex-col leading-tight text-left">
      <span className="hidden sm:block text-[10px] font-inter uppercase tracking-wide opacity-80">
        Need help?
      </span>
      <span className="text-xs font-inter font-semibold whitespace-nowrap">
        {SUPPORT_PHONE_DISPLAY}
      </span>
    </span>
  </a>
);

/** Inline support banner for forms / checkout steps. */
export const SupportBanner = () => (
  <div className="flex items-center gap-3 rounded-xl border border-soft-green bg-soft-green/40 px-4 py-3">
    <span className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-green text-white">
      <Phone className="size-4" />
    </span>
    <p className="text-xs font-inter text-text-sec leading-relaxed">
      Having issues with your booking or payment? Call{" "}
      <a href={SUPPORT_TEL_LINK} className="font-semibold text-green hover:underline">
        {SUPPORT_PHONE_DISPLAY}
      </a>{" "}
      or{" "}
      <a
        href={SUPPORT_WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-green hover:underline"
      >
        chat on WhatsApp
      </a>
      .
    </p>
  </div>
);
