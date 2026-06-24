"use client";

import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  isLoading = false,
  className = "",
  fullWidth = false,
  type = "button",
}: ButtonProps) => {
  const baseStyles =
    "h-10 px-4 rounded-md flex items-center justify-center text-sm font-semibold font-inter transition-all duration-200 cursor-pointer focus:outline-none select-none";

  const variants = {
    primary: "bg-green text-soft-green hover:opacity-90 disabled:opacity-50 border border-transparent",
    secondary: "border border-green text-green bg-bg hover:bg-soft-green/30 disabled:opacity-50",
  };

  const widthStyles = fullWidth ? "w-full" : "flex-1";

  return (
    <motion.button
      type={type}
      whileTap={disabled || isLoading ? undefined : { scale: 0.97 }}
      onClick={disabled || isLoading ? undefined : onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${widthStyles} ${className} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
