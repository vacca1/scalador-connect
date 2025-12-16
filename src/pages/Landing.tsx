import { Briefcase, Users, TrendingUp, Star, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import scaladorLogo from "@/assets/scalador-logo.png";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50">
      {/* HEADER */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={scaladorLogo} alt="Scalador" className="h-10 md:h-12" />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#como-funciona" className="text-gray-700 hover:text-indigo-600 font-semibold transition-colors">
              Como funciona
            </a>
            <a href="#para-empresas" className="text-gray-700 hover:text-indigo-600 font-semibold transition-colors">
              Para empresas
            </a>
            <a href="#para-freelancers" className="text-gray-700 hover:text-indigo-600 font-semibold transition-colors">
              Para freelancers
            </a>
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="px-6 py-2 rounded-xl font-bold hover:bg-indigo-50"
            >
              Entrar
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <a href="#como-funciona" className="block text-gray-700 hover:text-indigo-600 font-semibold">
              Como funciona
            </a>
            <a href="#para-empresas" className="block text-gray-700 hover:text-indigo-600 font-semibold">
              Para empresas
            </a>
            <a href="#para-freelancers" className="block text-gray-700 hover:text-indigo-600 font-semibold">
              Para freelancers
            </a>
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="w-full"
            >
              Entrar
            </Button>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Conectamos Empresas
            </span>
            <br />
            <span className="text-gray-900">e Freelancers</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            A plataforma que une quem precisa de profissionais qualificados 
            com quem busca oportunidades de trabalho
          </p>

          {/* CARDS DE ESCOLHA - PRINCIPAL */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-12">
            {/* CARD EMPRESA */}
            <div 
              onClick={() => navigate('/empresa')}
              className="bg-white/70 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 
                         transition-all duration-300 cursor-pointer group border-4 border-transparent 
                         hover:border-indigo-600"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-600 to-purple-600 
                            rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all">
                <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4 text-gray-900">
                Quero Contratar
              </h2>
              <p className="text-gray-600 mb-6">
                Encontre profissionais qualificados para suas vagas em minutos
              </p>
              <button className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 
                               text-white rounded-xl font-bold shadow-xl hover:shadow-2xl 
                               hover:scale-105 transition-all">
                Sou Empresa →
              </button>
            </div>

            {/* CARD FREELANCER */}
            <div 
              onClick={() => navigate('/freelancer')}
              className="bg-white/70 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 
                         transition-all duration-300 cursor-pointer group border-4 border-transparent 
                         hover:border-amber-500"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-orange-600 
                            rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all">
                <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4 text-gray-900">
                Quero Trabalhar
              </h2>
              <p className="text-gray-600 mb-6">
                Encontre oportunidades de trabalho perto de você
              </p>
              <button className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 
                               text-white rounded-xl font-bold shadow-xl hover:shadow-2xl 
                               hover:scale-105 transition-all">
                Sou Freelancer →
              </button>
            </div>
          </div>

          {/* ESTATÍSTICAS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg">
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-black text-gray-900">+500</p>
              <p className="text-xs md:text-sm text-gray-600">Vagas Ativas</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-black text-gray-900">+2.000</p>
              <p className="text-xs md:text-sm text-gray-600">Freelancers</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg">
              <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-black text-gray-900">+300</p>
              <p className="text-xs md:text-sm text-gray-600">Empresas</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg">
              <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-black text-gray-900">4.8</p>
              <p className="text-xs md:text-sm text-gray-600">Avaliação Média</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: COMO FUNCIONA */}
      <section id="como-funciona" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 md:mb-16">Como funciona?</h2>
          
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* PARA EMPRESAS */}
            <div id="para-empresas">
              <h3 className="text-xl md:text-2xl font-bold mb-8 text-indigo-600">Para Empresas</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-indigo-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Publique sua vaga</h4>
                    <p className="text-gray-600">Descreva a vaga e o perfil desejado</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-indigo-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Receba candidaturas</h4>
                    <p className="text-gray-600">Freelancers qualificados se candidatam</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-indigo-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Contrate e gerencie</h4>
                    <p className="text-gray-600">Escolha o profissional e acompanhe o trabalho</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PARA FREELANCERS */}
            <div id="para-freelancers">
              <h3 className="text-xl md:text-2xl font-bold mb-8 text-amber-600">Para Freelancers</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-amber-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Crie seu perfil</h4>
                    <p className="text-gray-600">Cadastre suas habilidades e experiência</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-amber-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Candidate-se</h4>
                    <p className="text-gray-600">Veja vagas próximas e se candidate</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-amber-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Trabalhe e receba</h4>
                    <p className="text-gray-600">Realize o trabalho e receba automaticamente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <img src={scaladorLogo} alt="Scalador" className="h-10 mx-auto mb-6 brightness-0 invert" />
          <p className="text-gray-400">© 2025 Scalador. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
