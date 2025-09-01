import { motion } from "framer-motion";

export default function LoadingDots() {

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
      {[0, 0.15, 0.3].map((delay, i) => (
        <motion.span
          key={i}
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#fff",
          }}
          animate={{
            y: [0, -10, 0], // sobe e desce, mas sempre volta ao mesmo ponto base
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        />
      ))}
    </div>
  );
}
