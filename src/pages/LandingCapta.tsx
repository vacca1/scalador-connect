import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Briefcase, Users, Building2, ChevronDown, Play, Star, Facebook, Instagram, Linkedin, Youtube, TrendingUp, CheckCircle2, Shield, Heart, Clock, Award, FileText, Zap, GraduationCap, Banknote, Calendar, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoCloud } from "@/components/ui/logo-cloud";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import scaladorLogo from "@/assets/scalador-logo.png";
import logoFF from "@/assets/logos/ff.png";
import logoAbrasel from "@/assets/logos/abrasel.png";
import logoBrasilStartups from "@/assets/logos/brasil-startups.png";
import logoCocoBambu from "@/assets/logos/coco-bambu.png";
import logoAlpinus from "@/assets/logos/alpinus.png";
import logoENAdv from "@/assets/logos/en-adv.png";
import logoSTG from "@/assets/logos/stg.png";
import logoVillaCarioca from "@/assets/logos/villa-carioca.png";
import logoDburger from "@/assets/logos/dburger.png";
import logoLabi9 from "@/assets/logos/labi9.png";

const partnerLogos = [
  { src: logoFF, alt: "FF" }, { src: logoAbrasel, alt: "Abrasel" }, { src: logoBrasilStartups, alt: "Brasil Startups" },
  { src: logoCocoBambu, alt: "Coco Bambu" }, { src: logoAlpinus, alt: "Alpinus" }, { src: logoENAdv, alt: "Estrela Neto" },
  { src: logoSTG, alt: "STG" }, { src: logoVillaCarioca, alt: "Villa Carioca" }, { src: logoDburger, alt: "D.Burger" }, { src: logoLabi9, alt: "Labi9" },
];

const testimonials = [
  { name: "Mariana Silva", role: "Gerente de Restaurante", company: "Coco Bambu", quote: "Contratamos 15 profissionais CLT através do Scalador Capta. O processo foi muito mais rápido que agências tradicionais e a qualidade dos candidatos é excepcional.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
  { name: "Roberto Santos", role: "Coordenador de RH", company: "Villa Carioca", quote: "A plataforma reduziu nosso tempo de contratação de 45 para apenas 7 dias. Os candidatos já vêm pré-avaliados com histórico de trabalhos anteriores.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
  { name: "Ana Beatriz", role: "Diretora de Operações", company: "STG Restaurantes", quote: "O diferencial do Scalador Capta é o match perfeito entre candidatos e vagas. Conseguimos profissionais que já conheciam nosso ritmo de trabalho.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
  { name: "Carlos Eduardo", role: "Proprietário", company: "D.Burger", quote: "Já contratei 8 funcionários CLT pela plataforma. Todos com excelentes avaliações de trabalhos freelancer anteriores. É uma evolução natural.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
];

const benefits = [
  { icon: Shield, title: "Carteira Assinada", description: "Todos os direitos trabalhistas garantidos: FGTS, férias, 13º salário e seguro desemprego.", highlight: "100% CLT" },
  { icon: Heart, title: "Benefícios Completos", description: "Vale transporte, vale refeição, plano de saúde e odontológico nas melhores empresas.", highlight: "VT + VR + Saúde" },
  { icon: TrendingUp, title: "Crescimento na Carreira", description: "Oportunidades de promoção e desenvolvimento profissional em empresas sólidas.", highlight: "Plano de Carreira" },
];

const stats = [
  { value: "+1.500", label: "Vagas CLT Abertas", icon: Briefcase },
  { value: "+3.000", label: "Empresas Parceiras", icon: Building2 },
  { value: "7 dias", label: "Tempo Médio de Contratação", icon: Clock },
  { value: "+95%", label: "Taxa de Satisfação", icon: Award },
];

const cltBenefits = [
  { icon: Banknote, title: "Salário Fixo", description: "Receba mensalmente com todos os direitos" },
  { icon: Shield, title: "FGTS", description: "Fundo de garantia depositado todo mês" },
  { icon: Calendar, title: "Férias Remuneradas", description: "30 dias de descanso com adicional de 1/3" },
  { icon: GraduationCap, title: "13º Salário", description: "Gratificação natalina garantida" },
  { icon: Heart, title: "Plano de Saúde", description: "Cobertura médica para você e família" },
  { icon: MapPin, title: "Vale Transporte", description: "Deslocamento custeado pela empresa" },
];

const faqs = [
  { question: "Como funciona o Scalador Capta?", answer: "O Scalador Capta conecta profissionais qualificados com empresas que buscam contratar com carteira assinada (CLT). Basta criar seu perfil, destacar suas experiências e candidatar-se às vagas que mais combinam com você." },
  { question: "Qual a diferença entre Scalador e Scalador Capta?", answer: "O Scalador tradicional é focado em trabalhos freelancer (diárias e temporários). O Scalador Capta é dedicado a empregos formais com carteira assinada, benefícios completos e estabilidade." },
  { question: "Quais benefícios terei com um emprego CLT?", answer: "Empregos CLT garantem carteira assinada, FGTS, férias remuneradas, 13º salário, vale transporte, e muitas empresas oferecem também vale refeição, plano de saúde e odontológico." },
  { question: "Quanto tempo leva para ser contratado?", answer: "Em média, nossos candidatos são contratados em 7 dias. Profissionais com boas avaliações de trabalhos freelancer anteriores têm prioridade e são contratados ainda mais rápido." },
  { question: "Preciso ter experiência como freelancer para me candidatar?", answer: "Não é obrigatório, mas profissionais que já trabalharam como freelancer no Scalador têm vantagem competitiva pois já possuem avaliações e histórico verificado." },
];

const menuItems = [
  { label: "Benefícios", href: "#beneficios" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Dúvidas", href: "#faq" },
];

export default function LandingCapta() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }} 
        animate={{ y: 0 }} 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-indigo-100" 
            : "bg-white/70 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={scaladorLogo} alt="Scalador" className="h-10 w-auto" />
            <span className="font-black text-xl hidden sm:block">
              Scalador <span className="text-indigo-600">Capta</span>
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button 
                key={item.label}
                onClick={() => scrollToSection(item.href.replace("#", ""))}
                className="text-slate-700 hover:text-indigo-600 font-semibold transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/login")} className="hidden md:flex text-slate-700 hover:text-indigo-600 hover:bg-indigo-50">
              <User className="mr-2 h-4 w-4" />Entrar
            </Button>
            <Button onClick={() => navigate("/login")} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25">
              Quero Trabalhar
            </Button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-700">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-t border-indigo-100">
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
                {menuItems.map((item) => (
                  <button 
                    key={item.label}
                    onClick={() => scrollToSection(item.href.replace("#", ""))}
                    className="text-left py-3 px-4 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <Button variant="outline" onClick={() => navigate("/login")} className="mt-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50">Entrar</Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50/50 -z-10" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Social Proof Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-3 mb-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-md">
                  <img src={`https://i.pravatar.cc/40?img=${i + 20}`} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600">
              <span className="font-bold text-indigo-600">+1.500</span> vagas CLT disponíveis
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
              Encontre seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">emprego formal</span> nos melhores estabelecimentos do Brasil
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-10">
              Carteira assinada, benefícios completos e estabilidade. <br className="hidden md:block" />
              <span className="font-semibold text-indigo-600">Construa sua carreira conosco!</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/login")} className="text-lg px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-500/30">
                <Briefcase className="mr-2 h-5 w-5" />Ver Vagas CLT (+1.500)
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/")} className="text-lg px-8 py-6 border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                <Zap className="mr-2 h-5 w-5" />Prefiro Freelancer
              </Button>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex justify-center mt-16">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center text-slate-400">
              <span className="text-sm mb-2">Descubra os benefícios</span>
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CLT Benefits Grid */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-lg uppercase tracking-wide">Benefícios CLT</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Tudo o que você tem direito</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Empregos formais garantem segurança e estabilidade para você e sua família</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {cltBenefits.map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-indigo-50/50 border border-indigo-100 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-20 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(129,140,248,0.3),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Como funciona?</h2>
            <p className="text-lg text-indigo-200">Em 3 passos simples você encontra seu emprego ideal</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Crie seu perfil", description: "Complete seu cadastro em menos de 5 minutos com suas experiências e habilidades" },
              { step: "2", title: "Candidate-se", description: "Escolha as vagas que combinam com você e envie sua candidatura com um clique" },
              { step: "3", title: "Seja contratado", description: "Receba propostas das empresas e comece seu novo emprego com carteira assinada" },
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <span className="text-2xl font-bold text-indigo-300">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-indigo-200">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
            <Button size="lg" onClick={() => navigate("/login")} className="text-lg px-8 py-6 bg-white text-indigo-600 hover:bg-indigo-50">
              Começar Agora
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-slate-600 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Cards */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-lg">Por que escolher o Scalador Capta?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Vantagens exclusivas</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-indigo-100 rounded-3xl p-8 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 mb-4">{benefit.description}</p>
                <span className="inline-flex items-center gap-2 text-indigo-600 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />{benefit.highlight}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Empresas que contratam pelo Scalador Capta</h2>
            <p className="text-lg text-slate-600">Mais de 3.000 estabelecimentos parceiros em todo o Brasil</p>
          </motion.div>
          <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl border border-indigo-100 py-8">
            <LogoCloud logos={partnerLogos} />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">O que nossos parceiros dizem</h2>
            <p className="text-lg text-slate-600">Empresas que já contrataram através do Scalador Capta</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-indigo-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200" />
                  <div>
                    <h3 className="font-bold text-slate-900">{t.name}</h3>
                    <p className="text-indigo-600 text-sm font-medium">{t.role}</p>
                    <p className="text-slate-500 text-sm">{t.company}</p>
                  </div>
                </div>
                <blockquote className="text-slate-700 italic leading-relaxed">"{t.quote}"</blockquote>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Perguntas Frequentes</h2>
            <p className="text-lg text-slate-600">Tire suas dúvidas sobre o Scalador Capta</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-gradient-to-br from-white to-indigo-50/30 border border-indigo-100 rounded-xl px-6 overflow-hidden">
                  <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-indigo-600 py-6">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-slate-600 pb-6">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_40%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para conquistar seu emprego dos sonhos?
            </h2>
            <p className="text-lg text-indigo-100 mb-10">
              Mais de 1.500 vagas CLT te esperando em todo o Brasil
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/login")} className="text-lg px-8 py-6 bg-white text-indigo-600 hover:bg-indigo-50">
                <Briefcase className="mr-2 h-5 w-5" />Quero um Emprego CLT
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/")} className="text-lg px-8 py-6 border-white text-white hover:bg-white/10">
                <Zap className="mr-2 h-5 w-5" />Prefiro Trabalhos Freelancer
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <img src={scaladorLogo} alt="Scalador" className="h-10 w-auto brightness-0 invert" />
              <span className="font-bold text-lg">Scalador <span className="text-indigo-400">Capta</span></span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span>© Scalador Capta 2024</span>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
