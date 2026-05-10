import { motion } from "motion/react";
import { ReactNode } from "react";

export default function Page({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`min-h-[100svh] w-full max-w-5xl mx-auto px-6 pt-24 pb-48 flex flex-col justify-center ${className}`}
    >
      {children}
    </motion.div>
  );
}
