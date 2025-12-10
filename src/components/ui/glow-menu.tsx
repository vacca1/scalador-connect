"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Home, Users, Heart, Briefcase, Plus } from "lucide-react"

interface MenuItem {
  icon: React.ReactNode
  label: string
  key: string
  gradient: string
  iconColor: string
}

const menuItems: MenuItem[] = [
  {
    icon: <Home className="h-5 w-5" />,
    label: "Vagas",
    key: "vagas",
    gradient: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500",
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "Freelancers",
    key: "freelancers",
    gradient: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
  {
    icon: <Heart className="h-5 w-5" />,
    label: "Favoritos",
    key: "carteira",
    gradient: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(219,39,119,0.06) 50%, rgba(190,24,93,0) 100%)",
    iconColor: "text-pink-500",
  },
  {
    icon: <Briefcase className="h-5 w-5" />,
    label: "Minhas Vagas",
    key: "minhas-vagas",
    gradient: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "text-green-500",
  },
  {
    icon: <Plus className="h-5 w-5" />,
    label: "Publicar",
    key: "publicar",
    gradient: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(8,145,178,0.06) 50%, rgba(14,116,144,0) 100%)",
    iconColor: "text-cyan-500",
  },
]

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
}

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
}

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
      scale: { duration: 0.5, type: "spring" as const, stiffness: 300, damping: 25 },
    },
  },
}

const navGlowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
}

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
}

interface GlowMenuProps {
  navegarPara: (pagina: string) => void
  paginaAtual?: string
  carteiraCount?: number
}

export function GlowMenu({ navegarPara, paginaAtual, carteiraCount = 0 }: GlowMenuProps) {
  return (
    <motion.nav
      className="p-2 rounded-2xl bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-lg border border-white/40 shadow-lg relative overflow-hidden"
      initial="initial"
      whileHover="hover"
    >
      <motion.div
        className="absolute -inset-2 bg-gradient-radial from-transparent via-blue-400/20 to-transparent rounded-3xl z-0 pointer-events-none"
        variants={navGlowVariants}
      />
      <ul className="flex items-center gap-1 relative z-10">
        {menuItems.map((item) => (
          <motion.li key={item.key} className="relative">
            <motion.div
              className="block rounded-xl overflow-visible group relative cursor-pointer"
              style={{ perspective: "600px" }}
              whileHover="hover"
              initial="initial"
              onClick={() => navegarPara(item.key)}
            >
              <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                variants={glowVariants}
                style={{
                  background: item.gradient,
                  opacity: 0,
                  borderRadius: "16px",
                }}
              />
              <motion.div
                className={`flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent transition-colors rounded-xl ${
                  paginaAtual === item.key ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"
                }`}
                variants={itemVariants}
                transition={sharedTransition}
                style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
              >
                <span className={`transition-colors duration-300 ${paginaAtual === item.key ? item.iconColor : ""}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
                {item.key === "carteira" && carteiraCount > 0 && (
                  <span className="bg-gradient-to-r from-scalador-orange to-scalador-orange-light text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {carteiraCount}
                  </span>
                )}
              </motion.div>
              <motion.div
                className={`flex items-center gap-2 px-4 py-2 absolute inset-0 z-10 bg-transparent transition-colors rounded-xl text-gray-900`}
                variants={backVariants}
                transition={sharedTransition}
                style={{ transformStyle: "preserve-3d", transformOrigin: "center top", rotateX: 90 }}
              >
                <span className={`transition-colors duration-300 ${item.iconColor}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
                {item.key === "carteira" && carteiraCount > 0 && (
                  <span className="bg-gradient-to-r from-scalador-orange to-scalador-orange-light text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {carteiraCount}
                  </span>
                )}
              </motion.div>
            </motion.div>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  )
}

export default GlowMenu
