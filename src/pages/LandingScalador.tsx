import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Zap, TrendingUp, FileText, Briefcase, Users, DollarSign, 
  ChevronDown, Quote, Play, Menu, X, Facebook, Instagram, 
  Linkedin, Youtube, ArrowRight
} from "lucide-react";

// Partner logos
import abraselLogo from "@/assets/logos/abrasel.png";
import alpinusLogo from "@/assets/logos/alpinus.png";
import brasilStartupsLogo from "@/assets/logos/brasil-startups.png";
import cocoBambuLogo from "@/assets/logos/coco-bambu.png";
import dburgerLogo from "@/assets/logos/dburger.png";
import enAdvLogo from "@/assets/logos/en-adv.png";

const partnerLogos = [
  { name: "Abrasel", logo: abraselLogo },
  { name: "Alpinus", logo: alpinusLogo },
  { name: "Brasil Startups", logo: brasilStartupsLogo },
  { name: "Coco Bambu", logo: cocoBambuLogo },
  { name: "D'Burger", logo: dburgerLogo },
  { name: "EN Advocacia", logo: enAdvLogo },
];

const stats = [
  { icon: Briefcase, value: "+1.400", label: "Vagas", color: "text-amber-400" },
  { icon: Users, value: "+1.000", label: "Empresas", color: "text-amber-400" },
  { icon: TrendingUp, value: "+5M", label: "Oportunidades", color: "text-amber-400" },
  { icon: DollarSign, value: "R$ 500M+", label: "GMV", color: "text-amber-400" },
];

const benefits = [
  {
    icon: Zap,
    title: "Rápido e Prático",
    description: "10x mais rápido que outras plataformas",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: TrendingUp,
    title: "Ganhe Ainda Mais",
    description: "Salários até 27% maiores",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: FileText,
    title: "Currículo Profissional",
    description: "PDF personalizado totalmente grátis",
    gradient: "from-amber-500 to-orange-500",
  },
];

const testimonials = [
  {
    name: "Gabriel",
    role: "Garçom - La Braciera",
    quote: "Processo muito rápido e eficiente. Encontrei trabalho em menos de 24 horas!",
    gradient: "from-indigo-500 to-purple-500",
    initial: "G",
    nameColor: "text-indigo-600",
  },
  {
    name: "Leandro",
    role: "Auxiliar - Motqie",
    quote: "Plataforma fácil de usar. Pagamento sempre em dia, sem complicação!",
    gradient: "from-amber-500 to-orange-500",
    initial: "L",
    nameColor: "text-amber-600",
  },
  {
    name: "Karina",
    role: "Recepcionista",
    quote: "Vagas todos os dias. Consegui montar minha agenda do jeito que eu queria.",
    gradient: "from-green-500 to-emerald-500",
    initial: "K",
    nameColor: "text-green-600",
  },
  {
    name: "Kathleen",
    role: "Garçonete - Prainha Paulista",
    quote: "Tudo muito simples. Do cadastro ao primeiro trabalho foram apenas 2 dias!",
    gradient: "from-purple-500 to-pink-500",
    initial: "K",
    nameColor: "text-purple-600",
  },
];

export default function LandingScalador() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 overflow-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-xl shadow-lg" : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Scalador Capta
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection("sobre")} className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                Sobre
              </button>
              <button onClick={() => scrollToSection("como-funciona")} className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                Como funciona
              </button>
              <button onClick={() => scrollToSection("empresas")} className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                Para empresas
              </button>
              <Link to="/profissional" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                Ver vagas
              </Link>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="px-6 py-2.5 glass text-gray-700 font-bold rounded-xl hover:bg-indigo-50 transition-all"
              >
                Entrar
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t shadow-xl"
          >
            <div className="px-4 py-6 space-y-4">
              <button onClick={() => scrollToSection("sobre")} className="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-indigo-50 rounded-xl">
                Sobre
              </button>
              <button onClick={() => scrollToSection("como-funciona")} className="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-indigo-50 rounded-xl">
                Como funciona
              </button>
              <button onClick={() => scrollToSection("empresas")} className="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-indigo-50 rounded-xl">
                Para empresas
              </button>
              <Link to="/profissional" className="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-indigo-50 rounded-xl">
                Ver vagas
              </Link>
              <div className="pt-4 border-t">
                <Link to="/login" className="block w-full text-center px-6 py-3 glass text-gray-700 font-bold rounded-xl">
                  Entrar
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Social Proof Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full mb-8"
          >
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">J</div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">M</div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">A</div>
            </div>
            <span className="text-sm font-semibold text-gray-700">+5M oportunidades geradas</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6"
          >
            Com a Scalador Capta você encontra{" "}
            <span className="text-indigo-600">vagas de emprego</span> e{" "}
            <span className="text-amber-600">trabalhos freelancer</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            Encontre seu futuro trabalho em menos de 5 minutos! ⚡
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/profissional"
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-600/40 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              Ver Vagas (+1.400)
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/profissional"
              className="w-full sm:w-auto px-10 py-4 glass text-gray-700 font-bold text-lg rounded-2xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
            >
              Quero Trabalhar
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <ChevronDown className="w-8 h-8 text-indigo-400 mx-auto animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="empresas" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-700 mb-10">
            Encontre oportunidades em mais de <span className="text-indigo-600">1.000 empresas</span> parceiras
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {partnerLogos.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass p-4 sm:p-6 rounded-2xl flex items-center justify-center group hover:shadow-xl transition-all"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-8 sm:h-12 object-contain grayscale group-hover:grayscale-0 transition-all"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="sobre" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-indigo-600 uppercase text-sm font-bold tracking-wider">Benefícios</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-3">
              Por que fazer parte da Scalador Capta?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="glass p-8 rounded-3xl hover:shadow-2xl transition-all group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/profissional"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Ver Vagas (+1.400)
            </Link>
            <Link
              to="/profissional"
              className="px-8 py-4 glass text-gray-700 font-bold rounded-2xl hover:bg-indigo-50 transition-all"
            >
              Quero Trabalhar
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-900 to-purple-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-black text-white mb-12">
            Já impactamos milhares de famílias brasileiras
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-4`} />
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-indigo-200 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="como-funciona" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-indigo-600 uppercase text-sm font-bold tracking-wider">Casos de Sucesso</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-3">
              Histórias de quem conquistou o emprego dos sonhos
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass p-6 sm:p-8 rounded-3xl hover:shadow-2xl transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white text-xl font-bold`}>
                    {testimonial.initial}
                  </div>
                  <div className="relative">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center absolute -left-3 -top-1">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className={`font-bold text-lg ${testimonial.nameColor}`}>{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Quote className="w-6 h-6 text-indigo-300 flex-shrink-0" />
                  <p className="text-gray-700 italic">{testimonial.quote}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Temos mais de 1.400 vagas te esperando!
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            Candidate-se grátis na Scalador Capta
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/profissional"
              className="w-full sm:w-auto px-12 py-6 bg-white text-indigo-600 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              Quero Trabalhar Agora
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/profissional"
              className="w-full sm:w-auto px-12 py-6 border-2 border-white text-white font-bold text-lg rounded-2xl hover:bg-white hover:text-indigo-600 transition-all"
            >
              Ver Vagas (+1.400)
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-2xl font-black text-white">Scalador Capta</span>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
            <p>© 2025 Scalador Capta. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
