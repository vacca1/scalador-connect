import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  TrendingUp,
  Star,
  Menu,
  X,
  MapPin,
  Clock,
  DollarSign,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  Heart,
  Award,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import scaladorLogo from "@/assets/scalador-logo.png";

const Landing = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 overflow-x-hidden">
      {/* HEADER */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.img
            src={scaladorLogo}
            alt="Scalador"
            className="h-10 md:h-12 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="text-gray-700 hover:text-amber-600 font-semibold transition-colors relative group"
            >
              Como funciona
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection("beneficios")}
              className="text-gray-700 hover:text-amber-600 font-semibold transition-colors relative group"
            >
              Benefícios
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection("depoimentos")}
              className="text-gray-700 hover:text-amber-600 font-semibold transition-colors relative group"
            >
              Depoimentos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-gray-700 hover:text-amber-600 font-semibold transition-colors relative group"
            >
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="px-6 py-2 rounded-xl font-bold border-2 border-amber-500 text-amber-600 hover:bg-amber-50 hover:border-amber-600"
            >
              Entrar
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-4 border-t border-gray-100 pt-4"
          >
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="block w-full text-left text-gray-700 hover:text-amber-600 font-semibold py-2"
            >
              Como funciona
            </button>
            <button
              onClick={() => scrollToSection("beneficios")}
              className="block w-full text-left text-gray-700 hover:text-amber-600 font-semibold py-2"
            >
              Benefícios
            </button>
            <button
              onClick={() => scrollToSection("depoimentos")}
              className="block w-full text-left text-gray-700 hover:text-amber-600 font-semibold py-2"
            >
              Depoimentos
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="block w-full text-left text-gray-700 hover:text-amber-600 font-semibold py-2"
            >
              FAQ
            </button>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600"
            >
              Entrar
            </Button>
          </motion.div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="py-12 md:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full text-sm font-bold border border-amber-200">
                🚀 A maior plataforma de freelancers de Brasília
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Conectamos{" "}
              </span>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Empresas
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                e{" "}
              </span>
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Freelancers
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              A plataforma que une quem precisa de profissionais qualificados com quem busca oportunidades de trabalho{" "}
              <span className="font-bold text-amber-600">em Brasília</span>
            </motion.p>

            {/* CARDS DE ESCOLHA */}
            <motion.div
              variants={fadeInUp}
              className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-16"
            >
              {/* CARD EMPRESA */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/empresa")}
                className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl 
                           transition-all duration-300 cursor-pointer group border-2 border-transparent 
                           hover:border-blue-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-indigo-600 
                              rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-blue-500/30"
                  >
                    <Building2 className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                    Quero Contratar
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Encontre profissionais qualificados para suas vagas em minutos. Publique vagas, gerencie candidaturas e acompanhe trabalhos.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      Publicar Vagas
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      Buscar Freelancers
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      Pagamentos Seguros
                    </span>
                  </div>
                  <button
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 
                               text-white rounded-xl font-bold shadow-xl shadow-blue-500/30 hover:shadow-2xl 
                               hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    Sou Empresa <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

              {/* CARD FREELANCER */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/freelancer")}
                className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl 
                           transition-all duration-300 cursor-pointer group border-2 border-transparent 
                           hover:border-amber-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-orange-600 
                              rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-amber-500/30"
                  >
                    <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black mb-4 text-gray-900 group-hover:text-amber-600 transition-colors">
                    Quero Trabalhar
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Encontre oportunidades de trabalho perto de você. Candidate-se a vagas, gerencie sua agenda e receba pagamentos.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                      Vagas Próximas
                    </span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                      Pagamento Rápido
                    </span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                      Perfil Completo
                    </span>
                  </div>
                  <button
                    className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 
                               text-white rounded-xl font-bold shadow-xl shadow-amber-500/30 hover:shadow-2xl 
                               hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    Sou Freelancer <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </motion.div>

            {/* ESTATÍSTICAS */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
            >
              {[
                { icon: TrendingUp, value: "+500", label: "Vagas Ativas", color: "text-blue-600", bg: "from-blue-50 to-indigo-50" },
                { icon: Users, value: "+2.000", label: "Freelancers", color: "text-amber-600", bg: "from-amber-50 to-orange-50" },
                { icon: Building2, value: "+300", label: "Empresas", color: "text-purple-600", bg: "from-purple-50 to-pink-50" },
                { icon: Star, value: "4.8", label: "Avaliação Média", color: "text-yellow-500", bg: "from-yellow-50 to-amber-50" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className={`bg-gradient-to-br ${stat.bg} backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-white/50`}
                >
                  <stat.icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color} mx-auto mb-2`} />
                  <p className="text-2xl md:text-3xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
        >
          <button onClick={() => scrollToSection("como-funciona")} className="text-gray-400 hover:text-amber-600 transition-colors">
            <ChevronDown className="w-8 h-8" />
          </button>
        </motion.div>
      </section>

      {/* SEÇÃO: COMO FUNCIONA */}
      <section id="como-funciona" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold mb-4">
              Simples e Rápido
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black mb-4">
              Como funciona?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 max-w-2xl mx-auto">
              Em poucos passos você conecta sua empresa aos melhores profissionais ou encontra oportunidades de trabalho
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* PARA EMPRESAS */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100"
            >
              <motion.h3 variants={fadeInUp} className="text-xl md:text-2xl font-bold mb-8 text-blue-600 flex items-center gap-3">
                <Building2 className="w-6 h-6" /> Para Empresas
              </motion.h3>
              <div className="space-y-6">
                {[
                  { step: 1, title: "Publique sua vaga", desc: "Descreva a vaga, local, horário e valor oferecido" },
                  { step: 2, title: "Receba candidaturas", desc: "Freelancers qualificados se candidatam automaticamente" },
                  { step: 3, title: "Selecione e gerencie", desc: "Escolha o profissional e acompanhe o trabalho em tempo real" },
                  { step: 4, title: "Pague com segurança", desc: "Pagamento seguro após a conclusão do trabalho" },
                ].map((item) => (
                  <motion.div key={item.step} variants={fadeInUp} className="flex gap-4 items-start group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                      <span className="font-black text-white text-lg">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/empresa")}
                className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Começar como Empresa <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* PARA FREELANCERS */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-100"
            >
              <motion.h3 variants={fadeInUp} className="text-xl md:text-2xl font-bold mb-8 text-amber-600 flex items-center gap-3">
                <Users className="w-6 h-6" /> Para Freelancers
              </motion.h3>
              <div className="space-y-6">
                {[
                  { step: 1, title: "Crie seu perfil", desc: "Cadastre suas habilidades, experiência e disponibilidade" },
                  { step: 2, title: "Encontre vagas", desc: "Veja vagas próximas à sua localização em tempo real" },
                  { step: 3, title: "Candidate-se", desc: "Envie sua candidatura com um clique e aguarde aprovação" },
                  { step: 4, title: "Trabalhe e receba", desc: "Realize o trabalho e receba o pagamento automaticamente" },
                ].map((item) => (
                  <motion.div key={item.step} variants={fadeInUp} className="flex gap-4 items-start group">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                      <span className="font-black text-white text-lg">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/freelancer")}
                className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Começar como Freelancer <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: BENEFÍCIOS */}
      <section id="beneficios" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="inline-block px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-bold mb-4">
              Por que escolher o Scalador?
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black mb-4">
              Benefícios da Plataforma
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: MapPin, title: "Vagas por Localização", desc: "Encontre oportunidades próximas à você, por bairro ou região de Brasília", color: "from-amber-500 to-orange-600" },
              { icon: Clock, title: "Contratação Rápida", desc: "Publique sua vaga e receba candidaturas em minutos", color: "from-blue-500 to-indigo-600" },
              { icon: DollarSign, title: "Pagamento Seguro", desc: "Sistema de pagamento integrado com garantia para ambas as partes", color: "from-green-500 to-emerald-600" },
              { icon: Shield, title: "Freelancers Verificados", desc: "Todos os profissionais passam por verificação de perfil", color: "from-purple-500 to-pink-600" },
              { icon: Star, title: "Sistema de Avaliação", desc: "Avalie e seja avaliado para construir sua reputação", color: "from-yellow-500 to-amber-600" },
              { icon: Zap, title: "Notificações em Tempo Real", desc: "Receba alertas instantâneos sobre vagas e candidaturas", color: "from-cyan-500 to-blue-600" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition-all group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO: DEPOIMENTOS */}
      <section id="depoimentos" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">
              Depoimentos Reais
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black mb-4">
              O que dizem sobre nós
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                name: "Carlos Mendes",
                role: "Dono de Restaurante",
                avatar: "🧑‍💼",
                rating: 5,
                text: "Encontrei garçons incríveis para o meu evento em menos de 1 hora! O sistema de localização por bairro facilitou muito.",
                type: "empresa",
              },
              {
                name: "Ana Paula",
                role: "Freelancer - Garçonete",
                avatar: "👩",
                rating: 5,
                text: "Já fiz mais de 50 trabalhos pela plataforma. O pagamento sempre cai rápido e as vagas são próximas da minha casa.",
                type: "freelancer",
              },
              {
                name: "Roberto Silva",
                role: "Gerente de Eventos",
                avatar: "👨‍💼",
                rating: 5,
                text: "A melhor plataforma para contratar equipe temporária em Brasília. Profissionais qualificados e processo simples.",
                type: "empresa",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className={`rounded-3xl p-6 border-2 ${
                  item.type === "empresa"
                    ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
                    : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                    item.type === "empresa" ? "bg-blue-100" : "bg-amber-100"
                  }`}>
                    {item.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className={`text-sm ${item.type === "empresa" ? "text-blue-600" : "text-amber-600"}`}>
                      {item.role}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(item.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{item.text}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO: FAQ */}
      <section id="faq" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.span variants={fadeInUp} className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold mb-4">
              Dúvidas Frequentes
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black mb-4">
              Perguntas Frequentes
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {[
                { q: "Quanto custa usar a plataforma?", a: "Para freelancers, a plataforma é gratuita. Para empresas, cobramos uma taxa de serviço de 9.9% sobre o valor do trabalho." },
                { q: "Como funciona o pagamento?", a: "O pagamento é processado de forma segura pela plataforma. A empresa paga antecipadamente e o freelancer recebe após a conclusão do trabalho." },
                { q: "Posso cancelar uma vaga publicada?", a: "Sim, você pode cancelar uma vaga a qualquer momento antes de um freelancer ser confirmado. Após a confirmação, pode haver taxas de cancelamento." },
                { q: "Como sei se o freelancer é confiável?", a: "Todos os freelancers têm perfil verificado, avaliações de trabalhos anteriores e taxa de comparecimento visível." },
                { q: "A plataforma funciona em toda Brasília?", a: "Sim! Atendemos todas as regiões administrativas de Brasília e Entorno, com filtros por bairro para facilitar sua busca." },
              ].map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white rounded-2xl border border-gray-200 px-6 overflow-hidden"
                >
                  <AccordionTrigger className="text-left font-bold text-gray-900 hover:text-amber-600 py-5">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-white mb-6">
              Pronto para começar?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-white/90 mb-10">
              Junte-se a milhares de empresas e freelancers que já usam o Scalador
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/empresa")}
                className="px-8 py-6 bg-white text-amber-600 hover:bg-gray-100 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                <Building2 className="w-5 h-5 mr-2" /> Sou Empresa
              </Button>
              <Button
                onClick={() => navigate("/freelancer")}
                className="px-8 py-6 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                <Users className="w-5 h-5 mr-2" /> Sou Freelancer
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src={scaladorLogo} alt="Scalador" className="h-10 mb-4 brightness-0 invert" />
              <p className="text-gray-400 text-sm">
                A maior plataforma de conexão entre empresas e freelancers de Brasília.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => scrollToSection("como-funciona")} className="hover:text-amber-500 transition-colors">Como funciona</button></li>
                <li><button onClick={() => scrollToSection("beneficios")} className="hover:text-amber-500 transition-colors">Benefícios</button></li>
                <li><button onClick={() => scrollToSection("faq")} className="hover:text-amber-500 transition-colors">FAQ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Acesso</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => navigate("/empresa")} className="hover:text-amber-500 transition-colors">Portal Empresa</button></li>
                <li><button onClick={() => navigate("/freelancer")} className="hover:text-amber-500 transition-colors">Portal Freelancer</button></li>
                <li><button onClick={() => navigate("/login")} className="hover:text-amber-500 transition-colors">Login</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> contato@scalador.com.br
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> (61) 99999-9999
                </li>
              </ul>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Scalador. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
