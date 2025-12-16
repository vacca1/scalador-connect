import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, Briefcase, Users, Building2, DollarSign, Clock, FileText, ChevronDown, Play, Star, Facebook, Instagram, Linkedin, Youtube, TrendingUp, CheckCircle2, Gift, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoCloud } from "@/components/ui/logo-cloud";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { InfiniteGridBackground } from "@/components/ui/the-infinite-grid";
import { MenuBar } from "@/components/ui/menu-bar";
import { BrazilMap } from "@/components/BrazilMap";
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
  { name: "Gabriel", role: "Freelancer Garçom", quote: "Desde o oferecimento da vaga até a contratação o processo foi muito rápido. Marquei a entrevista em um dia e no dia seguinte já estava trabalhando.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
  { name: "Leandro", role: "Freelancer Bartender", quote: "Um diferencial muito grande do Scalador são as avaliações, cada vez que você completa um trabalho bem feito, sua pontuação cresce.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
  { name: "Karina", role: "Freelancer Promotora", quote: "São postadas vagas todos os dias na plataforma, acho que a iniciativa é muito boa e espero que possa continuar ajudando muitas pessoas.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
  { name: "Kathleen", role: "Freelancer Recepcionista", quote: "Basta você acessar a plataforma, lá você encontra todas as informações sobre a vaga, depois é só escolher qual horário está disponível.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
];

const benefits = [
  { icon: Clock, title: "Rápido e Prático", description: "Complete seu perfil em menos de 5 minutos e consiga oportunidades 10x mais rápido.", highlight: "10x mais rápido" },
  { icon: TrendingUp, title: "Ganhe Ainda Mais", description: "Consiga diárias até 27% maiores que a média de mercado.", highlight: "+27% de ganhos" },
  { icon: FileText, title: "Perfil Profissional", description: "O Scalador gera automaticamente um perfil com suas informações e avaliações.", highlight: "Taxa zero" },
];

const stats = [
  { value: "+5.000", label: "Vagas abertas no Brasil", icon: Briefcase },
  { value: "+3.000", label: "Empresas parceiras", icon: Building2 },
  { value: "+5 milhões", label: "De oportunidades geradas", icon: Users },
  { value: "+500 milhões", label: "De renda gerada (GMV)", icon: DollarSign },
];

const faqs = [
  { question: "Como funciona o Scalador?", answer: "O Scalador conecta freelancers qualificados com empresas que precisam de profissionais para trabalhos temporários em todo o Brasil. Basta criar seu perfil e começar a receber ofertas." },
  { question: "Quanto custa usar a plataforma?", answer: "Para freelancers, a plataforma é 100% gratuita. Empresas pagam uma taxa de serviço de 9,9% sobre o valor das diárias." },
  { question: "Quanto tempo leva para conseguir um trabalho?", answer: "A maioria dos freelancers consegue seu primeiro trabalho em menos de 48 horas após completar o perfil." },
  { question: "Como recebo meu pagamento?", answer: "Os pagamentos são processados diretamente pela plataforma e transferidos para sua conta em até 24 horas após a conclusão do trabalho." },
  { question: "Em quais cidades o Scalador está disponível?", answer: "O Scalador está presente em todas as capitais e principais cidades do Brasil, com expansão contínua para novas regiões." },
];

const menuItems = [
  {
    icon: Gift,
    label: "Benefícios",
    href: "#beneficios",
    gradient: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
  {
    icon: Building2,
    label: "Parceiros",
    href: "#parceiros",
    gradient: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500",
  },
  {
    icon: MessageCircle,
    label: "Depoimentos",
    href: "#depoimentos",
    gradient: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "text-green-500",
  },
  {
    icon: FileText,
    label: "FAQ",
    href: "#faq",
    gradient: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(147,51,234,0.06) 50%, rgba(126,34,206,0) 100%)",
    iconColor: "text-purple-500",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("Benefícios");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const sectionMap: Record<string, string> = {
      "Benefícios": "beneficios",
      "Parceiros": "parceiros",
      "Depoimentos": "depoimentos",
      "FAQ": "faq",
    };
    const targetId = sectionMap[id] || id.toLowerCase();
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <InfiniteGridBackground className="min-h-screen">
      {/* Header with Glassmorphism + MenuBar */}
      <motion.header 
        initial={{ y: -100 }} 
        animate={{ y: 0 }} 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-background/70 backdrop-blur-xl shadow-lg border-b border-border/50" 
            : "bg-background/30 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/"><img src={scaladorLogo} alt="Scalador" className="h-10 w-auto" /></Link>
          
          {/* Desktop MenuBar */}
          <div className="hidden lg:block">
            <MenuBar
              items={menuItems}
              activeItem={activeSection}
              onItemClick={scrollToSection}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/login")} className="hidden md:flex backdrop-blur-sm bg-background/50 hover:bg-background/70">Entrar</Button>
            <Button onClick={() => navigate("/login")} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">Começar Agora</Button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-foreground">{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-background/90 backdrop-blur-xl border-t border-border">
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
                {menuItems.map((item) => (
                  <button 
                    key={item.label} 
                    onClick={() => scrollToSection(item.label)} 
                    className={`flex items-center gap-3 text-left py-3 px-4 rounded-xl transition-colors ${
                      activeSection === item.label 
                        ? "bg-primary/10 text-primary" 
                        : "text-foreground/80 hover:bg-muted"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                <Button variant="outline" onClick={() => navigate("/login")} className="mt-2">Entrar</Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-3 mb-8">
            <div className="flex -space-x-3">{[1, 2, 3, 4].map((i) => (<div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden"><img src={`https://i.pravatar.cc/40?img=${i + 10}`} alt="" className="w-full h-full object-cover" /></div>))}</div>
            <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">+5 milhões</span> de oportunidades geradas</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">Com o Scalador você consegue <span className="text-primary">vagas de trabalho</span> nos melhores estabelecimentos do Brasil</h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10">Encontre seu próximo trabalho em menos de <span className="font-semibold text-foreground">5 minutos!</span></p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/freelancer")} className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"><Briefcase className="mr-2 h-5 w-5" />Ver Vagas (+5.000)</Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="text-lg px-8 py-6 border-primary/30 hover:bg-primary/10 backdrop-blur-sm bg-background/50"><Users className="mr-2 h-5 w-5" />Quero Trabalhar</Button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex justify-center mt-16">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center text-muted-foreground"><span className="text-sm mb-2">Role para descobrir mais</span><ChevronDown className="h-5 w-5" /></motion.div>
          </motion.div>
        </div>
      </section>

      {/* Map Section - Brazil Map */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Encontre seu próximo trabalho em mais de <span className="text-primary">3.000 estabelecimentos</span></h2>
            <p className="text-lg text-muted-foreground">Vagas em todo o Brasil, perto de você</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="aspect-[16/9] md:aspect-[21/9] relative bg-gradient-to-br from-primary/5 to-primary/10">
              <BrazilMap />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="parceiros" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Empresas que confiam no Scalador</h2>
            <p className="text-lg text-muted-foreground">Mais de 3.000 estabelecimentos parceiros em todo o Brasil</p>
          </motion.div>
          <div className="mx-auto my-5 h-px max-w-sm bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 py-8">
            <LogoCloud logos={partnerLogos} />
          </div>
          <div className="mt-5 h-px bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
        </div>
      </section>

      {/* Intermediate CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto bg-card/60 backdrop-blur-xl rounded-3xl p-12 border border-border/50 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Não perca mais tempo no caminho para o trabalho!</h2>
            <p className="text-lg text-muted-foreground mb-8">Complete seu perfil em menos de 5 minutos e encontre a vaga mais perto de você, em qualquer cidade do Brasil.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/freelancer")} className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">Ver Vagas (+5.000)</Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="text-lg px-8 py-6">Quero Trabalhar</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-primary font-semibold text-lg">Benefícios</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Por que fazer parte da comunidade Scalador?</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group">
                <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8 h-full hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:bg-card/80">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors"><benefit.icon className="h-7 w-7 text-primary" /></div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground mb-4">{benefit.description}</p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold"><CheckCircle2 className="h-4 w-4" />{benefit.highlight}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Impact Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.2),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Já impactamos milhares de famílias brasileiras</h2>
            <p className="text-lg text-slate-300">Números que representam nosso compromisso com você</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20"><stat.icon className="h-8 w-8 text-primary" /></div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-slate-300 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Casos de Sucesso</h2>
            <p className="text-lg text-muted-foreground">Algumas pessoas que conseguiram trabalho através do Scalador</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="relative"><img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/30" /><div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center"><Play className="h-4 w-4 text-primary-foreground fill-current" /></div></div>
                  <div className="flex-1"><h3 className="font-bold text-primary text-lg">{t.name}</h3><p className="text-muted-foreground text-sm">{t.role}</p></div>
                </div>
                <blockquote className="mt-6 text-foreground/90 italic leading-relaxed">"{t.quote}"</blockquote>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Perguntas Frequentes</h2>
            <p className="text-lg text-muted-foreground">Tire suas dúvidas sobre o Scalador</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl px-6 overflow-hidden">
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-6">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary/90 to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white/10,transparent_40%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Temos mais de 5.000 vagas em todo o Brasil te esperando!</h2>
            <p className="text-lg text-primary-foreground/80 mb-10">Cadastre-se grátis no Scalador e aguarde seus convites de entrevista.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/login")} className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90">Quero Trabalhar</Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/freelancer")} className="text-lg px-8 py-6 border-white text-white hover:bg-white/10">Ver Vagas (+5.000)</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <img src={scaladorLogo} alt="Scalador" className="h-10 w-auto brightness-0 invert" />
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span>© Scalador 2024</span>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de uso</a>
            </div>
          </div>
        </div>
      </footer>
    </InfiniteGridBackground>
  );
}
