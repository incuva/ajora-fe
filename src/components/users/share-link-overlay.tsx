"use client";

import { useState } from "react";
import { Person16Regular } from "@fluentui/react-icons";
import OverlaySheet from "@/components/shared/overlay-sheet";
import { X } from "lucide-react";

interface ShareLinkOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  link?: string;
}

/**
 * Share Registration Link modal. A compact centered card with a
 * read-only registration link and a copy-to-clipboard action.
 */
const ShareLinkOverlay = ({
  isOpen,
  onClose,
  link = "ajora.ng/register",
}: ShareLinkOverlayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — no-op.
    }
  };

  return (
    <OverlaySheet isOpen={isOpen} onClose={onClose} variant="center">
      <div className="relative flex flex-col items-center gap-3 px-4 py-8">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center p-2.5 rounded-lg border border-[#c8c8c2] text-green">
          <Person16Regular className="w-4 h-4" />
        </div>

        <p className="text-lg font-bold text-green font-inter text-center">
          Share Registration Link
        </p>
        <p className="text-xs text-grey-800 font-inter text-center">
          Enter the following details for a buyer and registration instructions
          would be sent to their email address.
        </p>

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[13px] font-medium text-green font-inter">
            Registration Link
          </label>
          <div className="flex items-center gap-2 bg-white border border-input-border rounded-md px-3 py-2">
            <input
              readOnly
              value={link}
              className="flex-1 min-w-0 text-base text-label font-inter bg-transparent focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="shrink-0 text-sm font-semibold text-green font-inter hover:underline"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </div>
    </OverlaySheet>
  );
};

export default ShareLinkOverlay;
