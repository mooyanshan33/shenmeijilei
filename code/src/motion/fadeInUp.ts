import type { Variants } from "framer-motion"

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 4,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}
