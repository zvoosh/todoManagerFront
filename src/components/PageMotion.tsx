import { motion } from "framer-motion";

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  console.log("dusan");
  return (
    <motion.div
      initial={{ opacity: 0, y: 23 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -23 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};
