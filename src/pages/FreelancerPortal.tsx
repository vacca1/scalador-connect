import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  DollarSign,
  User,
  Bell,
  Menu,
  X,
  Search,
  MapPin,
  Star,
  Filter,
  ChevronDown,
  LogOut,
  Home,
  Calendar,
  Award,
  TrendingUp,
  Phone,
  Mail,
  Plus,
  Trash2,
  Heart,
  Settings,
  HelpCircle,
  MessageSquare,
  Navigation,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import scaladorLogo from "@/assets/scalador-logo.png";
import { FreelancerGlowMenu } from "@/components/ui/freelancer-glow-menu";
import { AnimatedSelect } from "@/components/ui/animated-select";

// ===== TIPOS =====
interface FAQ {
  pergunta: string;
  resposta: string;
}

interface Vaga {
  id: string;
  titulo: string;
  empresa: string;
  logoEmpresa: string;
  tipo: "freelance" | "clt";
  profissao: string;
  descricao: string;
  atividades: string[];
  valorDiaria: number;
  localizacao: {
    endereco: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    coordenadas?: { lat: number; lng: number };
  };
  data: string;
  horarioEntrada: string;
  horarioSaida: string;
  vestimenta: string;
  experienciaNecessaria: boolean;
  beneficios: string[];
  status: "aberta" | "fechada";
  publicadoEm: Date;
  perguntasFrequentes?: FAQ[];
}

interface Candidatura {
  id: string;
  vagaId: string;
  vaga: Vaga;
  status: "aguardando" | "aceito" | "recusado";
  dataAplicacao: Date;
}

// ===== DADOS MOCK =====
const VAGAS_DISPONIVEIS: Vaga[] = [
  {
    id: "1",
    titulo: "Garçom para Evento Corporativo",
    empresa: "Restaurante Premium",
    logoEmpresa: "🍽️",
    tipo: "freelance",
    profissao: "Garçom",
    descricao: "Evento de confraternização empresarial de grande porte",
    atividades: ["Servir alimentos e bebidas", "Atendimento aos convidados", "Organização do buffet"],
    valorDiaria: 200,
    localizacao: {
      endereco: "Quadra 516 Bloco B, 66",
      bairro: "Asa Sul",
      cidade: "Brasília",
      estado: "DF",
      cep: "70000-000",
      coordenadas: { lat: -15.8153, lng: -47.9193 },
    },
    data: "2025-12-20",
    horarioEntrada: "18:00",
    horarioSaida: "23:00",
    vestimenta: "Terno preto, gravata, sapato social",
    experienciaNecessaria: true,
    beneficios: ["Alimentação", "Gorjeta"],
    status: "aberta",
    publicadoEm: new Date(Date.now() - 2 * 60 * 60 * 1000),
    perguntasFrequentes: [
      { pergunta: "Qual é o código de vestimenta?", resposta: "Terno preto com gravata e sapato social." },
      { pergunta: "Há estacionamento disponível?", resposta: "Sim, estacionamento gratuito para funcionários." },
      { pergunta: "Posso sair mais cedo?", resposta: "O horário de saída é fixo às 23:00, salvo liberação do coordenador." },
    ],
  },
  {
    id: "2",
    titulo: "Auxiliar de Serviços Gerais",
    empresa: "Scalador",
    logoEmpresa: "🏢",
    tipo: "freelance",
    profissao: "Auxiliar de serviços gerais",
    descricao: "Precisamos de auxiliares para evento corporativo",
    atividades: ["Limpeza e organização do espaço", "Montagem de estruturas", "Suporte durante o evento"],
    valorDiaria: 160,
    localizacao: {
      endereco: "SAUS Quadra 4",
      bairro: "Asa Sul",
      cidade: "Brasília",
      estado: "DF",
      cep: "70070-040",
      coordenadas: { lat: -15.7942, lng: -47.8822 },
    },
    data: "2025-12-21",
    horarioEntrada: "10:30",
    horarioSaida: "22:30",
    vestimenta: "Calça preta, camisa branca, sapato fechado",
    experienciaNecessaria: false,
    beneficios: ["Passagem", "Alimentação"],
    status: "aberta",
    publicadoEm: new Date(Date.now() - 5 * 60 * 60 * 1000),
    perguntasFrequentes: [
      { pergunta: "Preciso levar meu próprio uniforme?", resposta: "Não, a vestimenta padrão é: calça preta, camisa branca e sapato fechado." },
      { pergunta: "Há alimentação incluída?", resposta: "Sim, alimentação e passagem estão inclusas nos benefícios." },
    ],
  },
  {
    id: "3",
    titulo: "Recepcionista",
    empresa: "Hotel Central",
    logoEmpresa: "🏨",
    tipo: "clt",
    profissao: "Recepcionista",
    descricao: "Vaga CLT para cobertura de férias",
    atividades: ["Atendimento ao cliente", "Check-in e check-out", "Gestão de reservas"],
    valorDiaria: 150,
    localizacao: {
      endereco: "SHN Quadra 5",
      bairro: "Asa Norte",
      cidade: "Brasília",
      estado: "DF",
      cep: "70000-000",
      coordenadas: { lat: -15.7094, lng: -47.9025 },
    },
    data: "2025-12-22",
    horarioEntrada: "08:00",
    horarioSaida: "17:00",
    vestimenta: "Social (blazer opcional)",
    experienciaNecessaria: false,
    beneficios: ["Vale transporte", "Vale refeição"],
    status: "aberta",
    publicadoEm: new Date(Date.now() - 1 * 60 * 60 * 1000),
    perguntasFrequentes: [
      { pergunta: "É necessário falar inglês?", resposta: "Inglês básico é desejável, mas não obrigatório." },
      { pergunta: "Há treinamento?", resposta: "Sim, será fornecido treinamento no primeiro dia." },
    ],
  },
  {
    id: "4",
    titulo: "Bartender para Casa Noturna",
    empresa: "Club VIP Brasília",
    logoEmpresa: "🍸",
    tipo: "freelance",
    profissao: "Bartender",
    descricao: "Bartender experiente para noite especial",
    atividades: ["Preparar drinks e coquetéis", "Atendimento ao cliente no bar", "Controle de estoque"],
    valorDiaria: 250,
    localizacao: {
      endereco: "SCLN 408 Bloco D",
      bairro: "Asa Norte",
      cidade: "Brasília",
      estado: "DF",
      cep: "70865-540",
      coordenadas: { lat: -15.7601, lng: -47.8892 },
    },
    data: "2025-12-23",
    horarioEntrada: "21:00",
    horarioSaida: "05:00",
    vestimenta: "Camisa preta, calça social preta",
    experienciaNecessaria: true,
    beneficios: ["Alimentação", "Gorjeta", "Transporte"],
    status: "aberta",
    publicadoEm: new Date(Date.now() - 30 * 60 * 1000),
    perguntasFrequentes: [
      { pergunta: "Preciso saber fazer drinks específicos?", resposta: "Sim, experiência com coquetéis clássicos e modernos é necessária." },
    ],
  },
];

const MINHAS_CANDIDATURAS: Candidatura[] = [
  {
    id: "c1",
    vagaId: "5",
    vaga: {
      id: "5",
      titulo: "Barman",
      empresa: "Bar do João",
      logoEmpresa: "🍺",
      tipo: "freelance",
      profissao: "Barman",
      descricao: "Trabalho noturno em bar movimentado",
      atividades: ["Servir bebidas", "Atendimento"],
      valorDiaria: 220,
      localizacao: { endereco: "CLN 201", bairro: "Asa Norte", cidade: "Brasília", estado: "DF", cep: "70000-000" },
      data: "2025-12-18",
      horarioEntrada: "20:00",
      horarioSaida: "04:00",
      vestimenta: "Casual",
      experienciaNecessaria: true,
      beneficios: ["Gorjeta"],
      status: "aberta",
      publicadoEm: new Date(),
    },
    status: "aceito",
    dataAplicacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "c2",
    vagaId: "6",
    vaga: {
      id: "6",
      titulo: "Garçom",
      empresa: "Restaurante Italiano",
      logoEmpresa: "🍝",
      tipo: "freelance",
      profissao: "Garçom",
      descricao: "Restaurante italiano premium",
      atividades: ["Servir mesas", "Atendimento VIP"],
      valorDiaria: 180,
      localizacao: { endereco: "CLS 104", bairro: "Asa Sul", cidade: "Brasília", estado: "DF", cep: "70000-000" },
      data: "2025-12-19",
      horarioEntrada: "18:00",
      horarioSaida: "23:00",
      vestimenta: "Social",
      experienciaNecessaria: true,
      beneficios: ["Alimentação", "Gorjeta"],
      status: "aberta",
      publicadoEm: new Date(),
    },
    status: "aguardando",
    dataAplicacao: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "c3",
    vagaId: "7",
    vaga: {
      id: "7",
      titulo: "Atendente",
      empresa: "Café Central",
      logoEmpresa: "☕",
      tipo: "freelance",
      profissao: "Atendente",
      descricao: "Café gourmet",
      atividades: ["Preparar café", "Atendimento"],
      valorDiaria: 120,
      localizacao: { endereco: "SCLN 302", bairro: "Asa Norte", cidade: "Brasília", estado: "DF", cep: "70000-000" },
      data: "2025-12-17",
      horarioEntrada: "07:00",
      horarioSaida: "15:00",
      vestimenta: "Uniforme fornecido",
      experienciaNecessaria: false,
      beneficios: ["Alimentação"],
      status: "fechada",
      publicadoEm: new Date(),
    },
    status: "recusado",
    dataAplicacao: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

const HISTORICO_PAGAMENTOS = [
  { id: 1, data: "15/12/2025", empresa: "Restaurante Sabor & Arte", valor: 180, status: "Pago" },
  { id: 2, data: "10/12/2025", empresa: "Hotel Grand Brasília", valor: 200, status: "Pago" },
  { id: 3, data: "05/12/2025", empresa: "Buffet Elegance", valor: 300, status: "Pago" },
  { id: 4, data: "01/12/2025", empresa: "Bar do João", valor: 220, status: "Pago" },
  { id: 5, data: "28/11/2025", empresa: "Club VIP Brasília", valor: 250, status: "Pago" },
];

const BAIRROS_BRASILIA = [
  "Asa Norte", "Asa Sul", "Taguatinga", "Ceilândia", "Gama",
  "Águas Claras", "Samambaia", "Guará", "Sudoeste", "Lago Norte",
  "Lago Sul", "Planaltina", "Sobradinho", "Santa Maria", "Recanto das Emas",
];

const PROFISSOES = [
  "Garçom/Garçonete", "Barman/Bartender", "Recepcionista", "Auxiliar de Cozinha",
  "Promotor de Vendas", "Copeiro", "Segurança", "Manobrista", "Chef", "Hostess",
];

// ===== HELPER: TEMPO DE PUBLICAÇÃO =====
const getTempoPublicacao = (data: Date): string => {
  const diff = Date.now() - data.getTime();
  const minutos = Math.floor(diff / (1000 * 60));
  const horas = Math.floor(diff / (1000 * 60 * 60));
  const dias = Math.floor(horas / 24);
  if (minutos < 60) return minutos <= 1 ? "há menos de 1 minuto" : `há ${minutos} minutos`;
  if (horas === 1) return "há 1 hora";
  if (horas < 24) return `há ${horas} horas`;
  if (dias === 1) return "há 1 dia";
  return `há ${dias} dias`;
};

// ===== COMPONENTE PRINCIPAL =====
const FreelancerPortal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [vagasFavoritas, setVagasFavoritas] = useState<string[]>(["1", "4"]);
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>(MINHAS_CANDIDATURAS);

  // Localização do freelancer (mock)
  const localizacaoUsuario = { lat: -15.7801, lng: -47.9292 };

  // Filtros
  const [filtros, setFiltros] = useState({
    busca: "",
    tipo: "todos",
    profissao: "todas",
    bairro: "todos",
    experiencia: "todas",
    distanciaMaxima: "todas",
  });

  // Profile state
  const [perfilNome, setPerfilNome] = useState("João Silva");
  const [perfilTelefone, setPerfilTelefone] = useState("(61) 99999-9999");
  const [perfilCPF, setPerfilCPF] = useState("123.456.789-00");
  const [perfilNascimento, setPerfilNascimento] = useState("1990-05-15");
  const [perfilProfissao, setPerfilProfissao] = useState("Garçom/Garçonete");
  const [perfilHabilidades, setPerfilHabilidades] = useState(["Atendimento ao cliente", "Inglês básico", "Trabalho em equipe", "Eventos corporativos"]);
  const [novaHabilidade, setNovaHabilidade] = useState("");

  // Menu items
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "vagas", label: "Vagas Disponíveis", icon: Briefcase },
    { id: "candidaturas", label: "Minhas Candidaturas", icon: FileText },
    { id: "favoritas", label: "Vagas Favoritas", icon: Heart },
    { id: "ganhos", label: "Meus Ganhos", icon: DollarSign },
    { id: "perfil", label: "Meu Perfil", icon: User },
    { id: "configuracoes", label: "Configurações", icon: Settings },
    { id: "notificacoes", label: "Notificações", icon: Bell },
  ];

  // ===== FUNÇÕES =====
  const calcularDistancia = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const navegarPara = (pagina: string) => {
    setCurrentPage(pagina);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    navigate("/");
  };

  const clearFilters = () => {
    setFiltros({
      busca: "",
      tipo: "todos",
      profissao: "todas",
      bairro: "todos",
      experiencia: "todas",
      distanciaMaxima: "todas",
    });
  };

  const toggleFavorito = (vagaId: string) => {
    setVagasFavoritas(prev => {
      if (prev.includes(vagaId)) {
        toast({ title: "Removido dos favoritos", description: "Vaga removida da sua lista" });
        return prev.filter(id => id !== vagaId);
      } else {
        toast({ title: "Adicionado aos favoritos", description: "Vaga salva na sua lista" });
        return [...prev, vagaId];
      }
    });
  };

  const candidatarVaga = (vaga: Vaga) => {
    const jaCandidatou = candidaturas.some(c => c.vagaId === vaga.id);
    if (jaCandidatou) {
      toast({ title: "Já candidatado", description: "Você já se candidatou a esta vaga", variant: "destructive" });
      return;
    }
    const novaCandidatura: Candidatura = {
      id: `c${Date.now()}`,
      vagaId: vaga.id,
      vaga,
      status: "aguardando",
      dataAplicacao: new Date(),
    };
    setCandidaturas(prev => [novaCandidatura, ...prev]);
    toast({ title: "Candidatura enviada!", description: `Sua candidatura para ${vaga.titulo} foi enviada com sucesso` });
    setSelectedVaga(null);
  };

  const addHabilidade = () => {
    if (novaHabilidade.trim() && !perfilHabilidades.includes(novaHabilidade.trim())) {
      setPerfilHabilidades([...perfilHabilidades, novaHabilidade.trim()]);
      setNovaHabilidade("");
    }
  };

  const removeHabilidade = (hab: string) => {
    setPerfilHabilidades(perfilHabilidades.filter((h) => h !== hab));
  };

  // ===== COMPONENTES =====
  const VagaCard = ({ vaga, showCandidatarButton = true }: { vaga: Vaga; showCandidatarButton?: boolean }) => {
    const isFavorita = vagasFavoritas.includes(vaga.id);
    const distancia = vaga.localizacao.coordenadas
      ? calcularDistancia(localizacaoUsuario.lat, localizacaoUsuario.lng, vaga.localizacao.coordenadas.lat, vaga.localizacao.coordenadas.lng)
      : null;

    return (
      <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 cursor-pointer group hover:-translate-y-1 sm:hover:-translate-y-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Botão Favorito */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorito(vaga.id); }}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10 ${
            isFavorita ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-400 hover:bg-pink-50 hover:text-pink-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorita ? "fill-current" : ""}`} />
        </button>

        <div className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6" onClick={() => setSelectedVaga(vaga)}>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0">
            {vaga.logoEmpresa}
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2 pr-10">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-amber-600 mb-1">{vaga.empresa}</p>
                <h3 className="text-lg sm:text-2xl font-black text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-orange-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                  {vaga.titulo}
                </h3>
              </div>
            </div>

            {/* Valor Destacado */}
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
              <p className="text-xs sm:text-sm text-gray-600">Você recebe</p>
              <p className="text-2xl sm:text-3xl font-black text-green-600">R$ {vaga.valorDiaria.toFixed(2)}</p>
            </div>

            <p className="text-gray-700 text-sm sm:text-base mb-4 line-clamp-2 leading-relaxed">{vaga.descricao}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
              <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm ${
                vaga.tipo === "freelance"
                  ? "bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-amber-700"
                  : "bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-300 text-indigo-700"
              }`}>
                {vaga.tipo === "freelance" ? "⚡ Freelancer" : "💼 CLT"}
              </span>
              <span className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/50 text-amber-700 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                {vaga.experienciaNecessaria ? "⭐ Com experiência" : "🌟 Sem experiência"}
              </span>
            </div>

            {/* Info Row */}
            <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 font-medium mb-4">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span className="font-bold text-amber-600">{vaga.localizacao.bairro}</span>
                <span className="text-gray-400">•</span>
                <span>{vaga.localizacao.cidade}</span>
              </span>
              {distancia !== null && (
                <span className="flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="font-bold text-green-600">{distancia.toFixed(1)}km</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0" />
                {new Date(vaga.data).toLocaleDateString("pt-BR")}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                {vaga.horarioEntrada} - {vaga.horarioSaida}
              </span>
            </div>

            {/* Publicado em */}
            <p className="text-xs text-gray-400 mb-4">Publicado {getTempoPublicacao(vaga.publicadoEm)}</p>

            {/* Botões */}
            {showCandidatarButton && (
              <div className="flex gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedVaga(vaga); }}
                  className="flex-1 px-4 py-3 glass hover:bg-gray-100 rounded-xl font-bold text-gray-700 transition-all"
                >
                  Ver Detalhes
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); candidatarVaga(vaga); }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Me Candidatar <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Modal de Detalhes da Vaga
  const VagaDetalhesModal = () => {
    if (!selectedVaga) return null;
    const isFavorita = vagasFavoritas.includes(selectedVaga.id);
    const jaCandidatou = candidaturas.some(c => c.vagaId === selectedVaga.id);

    return (
      <Dialog open={!!selectedVaga} onOpenChange={() => setSelectedVaga(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                {selectedVaga.logoEmpresa}
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-600">{selectedVaga.empresa}</p>
                <DialogTitle className="text-2xl font-black">{selectedVaga.titulo}</DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Valor */}
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white">
              <p className="text-sm opacity-90">Você recebe</p>
              <p className="text-3xl font-black">R$ {selectedVaga.valorDiaria.toFixed(2)}</p>
            </div>

            {/* Localização */}
            <div>
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" /> Localização
              </h4>
              <p className="text-gray-700">
                <span className="font-bold text-amber-600">{selectedVaga.localizacao.bairro}</span> • {selectedVaga.localizacao.endereco}
              </p>
              <p className="text-sm text-gray-500">{selectedVaga.localizacao.cidade} - {selectedVaga.localizacao.estado}</p>
            </div>

            {/* Data e Horário */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" /> Data
                </h4>
                <p className="text-gray-700">{new Date(selectedVaga.data).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" /> Horário
                </h4>
                <p className="text-gray-700">{selectedVaga.horarioEntrada} às {selectedVaga.horarioSaida}</p>
              </div>
            </div>

            {/* Atividades */}
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Atividades</h4>
              <ul className="space-y-2">
                {selectedVaga.atividades.map((atividade, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {atividade}
                  </li>
                ))}
              </ul>
            </div>

            {/* Vestimenta */}
            <div>
              <h4 className="font-bold text-gray-900 mb-2">👔 Vestimenta</h4>
              <p className="text-gray-700">{selectedVaga.vestimenta}</p>
            </div>

            {/* Benefícios */}
            <div>
              <h4 className="font-bold text-gray-900 mb-2">🎁 Benefícios</h4>
              <div className="flex flex-wrap gap-2">
                {selectedVaga.beneficios.map((beneficio, i) => (
                  <Badge key={i} className="bg-amber-100 text-amber-700">{beneficio}</Badge>
                ))}
              </div>
            </div>

            {/* FAQ */}
            {selectedVaga.perguntasFrequentes && selectedVaga.perguntasFrequentes.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-900 mb-2">❓ Perguntas Frequentes</h4>
                <Accordion type="single" collapsible className="w-full">
                  {selectedVaga.perguntasFrequentes.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left text-sm">{faq.pergunta}</AccordionTrigger>
                      <AccordionContent className="text-gray-600">{faq.resposta}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => toggleFavorito(selectedVaga.id)}
                className={`flex-1 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  isFavorita
                    ? "bg-pink-100 text-pink-600 border-2 border-pink-300"
                    : "glass text-gray-700 hover:bg-pink-50"
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorita ? "fill-current" : ""}`} />
                {isFavorita ? "Favoritado" : "Favoritar"}
              </button>
              <button
                onClick={() => candidatarVaga(selectedVaga)}
                disabled={jaCandidatou}
                className={`flex-1 px-4 py-3 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 transition-all ${
                  jaCandidatou
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-2xl hover:scale-105"
                }`}
              >
                {jaCandidatou ? "Já Candidatado" : "Me Candidatar"}
                {!jaCandidatou && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Filtros Component
  const FilterContent = () => (
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
        <label className="block text-sm font-bold text-gray-700 mb-3">Bairro/Região</label>
        <AnimatedSelect
          accentColor="orange"
          value={filtros.bairro}
          onChange={(value) => setFiltros({ ...filtros, bairro: value })}
          options={[
            { value: "todos", label: "Todos os bairros" },
            ...BAIRROS_BRASILIA.map(b => ({ value: b, label: b, icon: "📍" }))
          ]}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">Profissão</label>
        <AnimatedSelect
          accentColor="orange"
          value={filtros.profissao}
          onChange={(value) => setFiltros({ ...filtros, profissao: value })}
          options={[
            { value: "todas", label: "Todas as profissões" },
            ...PROFISSOES.map(p => ({ value: p.toLowerCase(), label: p, icon: "👔" }))
          ]}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">Experiência</label>
        <AnimatedSelect
          accentColor="orange"
          value={filtros.experiencia}
          onChange={(value) => setFiltros({ ...filtros, experiencia: value })}
          options={[
            { value: "todas", label: "Todas" },
            { value: "com", label: "Com experiência", icon: "⭐" },
            { value: "sem", label: "Sem experiência", icon: "🌟" },
          ]}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">Distância Máxima</label>
        <AnimatedSelect
          accentColor="orange"
          value={filtros.distanciaMaxima}
          onChange={(value) => setFiltros({ ...filtros, distanciaMaxima: value })}
          options={[
            { value: "todas", label: "Todas as distâncias" },
            { value: "5", label: "Até 5km", icon: "📍" },
            { value: "10", label: "Até 10km", icon: "📍" },
            { value: "20", label: "Até 20km", icon: "📍" },
            { value: "30", label: "Até 30km", icon: "📍" },
          ]}
        />
      </div>
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Limpar filtros
      </Button>
    </div>
  );

  // ===== PÁGINAS =====
  const PaginaDashboard = () => {
    const trabalhosAceitos = candidaturas.filter(c => c.status === "aceito");
    return (
      <div className="space-y-6">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Olá, {perfilNome}! 👋</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-xl">Confira suas oportunidades</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <Briefcase className="w-8 h-8 text-amber-600 mb-2" />
            <p className="text-2xl font-black text-gray-900">12</p>
            <p className="text-sm text-gray-600">Trabalhos este mês</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <DollarSign className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-2xl font-black text-gray-900">R$ 2.450</p>
            <p className="text-sm text-gray-600">Ganhos do mês</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <Star className="w-8 h-8 text-yellow-500 mb-2" />
            <p className="text-2xl font-black text-gray-900">4.8</p>
            <p className="text-sm text-gray-600">Avaliação</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-2xl font-black text-gray-900">95%</p>
            <p className="text-sm text-gray-600">Comparecimento</p>
          </div>
        </div>

        {/* Próximos Trabalhos */}
        {trabalhosAceitos.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" /> Próximos Trabalhos
            </h2>
            <div className="space-y-3">
              {trabalhosAceitos.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-xl">
                      {c.vaga.logoEmpresa}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{c.vaga.titulo}</p>
                      <p className="text-sm text-gray-600">{c.vaga.empresa} • {new Date(c.vaga.data).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500 text-white">Confirmado</Badge>
                    <p className="text-lg font-bold text-green-600 mt-1">R$ {c.vaga.valorDiaria}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vagas Recentes */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-600" /> Vagas Recentes
            </h2>
            <button
              onClick={() => navegarPara("vagas")}
              className="text-amber-600 font-semibold flex items-center gap-1 hover:underline"
            >
              Ver todas <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {VAGAS_DISPONIVEIS.slice(0, 3).map((vaga) => (
              <div
                key={vaga.id}
                onClick={() => setSelectedVaga(vaga)}
                className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-xl">
                    {vaga.logoEmpresa}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{vaga.titulo}</p>
                    <p className="text-sm text-gray-600">{vaga.empresa} • {vaga.localizacao.bairro}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">R$ {vaga.valorDiaria}</p>
                  <p className="text-xs text-gray-500">{getTempoPublicacao(vaga.publicadoEm)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const PaginaVagas = () => {
    const vagasFiltradas = VAGAS_DISPONIVEIS.filter(vaga => {
      if (filtros.busca && !vaga.titulo.toLowerCase().includes(filtros.busca.toLowerCase()) && !vaga.localizacao.bairro.toLowerCase().includes(filtros.busca.toLowerCase())) return false;
      if (filtros.tipo !== "todos" && vaga.tipo !== filtros.tipo) return false;
      if (filtros.bairro !== "todos" && vaga.localizacao.bairro !== filtros.bairro) return false;
      if (filtros.experiencia !== "todas") {
        if (filtros.experiencia === "com" && !vaga.experienciaNecessaria) return false;
        if (filtros.experiencia === "sem" && vaga.experienciaNecessaria) return false;
      }
      if (filtros.distanciaMaxima !== "todas" && vaga.localizacao.coordenadas) {
        const distancia = calcularDistancia(localizacaoUsuario.lat, localizacaoUsuario.lng, vaga.localizacao.coordenadas.lat, vaga.localizacao.coordenadas.lng);
        if (distancia > parseFloat(filtros.distanciaMaxima)) return false;
      }
      return true;
    });

    return (
      <div className="space-y-6">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Vagas Disponíveis</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-xl">Encontre oportunidades perto de você 🚀</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex gap-2 sm:gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 text-amber-500 w-5 sm:w-6 h-5 sm:h-6" />
              <input
                type="text"
                placeholder="Procure por trabalhos..."
                className="w-full pl-10 sm:pl-14 pr-3 sm:pr-6 py-3 sm:py-5 glass rounded-xl sm:rounded-2xl text-sm sm:text-lg font-medium placeholder:text-gray-400 focus:ring-4 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-300"
                value={filtros.busca}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
              />
            </div>
            <button className="px-5 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg shadow-xl shadow-amber-500/40 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap">
              Buscar
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <button className="w-full px-6 py-4 glass rounded-2xl font-bold text-gray-900 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all border-2 border-amber-500/30">
                  <Filter className="w-5 h-5 text-amber-600" />
                  <span>Filtrar Vagas</span>
                  <ChevronDown className="w-5 h-5 text-amber-600" />
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
                <SheetHeader className="pb-4 border-b">
                  <SheetTitle className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-amber-600" /> Filtros
                  </SheetTitle>
                </SheetHeader>
                <div className="py-6 overflow-y-auto max-h-[calc(85vh-150px)]">
                  <FilterContent />
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <button onClick={clearFilters} className="flex-1 px-6 py-3 glass rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-all">
                    Limpar
                  </button>
                  <button onClick={() => setMobileFiltersOpen(false)} className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                    Aplicar Filtros
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0 lg:sticky lg:top-24 lg:self-start">
            <div className="glass rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-gray-900 text-xl flex items-center gap-2">
                  <Filter className="w-5 h-5 text-amber-600" /> Filtros
                </h3>
                <button onClick={clearFilters} className="text-sm font-bold text-amber-600 hover:text-amber-700 hover:scale-110 transition-all">
                  Limpar
                </button>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Vagas List */}
          <div className="flex-1 space-y-6">
            {vagasFiltradas.length === 0 ? (
              <div className="text-center py-12 glass rounded-2xl">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700">Nenhuma vaga encontrada</h3>
                <p className="text-gray-500">Tente ajustar os filtros</p>
              </div>
            ) : (
              vagasFiltradas.map((vaga) => <VagaCard key={vaga.id} vaga={vaga} />)
            )}
          </div>
        </div>
      </div>
    );
  };

  const PaginaCandidaturas = () => (
    <div className="space-y-6">
      <div className="mb-8 text-center animate-fade-in">
        <h2 className="text-3xl sm:text-5xl font-black mb-3">
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Minhas Candidaturas</span>
        </h2>
        <p className="text-gray-600 text-base sm:text-xl">Acompanhe o status das suas candidaturas</p>
      </div>

      {candidaturas.length === 0 ? (
        <div className="text-center py-12 glass rounded-2xl">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700">Nenhuma candidatura</h3>
          <p className="text-gray-500 mb-4">Candidate-se a vagas para vê-las aqui</p>
          <Button onClick={() => navegarPara("vagas")} className="bg-gradient-to-r from-amber-500 to-orange-600">
            Ver Vagas
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {candidaturas.map((c) => (
            <div
              key={c.id}
              className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all hover:shadow-xl ${
                c.status === "aceito"
                  ? "border-green-300 bg-green-50"
                  : c.status === "recusado"
                  ? "border-red-200"
                  : "border-yellow-200"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-2xl">
                    {c.vaga.logoEmpresa}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{c.vaga.titulo}</h3>
                    <p className="text-gray-600">{c.vaga.empresa}</p>
                  </div>
                </div>
                <Badge
                  className={
                    c.status === "aceito"
                      ? "bg-green-500 text-white"
                      : c.status === "recusado"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-white"
                  }
                >
                  {c.status === "aceito" ? "✅ Aceito" : c.status === "recusado" ? "❌ Não selecionado" : "⏳ Aguardando"}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-amber-600">{c.vaga.localizacao.bairro}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(c.vaga.data).toLocaleDateString("pt-BR")}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-green-600">R$ {c.vaga.valorDiaria}</span>
                </span>
              </div>

              {c.status === "aceito" && (
                <div className="bg-green-100 rounded-xl p-4 border border-green-300">
                  <p className="font-bold text-green-800">🎉 Parabéns! Você foi selecionado!</p>
                  <p className="text-sm text-green-700 mt-1">Compareça no local e horário indicados.</p>
                  <Button className="mt-3 bg-green-600 hover:bg-green-700">Ver Detalhes</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const PaginaFavoritas = () => {
    const vagasFavoritasLista = VAGAS_DISPONIVEIS.filter(v => vagasFavoritas.includes(v.id));

    return (
      <div className="space-y-6">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">Vagas Favoritas</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-xl">Vagas que você salvou para se candidatar depois</p>
        </div>

        {vagasFavoritasLista.length === 0 ? (
          <div className="text-center py-12 glass rounded-2xl">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Nenhuma vaga favorita</h3>
            <p className="text-gray-500 mb-4">Favorite vagas para salvá-las aqui</p>
            <Button onClick={() => navegarPara("vagas")} className="bg-gradient-to-r from-amber-500 to-orange-600">
              Explorar Vagas
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {vagasFavoritasLista.map((vaga) => <VagaCard key={vaga.id} vaga={vaga} />)}
          </div>
        )}
      </div>
    );
  };

  const PaginaGanhos = () => (
    <div className="space-y-6">
      <div className="mb-8 text-center animate-fade-in">
        <h2 className="text-3xl sm:text-5xl font-black mb-3">
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Meus Ganhos</span>
        </h2>
        <p className="text-gray-600 text-base sm:text-xl">Acompanhe seus recebimentos</p>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-green-500/30">
        <p className="text-lg opacity-90">Ganhos este mês</p>
        <p className="text-4xl md:text-5xl font-black mt-2">R$ 2.450,00</p>
        <p className="text-sm opacity-80 mt-2">💰 Pagamento direto após cada trabalho</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center">
          <p className="text-2xl font-black text-gray-900">12</p>
          <p className="text-sm text-gray-600">Trabalhos</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center">
          <p className="text-2xl font-black text-gray-900">R$ 204</p>
          <p className="text-sm text-gray-600">Média</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center">
          <p className="text-2xl font-black text-gray-900">95%</p>
          <p className="text-sm text-gray-600">Comparecimento</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center">
          <p className="text-2xl font-black text-gray-900">4.8 ⭐</p>
          <p className="text-sm text-gray-600">Avaliação</p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Histórico de Pagamentos</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Data</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Empresa</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Valor</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {HISTORICO_PAGAMENTOS.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 text-sm text-gray-600">{p.data}</td>
                  <td className="py-3 px-2 text-sm font-medium text-gray-900">{p.empresa}</td>
                  <td className="py-3 px-2 text-sm font-bold text-green-600">R$ {p.valor}</td>
                  <td className="py-3 px-2">
                    <Badge className="bg-green-100 text-green-700">{p.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PaginaPerfil = () => (
    <div className="space-y-6">
      <div className="mb-8 text-center animate-fade-in">
        <h2 className="text-3xl sm:text-5xl font-black mb-3">
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Meu Perfil</span>
        </h2>
        <p className="text-gray-600 text-base sm:text-xl">Mantenha suas informações atualizadas</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-4xl shadow-xl">
            👤
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black text-gray-900">{perfilNome}</h2>
            <p className="text-amber-600 font-semibold">{perfilProfissao}</p>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                4.8
              </span>
              <span>•</span>
              <span>45 trabalhos</span>
              <span>•</span>
              <span className="text-green-600">95% comparecimento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Informações Pessoais</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              value={perfilNome}
              onChange={(e) => setPerfilNome(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={perfilTelefone}
              onChange={(e) => setPerfilTelefone(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={perfilCPF}
              onChange={(e) => setPerfilCPF(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="nascimento">Data de Nascimento</Label>
            <Input
              id="nascimento"
              type="date"
              value={perfilNascimento}
              onChange={(e) => setPerfilNascimento(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="profissao">Profissão Principal</Label>
            <Select value={perfilProfissao} onValueChange={setPerfilProfissao}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROFISSOES.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Habilidades</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {perfilHabilidades.map((h) => (
            <Badge
              key={h}
              className="bg-amber-100 text-amber-700 px-3 py-1 flex items-center gap-2"
            >
              {h}
              <button onClick={() => removeHabilidade(h)} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Adicionar habilidade"
            value={novaHabilidade}
            onChange={(e) => setNovaHabilidade(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addHabilidade()}
          />
          <Button onClick={addHabilidade} variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={() => toast({ title: "Perfil atualizado!", description: "Suas informações foram salvas com sucesso" })}
        className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
      >
        Salvar Alterações
      </Button>
    </div>
  );

  const PaginaConfiguracoes = () => (
    <div className="space-y-6">
      <div className="mb-8 text-center animate-fade-in">
        <h2 className="text-3xl sm:text-5xl font-black mb-3">
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Configurações</span>
        </h2>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-bold text-gray-900">Notificações por push</p>
              <p className="text-sm text-gray-500">Receba alertas de novas vagas</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-amber-500 rounded-full relative cursor-pointer">
            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow"></div>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-bold text-gray-900">Notificações por email</p>
              <p className="text-sm text-gray-500">Resumo semanal de vagas</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer">
            <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow"></div>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-bold text-gray-900">Localização</p>
              <p className="text-sm text-gray-500">Permitir acesso à localização</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-amber-500 rounded-full relative cursor-pointer">
            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow"></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Sobre</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Versão do app: 1.0.0</p>
          <p>Scalador © 2025</p>
        </div>
      </div>
    </div>
  );

  const PaginaNotificacoes = () => (
    <div className="space-y-6">
      <div className="mb-8 text-center animate-fade-in">
        <h2 className="text-3xl sm:text-5xl font-black mb-3">
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Notificações</span>
        </h2>
      </div>

      <div className="space-y-3">
        {[
          { title: "Candidatura aceita!", desc: "Bar do João aceitou sua candidatura", time: "2h atrás", type: "success" },
          { title: "Nova vaga disponível", desc: "Vaga de Garçom em Asa Norte", time: "5h atrás", type: "info" },
          { title: "Lembrete de trabalho", desc: "Você tem um trabalho amanhã às 18h", time: "1d atrás", type: "warning" },
          { title: "Pagamento recebido", desc: "R$ 220,00 do Bar do João", time: "2d atrás", type: "success" },
        ].map((n, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl p-4 shadow-lg border-l-4 hover:shadow-xl transition-all ${
              n.type === "success" ? "border-l-green-500" : n.type === "warning" ? "border-l-yellow-500" : "border-l-amber-500"
            }`}
          >
            <h3 className="font-bold text-gray-900">{n.title}</h3>
            <p className="text-sm text-gray-600">{n.desc}</p>
            <p className="text-xs text-gray-400 mt-1">{n.time}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // ===== RENDER CONTENT =====
  const renderContent = () => {
    switch (currentPage) {
      case "dashboard": return <PaginaDashboard />;
      case "vagas": return <PaginaVagas />;
      case "candidaturas": return <PaginaCandidaturas />;
      case "favoritas": return <PaginaFavoritas />;
      case "ganhos": return <PaginaGanhos />;
      case "perfil": return <PaginaPerfil />;
      case "configuracoes": return <PaginaConfiguracoes />;
      case "notificacoes": return <PaginaNotificacoes />;
      default: return <PaginaDashboard />;
    }
  };

  // ===== MAIN RENDER =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-amber-200/50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-amber-50">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <img src={scaladorLogo} alt="Scalador" className="h-8 md:h-10" />
            <Badge className="hidden md:block bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 font-semibold border border-amber-300">
              Freelancer
            </Badge>
          </div>

          {/* Desktop GlowMenu */}
          <div className="hidden lg:block">
            <FreelancerGlowMenu
              navegarPara={navegarPara}
              paginaAtual={currentPage}
              favoritasCount={vagasFavoritas.length}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navegarPara("notificacoes")}
              className="p-2 rounded-lg hover:bg-amber-50 relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl">
                  👤
                </div>
                <div>
                  <p className="font-bold">{perfilNome}</p>
                  <p className="text-sm text-amber-100">Freelancer</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentPage === item.id
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                      : "text-gray-700 hover:bg-amber-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {item.id === "favoritas" && vagasFavoritas.length > 0 && (
                    <span className="ml-auto bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {vagasFavoritas.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Modal de Detalhes */}
      <VagaDetalhesModal />
    </div>
  );
};

export default FreelancerPortal;
