import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase, Clock, MapPin, Calendar, DollarSign, User, Bell, MessageSquare, 
  Menu, Search, X, Check, TrendingUp, Users, ArrowRight, Phone, Navigation, 
  AlertCircle, CheckCircle, XCircle, Timer, Send, Star, Edit, Settings, 
  HelpCircle, LogOut, Filter, ChevronDown, Home, Wallet, FileText, Heart, 
  Award, Zap, Building
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import scaladorLogo from "@/assets/scalador-logo.png";
import { AnimatedSelect } from "@/components/ui/animated-select";
import { MenuBar } from "@/components/ui/menu-bar";

// ===== TIPOS =====
type JobType = "freelance" | "clt";
type CandidaturaStatus = "aguardando" | "aceito" | "recusado";

interface Job {
  id: string;
  titulo: string;
  empresa: string;
  logoEmpresa: string;
  tipo: JobType;
  profissao: string;
  descricao: string;
  valorDiaria: number;
  salarioMensal?: number;
  escala?: string;
  beneficios: string[];
  localizacao: {
    endereco: string;
    bairro: string;
    cidade: string;
    estado: string;
    coordenadas?: { lat: number; lng: number };
  };
  data: string;
  horarioEntrada: string;
  horarioSaida: string;
  experienciaNecessaria: boolean;
  publicadoEm: Date;
}

interface Candidatura {
  id: string;
  jobId: string;
  job: Job;
  status: CandidaturaStatus;
  dataAplicacao: Date;
}

// ===== MOCK DATA =====
const MOCK_JOBS: Job[] = [
  {
    id: "1",
    titulo: "Garçom para Evento Corporativo",
    empresa: "Restaurante Premium",
    logoEmpresa: "🍽️",
    tipo: "freelance",
    profissao: "Garçom",
    descricao: "Evento de confraternização empresarial de alto padrão.",
    valorDiaria: 320,
    beneficios: ["Alimentação", "Transporte"],
    localizacao: {
      endereco: "SAUS Quadra 4",
      bairro: "Asa Sul",
      cidade: "Brasília",
      estado: "DF",
      coordenadas: { lat: -15.7942, lng: -47.8822 }
    },
    data: "2025-12-20",
    horarioEntrada: "18:00",
    horarioSaida: "23:00",
    experienciaNecessaria: true,
    publicadoEm: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "2",
    titulo: "Auxiliar de Limpeza",
    empresa: "Shopping Center",
    logoEmpresa: "🏬",
    tipo: "freelance",
    profissao: "Auxiliar de limpeza",
    descricao: "Limpeza e organização após evento especial.",
    valorDiaria: 180,
    beneficios: ["Alimentação"],
    localizacao: {
      endereco: "SCS Quadra 7",
      bairro: "Asa Sul",
      cidade: "Brasília",
      estado: "DF",
      coordenadas: { lat: -15.7953, lng: -47.8914 }
    },
    data: "2025-12-18",
    horarioEntrada: "06:00",
    horarioSaida: "14:00",
    experienciaNecessaria: false,
    publicadoEm: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  {
    id: "3",
    titulo: "Recepcionista",
    empresa: "Hotel Central",
    logoEmpresa: "🏨",
    tipo: "clt",
    profissao: "Recepcionista",
    descricao: "Vaga efetiva para atendimento em hotel 4 estrelas.",
    valorDiaria: 0,
    salarioMensal: 2800,
    escala: "Escala 6x1",
    beneficios: ["Vale Transporte", "Vale Refeição", "Plano de Saúde"],
    localizacao: {
      endereco: "SHN Quadra 5",
      bairro: "Asa Norte",
      cidade: "Brasília",
      estado: "DF",
      coordenadas: { lat: -15.7094, lng: -47.9025 }
    },
    data: "Início Imediato",
    horarioEntrada: "08:00",
    horarioSaida: "16:00",
    experienciaNecessaria: true,
    publicadoEm: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: "4",
    titulo: "Vendedor(a)",
    empresa: "Loja de Roupas",
    logoEmpresa: "👔",
    tipo: "clt",
    profissao: "Vendedor",
    descricao: "Vaga CLT para vendas em loja de shopping.",
    valorDiaria: 0,
    salarioMensal: 2200,
    escala: "Segunda a Sábado",
    beneficios: ["Vale Transporte", "Vale Refeição", "Comissão"],
    localizacao: {
      endereco: "Park Shopping",
      bairro: "Guará",
      cidade: "Brasília",
      estado: "DF",
      coordenadas: { lat: -15.8333, lng: -47.9667 }
    },
    data: "Início Imediato",
    horarioEntrada: "10:00",
    horarioSaida: "18:00",
    experienciaNecessaria: false,
    publicadoEm: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    id: "5",
    titulo: "Promotor de Eventos",
    empresa: "Agência Marketing",
    logoEmpresa: "🎯",
    tipo: "freelance",
    profissao: "Promotor",
    descricao: "Ação promocional em supermercado.",
    valorDiaria: 250,
    beneficios: ["Alimentação", "Uniforme"],
    localizacao: {
      endereco: "Supermercado Extra",
      bairro: "Taguatinga",
      cidade: "Brasília",
      estado: "DF",
      coordenadas: { lat: -15.8270, lng: -48.0501 }
    },
    data: "2025-12-22",
    horarioEntrada: "09:00",
    horarioSaida: "17:00",
    experienciaNecessaria: false,
    publicadoEm: new Date(Date.now() - 4 * 60 * 60 * 1000)
  }
];

const MOCK_CANDIDATURAS: Candidatura[] = [
  {
    id: "c1",
    jobId: "1",
    job: MOCK_JOBS[0],
    status: "aceito",
    dataAplicacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: "c2",
    jobId: "2",
    job: MOCK_JOBS[1],
    status: "aguardando",
    dataAplicacao: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

// ===== HELPERS =====
const getTempoPublicacao = (data: Date): string => {
  const diff = Date.now() - data.getTime();
  const horas = Math.floor(diff / (1000 * 60 * 60));
  const dias = Math.floor(horas / 24);
  if (horas < 1) return "há menos de 1 hora";
  if (horas === 1) return "há 1 hora";
  if (horas < 24) return `há ${horas} horas`;
  if (dias === 1) return "há 1 dia";
  return `há ${dias} dias`;
};

const calcularDistancia = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ===== COMPONENTE PRINCIPAL =====
export default function ProfissionalPortal() {
  const [currentPage, setCurrentPage] = useState("vagas");
  const [jobs] = useState<Job[]>(MOCK_JOBS);
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>(MOCK_CANDIDATURAS);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const { toast } = useToast();

  const localizacaoUsuario = { lat: -15.7801, lng: -47.9292 };

  const [filtros, setFiltros] = useState({
    busca: "",
    tipo: "todos",
    bairro: "todos"
  });

  // Menu items for MenuBar
  const menuItems = [
    { icon: Home, label: "Vagas", href: "#", gradient: "from-amber-500 to-orange-600", iconColor: "#F59E0B" },
    { icon: FileText, label: "Candidaturas", href: "#", gradient: "from-green-500 to-emerald-600", iconColor: "#10B981" },
    { icon: Wallet, label: "Ganhos", href: "#", gradient: "from-green-500 to-emerald-600", iconColor: "#10B981" },
    { icon: User, label: "Perfil", href: "#", gradient: "from-purple-500 to-pink-600", iconColor: "#A855F7" },
  ];

  const navegarPara = (pagina: string, jobId?: string) => {
    setCurrentPage(pagina);
    if (jobId) {
      const job = jobs.find(j => j.id === jobId);
      setSelectedJob(job || null);
    }
    setShowMenu(false);
  };

  const candidatarVaga = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const novaCandidatura: Candidatura = {
      id: `c${Date.now()}`,
      jobId,
      job,
      status: "aguardando",
      dataAplicacao: new Date()
    };
    setCandidaturas(prev => [novaCandidatura, ...prev]);
    toast({
      title: "Candidatura enviada! 🎉",
      description: `Você se candidatou para ${job.titulo}`
    });
  };

  const jaCandidatou = (jobId: string) => candidaturas.some(c => c.jobId === jobId);

  // ===== COMPONENTES =====
  const JobCard = ({ job }: { job: Job }) => {
    const isFreelance = job.tipo === "freelance";
    const tipoBorderColor = isFreelance ? "border-l-amber-500" : "border-l-indigo-500";
    const candidatou = jaCandidatou(job.id);

    return (
      <div 
        className={`glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-1 relative overflow-hidden border-l-4 ${tipoBorderColor}`}
        onClick={() => navegarPara("vaga-detalhes", job.id)}
      >
        <div className={`absolute inset-0 ${isFreelance ? "bg-gradient-to-br from-amber-500/5 to-orange-500/5" : "bg-gradient-to-br from-indigo-500/5 to-purple-500/5"} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        
        {/* Badge de Tipo */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            isFreelance 
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/40" 
              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40"
          }`}>
            {isFreelance ? <Zap className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
            {isFreelance ? "Freelancer" : "CLT"}
          </span>
        </div>
        
        <div className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${isFreelance ? "from-amber-100 to-orange-100" : "from-indigo-100 to-purple-100"} rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:scale-110 transition-all flex-shrink-0`}>
            {job.logoEmpresa}
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-start justify-between mb-2 pr-24 sm:pr-28">
              <div className="flex-1 min-w-0">
                <p className={`text-xs sm:text-sm font-semibold mb-1 ${isFreelance ? "text-amber-600" : "text-indigo-600"}`}>{job.empresa}</p>
                <h3 className="text-lg sm:text-2xl font-black text-gray-900 line-clamp-2">{job.titulo}</h3>
              </div>
            </div>
            
            {/* Valor Card */}
            {isFreelance ? (
              <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                <p className="text-xs text-green-600 font-medium mb-1">Você recebe por dia</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-green-600">
                    R$ {job.valorDiaria.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-xl">
                <p className="text-xs text-indigo-600 font-medium mb-1">Salário Mensal</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-indigo-600">
                    R$ {(job.salarioMensal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {job.beneficios && job.beneficios.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.beneficios.slice(0, 3).map((b, i) => (
                      <span key={i} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <p className="text-gray-700 text-sm mb-4 line-clamp-2">{job.descricao}</p>
            
            <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1.5">
                <MapPin className={`w-4 h-4 ${isFreelance ? "text-amber-500" : "text-indigo-500"}`} />
                <span className="font-bold">{job.localizacao.bairro}</span>
                <span className="text-gray-400">•</span>
                {job.localizacao.cidade}
              </span>
              {job.localizacao.coordenadas && (
                <span className="flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-green-500" />
                  <span className="font-bold text-green-600">
                    {calcularDistancia(localizacaoUsuario.lat, localizacaoUsuario.lng, job.localizacao.coordenadas.lat, job.localizacao.coordenadas.lng).toFixed(1)}km
                  </span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className={`w-4 h-4 ${isFreelance ? "text-amber-500" : "text-indigo-500"}`} />
                {isFreelance ? new Date(job.data).toLocaleDateString("pt-BR") : job.escala || "Segunda a Sexta"}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className={`w-4 h-4 ${isFreelance ? "text-amber-500" : "text-indigo-500"}`} />
                {job.horarioEntrada} - {job.horarioSaida}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">{getTempoPublicacao(job.publicadoEm)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!candidatou) candidatarVaga(job.id);
                }}
                disabled={candidatou}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  candidatou
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isFreelance
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:scale-105"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105"
                }`}
              >
                {candidatou ? "✓ Candidatado" : "Me Candidatar →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ===== PÁGINAS =====
  const PaginaVagas = () => {
    const jobsFiltrados = jobs.filter(job => {
      if (filtros.busca && !job.titulo.toLowerCase().includes(filtros.busca.toLowerCase())) return false;
      if (filtros.tipo !== "todos" && job.tipo !== filtros.tipo) return false;
      if (filtros.bairro !== "todos" && job.localizacao.bairro !== filtros.bairro) return false;
      return true;
    });

    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Vagas Disponíveis</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-xl">Encontre seu próximo trabalho 🚀</p>
        </div>

        {/* Search */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex gap-2 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Procure por vagas..."
                className="w-full pl-12 pr-4 py-4 glass rounded-xl font-medium focus:ring-4 focus:ring-amber-500/30"
                value={filtros.busca}
                onChange={e => setFiltros({ ...filtros, busca: e.target.value })}
              />
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:scale-105 transition-all">
              Buscar
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
            <button 
              onClick={() => setFiltros({ ...filtros, tipo: "todos" })}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                filtros.tipo === "todos" ? "bg-gray-900 text-white shadow-lg" : "glass text-gray-600 hover:bg-gray-100"
              }`}
            >
              Todas Vagas
              <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full">{jobs.length}</span>
            </button>
            <button 
              onClick={() => setFiltros({ ...filtros, tipo: "freelance" })}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                filtros.tipo === "freelance" 
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg" 
                  : "glass text-amber-600 hover:bg-amber-50 border border-amber-200"
              }`}
            >
              <Zap className="w-4 h-4" /> Freelancer
              <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full">{jobs.filter(j => j.tipo === "freelance").length}</span>
            </button>
            <button 
              onClick={() => setFiltros({ ...filtros, tipo: "clt" })}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                filtros.tipo === "clt" 
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg" 
                  : "glass text-indigo-600 hover:bg-indigo-50 border border-indigo-200"
              }`}
            >
              <Briefcase className="w-4 h-4" /> CLT
              <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full">{jobs.filter(j => j.tipo === "clt").length}</span>
            </button>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <button className="w-full px-6 py-4 glass rounded-2xl font-bold flex items-center justify-center gap-3 border-2 border-amber-500/30">
                <Filter className="w-5 h-5 text-amber-500" />
                Filtrar Vagas
                <ChevronDown className="w-5 h-5 text-amber-500" />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
              <SheetHeader className="pb-4 border-b">
                <SheetTitle className="text-xl font-black flex items-center gap-2">
                  <Filter className="w-5 h-5 text-amber-500" /> Filtros
                </SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Tipo de vaga</label>
                  <AnimatedSelect
                    accentColor="orange"
                    value={filtros.tipo}
                    onChange={(value) => setFiltros({ ...filtros, tipo: value })}
                    options={[
                      { value: "todos", label: "Todos os tipos" },
                      { value: "freelance", label: "Freelancer", icon: "⚡" },
                      { value: "clt", label: "CLT", icon: "💼" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Bairro</label>
                  <AnimatedSelect
                    accentColor="orange"
                    value={filtros.bairro}
                    onChange={(value) => setFiltros({ ...filtros, bairro: value })}
                    options={[
                      { value: "todos", label: "Todos os bairros" },
                      { value: "Asa Norte", label: "Asa Norte" },
                      { value: "Asa Sul", label: "Asa Sul" },
                      { value: "Taguatinga", label: "Taguatinga" },
                      { value: "Guará", label: "Guará" },
                    ]}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Jobs Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="glass rounded-3xl p-6 sticky top-24">
              <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-amber-500" /> Filtros
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Tipo de vaga</label>
                  <AnimatedSelect
                    accentColor="orange"
                    value={filtros.tipo}
                    onChange={(value) => setFiltros({ ...filtros, tipo: value })}
                    options={[
                      { value: "todos", label: "Todos os tipos" },
                      { value: "freelance", label: "Freelancer", icon: "⚡" },
                      { value: "clt", label: "CLT", icon: "💼" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Bairro</label>
                  <AnimatedSelect
                    accentColor="orange"
                    value={filtros.bairro}
                    onChange={(value) => setFiltros({ ...filtros, bairro: value })}
                    options={[
                      { value: "todos", label: "Todos os bairros" },
                      { value: "Asa Norte", label: "Asa Norte" },
                      { value: "Asa Sul", label: "Asa Sul" },
                      { value: "Taguatinga", label: "Taguatinga" },
                      { value: "Guará", label: "Guará" },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            {jobsFiltrados.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma vaga encontrada</h3>
                <p className="text-gray-600">Tente ajustar os filtros</p>
              </div>
            ) : (
              jobsFiltrados.map(job => <JobCard key={job.id} job={job} />)
            )}
          </div>
        </div>
      </div>
    );
  };

  const PaginaCandidaturas = () => {
    const statusConfig = {
      aguardando: { label: "⏳ Aguardando", color: "bg-yellow-100 text-yellow-700" },
      aceito: { label: "✅ Aceito", color: "bg-green-100 text-green-700" },
      recusado: { label: "❌ Não selecionado", color: "bg-red-100 text-red-700" }
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl sm:text-4xl font-black mb-8 text-center">
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Minhas Candidaturas</span>
        </h2>

        {candidaturas.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma candidatura ainda</h3>
            <p className="text-gray-600 mb-6">Comece a se candidatar às vagas disponíveis!</p>
            <button onClick={() => navegarPara("vagas")} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold">
              Ver Vagas
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {candidaturas.map(c => (
              <div key={c.id} className="glass rounded-2xl p-6 hover:shadow-xl transition-all">
                {c.status === "aceito" && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                    <p className="text-green-700 font-bold text-center">🎉 Parabéns! Você foi selecionado!</p>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-2xl">
                    {c.job.logoEmpresa}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{c.job.titulo}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusConfig[c.status].color}`}>
                        {statusConfig[c.status].label}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{c.job.empresa}</p>
                    <p className="text-gray-500 text-xs">
                      Candidatura enviada em {c.dataAplicacao.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const PaginaGanhos = () => {
    const ganhosEsteMes = 2450;
    const trabalhosMes = 12;
    const mediaPorTrabalho = ganhosEsteMes / trabalhosMes;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl sm:text-4xl font-black mb-8 text-center">
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Meus Ganhos</span>
        </h2>

        {/* Hero Card */}
        <div className="glass rounded-3xl p-8 mb-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <p className="text-green-600 font-medium mb-2">Ganhos este mês</p>
          <p className="text-5xl font-black text-green-600 mb-4">
            R$ {ganhosEsteMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-green-700 flex items-center gap-2">
            💡 Pagamento automático após cada trabalho
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-2xl p-4 text-center">
            <Briefcase className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-900">{trabalhosMes}</p>
            <p className="text-xs text-gray-600">Trabalhos este mês</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-900">R$ {mediaPorTrabalho.toFixed(0)}</p>
            <p className="text-xs text-gray-600">Média por trabalho</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <CheckCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-900">95%</p>
            <p className="text-xs text-gray-600">Taxa comparecimento</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-900">4.8 ⭐</p>
            <p className="text-xs text-gray-600">Avaliação</p>
          </div>
        </div>

        {/* Histórico */}
        <div className="glass rounded-3xl p-6">
          <h3 className="font-bold text-lg mb-4">Histórico de Pagamentos</h3>
          <div className="space-y-3">
            {[
              { empresa: "Restaurante Premium", valor: 320, data: "15/12" },
              { empresa: "Shopping Center", valor: 180, data: "14/12" },
              { empresa: "Hotel Central", valor: 250, data: "12/12" },
            ].map((pag, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{pag.empresa}</p>
                  <p className="text-xs text-gray-500">{pag.data}</p>
                </div>
                <span className="font-bold text-green-600">+ R$ {pag.valor.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const PaginaPerfil = () => {
    const [perfil, setPerfil] = useState({
      nome: "João Silva",
      telefone: "(61) 98765-4321",
      cpf: "123.456.789-00",
      dataNascimento: "15/05/1990",
      profissao: "Garçom",
      habilidades: ["Eventos", "Atendimento VIP", "Buffet"]
    });

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-3xl sm:text-4xl font-black mb-8 text-center">
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Meu Perfil</span>
        </h2>

        <div className="glass rounded-3xl p-8">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-5xl shadow-xl">
              👤
            </div>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome completo</label>
              <input
                type="text"
                value={perfil.nome}
                onChange={e => setPerfil({ ...perfil, nome: e.target.value })}
                className="w-full px-4 py-3 glass rounded-xl focus:ring-4 focus:ring-amber-500/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Telefone</label>
                <input
                  type="text"
                  value={perfil.telefone}
                  onChange={e => setPerfil({ ...perfil, telefone: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-xl focus:ring-4 focus:ring-amber-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">CPF</label>
                <input
                  type="text"
                  value={perfil.cpf}
                  onChange={e => setPerfil({ ...perfil, cpf: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-xl focus:ring-4 focus:ring-amber-500/30"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Data de nascimento</label>
              <input
                type="text"
                value={perfil.dataNascimento}
                onChange={e => setPerfil({ ...perfil, dataNascimento: e.target.value })}
                className="w-full px-4 py-3 glass rounded-xl focus:ring-4 focus:ring-amber-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Profissão principal</label>
              <select
                value={perfil.profissao}
                onChange={e => setPerfil({ ...perfil, profissao: e.target.value })}
                className="w-full px-4 py-3 glass rounded-xl focus:ring-4 focus:ring-amber-500/30"
              >
                <option value="Garçom">Garçom</option>
                <option value="Auxiliar de limpeza">Auxiliar de limpeza</option>
                <option value="Recepcionista">Recepcionista</option>
                <option value="Promotor">Promotor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Habilidades</label>
              <div className="flex flex-wrap gap-2">
                {perfil.habilidades.map((h, i) => (
                  <span key={i} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium flex items-center gap-2">
                    {h}
                    <button onClick={() => setPerfil({ ...perfil, habilidades: perfil.habilidades.filter((_, idx) => idx !== i) })} className="hover:text-amber-900">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => toast({ title: "Perfil salvo!", description: "Suas informações foram atualizadas" })}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:scale-[1.02] transition-all"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    );
  };

  const VagaDetalhes = () => {
    if (!selectedJob) return null;
    const isFreelance = selectedJob.tipo === "freelance";
    const candidatou = jaCandidatou(selectedJob.id);

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navegarPara("vagas")} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900">
          ← Voltar para vagas
        </button>

        <div className="glass rounded-3xl p-8">
          <div className="flex items-start gap-6 mb-6">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl ${isFreelance ? "bg-gradient-to-br from-amber-100 to-orange-100" : "bg-gradient-to-br from-indigo-100 to-purple-100"}`}>
              {selectedJob.logoEmpresa}
            </div>
            <div className="flex-1">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${isFreelance ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"}`}>
                {isFreelance ? "⚡ Freelancer" : "💼 CLT"}
              </span>
              <h1 className="text-3xl font-black text-gray-900 mt-2">{selectedJob.titulo}</h1>
              <p className={`font-semibold ${isFreelance ? "text-amber-600" : "text-indigo-600"}`}>{selectedJob.empresa}</p>
            </div>
          </div>

          {/* Valor */}
          <div className={`p-6 rounded-2xl mb-6 ${isFreelance ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200" : "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-indigo-200"}`}>
            <p className={`text-sm font-medium mb-1 ${isFreelance ? "text-green-600" : "text-indigo-600"}`}>
              {isFreelance ? "Você recebe por dia" : "Salário Mensal"}
            </p>
            <p className={`text-4xl font-black ${isFreelance ? "text-green-600" : "text-indigo-600"}`}>
              R$ {isFreelance ? selectedJob.valorDiaria.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : (selectedJob.salarioMensal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            {!isFreelance && selectedJob.beneficios && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedJob.beneficios.map((b, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">✓ {b}</span>
                ))}
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <MapPin className={`w-5 h-5 ${isFreelance ? "text-amber-500" : "text-indigo-500"}`} />
              <div>
                <p className="font-bold">{selectedJob.localizacao.bairro}</p>
                <p className="text-sm text-gray-600">{selectedJob.localizacao.cidade} - {selectedJob.localizacao.estado}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Calendar className={`w-5 h-5 ${isFreelance ? "text-amber-500" : "text-indigo-500"}`} />
              <div>
                <p className="font-bold">{isFreelance ? new Date(selectedJob.data).toLocaleDateString("pt-BR") : selectedJob.escala}</p>
                <p className="text-sm text-gray-600">{selectedJob.horarioEntrada} - {selectedJob.horarioSaida}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3">Descrição</h3>
            <p className="text-gray-700">{selectedJob.descricao}</p>
          </div>

          <button
            onClick={() => !candidatou && candidatarVaga(selectedJob.id)}
            disabled={candidatou}
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all ${
              candidatou
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isFreelance
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:scale-[1.02]"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:scale-[1.02]"
            }`}
          >
            {candidatou ? "✓ Candidatura Enviada" : "Me Candidatar Agora →"}
          </button>
        </div>
      </div>
    );
  };

  // ===== RENDER =====
  const renderPage = () => {
    switch (currentPage) {
      case "vagas": return <PaginaVagas />;
      case "candidaturas": return <PaginaCandidaturas />;
      case "ganhos": return <PaginaGanhos />;
      case "perfil": return <PaginaPerfil />;
      case "vaga-detalhes": return <VagaDetalhes />;
      default: return <PaginaVagas />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={scaladorLogo} alt="Scalador" className="h-8 sm:h-10" />
              <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Profissional
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <MenuBar 
                items={menuItems} 
                activeItem={currentPage === "vagas" ? "Vagas" : currentPage === "candidaturas" ? "Candidaturas" : currentPage === "ganhos" ? "Ganhos" : "Perfil"}
                onItemClick={(label) => navegarPara(label.toLowerCase())}
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 glass rounded-xl"
            >
              {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl animate-slide-in-right">
            <div className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setShowMenu(false)}><X className="w-6 h-6" /></button>
              </div>
            </div>
            <div className="py-4">
              {menuItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => navegarPara(item.label.toLowerCase())}
                  className={`w-full px-6 py-4 text-left flex items-center gap-3 hover:bg-amber-50 transition-colors ${currentPage === item.label.toLowerCase() ? "bg-amber-50 text-amber-600" : "text-gray-700"}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20">
        {renderPage()}
      </main>
    </div>
  );
}
