import { motion } from "framer-motion";
import Image from "next/image";

const Header = () => (
  <motion.header
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="px-10 flex items-center h-32"
  >
    <Image
      src="/logo.png"
      alt="Àjọrà"
      width={160}
      height={32}
      priority
      className="object-contain"
      style={{ height: "100%", width: "auto" }}
    />
  </motion.header>
);

export default Header;
