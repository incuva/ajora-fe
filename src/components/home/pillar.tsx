import { motion } from "framer-motion";
import { CheckIcon } from "./icons";

interface PillarProps {
  label: string;
  delay: number;
}

const Pillar = ({ label, delay }: PillarProps) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className="flex items-center gap-1.75 bg-white border border-grey rounded-full px-4 py-2 text-xs font-medium text-text-sec shadow-xs"
  >
    <span className="w-4 h-4 bg-green rounded-full flex items-center justify-center shrink-0">
      <CheckIcon />
    </span>
    {label}
  </motion.div>
);

export default Pillar;
