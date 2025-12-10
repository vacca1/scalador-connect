import React, { useState, useEffect } from "react";
import { Briefcase, Clock, MapPin, Calendar, DollarSign, User, Bell, MessageSquare, Menu, Search, X, Plus, Check, TrendingUp, Users, Activity, ArrowRight, Phone, Navigation, AlertCircle, CheckCircle, XCircle, Timer, Send, Star, Edit, Settings, HelpCircle, LogOut, Filter, ChevronDown, Home, Wallet, FileText, Heart, UserPlus, Award, Zap, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import scaladorLogo from "@/assets/scalador-logo.png";

// ===== TIPOS E INTERFACES =====
type JobStatus = "aberta" | "aguardando_freelancer" | "em_deslocamento" | "em_andamento" | "concluida" | "cancelada";
type JobType = "freelance" | "temporario";
type UserType = "empresa" | "freelancer" | "visitante";
interface FAQ {
  pergunta: string;
  resposta: string;
}
interface Job {
  id: string;
  titulo: string;
  empresa: string;
  logoEmpresa: string;
  tipo: JobType;
  profissao: string;
  descricao: string;
  atividades: string[];
  valorDiaria: number;
  valorTotal: number;
  taxaScalador: number;
  valorComTaxa: number;
  quantidadeFreelancers: number;
  localizacao: {
    endereco: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    coordenadas?: {
      lat: number;
      lng: number;
    };
  };
  data: string;
  horarioEntrada: string;
  horarioSaida: string;
  vestimenta: string;
  experienciaNecessaria: boolean;
  beneficios: string[];
  status: JobStatus;
  publicadoEm: Date;
  perguntasFrequentes?: FAQ[];
  freelancerSelecionado?: {
    id: string;
    nome: string;
    foto: string;
    rating: number;
    telefone: string;
    tempoEstimadoChegada: string;
    horarioAceite?: Date;
    horarioChegada?: Date;
  };
  tempoLimiteEmpresaCancelar?: Date;
}

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

// ===== SISTEMA DE VALORES DIFERENCIADOS =====
interface ValoresVaga {
  valorBase: number; // Valor base (nunca mostrado diretamente)
  valorParaEmpresa: number; // valorBase * 1.099
  taxaServico: number; // 9.9%
  valorParaFreelancer: number; // valorBase
  modalidadePosPago?: {
    valorComTaxa: number; // valorBase * 1.15
    taxaPosPago: number; // 15%
  };
}
const calcularValores = (valorBase: number): ValoresVaga => {
  const taxaNormal = 0.099; // 9.9%
  const taxaPosPago = 0.15; // 15%

  return {
    valorBase,
    valorParaEmpresa: valorBase * (1 + taxaNormal),
    taxaServico: 9.9,
    valorParaFreelancer: valorBase,
    modalidadePosPago: {
      valorComTaxa: valorBase * (1 + taxaPosPago),
      taxaPosPago: 15
    }
  };
};
interface Notification {
  id: string;
  tipo: "pagamento" | "mensagem" | "candidatura" | "avaliacao" | "checkin" | "sistema";
  titulo: string;
  mensagem: string;
  timestamp: Date;
  lida: boolean;
  vagaId?: string;
}
interface Message {
  id: string;
  remetente: string;
  destinatario: string;
  mensagem: string;
  timestamp: Date;
  tipo: "texto" | "sistema" | "whatsapp";
}

// ===== INTERFACE AVALIAÇÃO DETALHADA =====
interface AvaliacaoDetalhada {
  pontualidade: number; // 1-5
  qualidadeTrabalho: number; // 1-5
  comunicacao: number; // 1-5
  profissionalismo: number; // 1-5
  apresentacao: number; // 1-5
}

// ===== INTERFACE SISTEMA DE FALTAS E REPUTAÇÃO =====
interface HistoricoComparecimento {
  totalAgendados: number; // Total de trabalhos agendados
  totalCompareceu: number; // Total de trabalhos que compareceu
  totalFaltas: number; // Total de faltas
  taxaComparecimento: number; // Percentual (0-100)
  ultimaFalta?: Date; // Data da última falta
  historicoDetalhado: {
    data: Date;
    empresa: string;
    compareceu: boolean;
    justificativa?: string;
  }[];
}

// Helper para determinar badge de comparecimento
const getBadgeComparecimento = (taxa: number): {
  label: string;
  cor: string;
  icon: string;
  alerta: boolean;
} => {
  if (taxa === 100) return {
    label: "100% Presença",
    cor: "bg-green-100 text-green-700 border-green-300",
    icon: "🏆",
    alerta: false
  };
  if (taxa >= 95) return {
    label: "95%+ Presença",
    cor: "bg-emerald-100 text-emerald-700 border-emerald-300",
    icon: "⭐",
    alerta: false
  };
  if (taxa >= 90) return {
    label: "90%+ Presença",
    cor: "bg-blue-100 text-blue-700 border-blue-300",
    icon: "✓",
    alerta: false
  };
  if (taxa >= 80) return {
    label: "80%+ Presença",
    cor: "bg-amber-100 text-amber-700 border-amber-300",
    icon: "⚠️",
    alerta: true
  };
  return {
    label: `${taxa.toFixed(0)}% Presença`,
    cor: "bg-red-100 text-red-700 border-red-300",
    icon: "⛔",
    alerta: true
  };
};
interface Freelancer {
  id: string;
  nome: string;
  foto: string;
  profissao: string;
  rating: number;
  totalTrabalhos: number;
  experiencia: string;
  localizacao: {
    bairro: string;
    cidade: string;
    estado: string;
    coordenadas: {
      lat: number;
      lng: number;
    };
  };
  habilidades: string[];
  disponivel: boolean;
  valorHora: number;
  telefone: string;
  descricao: string;
  avaliacaoDetalhada: AvaliacaoDetalhada;
  historicoComparecimento: HistoricoComparecimento;
  ultimosTrabalhos: {
    empresa: string;
    cargo: string;
    avaliacao: number;
    data: Date;
  }[];
}

// ===== DADOS MOCKADOS =====
const MOCK_JOBS: Job[] = [{
  id: "1",
  titulo: "Auxiliar de Serviços Gerais",
  empresa: "Scalador",
  logoEmpresa: "🏢",
  tipo: "freelance",
  profissao: "Auxiliar de serviços gerais",
  descricao: "Precisamos de auxiliares para evento corporativo",
  atividades: ["Limpeza e organização do espaço", "Montagem de estruturas", "Suporte durante o evento"],
  valorDiaria: 160.0,
  valorTotal: 320.0,
  taxaScalador: 32.0,
  valorComTaxa: 352.0,
  quantidadeFreelancers: 2,
  localizacao: {
    endereco: "SAUS Quadra 4",
    bairro: "Asa Sul",
    cidade: "Brasília",
    estado: "DF",
    cep: "70070-040",
    coordenadas: {
      lat: -15.7942,
      lng: -47.8822
    }
  },
  data: "2025-11-27",
  horarioEntrada: "10:30",
  horarioSaida: "22:30",
  vestimenta: "Calça preta, camisa branca, sapato fechado",
  experienciaNecessaria: true,
  beneficios: ["Passagem", "Alimentação"],
  status: "aberta",
  publicadoEm: new Date(Date.now() - 5 * 60 * 60 * 1000),
  perguntasFrequentes: [{
    pergunta: "Preciso levar meu próprio uniforme?",
    resposta: "Não, a vestimenta padrão é: calça preta, camisa branca e sapato fechado."
  }, {
    pergunta: "Há alimentação incluída?",
    resposta: "Sim, alimentação e passagem estão inclusas nos benefícios."
  }, {
    pergunta: "Preciso ter experiência prévia?",
    resposta: "Sim, é necessário ter experiência na área."
  }]
}, {
  id: "2",
  titulo: "Garçom para Evento",
  empresa: "Restaurante Premium",
  logoEmpresa: "🍽️",
  tipo: "freelance",
  profissao: "Garçom",
  descricao: "Evento de confraternização empresarial",
  atividades: ["Servir alimentos e bebidas", "Atendimento aos convidados", "Organização do buffet"],
  valorDiaria: 200.0,
  valorTotal: 600.0,
  taxaScalador: 60.0,
  valorComTaxa: 660.0,
  quantidadeFreelancers: 3,
  localizacao: {
    endereco: "Quadra 516 Bloco B, 66",
    bairro: "Asa Sul",
    cidade: "Brasília",
    estado: "DF",
    cep: "70000-000",
    coordenadas: {
      lat: -15.8153,
      lng: -47.9193
    }
  },
  data: "2025-11-28",
  horarioEntrada: "18:00",
  horarioSaida: "23:00",
  vestimenta: "Terno preto, gravata, sapato social",
  experienciaNecessaria: true,
  beneficios: ["Alimentação"],
  status: "em_deslocamento",
  publicadoEm: new Date(Date.now() - 2 * 60 * 60 * 1000),
  perguntasFrequentes: [{
    pergunta: "Qual é o código de vestimenta?",
    resposta: "Terno preto com gravata e sapato social."
  }, {
    pergunta: "Há estacionamento disponível?",
    resposta: "Sim, estacionamento gratuito para funcionários."
  }, {
    pergunta: "Posso sair mais cedo?",
    resposta: "O horário de saída é fixo às 23:00, salvo liberação do coordenador."
  }],
  freelancerSelecionado: {
    id: "f1",
    nome: "João Silva",
    foto: "👨",
    rating: 4.8,
    telefone: "(61) 98765-4321",
    tempoEstimadoChegada: "2:30h",
    horarioAceite: new Date(Date.now() - 30 * 60 * 1000)
  },
  tempoLimiteEmpresaCancelar: new Date(Date.now() + 10 * 60 * 1000)
}, {
  id: "3",
  titulo: "Recepcionista",
  empresa: "Hotel Central",
  logoEmpresa: "🏨",
  tipo: "temporario",
  profissao: "Recepcionista",
  descricao: "Vaga temporária para cobertura de férias",
  atividades: ["Atendimento ao cliente", "Check-in e check-out", "Gestão de reservas"],
  valorDiaria: 150.0,
  valorTotal: 150.0,
  taxaScalador: 15.0,
  valorComTaxa: 165.0,
  quantidadeFreelancers: 1,
  localizacao: {
    endereco: "SHN Quadra 5",
    bairro: "Asa Norte",
    cidade: "Brasília",
    estado: "DF",
    cep: "70000-000",
    coordenadas: {
      lat: -15.7094,
      lng: -47.9025
    }
  },
  data: "2025-11-29",
  horarioEntrada: "08:00",
  horarioSaida: "17:00",
  vestimenta: "Social (blazer opcional)",
  experienciaNecessaria: false,
  beneficios: ["Vale transporte", "Vale refeição"],
  status: "aberta",
  publicadoEm: new Date(Date.now() - 1 * 60 * 60 * 1000),
  perguntasFrequentes: [{
    pergunta: "É necessário falar inglês?",
    resposta: "Inglês básico é desejável, mas não obrigatório."
  }, {
    pergunta: "Há treinamento?",
    resposta: "Sim, será fornecido treinamento no primeiro dia."
  }, {
    pergunta: "Qual o horário do almoço?",
    resposta: "Intervalo de 1 hora entre 12:00 e 13:00."
  }]
}];
const MOCK_HISTORICO_FREELANCERS = [{
  id: "h1",
  freelancerId: "f1",
  nome: "João Silva",
  jobId: "2",
  status: "aceito",
  data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
}, {
  id: "h2",
  freelancerId: "f2",
  nome: "Maria Santos",
  jobId: "1",
  status: "concluido",
  data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
}, {
  id: "h3",
  freelancerId: "f3",
  nome: "Carlos Lima",
  jobId: "3",
  status: "aceito",
  data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
}, {
  id: "h4",
  freelancerId: "f4",
  nome: "Ana Costa",
  jobId: "1",
  status: "recusado",
  data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
}, {
  id: "h5",
  freelancerId: "f5",
  nome: "Pedro Oliveira",
  jobId: "2",
  status: "cancelado_empresa",
  data: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
}];
const MOCK_FREELANCERS: Freelancer[] = [{
  id: "f1",
  nome: "João Silva",
  foto: "👨",
  profissao: "Garçom",
  rating: 4.8,
  totalTrabalhos: 127,
  experiencia: "5 anos",
  localizacao: {
    bairro: "Asa Sul",
    cidade: "Brasília",
    estado: "DF",
    coordenadas: {
      lat: -15.7801,
      lng: -47.9292
    }
  },
  habilidades: ["Eventos", "Atendimento VIP", "Buffet"],
  disponivel: true,
  valorHora: 35.0,
  telefone: "(61) 98765-4321",
  descricao: "Profissional experiente em eventos corporativos e sociais",
  avaliacaoDetalhada: {
    pontualidade: 4.9,
    qualidadeTrabalho: 4.8,
    comunicacao: 4.7,
    profissionalismo: 4.9,
    apresentacao: 4.7
  },
  historicoComparecimento: {
    totalAgendados: 127,
    totalCompareceu: 127,
    totalFaltas: 0,
    taxaComparecimento: 100,
    historicoDetalhado: [{
      data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      empresa: "Restaurante Premium",
      compareceu: true
    }, {
      data: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      empresa: "Hotel Central",
      compareceu: true
    }]
  },
  ultimosTrabalhos: [{
    empresa: "Restaurante Premium",
    cargo: "Garçom",
    avaliacao: 5,
    data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  }, {
    empresa: "Hotel Central",
    cargo: "Garçom",
    avaliacao: 4.8,
    data: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  }]
}, {
  id: "f2",
  nome: "Maria Santos",
  foto: "👩",
  profissao: "Auxiliar de Limpeza",
  rating: 4.9,
  totalTrabalhos: 203,
  experiencia: "8 anos",
  localizacao: {
    bairro: "Taguatinga",
    cidade: "Brasília",
    estado: "DF",
    coordenadas: {
      lat: -15.8270,
      lng: -48.0501
    }
  },
  habilidades: ["Limpeza Pesada", "Organização", "Eventos"],
  disponivel: true,
  valorHora: 28.0,
  telefone: "(61) 98111-2222",
  descricao: "Especialista em limpeza e organização de eventos",
  avaliacaoDetalhada: {
    pontualidade: 5.0,
    qualidadeTrabalho: 4.9,
    comunicacao: 4.8,
    profissionalismo: 5.0,
    apresentacao: 4.8
  },
  historicoComparecimento: {
    totalAgendados: 203,
    totalCompareceu: 199,
    totalFaltas: 4,
    taxaComparecimento: 98.03,
    ultimaFalta: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    historicoDetalhado: [{
      data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      empresa: "Scalador",
      compareceu: true
    }, {
      data: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      empresa: "Shopping Center",
      compareceu: true
    }, {
      data: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      empresa: "Evento Corporativo",
      compareceu: false,
      justificativa: "Emergência médica"
    }]
  },
  ultimosTrabalhos: [{
    empresa: "Scalador",
    cargo: "Auxiliar",
    avaliacao: 5,
    data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  }, {
    empresa: "Shopping Center",
    cargo: "Limpeza",
    avaliacao: 4.9,
    data: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  }]
}, {
  id: "f3",
  nome: "Carlos Lima",
  foto: "👨‍💼",
  profissao: "Recepcionista",
  rating: 4.7,
  totalTrabalhos: 85,
  experiencia: "3 anos",
  localizacao: {
    bairro: "Asa Norte",
    cidade: "Brasília",
    estado: "DF",
    coordenadas: {
      lat: -15.7217,
      lng: -47.8870
    }
  },
  habilidades: ["Atendimento", "Inglês fluente", "Informática"],
  disponivel: true,
  valorHora: 32.0,
  telefone: "(61) 98333-4444",
  descricao: "Recepcionista bilíngue com experiência em hotelaria",
  avaliacaoDetalhada: {
    pontualidade: 4.5,
    qualidadeTrabalho: 4.8,
    comunicacao: 4.9,
    profissionalismo: 4.7,
    apresentacao: 4.6
  },
  historicoComparecimento: {
    totalAgendados: 85,
    totalCompareceu: 78,
    totalFaltas: 7,
    taxaComparecimento: 91.76,
    ultimaFalta: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    historicoDetalhado: [{
      data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      empresa: "Hotel Central",
      compareceu: true
    }, {
      data: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      empresa: "Evento XYZ",
      compareceu: false,
      justificativa: "Problema de transporte"
    }]
  },
  ultimosTrabalhos: [{
    empresa: "Hotel Central",
    cargo: "Recepcionista",
    avaliacao: 4.7,
    data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }]
}, {
  id: "f4",
  nome: "Ana Costa",
  foto: "👩‍🍳",
  profissao: "Cozinheira",
  rating: 5.0,
  totalTrabalhos: 156,
  experiencia: "10 anos",
  localizacao: {
    bairro: "Ceilândia",
    cidade: "Brasília",
    estado: "DF",
    coordenadas: {
      lat: -15.8930,
      lng: -48.0591
    }
  },
  habilidades: ["Cozinha Brasileira", "Eventos", "Buffet"],
  disponivel: false,
  valorHora: 45.0,
  telefone: "(61) 98555-6666",
  descricao: "Chef especializada em eventos e cozinha regional",
  avaliacaoDetalhada: {
    pontualidade: 5.0,
    qualidadeTrabalho: 5.0,
    comunicacao: 5.0,
    profissionalismo: 5.0,
    apresentacao: 5.0
  },
  historicoComparecimento: {
    totalAgendados: 156,
    totalCompareceu: 156,
    totalFaltas: 0,
    taxaComparecimento: 100,
    historicoDetalhado: [{
      data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      empresa: "Restaurante Gourmet",
      compareceu: true
    }]
  },
  ultimosTrabalhos: [{
    empresa: "Restaurante Gourmet",
    cargo: "Chef",
    avaliacao: 5,
    data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }]
}, {
  id: "f5",
  nome: "Pedro Oliveira",
  foto: "👨‍🔧",
  profissao: "Técnico de Eventos",
  rating: 4.6,
  totalTrabalhos: 94,
  experiencia: "4 anos",
  localizacao: {
    bairro: "Águas Claras",
    cidade: "Brasília",
    estado: "DF",
    coordenadas: {
      lat: -15.8398,
      lng: -48.0226
    }
  },
  habilidades: ["Montagem", "Som e Luz", "Elétrica"],
  disponivel: true,
  valorHora: 38.0,
  telefone: "(61) 98777-8888",
  descricao: "Técnico completo para montagem e suporte de eventos",
  avaliacaoDetalhada: {
    pontualidade: 4.4,
    qualidadeTrabalho: 4.7,
    comunicacao: 4.5,
    profissionalismo: 4.6,
    apresentacao: 4.8
  },
  historicoComparecimento: {
    totalAgendados: 94,
    totalCompareceu: 75,
    totalFaltas: 19,
    taxaComparecimento: 79.79,
    ultimaFalta: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    historicoDetalhado: [{
      data: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      empresa: "Eventos Premium",
      compareceu: true
    }, {
      data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      empresa: "Show Festival",
      compareceu: false,
      justificativa: "Não compareceu"
    }, {
      data: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      empresa: "Congresso Tech",
      compareceu: false
    }]
  },
  ultimosTrabalhos: [{
    empresa: "Eventos Premium",
    cargo: "Técnico",
    avaliacao: 4.6,
    data: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  }]
}];

// ===== COMPONENTE PRINCIPAL =====
export default function Index() {
  const [currentPage, setCurrentPage] = useState("vagas");
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [saldoAtual, setSaldoAtual] = useState(500.0);
  const [modalWhatsApp, setModalWhatsApp] = useState<{
    isOpen: boolean;
    tipo: string;
    destinatario: string;
    conteudo: any;
  }>({
    isOpen: false,
    tipo: "",
    destinatario: "",
    conteudo: null
  });
  const [historicoFreelancers, setHistoricoFreelancers] = useState(MOCK_HISTORICO_FREELANCERS);
  const [freelancers, setFreelancers] = useState<Freelancer[]>(MOCK_FREELANCERS);
  const [carteiraFreelancers, setCarteiraFreelancers] = useState<string[]>(["f1", "f2"]); // IDs dos favoritos
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [userType, setUserType] = useState<UserType>("freelancer"); // Tipo de usuário logado
  const {
    toast
  } = useToast();

  // Localização do usuário (empresa) - Exemplo: Asa Sul
  const localizacaoUsuario = {
    lat: -15.7801,
    lng: -47.9292
  };

  // Função para calcular distância entre dois pontos (Haversine)
  const calcularDistancia = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filtros
  const [filtros, setFiltros] = useState({
    busca: "",
    tipo: "todos",
    profissao: "todas",
    bairro: "todos",
    estado: "todos",
    experiencia: "todas",
    distanciaMaxima: "todas"
  });
  const [filtrosFreelancers, setFiltrosFreelancers] = useState({
    busca: "",
    profissao: "todas",
    disponivel: "todos",
    avaliacao: "todas"
  });

  // Adicionar notificações automáticas
  useEffect(() => {
    const novasNotificacoes: Notification[] = [{
      id: "n1",
      tipo: "checkin",
      titulo: "Freelancer a caminho",
      mensagem: "João Silva aceitou a vaga e está se deslocando",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      lida: false,
      vagaId: "2"
    }, {
      id: "n2",
      tipo: "pagamento",
      titulo: "Pagamento realizado",
      mensagem: "Seu pagamento foi aprovado com sucesso",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lida: false
    }];
    setNotifications(novasNotificacoes);
  }, []);

  // ===== FUNÇÕES DE NAVEGAÇÃO =====
  const navegarPara = (pagina: string, jobId?: string) => {
    setCurrentPage(pagina);
    if (jobId) {
      const job = jobs.find(j => j.id === jobId);
      setSelectedJob(job || null);
    }
    setShowMenu(false);
  };

  // ===== FUNÇÕES DE AÇÃO =====
  const simularEnvioWhatsApp = (tipo: string, destinatario: string, conteudo: any) => {
    // Abrir modal visual do WhatsApp
    setModalWhatsApp({
      isOpen: true,
      tipo,
      destinatario,
      conteudo
    });
    console.log("📱 SIMULANDO ENVIO WHATSAPP:", {
      tipo,
      destinatario,
      conteudo
    });

    // Adicionar notificação de confirmação
    const novaNotif: Notification = {
      id: `n${Date.now()}`,
      tipo: "sistema",
      titulo: "WhatsApp preparado",
      mensagem: `Mensagem pronta para ${destinatario}`,
      timestamp: new Date(),
      lida: false
    };
    setNotifications(prev => [novaNotif, ...prev]);
  };
  const publicarVaga = (dadosVaga: any) => {
    const novaVaga: Job = {
      ...dadosVaga,
      id: `job-${Date.now()}`,
      status: "aberta" as JobStatus,
      publicadoEm: new Date(),
      taxaScalador: dadosVaga.valorTotal * 0.1,
      valorComTaxa: dadosVaga.valorTotal * 1.1
    };
    setJobs(prev => [novaVaga, ...prev]);
    setSaldoAtual(prev => prev - novaVaga.valorComTaxa);

    // Simular envio para freelancers via WhatsApp com TODAS as informações
    simularEnvioWhatsApp("nova_vaga", "Todos os freelancers", {
      titulo: novaVaga.titulo,
      valor: novaVaga.valorDiaria,
      local: novaVaga.localizacao.cidade,
      endereco: `${novaVaga.localizacao.endereco}, ${novaVaga.localizacao.cidade} - ${novaVaga.localizacao.estado}`,
      data: novaVaga.data,
      horario: `${novaVaga.horarioEntrada} - ${novaVaga.horarioSaida}`,
      vestimenta: novaVaga.vestimenta,
      coordenadas: novaVaga.localizacao.coordenadas
    });
    navegarPara("minhas-vagas");
  };
  const aceitarFreelancer = (jobId: string, freelancerId: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: "em_deslocamento" as JobStatus,
          tempoLimiteEmpresaCancelar: new Date(Date.now() + 20 * 60 * 1000)
        };
      }
      return job;
    }));
    const job = jobs.find(j => j.id === jobId);
    if (job?.freelancerSelecionado) {
      simularEnvioWhatsApp("confirmacao_empresa", job.freelancerSelecionado.nome, {
        status: "aprovado",
        mensagem: "A empresa confirmou! Você pode se deslocar."
      });
    }
  };
  const cancelarFreelancer = (jobId: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: "aguardando_freelancer" as JobStatus,
          freelancerSelecionado: undefined,
          tempoLimiteEmpresaCancelar: undefined
        };
      }
      return job;
    }));
    simularEnvioWhatsApp("cancelamento", "Freelancer", {
      mensagem: "A empresa solicitou outro profissional"
    });
  };
  const confirmarChegada = (jobId: string, quem: "freelancer" | "empresa") => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    if (quem === "freelancer") {
      simularEnvioWhatsApp("checkin_freelancer", job.empresa, {
        freelancer: job.freelancerSelecionado?.nome,
        mensagem: "Freelancer chegou no local"
      });
    } else {
      setJobs(prev => prev.map(j => {
        if (j.id === jobId) {
          return {
            ...j,
            status: "em_andamento" as JobStatus
          };
        }
        return j;
      }));
      simularEnvioWhatsApp("checkin_confirmado", job.freelancerSelecionado?.nome || "", {
        mensagem: "Check-in confirmado pela empresa"
      });
    }
  };

  // ===== FUNÇÕES CARTEIRA DE FREELANCERS =====
  const toggleCarteiraFreelancer = (freelancerId: string) => {
    setCarteiraFreelancers(prev => {
      if (prev.includes(freelancerId)) {
        toast({
          title: "Removido da carteira",
          description: "Freelancer removido dos seus favoritos"
        });
        return prev.filter(id => id !== freelancerId);
      } else {
        toast({
          title: "Adicionado à carteira",
          description: "Freelancer salvo nos seus favoritos"
        });
        return [...prev, freelancerId];
      }
    });
  };
  const convidarFreelancer = (freelancerId: string, vagaId?: string) => {
    const freelancer = freelancers.find(f => f.id === freelancerId);
    if (!freelancer) return;
    simularEnvioWhatsApp("convite_direto", freelancer.nome, {
      tipo: "convite_personalizado",
      mensagem: `A empresa quer convidar você para uma vaga!`,
      freelancer: freelancer.nome,
      telefone: freelancer.telefone
    });
    toast({
      title: "Convite enviado!",
      description: `${freelancer.nome} receberá seu convite via WhatsApp`
    });
  };

  // ===== COMPONENTES DE UI =====
  const MenuDropdown = () => <>
      {/* Overlay escuro que fecha o menu ao clicar */}
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in" onClick={() => setShowMenu(false)} />

      {/* Container do menu fixo à direita */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 md:absolute md:right-4 md:top-20 md:inset-auto md:w-80 md:rounded-3xl md:shadow-xl overflow-hidden flex flex-col animate-slide-in-right md:animate-scale-in">
        <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-600 to-blue-500 text-white">
          <div className="flex items-center justify-between mb-4 md:mb-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-xl">
                S
              </div>
              <div>
                <p className="font-bold text-lg sm:text-xl">Scalador</p>
                <p className="text-xs sm:text-sm text-blue-100">contato.scalador@gmail.com</p>
              </div>
            </div>
            <button className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-all" onClick={() => setShowMenu(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="flex-1 h-[calc(100vh-100px)] md:h-auto py-2 sm:py-3 bg-white overflow-y-auto">
          <button onClick={() => {
          navegarPara("vagas");
          setShowMenu(false);
        }} className="md:hidden w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group">
            <Home className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" /> Vagas
          </button>
          <button onClick={() => {
          navegarPara("freelancers");
          setShowMenu(false);
        }} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group">
            <Users className="w-5 h-5 text-scalador-orange group-hover:scale-110 transition-transform" /> Buscar Freelancers
          </button>
          <button onClick={() => {
          navegarPara("carteira");
          setShowMenu(false);
        }} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group relative">
            <Heart className="w-5 h-5 text-scalador-orange group-hover:scale-110 transition-transform" />
            Minha Carteira
            {carteiraFreelancers.length > 0 && <span className="absolute right-4 bg-gradient-to-r from-scalador-orange to-scalador-orange-light text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {carteiraFreelancers.length}
              </span>}
          </button>
          <button onClick={() => {
          navegarPara("publicar");
          setShowMenu(false);
        }} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group">
            <Plus className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" /> Publicar vaga
          </button>
          <button onClick={() => {
          navegarPara("minhas-vagas");
          setShowMenu(false);
        }} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group">
            <Briefcase className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" /> Minhas Vagas
          </button>
          <button onClick={() => {
          navegarPara("pagamentos");
          setShowMenu(false);
        }} className="md:hidden w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group">
            <FileText className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" /> Pagamentos
          </button>
          <button onClick={() => {
          navegarPara("calendario");
          setShowMenu(false);
        }} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group">
            <Calendar className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" /> Calendário
          </button>
          <button onClick={() => {
          navegarPara("pagamentos");
          setShowMenu(false);
        }} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group">
            <Wallet className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" /> Minha Carteira
          </button>
          <button onClick={() => {
          navegarPara("configuracoes");
          setShowMenu(false);
        }} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group">
            <Settings className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" /> Configurações
          </button>
          <button onClick={() => {
          navegarPara("notificacoes");
          setShowMenu(false);
        }} className="md:hidden w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group">
            <MessageSquare className="w-5 h-5 text-scalador-blue group-hover:scale-110 transition-transform" /> Mensagens
          </button>
          <button onClick={() => setShowMenu(false)} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group">
            <HelpCircle className="w-5 h-5 text-scalador-blue group-hover:scale-110 transition-transform" /> Preciso de ajuda
          </button>
          <hr className="my-2 border-gray-100" />
          <button onClick={() => setShowMenu(false)} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 font-semibold transition-all duration-300 group rounded-b-3xl">
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" /> Sair
          </button>
        </div>
      </div>
    </>;

  // Menu mobile simples, em tela cheia
  const MobileMenu = () => <>
      <div className="fixed inset-0 bg-black/50 z-[9998] md:hidden animate-fade-in" onClick={() => setShowMenu(false)} />
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-[9999] flex flex-col animate-slide-in-right md:hidden">
        <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-600 to-blue-500 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-xl">
                S
              </div>
              <div>
                <p className="font-bold text-lg sm:text-xl">Scalador</p>
                <p className="text-xs sm:text-sm text-blue-100">contato.scalador@gmail.com</p>
              </div>
            </div>
            <button className="p-2 hover:bg-white/20 rounded-lg transition-all" onClick={() => setShowMenu(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="flex-1 py-2 sm:py-3 bg-white overflow-y-auto">
          <button onClick={() => navegarPara("vagas")} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group">
            <Home className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" /> Vagas
          </button>
          <button onClick={() => navegarPara("freelancers")} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group">
            <Users className="w-5 h-5 text-scalador-orange group-hover:scale-110 transition-transform" /> Buscar Freelancers
          </button>
          <button onClick={() => navegarPara("carteira")} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group relative">
            <Heart className="w-5 h-5 text-scalador-orange group-hover:scale-110 transition-transform" />
            Minha Carteira
            {carteiraFreelancers.length > 0 && <span className="absolute right-4 bg-gradient-to-r from-scalador-orange to-scalador-orange-light text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {carteiraFreelancers.length}
              </span>}
          </button>
          <button onClick={() => navegarPara("publicar")} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center gap-3 text-gray-700 font-medium transition-all duração-300 group">
            <Plus className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" /> Publicar vaga
          </button>
          <button onClick={() => navegarPara("minhas-vagas")} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center gap-3 text-gray-700 font-medium transition-all duração-300 group">
            <Briefcase className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" /> Minhas Vagas
          </button>
          <button onClick={() => navegarPara("pagamentos")} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center gap-3 text-gray-700 font-medium transition-all duração-300 group">
            <FileText className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" /> Pagamentos
          </button>
          <button onClick={() => navegarPara("saldo")} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center gap-3 text-gray-700 font-medium transition-all duração-300 group">
            <Wallet className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" /> Minha Carteira
          </button>
          <button onClick={() => navegarPara("configuracoes")} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center gap-3 text-gray-700 font-medium transition-all duração-300 group">
            <Settings className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" /> Configurações
          </button>
          <button onClick={() => navegarPara("notificacoes")} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group">
            <MessageSquare className="w-5 h-5 text-scalador-blue group-hover:scale-110 transition-transform" /> Mensagens
          </button>
          <button onClick={() => setShowMenu(false)} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center gap-3 text-gray-700 font-medium transition-all duration-300 group">
            <HelpCircle className="w-5 h-5 text-scalador-blue group-hover:scale-110 transition-transform" /> Preciso de ajuda
          </button>
          <hr className="my-2 border-gray-100" />
          <button onClick={() => setShowMenu(false)} className="w-full px-4 sm:px-6 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 font-semibold transition-all duração-300 group rounded-b-3xl">
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" /> Sair
          </button>
        </div>
      </div>
    </>;
  const Header = () => <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-2xl shadow-blue-500/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-10">
          <img src={scaladorLogo} alt="Scalador" className="h-8 sm:h-10 cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => navegarPara("vagas")} />
          <nav className="hidden md:flex gap-8">
            <button onClick={() => navegarPara("vagas")} className="relative text-gray-900 hover:text-blue-600 font-semibold transition-all duration-300 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-gradient-to-r after:from-blue-600 after:to-blue-400 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left backdrop-blur-sm">
              Vagas
            </button>
            <button onClick={() => navegarPara("freelancers")} className="relative text-gray-900 hover:text-blue-600 font-semibold transition-all duration-300 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-gradient-to-r after:from-blue-600 after:to-blue-400 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left backdrop-blur-sm">
              Buscar Freelancers
            </button>
            <button onClick={() => navegarPara("carteira")} className="relative text-gray-900 hover:text-blue-600 font-semibold transition-all duration-300 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-gradient-to-r after:from-blue-600 after:to-blue-400 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left backdrop-blur-sm flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Favoritos
              {carteiraFreelancers.length > 0 && <span className="bg-gradient-to-r from-scalador-orange to-scalador-orange-light text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {carteiraFreelancers.length}
                </span>}
            </button>
            <button onClick={() => navegarPara("minhas-vagas")} className="relative text-gray-900 hover:text-blue-600 font-semibold transition-all duration-300 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-gradient-to-r after:from-blue-600 after:to-blue-400 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left backdrop-blur-sm">
              Minhas Vagas
            </button>
            <button onClick={() => navegarPara("publicar")} className="relative text-gray-900 hover:text-blue-600 font-semibold transition-all duration-300 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-gradient-to-r after:from-blue-600 after:to-blue-400 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left backdrop-blur-sm">
              Publicar Vaga
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Toggle de tipo de usuário (para demonstração) */}
          <div className="hidden lg:flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50">
            <button onClick={() => setUserType("freelancer")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${userType === "freelancer" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"}`}>
              Freelancer
            </button>
            <button onClick={() => setUserType("empresa")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${userType === "empresa" ? "bg-gradient-to-r from-scalador-orange to-amber-500 text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"}`}>
              Empresa
            </button>
            <button onClick={() => setUserType("visitante")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${userType === "visitante" ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"}`}>
              Visitante
            </button>
          </div>
          <button className="p-2 sm:p-3 hover:bg-white/40 rounded-xl transition-all duration-300 hidden md:block hover:scale-105 backdrop-blur-sm">
            <MessageSquare className="w-4 sm:w-5 h-4 sm:h-5 text-gray-800" />
          </button>
          <button className="p-2 sm:p-3 hover:bg-white/40 rounded-xl relative transition-all duration-300 hover:scale-105 backdrop-blur-sm" onClick={() => navegarPara("notificacoes")}>
            <Bell className="w-4 sm:w-5 h-4 sm:h-5 text-gray-800" />
            {notifications.filter(n => !n.lida).length > 0 && <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>}
          </button>
          <button className="md:hidden w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-600/50 hover:scale-110 transition-all duration-300" onClick={() => setShowMenu(!showMenu)} aria-label="Menu">
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button className="hidden md:flex w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl items-center justify-center text-white font-black text-base sm:text-lg shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-600/50 hover:scale-110 transition-all duration-300" onClick={() => setShowMenu(!showMenu)}>
            S
          </button>
        </div>
      </div>
      {/* Menu mobile renderizado fora do header para ficar acima de tudo */}
    </header>;
  const Footer = () => <footer className="bg-gradient-to-br from-gray-900 via-scalador-orange-dark/80 to-gray-900 text-white mt-16 sm:mt-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-scalador-orange/10 to-amber-500/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
          <div>
            <div className="mb-4 sm:mb-6">
              <img src={scaladorLogo} alt="Scalador" className="h-12 sm:h-16 w-auto object-contain" />
            </div>
            <p className="text-orange-100 text-xs sm:text-sm mb-2 font-medium">CNPJ: 41.264.266/0001-29</p>
            <p className="text-orange-100 text-xs sm:text-sm leading-relaxed">
              Quadra Crs 516 Bloco B, 66 - Asa Sul, Brasília - DF
            </p>
            <p className="text-orange-200 text-xs sm:text-sm mt-4 sm:mt-6 font-semibold">© 2025 Scalador. Todos os direitos reservados</p>
          </div>
          <div>
            <h4 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-white">Contatos</h4>
            <p className="text-orange-100 text-xs sm:text-sm mb-3 flex items-center gap-2 sm:gap-3 hover:text-white transition-colors cursor-pointer group">
              <Phone className="w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110 transition-transform flex-shrink-0" /> (11) 92089-3500
            </p>
            <p className="text-orange-100 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 hover:text-white transition-colors cursor-pointer group">
              <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">📧</span> 
              <span className="break-all">contato.scalador@gmail.com</span>
            </p>
          </div>
          <div className="sm:col-span-2 md:col-span-1">
            <h4 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-white">Soluções</h4>
            <ul className="space-y-2 sm:space-y-3 text-orange-100 text-xs sm:text-sm font-medium">
              <li>
                <button onClick={() => navegarPara("vagas")} className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  → Vagas
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  → Quero trabalhar
                </a>
              </li>
            </ul>
            <div className="flex gap-4 sm:gap-5 mt-4 sm:mt-6">
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-orange-100 hover:text-white hover:scale-110 transition-all duration-300 shadow-lg">
                Li
              </a>
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-orange-100 hover:text-white hover:scale-110 transition-all duration-300 shadow-lg">
                In
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-orange-400/30 text-center text-orange-200 text-xs sm:text-sm font-medium">
          desenvolvido com <span className="text-red-400 animate-pulse">🔥</span> por{" "}
          <span className="font-bold text-white">Konecta</span>
        </div>
      </div>
    </footer>;

  // ===== COMPONENTE DISPLAY VALOR =====
  const DisplayValor = ({
    valorBase,
    tipoUsuario,
    size = "default",
    showDetails = false
  }: {
    valorBase: number;
    tipoUsuario: UserType;
    size?: "small" | "default" | "large";
    showDetails?: boolean;
  }) => {
    const valores = calcularValores(valorBase);
    const sizeClasses = {
      small: "text-lg sm:text-xl",
      default: "text-2xl sm:text-4xl",
      large: "text-3xl sm:text-5xl"
    };

    // EMPRESA vê valor COM taxa (laranja)
    if (tipoUsuario === "empresa") {
      return <div>
          <p className={`${sizeClasses[size]} font-black text-scalador-orange`}>
            R$ {valores.valorParaEmpresa.toFixed(2)}
            {size !== "large" && <span className="text-xs sm:text-sm font-semibold text-gray-500"> / dia</span>}
          </p>
          {showDetails && <p className="text-xs text-scalador-orange/80 font-medium mt-1">
              Inclui taxa de serviço ({valores.taxaServico}%)
            </p>}
        </div>;
    }

    // FREELANCER vê valor SEM taxa (verde)
    if (tipoUsuario === "freelancer") {
      return <div>
          <p className={`${sizeClasses[size]} font-black gradient-text-green`}>
            R$ {valores.valorParaFreelancer.toFixed(2)}
            {size !== "large" && <span className="text-xs sm:text-sm font-semibold text-gray-500"> / dia</span>}
          </p>
          {showDetails && <p className="text-xs text-scalador-green font-medium mt-1">
              Valor líquido a receber
            </p>}
        </div>;
    }

    // VISITANTE vê bloqueado
    return <div className="flex items-center gap-2">
        <div className="relative">
          <p className={`${sizeClasses[size]} font-black text-gray-300 blur-sm select-none`}>
            R$ ---.--
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <Lock className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-bold text-gray-600">Faça login para ver</span>
            </div>
          </div>
        </div>
      </div>;
  };
  const JobCard = ({
    job
  }: {
    job: Job;
  }) => {
    const statusBadge = {
      aberta: {
        text: "Vaga Aberta",
        color: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/40"
      },
      aguardando_freelancer: {
        text: "Aguardando",
        color: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/40"
      },
      em_deslocamento: {
        text: "Em Deslocamento",
        color: "bg-gradient-to-r from-scalador-orange to-amber-500 text-white shadow-lg shadow-orange-500/40 animate-pulse"
      },
      em_andamento: {
        text: "Em Andamento",
        color: "bg-gradient-to-r from-scalador-blue to-cyan-500 text-white shadow-lg shadow-blue-500/40"
      },
      concluida: {
        text: "Concluída",
        color: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/40"
      },
      cancelada: {
        text: "Cancelada",
        color: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/40"
      }
    };
    return <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 cursor-pointer group hover:-translate-y-1 sm:hover:-translate-y-2 relative overflow-hidden" onClick={() => navegarPara("vaga-detalhes", job.id)}>
        <div className="absolute inset-0 bg-gradient-to-br from-scalador-orange/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0">
            {job.logoEmpresa}
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-scalador-orange mb-1">{job.empresa}</p>
                <h3 className="text-lg sm:text-2xl font-black text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-scalador-orange group-hover:to-amber-500 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                  {job.titulo}
                </h3>
              </div>
              <span className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold ${statusBadge[job.status].color} whitespace-nowrap flex-shrink-0`}>
                {statusBadge[job.status].text}
              </span>
            </div>
            <div className="mb-3 sm:mb-4">
              <DisplayValor valorBase={job.valorDiaria} tipoUsuario={userType} />
            </div>
            <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-2 leading-relaxed">{job.descricao}</p>
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
              <span className="px-3 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/50 text-scalador-orange rounded-full text-xs sm:text-sm font-bold shadow-sm">
                {job.tipo === "freelance" ? "⚡ Freelancer" : "📅 Temporário"}
              </span>
              <span className="px-3 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 text-scalador-blue rounded-full text-xs sm:text-sm font-bold shadow-sm">
                👔 {job.profissao}
              </span>
              <span className="px-3 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/50 text-scalador-orange rounded-full text-xs sm:text-sm font-bold shadow-sm whitespace-nowrap">
                {job.experienciaNecessaria ? "⭐ Com experiência" : "🌟 Sem experiência"}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 font-medium">
              <span className="flex items-center gap-1.5 sm:gap-2 group/item">
                <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-scalador-orange group-hover/item:scale-110 transition-transform flex-shrink-0" />
                <span className="font-bold text-scalador-orange">{job.localizacao.bairro}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{job.localizacao.cidade}</span>
              </span>
              {job.localizacao.coordenadas && <span className="flex items-center gap-1.5 sm:gap-2 group/item whitespace-nowrap">
                  <Navigation className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 group-hover/item:scale-110 transition-transform flex-shrink-0" />
                  <span className="font-bold text-green-600">
                    {calcularDistancia(localizacaoUsuario.lat, localizacaoUsuario.lng, job.localizacao.coordenadas.lat, job.localizacao.coordenadas.lng).toFixed(1)}km
                  </span>
                </span>}
              <span className="flex items-center gap-1.5 sm:gap-2 group/item whitespace-nowrap">
                <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-scalador-blue group-hover/item:scale-110 transition-transform flex-shrink-0" />
                {new Date(job.data).toLocaleDateString("pt-BR")}
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2 group/item whitespace-nowrap">
                <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-scalador-orange group-hover/item:scale-110 transition-transform flex-shrink-0" />
                {job.horarioEntrada} - {job.horarioSaida}
              </span>
            </div>
          </div>
        </div>
      </div>;
  };

  // ===== PÁGINAS =====
  const PaginaVagas = () => {
    const jobsFiltrados = jobs.filter(job => {
      if (filtros.busca && !job.titulo.toLowerCase().includes(filtros.busca.toLowerCase()) && !job.localizacao.bairro.toLowerCase().includes(filtros.busca.toLowerCase())) return false;
      if (filtros.tipo !== "todos" && job.tipo !== filtros.tipo) return false;
      if (filtros.bairro !== "todos" && job.localizacao.bairro !== filtros.bairro) return false;

      // Filtro de distância
      if (filtros.distanciaMaxima !== "todas" && job.localizacao.coordenadas) {
        const distancia = calcularDistancia(localizacaoUsuario.lat, localizacaoUsuario.lng, job.localizacao.coordenadas.lat, job.localizacao.coordenadas.lng);
        const maxDistancia = parseFloat(filtros.distanciaMaxima);
        if (distancia > maxDistancia) return false;
      }
      return true;
    });
    return <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-12">
        <div className="mb-8 sm:mb-12 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4">
            <span className="gradient-text">Vagas Disponíveis</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-xl font-medium">Encontre as melhores oportunidades 🚀</p>
        </div>

        {/* Search Bar - Acima de tudo */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-10">
          <div className="flex gap-2 sm:gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 text-scalador-orange w-5 sm:w-6 h-5 sm:h-6 group-focus-within:scale-110 group-focus-within:text-scalador-orange-dark transition-all" />
              <input type="text" placeholder="Procure por trabalhos..." className="w-full pl-10 sm:pl-14 pr-3 sm:pr-6 py-3 sm:py-5 glass rounded-xl sm:rounded-2xl text-sm sm:text-lg font-medium placeholder:text-gray-400 focus:ring-4 focus:ring-scalador-orange/30 focus:border-scalador-orange transition-all duration-300" value={filtros.busca} onChange={e => setFiltros({
              ...filtros,
              busca: e.target.value
            })} />
            </div>
            <button className="px-5 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-scalador-orange via-scalador-orange to-scalador-orange-light bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg shadow-xl shadow-orange-500/40 hover:shadow-2xl hover:shadow-orange-600/50 hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap">
              Buscar
            </button>
          </div>
        </div>

        {/* Layout: Filtros à ESQUERDA + Vagas à direita */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Sidebar de Filtros - FIXO à ESQUERDA */}
          <aside className="lg:w-80 flex-shrink-0 order-2 lg:order-1">
            <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="font-black text-gray-900 text-lg sm:text-xl flex items-center gap-2">
                  <Filter className="w-4 sm:w-5 h-4 sm:h-5 text-scalador-orange" /> Filtros
                </h3>
                <button onClick={() => setFiltros({
                busca: "",
                tipo: "todos",
                profissao: "todas",
                bairro: "todos",
                estado: "todos",
                experiencia: "todas",
                distanciaMaxima: "todas"
              })} className="text-xs sm:text-sm font-bold text-scalador-orange hover:text-scalador-orange-dark hover:scale-110 transition-all">
                  Limpar
                </button>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">Tipo de Vaga</label>
                  <select className="w-full p-3 sm:p-4 glass rounded-xl font-medium text-sm sm:text-base focus:ring-4 focus:ring-scalador-orange/30 focus:border-scalador-orange transition-all duration-300" value={filtros.tipo} onChange={e => setFiltros({
                  ...filtros,
                  tipo: e.target.value
                })}>
                    <option value="todos">Todos os tipos</option>
                    <option value="freelance">⚡ Freelance</option>
                    <option value="temporario">📅 Temporário</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">Bairro/Região</label>
                  <select className="w-full p-3 sm:p-4 glass rounded-xl font-medium text-sm sm:text-base focus:ring-4 focus:ring-scalador-orange/30 focus:border-scalador-orange transition-all duration-300" value={filtros.bairro} onChange={e => setFiltros({
                  ...filtros,
                  bairro: e.target.value
                })}>
                    <option value="todos">Todos os bairros</option>
                    <option value="Asa Norte">🏙️ Asa Norte</option>
                    <option value="Asa Sul">🏙️ Asa Sul</option>
                    <option value="Águas Claras">💧 Águas Claras</option>
                    <option value="Taguatinga">🏘️ Taguatinga</option>
                    <option value="Ceilândia">🏘️ Ceilândia</option>
                    <option value="Samambaia">🌿 Samambaia</option>
                    <option value="Gama">🌳 Gama</option>
                    <option value="Planaltina">🌾 Planaltina</option>
                    <option value="Sobradinho">🏞️ Sobradinho</option>
                    <option value="Brazlândia">🌲 Brazlândia</option>
                    <option value="Santa Maria">⛪ Santa Maria</option>
                    <option value="São Sebastião">🏡 São Sebastião</option>
                    <option value="Recanto das Emas">🦜 Recanto das Emas</option>
                    <option value="Lago Sul">🌊 Lago Sul</option>
                    <option value="Lago Norte">🌊 Lago Norte</option>
                    <option value="Riacho Fundo">🏞️ Riacho Fundo</option>
                    <option value="Guará">🏘️ Guará</option>
                    <option value="Cruzeiro">✝️ Cruzeiro</option>
                    <option value="Sudoeste">🏙️ Sudoeste/Octogonal</option>
                    <option value="Vicente Pires">🏡 Vicente Pires</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">Profissão</label>
                  <select className="w-full p-3 sm:p-4 glass rounded-xl font-medium text-sm sm:text-base focus:ring-4 focus:ring-scalador-orange/30 focus:border-scalador-orange transition-all duration-300">
                    <option>Todas as profissões</option>
                    <option>🧹 Auxiliar de serviços gerais</option>
                    <option>🍽️ Garçom</option>
                    <option>📋 Recepcionista</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">Experiência</label>
                  <select className="w-full p-3 sm:p-4 glass rounded-xl font-medium text-sm sm:text-base focus:ring-4 focus:ring-scalador-orange/30 focus:border-scalador-orange transition-all duration-300">
                    <option>Todas</option>
                    <option>⭐ Com experiência</option>
                    <option>🌟 Sem experiência</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">Distância Máxima</label>
                  <select className="w-full p-3 sm:p-4 glass rounded-xl font-medium text-sm sm:text-base focus:ring-4 focus:ring-scalador-orange/30 focus:border-scalador-orange transition-all duration-300" value={filtros.distanciaMaxima} onChange={e => setFiltros({
                  ...filtros,
                  distanciaMaxima: e.target.value
                })}>
                    <option value="todas">Todas as distâncias</option>
                    <option value="5">📍 Até 5km</option>
                    <option value="10">📍 Até 10km</option>
                    <option value="20">📍 Até 20km</option>
                    <option value="30">📍 Até 30km</option>
                  </select>
                </div>

                {/* Botão Aplicar para mobile */}
                <button className="w-full lg:hidden px-6 py-3 bg-gradient-to-r from-scalador-orange to-scalador-orange-light text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </aside>

          {/* Lista de Vagas - Ocupa o espaço restante */}
          <div className="flex-1 min-w-0 order-1 lg:order-2">
            {jobsFiltrados.length === 0 ? <div className="text-center py-12 sm:py-20 glass rounded-2xl sm:rounded-3xl">
                <div className="text-4xl sm:text-6xl mb-4 animate-float">🔍</div>
                <p className="text-gray-600 text-lg sm:text-xl font-semibold mb-2">Nenhuma vaga encontrada</p>
                <p className="text-gray-500 text-sm sm:text-base">Tente ajustar os filtros selecionados</p>
              </div> : <div className="space-y-3 sm:space-y-6">
                {jobsFiltrados.map((job, idx) => <div key={job.id} className="animate-slide-up" style={{
              animationDelay: `${idx * 0.1}s`
            }}>
                    <JobCard job={job} />
                  </div>)}
              </div>}
          </div>
        </div>
      </div>;
  };
  const PaginaPublicarVaga = () => {
    const [step, setStep] = useState(1);
    const [tipoVaga, setTipoVaga] = useState<JobType | null>(null);
    const [formData, setFormData] = useState({
      titulo: "",
      profissao: "",
      descricao: "",
      valorDiaria: 0,
      quantidadeFreelancers: 1,
      data: "",
      horarioEntrada: "",
      horarioSaida: "",
      endereco: "",
      bairro: "",
      cidade: "Brasília",
      estado: "DF",
      cep: "",
      vestimenta: "",
      experienciaNecessaria: false,
      beneficios: [] as string[]
    });
    const valorTotal = formData.valorDiaria * formData.quantidadeFreelancers;
    const taxaScalador = valorTotal * 0.1;
    const valorComTaxa = valorTotal + taxaScalador;
    const handlePublicar = () => {
      if (!tipoVaga) return;
      const novaVaga = {
        titulo: formData.titulo || "Nova Vaga",
        empresa: "Scalador",
        logoEmpresa: "🏢",
        tipo: tipoVaga,
        profissao: formData.profissao || "Não especificado",
        descricao: formData.descricao || "Descrição não fornecida",
        atividades: [],
        valorDiaria: formData.valorDiaria,
        valorTotal: valorTotal,
        quantidadeFreelancers: formData.quantidadeFreelancers,
        localizacao: {
          endereco: formData.endereco,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado,
          cep: formData.cep
        },
        data: formData.data,
        horarioEntrada: formData.horarioEntrada,
        horarioSaida: formData.horarioSaida,
        vestimenta: formData.vestimenta,
        experienciaNecessaria: formData.experienciaNecessaria,
        beneficios: formData.beneficios
      };
      publicarVaga(novaVaga);
    };
    if (step === 1) {
      return <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Abra portas para <span className="gradient-text">talentos excepcionais</span> ✨
            </h2>
            <p className="text-gray-600 text-2xl font-medium">
              Publique sua vaga e assista aos talentos se destacarem...
            </p>
          </div>

          <div className="text-center mb-10">
            <p className="text-gray-700 font-bold text-xl mb-8">Escolha o tipo de vaga</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <button onClick={() => {
            setTipoVaga("freelance");
            setStep(2);
          }} className="glass rounded-3xl p-10 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 text-left group relative overflow-hidden hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">⚡ Freelance</h3>
                <p className="text-gray-600 leading-relaxed font-medium mb-6">
                  Freelancers são profissionais temporários que oferecem à empresas a flexibilidade de contratar
                  talentos sem necessidade de vínculo trabalhista.
                </p>
                <div className="flex items-center text-blue-600 font-bold group-hover:gap-3 gap-2 transition-all">
                  Selecionar <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            <button onClick={() => {
            setTipoVaga("temporario");
            setStep(2);
          }} className="glass rounded-3xl p-10 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 text-left group relative overflow-hidden hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">📅 Vaga temporária</h3>
                <p className="text-gray-600 leading-relaxed font-medium mb-6">
                  Vagas temporárias são posições de curto prazo que envolve a contratação de um funcionário por um
                  período definido de tempo.
                </p>
                <div className="flex items-center text-blue-600 font-bold group-hover:gap-3 gap-2 transition-all">
                  Selecionar <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>
        </div>;
    }
    return <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => setStep(1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          ← Voltar
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">Calcule seu orçamento</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título da vaga *</label>
              <input type="text" placeholder="Ex: Auxiliar de Serviços Gerais" className="w-full p-3 border border-gray-300 rounded-lg" value={formData.titulo} onChange={e => setFormData({
              ...formData,
              titulo: e.target.value
            })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profissão *</label>
              <input type="text" placeholder="Ex: Auxiliar de serviços gerais" className="w-full p-3 border border-gray-300 rounded-lg" value={formData.profissao} onChange={e => setFormData({
              ...formData,
              profissao: e.target.value
            })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição da vaga</label>
              <textarea rows={4} placeholder="Descreva as atividades e requisitos..." className="w-full p-3 border border-gray-300 rounded-lg" value={formData.descricao} onChange={e => setFormData({
              ...formData,
              descricao: e.target.value
            })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor da diária (R$) *</label>
                <input type="number" step="0.01" placeholder="0.00" className="w-full p-3 border border-gray-300 rounded-lg" value={formData.valorDiaria || ""} onChange={e => setFormData({
                ...formData,
                valorDiaria: parseFloat(e.target.value) || 0
              })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade de freelancers *</label>
                <input type="number" min="1" placeholder="1" className="w-full p-3 border border-gray-300 rounded-lg" value={formData.quantidadeFreelancers} onChange={e => setFormData({
                ...formData,
                quantidadeFreelancers: parseInt(e.target.value) || 1
              })} />
              </div>
            </div>

            {/* Preview de valores - FASE 4 */}
            {formData.valorDiaria > 0 && <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl p-6 border border-orange-200/50">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-scalador-orange" /> Preview dos valores
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-4 border border-orange-200/50">
                    <p className="text-sm text-gray-500 mb-1">Você pagará</p>
                    <p className="text-2xl font-black text-scalador-orange">
                      R$ {calcularValores(formData.valorDiaria).valorParaEmpresa.toFixed(2)}
                    </p>
                    <p className="text-xs text-scalador-orange/80 mt-1">
                      (inclui taxa de {calcularValores(formData.valorDiaria).taxaServico}%)
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-green-200/50">
                    <p className="text-sm text-gray-500 mb-1">Freelancer receberá</p>
                    <p className="text-2xl font-black text-scalador-green">
                      R$ {calcularValores(formData.valorDiaria).valorParaFreelancer.toFixed(2)}
                    </p>
                    <p className="text-xs text-scalador-green/80 mt-1">
                      (valor líquido)
                    </p>
                  </div>
                </div>
                {formData.quantidadeFreelancers > 1 && <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>Total para {formData.quantidadeFreelancers} freelancers:</strong>{" "}
                      <span className="text-scalador-orange font-black">
                        R$ {(calcularValores(formData.valorDiaria).valorParaEmpresa * formData.quantidadeFreelancers).toFixed(2)}
                      </span>
                    </p>
                  </div>}
              </div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data do trabalho *</label>
              <input type="date" className="w-full p-3 border border-gray-300 rounded-lg" value={formData.data} onChange={e => setFormData({
              ...formData,
              data: e.target.value
            })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário de entrada *</label>
                <input type="time" className="w-full p-3 border border-gray-300 rounded-lg" value={formData.horarioEntrada} onChange={e => setFormData({
                ...formData,
                horarioEntrada: e.target.value
              })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário de saída *</label>
                <input type="time" className="w-full p-3 border border-gray-300 rounded-lg" value={formData.horarioSaida} onChange={e => setFormData({
                ...formData,
                horarioSaida: e.target.value
              })} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Endereço completo *</label>
              <input type="text" placeholder="Rua, número, complemento" className="w-full p-3 border border-gray-300 rounded-lg" value={formData.endereco} onChange={e => setFormData({
              ...formData,
              endereco: e.target.value
            })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bairro/Região *</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg font-medium" value={formData.bairro} onChange={e => setFormData({
                ...formData,
                bairro: e.target.value
              })}>
                  <option value="">Selecione o bairro</option>
                  <option value="Asa Norte">🏙️ Asa Norte</option>
                  <option value="Asa Sul">🏙️ Asa Sul</option>
                  <option value="Águas Claras">💧 Águas Claras</option>
                  <option value="Taguatinga">🏘️ Taguatinga</option>
                  <option value="Ceilândia">🏘️ Ceilândia</option>
                  <option value="Samambaia">🌿 Samambaia</option>
                  <option value="Gama">🌳 Gama</option>
                  <option value="Planaltina">🌾 Planaltina</option>
                  <option value="Sobradinho">🏞️ Sobradinho</option>
                  <option value="Brazlândia">🌲 Brazlândia</option>
                  <option value="Santa Maria">⛪ Santa Maria</option>
                  <option value="São Sebastião">🏡 São Sebastião</option>
                  <option value="Recanto das Emas">🦜 Recanto das Emas</option>
                  <option value="Lago Sul">🌊 Lago Sul</option>
                  <option value="Lago Norte">🌊 Lago Norte</option>
                  <option value="Riacho Fundo">🏞️ Riacho Fundo</option>
                  <option value="Guará">🏘️ Guará</option>
                  <option value="Cruzeiro">✝️ Cruzeiro</option>
                  <option value="Sudoeste">🏙️ Sudoeste/Octogonal</option>
                  <option value="Vicente Pires">🏡 Vicente Pires</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                <input type="text" placeholder="00000-000" className="w-full p-3 border border-gray-300 rounded-lg" value={formData.cep} onChange={e => setFormData({
                ...formData,
                cep: e.target.value
              })} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vestimenta necessária</label>
              <input type="text" placeholder="Ex: Calça preta, camisa branca, sapato fechado" className="w-full p-3 border border-gray-300 rounded-lg" value={formData.vestimenta} onChange={e => setFormData({
              ...formData,
              vestimenta: e.target.value
            })} />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="experiencia" checked={formData.experienciaNecessaria} onChange={e => setFormData({
              ...formData,
              experienciaNecessaria: e.target.checked
            })} className="w-4 h-4 text-scalador-orange rounded" />
              <label htmlFor="experiencia" className="text-sm text-gray-700">
                Experiência necessária
              </label>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass rounded-3xl p-8 sticky top-24 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
              <h3 className="font-black text-gray-900 text-xl mb-6 flex items-center gap-2">
                <Wallet className="w-6 h-6 text-green-600" /> Resumo do Investimento
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <span className="text-sm font-bold text-gray-600">Saldo atual:</span>
                  <span className="font-black text-gray-900 text-lg">R$ {saldoAtual.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                  <span className="text-sm font-bold text-gray-600">Valor total:</span>
                  <span className="font-black text-gray-900 text-lg">R$ {valorTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                  <span className="text-sm font-bold text-gray-600">Taxa Scalador (10%):</span>
                  <span className="font-black text-red-600 text-lg">+ R$ {taxaScalador.toFixed(2)}</span>
                </div>

                <div className="pt-4 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl">
                    <span className="font-black text-gray-900">Seu investimento:</span>
                    <span className="font-black text-red-600 text-2xl">- R$ {valorComTaxa.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Saldo final:</span>
                    <span className="font-bold text-green-600">R$ {(saldoAtual - valorComTaxa).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-xs text-blue-800">
                  ⏱️ <strong>Tempo médio de chegada em Brasília:</strong> 2:30h - 3:00h
                </p>
              </div>

              <button onClick={handlePublicar} disabled={!formData.titulo || !formData.valorDiaria || !formData.data} className="w-full bg-gradient-to-r from-scalador-orange to-scalador-orange-light text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/40 hover:scale-[1.02] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed">
                Publicar Vaga
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Ao publicar, você concorda com nossos termos de serviço
              </p>
            </div>
          </div>
        </div>
      </div>;
  };
  const PaginaMinhasVagas = () => {
    const [periodoFiltro, setPeriodoFiltro] = useState<"7dias" | "30dias" | "90dias" | "ano">("30dias");
    const [visualizacao, setVisualizacao] = useState<"visao-geral" | "financeiro" | "freelancers" | "vagas" | "relatorios">("visao-geral");

    // ===== CÁLCULOS DE MÉTRICAS =====
    const hoje = new Date();
    const diasFiltro = periodoFiltro === "7dias" ? 7 : periodoFiltro === "30dias" ? 30 : periodoFiltro === "90dias" ? 90 : 365;
    const dataInicio = new Date(hoje.getTime() - diasFiltro * 24 * 60 * 60 * 1000);
    const vagasFiltradas = jobs.filter(j => j.publicadoEm >= dataInicio);
    const gastoTotal = vagasFiltradas.reduce((acc, j) => acc + j.valorComTaxa, 0);
    const gastoMedio = vagasFiltradas.length > 0 ? gastoTotal / vagasFiltradas.length : 0;
    const vagasPreenchidas = vagasFiltradas.filter(j => j.status === "concluida" || j.status === "em_andamento").length;
    const vagasAbertas = vagasFiltradas.filter(j => j.status === "aberta" || j.status === "aguardando_freelancer").length;
    const vagasCanceladas = vagasFiltradas.filter(j => j.status === "cancelada").length;
    const taxaPreenchimento = vagasFiltradas.length > 0 ? vagasPreenchidas / vagasFiltradas.length * 100 : 0;
    const freelancersAceitos = historicoFreelancers.filter(f => f.status === "aceito" || f.status === "concluido").length;
    const freelancersRecusados = historicoFreelancers.filter(f => f.status === "recusado").length;
    const freelancersCancelados = historicoFreelancers.filter(f => f.status === "cancelado_empresa").length;
    const taxaAceitacao = freelancersAceitos + freelancersRecusados > 0 ? freelancersAceitos / (freelancersAceitos + freelancersRecusados) * 100 : 0;

    // Dados para gráficos
    const gastosPorMes = [{
      mes: "Jul",
      valor: 320,
      vagas: 2
    }, {
      mes: "Ago",
      valor: 450,
      vagas: 3
    }, {
      mes: "Set",
      valor: 380,
      vagas: 2
    }, {
      mes: "Out",
      valor: 520,
      vagas: 4
    }, {
      mes: "Nov",
      valor: gastoTotal,
      vagas: vagasFiltradas.length
    }];
    const vagasPorStatus = [{
      status: "Concluídas",
      quantidade: vagasPreenchidas,
      cor: "bg-green-500"
    }, {
      status: "Em Aberto",
      quantidade: vagasAbertas,
      cor: "bg-blue-500"
    }, {
      status: "Em Andamento",
      quantidade: jobs.filter(j => j.status === "em_andamento" || j.status === "em_deslocamento").length,
      cor: "bg-purple-500"
    }, {
      status: "Canceladas",
      quantidade: vagasCanceladas,
      cor: "bg-red-500"
    }];
    const topProfissoes = [{
      profissao: "Garçom",
      vagas: 5,
      gasto: 1000,
      mediaAvaliacao: 4.8
    }, {
      profissao: "Auxiliar de Serviços",
      vagas: 3,
      gasto: 480,
      mediaAvaliacao: 4.5
    }, {
      profissao: "Recepcionista",
      vagas: 2,
      gasto: 300,
      mediaAvaliacao: 4.9
    }];
    const freelancersRanking = [{
      id: "f1",
      nome: "João Silva",
      foto: "👨",
      vagas: 8,
      rating: 4.8,
      valorTotal: 1600,
      pontualidade: 95
    }, {
      id: "f3",
      nome: "Carlos Lima",
      foto: "👨‍💼",
      vagas: 5,
      rating: 5.0,
      valorTotal: 750,
      pontualidade: 100
    }, {
      id: "f2",
      nome: "Maria Santos",
      foto: "👩",
      vagas: 3,
      rating: 4.5,
      valorTotal: 450,
      pontualidade: 90
    }];
    const alertasUrgentes = [{
      id: "a1",
      tipo: "pagamento",
      mensagem: "Pagamento pendente: R$ 200,00",
      urgencia: "alta"
    }, {
      id: "a2",
      tipo: "vaga",
      mensagem: "2 vagas sem candidatos há 24h",
      urgencia: "media"
    }, {
      id: "a3",
      tipo: "checkin",
      mensagem: "Freelancer aguardando confirmação",
      urgencia: "alta"
    }];

    // ===== COMPONENTE: CARD DE MÉTRICA =====
    const MetricCard = ({
      titulo,
      valor,
      subtitulo,
      icone,
      cor,
      tendencia
    }: any) => <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600 text-sm font-medium">{titulo}</span>
          <div className={`w-10 h-10 rounded-lg ${cor} bg-opacity-10 flex items-center justify-center`}>{icone}</div>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{valor}</p>
        {subtitulo && <p className="text-sm text-gray-500">{subtitulo}</p>}
        {tendencia && <div className={`mt-2 text-xs font-medium ${tendencia > 0 ? "text-green-600" : "text-red-600"}`}>
            {tendencia > 0 ? "↗" : "↘"} {Math.abs(tendencia).toFixed(1)}% vs período anterior
          </div>}
      </div>;

    // ===== COMPONENTE: GRÁFICO DE BARRAS SIMPLES =====
    const BarChart = ({
      data,
      label
    }: {
      data: any[];
      label: string;
    }) => {
      const maxValor = Math.max(...data.map(d => d.valor));
      return <div className="space-y-3">
          {data.map((item, idx) => <div key={idx}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-700 font-medium">{item.mes}</span>
                <span className="text-gray-900 font-bold">R$ {item.valor.toFixed(0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 h-3 rounded-full transition-all duration-500" style={{
              width: `${item.valor / maxValor * 100}%`
            }}></div>
              </div>
            </div>)}
        </div>;
    };

    // ===== COMPONENTE: GRÁFICO DE PIZZA (simulado com barras) =====
    const PieChart = ({
      data
    }: {
      data: any[];
    }) => {
      const total = data.reduce((acc, d) => acc + d.quantidade, 0);
      return <div className="space-y-3">
          {data.map((item, idx) => {
          const porcentagem = total > 0 ? item.quantidade / total * 100 : 0;
          return <div key={idx}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.cor}`}></div>
                    <span className="text-gray-700 font-medium">{item.status}</span>
                  </div>
                  <span className="text-gray-900 font-bold">
                    {item.quantidade} ({porcentagem.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${item.cor} h-2 rounded-full transition-all duration-500`} style={{
                width: `${porcentagem}%`
              }}></div>
                </div>
              </div>;
        })}
        </div>;
    };

    // ===== VISÃO GERAL =====
    const VisaoGeral = () => <div className="space-y-6">
        {/* Alertas Urgentes */}
        {alertasUrgentes.length > 0 && <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-4">
            <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Alertas Urgentes
            </h3>
            <div className="space-y-2">
              {alertasUrgentes.map(alerta => <div key={alerta.id} className={`flex items-center justify-between p-2 rounded ${alerta.urgencia === "alta" ? "bg-red-100" : "bg-yellow-100"}`}>
                  <span className="text-sm font-medium text-gray-800">{alerta.mensagem}</span>
                  <button className="px-3 py-1 bg-white rounded text-xs font-medium hover:bg-gray-50">Resolver</button>
                </div>)}
            </div>
          </div>}

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard titulo="Gastos no Período" valor={`R$ ${gastoTotal.toFixed(2)}`} subtitulo={`${vagasFiltradas.length} vagas`} icone={<DollarSign className="w-5 h-5 text-green-600" />} cor="bg-green-500" tendencia={15.5} />
          <MetricCard titulo="Taxa de Preenchimento" valor={`${taxaPreenchimento.toFixed(0)}%`} subtitulo={`${vagasPreenchidas} de ${vagasFiltradas.length} vagas`} icone={<TrendingUp className="w-5 h-5 text-indigo-600" />} cor="bg-indigo-500" tendencia={8.2} />
          <MetricCard titulo="Taxa de Aceitação" valor={`${taxaAceitacao.toFixed(0)}%`} subtitulo={`${freelancersAceitos} aceitos`} icone={<CheckCircle className="w-5 h-5 text-blue-600" />} cor="bg-blue-500" tendencia={-3.1} />
          <MetricCard titulo="Custo Médio/Vaga" valor={`R$ ${gastoMedio.toFixed(2)}`} subtitulo="Últimas vagas" icone={<Activity className="w-5 h-5 text-orange-600" />} cor="bg-orange-500" />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-600" /> Gastos por Mês
            </h3>
            <BarChart data={gastosPorMes} label="Gastos" />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" /> Vagas por Status
            </h3>
            <PieChart data={vagasPorStatus} />
          </div>
        </div>

        {/* Top Profissões */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" /> Top Profissões Contratadas
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profissão</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vagas</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gasto Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avaliação Média</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topProfissoes.map((prof, idx) => <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{prof.profissao}</td>
                    <td className="px-4 py-3 text-gray-600">{prof.vagas}</td>
                    <td className="px-4 py-3 text-green-600 font-semibold">R$ {prof.gasto.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{prof.mediaAvaliacao}</span>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>;

    // ===== ANÁLISE FINANCEIRA =====
    const AnaliseFinanceira = () => {
      const taxaScaladorTotal = vagasFiltradas.reduce((acc, j) => acc + j.taxaScalador, 0);
      const valorLiquidoFreelancers = vagasFiltradas.reduce((acc, j) => acc + j.valorTotal, 0);
      return <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-green-100 text-sm">Investimento Total</p>
                  <p className="text-3xl font-bold">R$ {gastoTotal.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-green-100 text-xs">Valor pago (incluindo taxa 10%)</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Valor Freelancers</p>
                  <p className="text-3xl font-bold">R$ {valorLiquidoFreelancers.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-blue-100 text-xs">Valor líquido recebido pelos freelancers</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-cyan-100 text-sm">Taxa Scalador</p>
                  <p className="text-3xl font-bold">R$ {taxaScaladorTotal.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-cyan-100 text-xs">10% sobre o valor total</p>
            </div>
          </div>

          {/* Detalhamento por Vaga */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">💰 Detalhamento Financeiro por Vaga</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vaga</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Freelancers</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Base</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taxa 10%</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Pago</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vagasFiltradas.map(vaga => <tr key={vaga.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{vaga.titulo}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {new Date(vaga.data).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{vaga.quantidadeFreelancers}x</td>
                      <td className="px-4 py-3 text-gray-900">R$ {vaga.valorTotal.toFixed(2)}</td>
                      <td className="px-4 py-3 text-orange-600">R$ {vaga.taxaScalador.toFixed(2)}</td>
                      <td className="px-4 py-3 font-bold text-green-600">R$ {vaga.valorComTaxa.toFixed(2)}</td>
                    </tr>)}
                </tbody>
                <tfoot className="bg-gray-50 font-bold">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-gray-900">
                      TOTAL
                    </td>
                    <td className="px-4 py-3 text-gray-900">R$ {valorLiquidoFreelancers.toFixed(2)}</td>
                    <td className="px-4 py-3 text-orange-600">R$ {taxaScaladorTotal.toFixed(2)}</td>
                    <td className="px-4 py-3 text-green-600">R$ {gastoTotal.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Gráfico de Pizza - Distribuição de Gastos */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">📊 Distribuição de Gastos por Profissão</h3>
            <div className="space-y-3">
              {topProfissoes.map((prof, idx) => {
              const porcentagem = gastoTotal > 0 ? prof.gasto / gastoTotal * 100 : 0;
              return <div key={idx}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">{prof.profissao}</span>
                      <span className="text-gray-900 font-bold">
                        R$ {prof.gasto} ({porcentagem.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{
                    width: `${porcentagem}%`
                  }}></div>
                    </div>
                  </div>;
            })}
            </div>
          </div>
        </div>;
    };

    // ===== RANKING DE FREELANCERS =====
    const RankingFreelancers = () => <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">🏆 Ranking de Freelancers</h2>
          <p className="text-purple-100">Os melhores profissionais que trabalharam com você</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {freelancersRanking.slice(0, 3).map((freelancer, idx) => <div key={freelancer.id} className={`bg-white rounded-lg border-2 p-6 ${idx === 0 ? "border-yellow-400 shadow-lg" : "border-gray-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl">{freelancer.foto}</div>
                {idx === 0 && <div className="text-4xl">👑</div>}
                {idx === 1 && <div className="text-3xl">🥈</div>}
                {idx === 2 && <div className="text-3xl">🥉</div>}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{freelancer.nome}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Vagas</span>
                  <span className="font-bold text-gray-900">{freelancer.vagas}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avaliação</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">{freelancer.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Pago</span>
                  <span className="font-bold text-green-600">R$ {freelancer.valorTotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pontualidade</span>
                  <span className="font-bold text-indigo-600">{freelancer.pontualidade}%</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                Ver Perfil
              </button>
            </div>)}
        </div>

        {/* Tabela Completa */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">📋 Histórico Completo de Freelancers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posição</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Freelancer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vagas</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avaliação</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pontualidade</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Pago</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {freelancersRanking.map((freelancer, idx) => <tr key={freelancer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{freelancer.foto}</div>
                        <div>
                          <p className="font-medium text-gray-900">{freelancer.nome}</p>
                          <p className="text-xs text-gray-500">ID: {freelancer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{freelancer.vagas}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{freelancer.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px]">
                          <div className="bg-green-500 h-2 rounded-full" style={{
                        width: `${freelancer.pontualidade}%`
                      }}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{freelancer.pontualidade}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-green-600">R$ {freelancer.valorTotal}</td>
                    <td className="px-4 py-3">
                      <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm font-medium">
                        Contratar Novamente
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>;

    // ===== ANÁLISE DE VAGAS =====
    const AnaliseVagas = () => {
      const vagasPorDia = [{
        dia: "Seg",
        quantidade: 2
      }, {
        dia: "Ter",
        quantidade: 1
      }, {
        dia: "Qua",
        quantidade: 3
      }, {
        dia: "Qui",
        quantidade: 2
      }, {
        dia: "Sex",
        quantidade: 4
      }, {
        dia: "Sáb",
        quantidade: 1
      }, {
        dia: "Dom",
        quantidade: 0
      }];
      const maxVagas = Math.max(...vagasPorDia.map(d => d.quantidade));
      return <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Tempo Médio de Preenchimento</p>
                <p className="text-4xl font-bold text-indigo-600">2.5h</p>
                <p className="text-xs text-gray-500 mt-1">Desde publicação até aceite</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Candidaturas por Vaga</p>
                <p className="text-4xl font-bold text-purple-600">3.2</p>
                <p className="text-xs text-gray-500 mt-1">Média de candidatos</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Taxa de Cancelamento</p>
                <p className="text-4xl font-bold text-red-600">5%</p>
                <p className="text-xs text-gray-500 mt-1">Vagas canceladas</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Satisfação Média</p>
                <p className="text-4xl font-bold text-yellow-600">4.7</p>
                <p className="text-xs text-gray-500 mt-1">Avaliação das empresas</p>
              </div>
            </div>
          </div>

          {/* Distribuição por Dia da Semana */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">📅 Vagas por Dia da Semana</h3>
            <div className="grid grid-cols-7 gap-2">
              {vagasPorDia.map((dia, idx) => <div key={idx} className="text-center">
                  <div className="mb-2">
                    <div className="mx-auto bg-indigo-500 rounded-t" style={{
                  height: `${dia.quantidade / maxVagas * 120}px`,
                  width: "40px",
                  minHeight: dia.quantidade > 0 ? "20px" : "0"
                }}></div>
                  </div>
                  <p className="text-xs font-medium text-gray-600">{dia.dia}</p>
                  <p className="text-sm font-bold text-gray-900">{dia.quantidade}</p>
                </div>)}
            </div>
          </div>

          {/* Calendário de Próximas Vagas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">🗓️ Calendário de Vagas</h3>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(30)].map((_, idx) => {
              const temVaga = idx === 5 || idx === 12 || idx === 20;
              return <div key={idx} className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium ${temVaga ? "bg-indigo-100 border-indigo-500 text-indigo-700" : "border-gray-200 text-gray-600"}`}>
                    {idx + 1}
                  </div>;
            })}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-100 border-2 border-indigo-500 rounded"></div>
                <span className="text-gray-600">Dia com vaga agendada</span>
              </div>
            </div>
          </div>
        </div>;
    };

    // ===== RELATÓRIOS =====
    const Relatorios = () => <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">📄 Gerar Relatórios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 text-left transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Relatório Financeiro</p>
                  <p className="text-xs text-gray-500">Gastos, taxas e ROI</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Excel • PDF</p>
            </button>

            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 text-left transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Relatório de Freelancers</p>
                  <p className="text-xs text-gray-500">Performance e histórico</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Excel • PDF</p>
            </button>

            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 text-left transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Relatório de Vagas</p>
                  <p className="text-xs text-gray-500">Status e métricas</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Excel • PDF</p>
            </button>

            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 text-left transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Relatório Completo</p>
                  <p className="text-xs text-gray-500">Todas as métricas</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Excel • PDF</p>
            </button>
          </div>
        </div>

        {/* Preview de Relatório */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">📊 Preview - Resumo Executivo</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Período analisado:</span>
              <span className="font-medium">Últimos 30 dias</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Total de vagas publicadas:</span>
              <span className="font-medium">{vagasFiltradas.length}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Vagas preenchidas:</span>
              <span className="font-medium text-green-600">
                {vagasPreenchidas} ({taxaPreenchimento.toFixed(0)}%)
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Investimento total:</span>
              <span className="font-medium text-gray-900">R$ {gastoTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Freelancers contratados:</span>
              <span className="font-medium">{freelancersAceitos}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Taxa de aceitação:</span>
              <span className="font-medium text-indigo-600">{taxaAceitacao.toFixed(0)}%</span>
            </div>
          </div>
          <button className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            Baixar Relatório Completo (PDF)
          </button>
        </div>
      </div>;

    // ===== RENDER PRINCIPAL =====
    return <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Análise completa do seu negócio na Scalador</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Período:</span>
            <div className="flex gap-2">
              {["7dias", "30dias", "90dias", "ano"].map(periodo => <button key={periodo} onClick={() => setPeriodoFiltro(periodo as any)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${periodoFiltro === periodo ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {periodo === "7dias" ? "7 dias" : periodo === "30dias" ? "30 dias" : periodo === "90dias" ? "90 dias" : "Ano"}
                </button>)}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium">
              Exportar Dados
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
              Atualizar
            </button>
          </div>
        </div>

        {/* Tabs de Visualização */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[{
            id: "visao-geral",
            label: "Visão Geral",
            icon: <Activity className="w-4 h-4" />
          }, {
            id: "financeiro",
            label: "Financeiro",
            icon: <DollarSign className="w-4 h-4" />
          }, {
            id: "freelancers",
            label: "Freelancers",
            icon: <Users className="w-4 h-4" />
          }, {
            id: "vagas",
            label: "Vagas",
            icon: <Briefcase className="w-4 h-4" />
          }, {
            id: "relatorios",
            label: "Relatórios",
            icon: <FileText className="w-4 h-4" />
          }].map(tab => <button key={tab.id} onClick={() => setVisualizacao(tab.id as any)} className={`flex-1 min-w-[120px] py-4 px-6 font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${visualizacao === tab.id ? "border-indigo-600 text-indigo-600 bg-indigo-50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                {tab.icon}
                {tab.label}
              </button>)}
          </div>
        </div>

        {/* Conteúdo */}
        {visualizacao === "visao-geral" && <VisaoGeral />}
        {visualizacao === "financeiro" && <AnaliseFinanceira />}
        {visualizacao === "freelancers" && <RankingFreelancers />}
        {visualizacao === "vagas" && <AnaliseVagas />}
        {visualizacao === "relatorios" && <Relatorios />}
      </div>;
  };
  const PaginaVagaDetalhes = () => {
    if (!selectedJob) return null;
    const job = jobs.find(j => j.id === selectedJob.id) || selectedJob;
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const candidatarVaga = (vagaId: string) => {
      toast({
        title: "Candidatura enviada!",
        description: "Sua candidatura foi registrada. Aguarde o retorno da empresa."
      });
      simularEnvioWhatsApp("candidatura", job.empresa, {
        freelancer: "Você",
        vaga: job.titulo,
        mensagem: "Nova candidatura recebida!"
      });
    };
    return <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header com botão voltar */}
        <button onClick={() => navegarPara("vagas")} className="flex items-center gap-2 text-gray-600 hover:text-scalador-orange mb-6 font-medium transition-colors">
          <ArrowRight className="w-4 h-4 rotate-180" /> Voltar para vagas
        </button>

        <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 shadow-xl">
          {/* Cabeçalho da vaga */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-lg">
              {job.logoEmpresa}
            </div>
            <div className="flex-1">
              <p className="text-scalador-orange font-bold mb-1">{job.empresa}</p>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">{job.titulo}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Clock className="w-4 h-4 text-scalador-orange" />
                Publicado {getTempoPublicacao(job.publicadoEm)}
              </p>
            </div>
          </div>

          {/* Seção freelancer em deslocamento */}
          {job.status === "em_deslocamento" && job.freelancerSelecionado && <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="animate-bounce">🚶</span> Freelancer a caminho
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{job.freelancerSelecionado.foto}</div>
                    <div>
                      <p className="font-bold text-gray-900">{job.freelancerSelecionado.nome}</p>
                      <p className="text-sm text-gray-600">{job.freelancerSelecionado.telefone}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-3 h-3 ${i <= job.freelancerSelecionado!.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)}
                        <span className="text-xs text-gray-600 ml-1">{job.freelancerSelecionado.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-blue-700 mt-3 font-medium">
                    ⏱️ Tempo estimado de chegada: <strong>{job.freelancerSelecionado.tempoEstimadoChegada}</strong>
                  </p>
                </div>
                {job.tempoLimiteEmpresaCancelar && new Date() < job.tempoLimiteEmpresaCancelar && <button onClick={() => cancelarFreelancer(job.id)} className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 font-bold text-sm transition-colors">
                    Solicitar outro
                  </button>}
              </div>

              {job.tempoLimiteEmpresaCancelar && new Date() < job.tempoLimiteEmpresaCancelar && <div className="mb-4">
                  <CountdownTimer endTime={job.tempoLimiteEmpresaCancelar} label="⏰ Tempo para cancelar freelancer" color="orange" />
                </div>}

              <div className="flex gap-3">
                <button onClick={() => simularEnvioWhatsApp("mensagem_empresa", job.freelancerSelecionado!.nome, {
              texto: "Olá! Estamos aguardando você.",
              jobId: job.id
            })} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold transition-colors">
                  <Phone className="w-4 h-4" /> Enviar WhatsApp
                </button>
                <button onClick={() => confirmarChegada(job.id, "empresa")} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-scalador-blue text-white rounded-xl hover:bg-scalador-blue/90 font-bold transition-colors">
                  <CheckCircle className="w-4 h-4" /> Confirmar Chegada
                </button>
              </div>
            </div>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Coluna principal */}
            <div className="md:col-span-2 space-y-6">
              {/* Sobre a Vaga */}
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-scalador-orange" /> SOBRE A VAGA
                </h2>
                <p className="text-gray-700 leading-relaxed">{job.descricao}</p>
              </div>

              {/* Atividades */}
              {job.atividades.length > 0 && <div>
                  <h3 className="font-bold text-gray-900 mb-3">Atividades:</h3>
                  <ul className="space-y-2">
                    {job.atividades.map((atividade, idx) => <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <Check className="w-5 h-5 text-scalador-green flex-shrink-0 mt-0.5" />
                        {atividade}
                      </li>)}
                  </ul>
                </div>}

              {/* Localização com Bairro Destacado */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200/50">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-scalador-orange" /> Localização
                </h3>
                <div className="space-y-2">
                  <p className="text-2xl font-black text-scalador-orange">{job.localizacao.bairro}</p>
                  <p className="text-gray-700">{job.localizacao.endereco}</p>
                  <p className="text-gray-600">{job.localizacao.cidade} - {job.localizacao.estado}</p>
                  <p className="text-sm text-gray-500">CEP: {job.localizacao.cep}</p>
                </div>
                {job.localizacao.coordenadas && <button onClick={() => window.open(`https://www.google.com/maps?q=${job.localizacao.coordenadas!.lat},${job.localizacao.coordenadas!.lng}`, "_blank")} className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-scalador-orange text-white rounded-xl hover:bg-scalador-orange/90 font-bold transition-colors w-full">
                    <Navigation className="w-4 h-4" /> Ver no Google Maps
                  </button>}
              </div>

              {/* Perguntas Frequentes */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-scalador-blue" /> PERGUNTAS FREQUENTES
                </h3>
                <div className="space-y-3">
                  {job.perguntasFrequentes && job.perguntasFrequentes.length > 0 ? job.perguntasFrequentes.map((faq, idx) => <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300">
                        <button onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                          <span className="font-bold text-gray-900">{faq.pergunta}</span>
                          <ChevronDown className={`w-5 h-5 text-scalador-orange transition-transform duration-300 ${expandedFaq === idx ? "rotate-180" : ""}`} />
                        </button>
                        {expandedFaq === idx && <div className="px-4 pb-4 text-gray-600 animate-fade-in">
                            {faq.resposta}
                          </div>}
                      </div>) : <>
                      <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <p className="font-bold text-gray-900 mb-1">É necessário ter experiência?</p>
                        <p className="text-gray-600">{job.experienciaNecessaria ? "Sim" : "Não"}</p>
                      </div>
                      {job.beneficios.length > 0 && <div className="bg-white rounded-xl border border-gray-200 p-4">
                          <p className="font-bold text-gray-900 mb-1">Quais são os benefícios inclusos?</p>
                          <p className="text-gray-600">{job.beneficios.join(", ")}</p>
                        </div>}
                      {job.vestimenta && <div className="bg-white rounded-xl border border-gray-200 p-4">
                          <p className="font-bold text-gray-900 mb-1">Qual é o padrão de apresentação?</p>
                          <p className="text-gray-600">{job.vestimenta}</p>
                        </div>}
                    </>}
                </div>
              </div>
            </div>

            {/* Sidebar - Informações */}
            <div className="md:col-span-1">
              <div className="glass rounded-2xl p-6 sticky top-24 shadow-xl">
                <h3 className="font-black text-gray-900 mb-4">INFORMAÇÕES DA VAGA</h3>
                <div className="space-y-4">
                  {/* Remuneração com valores diferenciados */}
                  <div className={`rounded-xl p-4 border ${userType === "empresa" ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200/50" : userType === "freelancer" ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50" : "bg-gray-50 border-gray-200"}`}>
                    <p className="text-sm text-gray-600 mb-1">Remuneração</p>
                    <DisplayValor valorBase={job.valorDiaria} tipoUsuario={userType} size="large" showDetails />
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                    <Briefcase className="w-5 h-5 text-scalador-orange" />
                    <div>
                      <p className="text-sm text-gray-600">Tipo de Vaga</p>
                      <p className="font-bold text-gray-900">
                        {job.tipo === "freelance" ? "Vaga Freelancer" : "Vaga Temporária"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                    <User className="w-5 h-5 text-scalador-orange" />
                    <div>
                      <p className="text-sm text-gray-600">Profissão</p>
                      <p className="font-bold text-gray-900">{job.profissao}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                    <Calendar className="w-5 h-5 text-scalador-orange" />
                    <div>
                      <p className="text-sm text-gray-600">Data</p>
                      <p className="font-bold text-gray-900">{new Date(job.data).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                    <Clock className="w-5 h-5 text-scalador-orange" />
                    <div>
                      <p className="text-sm text-gray-600">Horário</p>
                      <p className="font-bold text-gray-900">
                        {job.horarioEntrada} - {job.horarioSaida}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                    <Users className="w-5 h-5 text-scalador-orange" />
                    <div>
                      <p className="text-sm text-gray-600">Vagas disponíveis</p>
                      <p className="font-bold text-gray-900">{job.quantidadeFreelancers} freelancer(s)</p>
                    </div>
                  </div>

                  {/* Botão de candidatura - só aparece para freelancers */}
                  {userType === "freelancer" && job.status === "aberta" && <button onClick={() => candidatarVaga(job.id)} className="w-full mt-6 py-4 sm:py-5 bg-gradient-to-r from-scalador-orange to-scalador-orange-light text-white text-lg sm:text-xl font-black rounded-2xl shadow-2xl shadow-orange-500/40 hover:shadow-orange-600/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3">
                      <Send className="w-5 h-5 sm:w-6 sm:h-6" /> Me Candidatar
                    </button>}

                  {/* Mensagem para empresas */}
                  {userType === "empresa" && <div className="mt-4 bg-blue-50 rounded-xl p-4 text-center">
                      <p className="text-sm text-blue-700 font-medium">
                        Esta é uma de suas vagas publicadas
                      </p>
                    </div>}

                  {/* Mensagem para visitantes */}
                  {userType === "visitante" && <div className="mt-4 bg-gray-100 rounded-xl p-4 text-center">
                      <p className="text-sm text-gray-600 font-medium mb-2">
                        Faça login para se candidatar
                      </p>
                      <button className="px-4 py-2 bg-scalador-orange text-white rounded-xl font-bold text-sm hover:bg-scalador-orange/90 transition-colors">
                        Entrar
                      </button>
                    </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>;
  };
  const PaginaNotificacoes = () => {
    const marcarComoLida = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? {
        ...n,
        lida: true
      } : n));
    };
    const iconeNotificacao = (tipo: Notification["tipo"]) => {
      const icones = {
        pagamento: <DollarSign className="w-5 h-5 text-green-600" />,
        mensagem: <MessageSquare className="w-5 h-5 text-blue-600" />,
        candidatura: <User className="w-5 h-5 text-purple-600" />,
        avaliacao: <Star className="w-5 h-5 text-yellow-600" />,
        checkin: <CheckCircle className="w-5 h-5 text-indigo-600" />,
        sistema: <Bell className="w-5 h-5 text-gray-600" />
      };
      return icones[tipo];
    };
    return <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Notificações</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm">
              Todas{" "}
              <span className="ml-1 px-2 py-0.5 bg-white text-indigo-600 rounded-full text-xs">
                {notifications.length}
              </span>
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm">
              Apenas mensagens{" "}
              <span className="ml-1 px-2 py-0.5 bg-gray-200 rounded-full text-xs">
                {notifications.filter(n => n.tipo === "mensagem").length}
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {notifications.map(notif => <div key={notif.id} className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${!notif.lida ? "border-l-4 border-l-indigo-600" : ""}`} onClick={() => marcarComoLida(notif.id)}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notif.tipo === "pagamento" ? "bg-green-100" : notif.tipo === "mensagem" ? "bg-blue-100" : notif.tipo === "checkin" ? "bg-indigo-100" : "bg-gray-100"}`}>
                  {iconeNotificacao(notif.tipo)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{notif.titulo}</h3>
                    <span className="text-xs text-gray-500">
                      {Math.floor((Date.now() - notif.timestamp.getTime()) / (1000 * 60))} min atrás
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{notif.mensagem}</p>
                  {notif.vagaId && <button onClick={e => {
                e.stopPropagation();
                navegarPara("vaga-detalhes", notif.vagaId);
              }} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-2">
                      Ver vaga →
                    </button>}
                </div>
                {!notif.lida && <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>}
              </div>
            </div>)}
        </div>

        {notifications.length === 0 && <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma notificação ainda</p>
          </div>}
      </div>;
  };

  // ===== MOCK DATA PARA CARTEIRA =====
  const [transacoesCarteira] = useState([{
    id: "t1",
    tipo: "entrada",
    descricao: "Pagamento - Garçom para Evento",
    empresa: "Restaurante Premium",
    valor: 200,
    data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "concluido"
  }, {
    id: "t2",
    tipo: "entrada",
    descricao: "Pagamento - Auxiliar de Serviços",
    empresa: "Scalador",
    valor: 160,
    data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: "concluido"
  }, {
    id: "t3",
    tipo: "saida",
    descricao: "Saque para conta bancária",
    empresa: "PIX",
    valor: 150,
    data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: "concluido"
  }, {
    id: "t4",
    tipo: "entrada",
    descricao: "Pagamento - Recepcionista",
    empresa: "Hotel Central",
    valor: 150,
    data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: "concluido"
  }, {
    id: "t5",
    tipo: "entrada",
    descricao: "Bônus de indicação",
    empresa: "Scalador",
    valor: 50,
    data: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: "concluido"
  }, {
    id: "t6",
    tipo: "saida",
    descricao: "Saque para conta bancária",
    empresa: "PIX",
    valor: 200,
    data: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    status: "concluido"
  }, {
    id: "t7",
    tipo: "pendente",
    descricao: "Pagamento aguardando liberação",
    empresa: "Evento VIP",
    valor: 250,
    data: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
    status: "pendente"
  }]);
  const [ganhosMensais] = useState([{
    mes: "Jul",
    valor: 850
  }, {
    mes: "Ago",
    valor: 1200
  }, {
    mes: "Set",
    valor: 980
  }, {
    mes: "Out",
    valor: 1450
  }, {
    mes: "Nov",
    valor: 1680
  }, {
    mes: "Dez",
    valor: 560
  }]);
  const PaginaPagamentos = () => {
    const [abaAtiva, setAbaAtiva] = useState<"visao-geral" | "historico" | "sacar">("visao-geral");
    const [valorSaque, setValorSaque] = useState(0);
    const [chavePix, setChavePix] = useState("");
    const [tipoChavePix, setTipoChavePix] = useState<"cpf" | "email" | "telefone" | "aleatoria">("cpf");
    const [modalSaqueConfirmacao, setModalSaqueConfirmacao] = useState(false);

    // Calcular estatísticas
    const totalEntradas = transacoesCarteira.filter(t => t.tipo === "entrada" && t.status === "concluido").reduce((acc, t) => acc + t.valor, 0);
    const totalSaidas = transacoesCarteira.filter(t => t.tipo === "saida" && t.status === "concluido").reduce((acc, t) => acc + t.valor, 0);
    const valorPendente = transacoesCarteira.filter(t => t.status === "pendente").reduce((acc, t) => acc + t.valor, 0);
    const totalTrabalhosMes = transacoesCarteira.filter(t => t.tipo === "entrada" && t.status === "concluido").length;
    const maxGanho = Math.max(...ganhosMensais.map(g => g.valor));
    const formatarData = (data: Date) => {
      const hoje = new Date();
      const diff = Math.floor((hoje.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 0) return "Hoje";
      if (diff === 1) return "Ontem";
      if (diff < 7) return `${diff} dias atrás`;
      return data.toLocaleDateString("pt-BR");
    };
    return <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-5xl font-black mb-2">
                <span className="gradient-text">Minha Carteira</span> 💰
              </h2>
              <p className="text-gray-600 text-base sm:text-lg font-medium">Gerencie seus ganhos e saques</p>
            </div>
            <div className="flex gap-2">
              {(["visao-geral", "historico", "sacar"] as const).map(aba => <button key={aba} onClick={() => setAbaAtiva(aba)} className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ${abaAtiva === aba ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30" : "glass hover:bg-orange-50"}`}>
                  {aba === "visao-geral" ? "Visão Geral" : aba === "historico" ? "Histórico" : "Sacar"}
                </button>)}
            </div>
          </div>
        </div>

        {/* Cards de Saldo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Saldo Disponível */}
          <div className="glass rounded-3xl p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                Disponível
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">Saldo Disponível</p>
            <p className="text-3xl sm:text-4xl font-black text-green-600">
              R$ {saldoAtual.toFixed(2).replace(".", ",")}
            </p>
          </div>

          {/* Valor Pendente */}
          <div className="glass rounded-3xl p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
                Pendente
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">A Liberar</p>
            <p className="text-3xl sm:text-4xl font-black text-amber-600">
              R$ {valorPendente.toFixed(2).replace(".", ",")}
            </p>
          </div>

          {/* Total Ganho no Mês */}
          <div className="glass rounded-3xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200">
                Este mês
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">Ganhos do Mês</p>
            <p className="text-3xl sm:text-4xl font-black text-blue-600">
              R$ {ganhosMensais[ganhosMensais.length - 1].valor.toFixed(2).replace(".", ",")}
            </p>
          </div>

          {/* Trabalhos no Mês */}
          <div className="glass rounded-3xl p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">
                Trabalhos
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">Trabalhos Pagos</p>
            <p className="text-3xl sm:text-4xl font-black text-purple-600">
              {totalTrabalhosMes}
            </p>
          </div>
        </div>

        {/* Conteúdo da Aba */}
        {abaAtiva === "visao-geral" && <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Gráfico de Ganhos */}
            <div className="lg:col-span-2 glass rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900">Ganhos Mensais</h3>
                <span className="text-sm text-gray-500 font-medium">Últimos 6 meses</span>
              </div>
              <div className="h-64 flex items-end justify-between gap-2 sm:gap-4">
                {ganhosMensais.map((mes, idx) => <div key={mes.mes} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-gray-700">
                      R$ {mes.valor}
                    </span>
                    <div className={`w-full rounded-t-xl transition-all duration-500 hover:opacity-80 ${idx === ganhosMensais.length - 1 ? "bg-gradient-to-t from-orange-500 to-amber-400 shadow-lg shadow-orange-500/30" : "bg-gradient-to-t from-gray-300 to-gray-200"}`} style={{
                height: `${mes.valor / maxGanho * 180}px`,
                animationDelay: `${idx * 0.1}s`
              }} />
                    <span className="text-xs sm:text-sm font-bold text-gray-600">{mes.mes}</span>
                  </div>)}
              </div>
            </div>

            {/* Resumo Rápido */}
            <div className="glass rounded-3xl p-6 sm:p-8">
              <h3 className="text-xl font-black text-gray-900 mb-6">Resumo</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-white rotate-[-45deg]" />
                    </div>
                    <span className="font-bold text-gray-700">Total Recebido</span>
                  </div>
                  <span className="font-black text-green-600">R$ {totalEntradas.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-white rotate-[135deg]" />
                    </div>
                    <span className="font-bold text-gray-700">Total Sacado</span>
                  </div>
                  <span className="font-black text-red-600">R$ {totalSaidas.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-700">Média/Trabalho</span>
                  </div>
                  <span className="font-black text-blue-600">R$ {(totalEntradas / totalTrabalhosMes).toFixed(2)}</span>
                </div>
              </div>

              <button onClick={() => setAbaAtiva("sacar")} className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                💸 Sacar Agora
              </button>
            </div>
          </div>}

        {abaAtiva === "historico" && <div className="glass rounded-3xl p-6 sm:p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900">Histórico de Transações</h3>
              <span className="text-sm text-gray-500 font-medium">{transacoesCarteira.length} transações</span>
            </div>
            <div className="space-y-3">
              {transacoesCarteira.map((transacao, idx) => <div key={transacao.id} className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.01] ${transacao.tipo === "entrada" ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:shadow-lg hover:shadow-green-500/10" : transacao.tipo === "saida" ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 hover:shadow-lg hover:shadow-red-500/10" : "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 hover:shadow-lg hover:shadow-amber-500/10"}`} style={{
            animationDelay: `${idx * 0.05}s`
          }}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${transacao.tipo === "entrada" ? "bg-gradient-to-br from-green-500 to-emerald-600" : transacao.tipo === "saida" ? "bg-gradient-to-br from-red-500 to-rose-600" : "bg-gradient-to-br from-amber-500 to-yellow-600"}`}>
                      {transacao.tipo === "entrada" ? <ArrowRight className="w-6 h-6 text-white rotate-[-45deg]" /> : transacao.tipo === "saida" ? <ArrowRight className="w-6 h-6 text-white rotate-[135deg]" /> : <Clock className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">{transacao.descricao}</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {transacao.empresa} • {formatarData(transacao.data)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-lg sm:text-xl ${transacao.tipo === "entrada" ? "text-green-600" : transacao.tipo === "saida" ? "text-red-600" : "text-amber-600"}`}>
                      {transacao.tipo === "saida" ? "-" : "+"}R$ {transacao.valor.toFixed(2)}
                    </p>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${transacao.status === "concluido" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {transacao.status === "concluido" ? "Concluído" : "Pendente"}
                    </span>
                  </div>
                </div>)}
            </div>
          </div>}

        {abaAtiva === "sacar" && <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="glass rounded-3xl p-6 sm:p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/30 mb-4">
                  <DollarSign className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Sacar Dinheiro</h3>
                <p className="text-gray-600">Transfira seu saldo para sua conta bancária via PIX</p>
              </div>

              {/* Saldo disponível */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-green-700 font-bold">Saldo Disponível</span>
                  <span className="text-2xl font-black text-green-600">R$ {saldoAtual.toFixed(2)}</span>
                </div>
              </div>

              {/* Valor do saque */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Valor do Saque</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl font-bold">R$</span>
                  <input type="number" step="0.01" min="10" max={saldoAtual} placeholder="0,00" className="w-full pl-16 pr-6 py-5 text-3xl font-black border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-400 transition-all" value={valorSaque || ""} onChange={e => setValorSaque(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="flex gap-2 mt-3">
                  {[50, 100, 200, saldoAtual].map(valor => <button key={valor} onClick={() => setValorSaque(valor)} className={`flex-1 py-2 rounded-xl font-bold text-sm border-2 transition-all ${valorSaque === valor ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-700 border-gray-200 hover:border-orange-300"}`}>
                      {valor === saldoAtual ? "Tudo" : `R$ ${valor}`}
                    </button>)}
                </div>
              </div>

              {/* Tipo de chave PIX */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Chave PIX</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["cpf", "email", "telefone", "aleatoria"] as const).map(tipo => <button key={tipo} onClick={() => setTipoChavePix(tipo)} className={`py-3 rounded-xl font-bold text-xs sm:text-sm border-2 transition-all ${tipoChavePix === tipo ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-700 border-gray-200 hover:border-orange-300"}`}>
                      {tipo === "cpf" ? "CPF" : tipo === "email" ? "E-mail" : tipo === "telefone" ? "Telefone" : "Aleatória"}
                    </button>)}
                </div>
              </div>

              {/* Chave PIX */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2">Chave PIX</label>
                <input type="text" placeholder={tipoChavePix === "cpf" ? "000.000.000-00" : tipoChavePix === "email" ? "seu@email.com" : tipoChavePix === "telefone" ? "(00) 00000-0000" : "Chave aleatória"} className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-400 transition-all" value={chavePix} onChange={e => setChavePix(e.target.value)} />
              </div>

              {/* Resumo */}
              {valorSaque > 0 && <div className="bg-gray-50 rounded-2xl p-5 mb-6 border-2 border-gray-200">
                  <h4 className="font-bold text-gray-700 mb-3">Resumo do Saque</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Valor solicitado</span>
                      <span className="font-bold">R$ {valorSaque.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Taxa de transferência</span>
                      <span className="font-bold">Grátis</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
                      <span className="font-bold text-gray-900">Você receberá</span>
                      <span className="font-black text-xl text-green-600">R$ {valorSaque.toFixed(2)}</span>
                    </div>
                  </div>
                </div>}

              {/* Botão de saque */}
              <button disabled={valorSaque < 10 || valorSaque > saldoAtual || !chavePix} onClick={() => setModalSaqueConfirmacao(true)} className="w-full py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100">
                💸 Solicitar Saque
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                O valor será transferido em até 1 hora útil • Valor mínimo: R$ 10,00
              </p>
            </div>

            {/* Modal de Confirmação */}
            {modalSaqueConfirmacao && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="glass rounded-3xl max-w-md w-full p-8 animate-scale-in">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl mb-4">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Confirmar Saque</h3>
                    <p className="text-gray-600">Revise os dados antes de confirmar</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor</span>
                      <span className="font-black text-xl text-green-600">R$ {valorSaque.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chave PIX</span>
                      <span className="font-bold text-gray-900">{chavePix}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo</span>
                      <span className="font-bold text-gray-900 capitalize">{tipoChavePix}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setModalSaqueConfirmacao(false)} className="flex-1 py-4 glass rounded-2xl font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all">
                      Cancelar
                    </button>
                    <button onClick={() => {
                setSaldoAtual(prev => prev - valorSaque);
                setModalSaqueConfirmacao(false);
                setValorSaque(0);
                setChavePix("");
                simularEnvioWhatsApp("pagamento", "Você", {
                  valor: valorSaque,
                  vaga: "Saque PIX",
                  empresa: "Scalador"
                });
                toast({
                  title: "✅ Saque Solicitado!",
                  description: `R$ ${valorSaque.toFixed(2)} será transferido para sua conta.`
                });
                setAbaAtiva("historico");
              }} className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-green-500/30 hover:scale-[1.02] transition-all">
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>}
          </div>}
      </div>;
  };

  // ===== COMPONENTE COUNTDOWN TIMER =====
  const CountdownTimer = ({
    endTime,
    label,
    color = "blue"
  }: {
    endTime: Date;
    label: string;
    color?: string;
  }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [percentage, setPercentage] = useState(100);
    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const end = endTime.getTime();
        const distance = end - now;
        if (distance < 0) {
          setTimeLeft("Tempo esgotado");
          setPercentage(0);
          clearInterval(interval);
        } else {
          const minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
          const seconds = Math.floor(distance % (1000 * 60) / 1000);
          setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);

          // Calcular porcentagem (assumindo 20 minutos = 100%)
          const totalTime = 20 * 60 * 1000; // 20 minutos em ms
          setPercentage(distance / totalTime * 100);
        }
      }, 1000);
      return () => clearInterval(interval);
    }, [endTime]);
    const colorClasses = {
      blue: "bg-blue-600",
      red: "bg-red-600",
      green: "bg-green-600",
      orange: "bg-orange-600"
    };
    return <div className="glass rounded-3xl p-6 shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-700">{label}</span>
          <span className={`text-2xl font-black tabular-nums ${percentage < 30 ? "text-red-600 animate-pulse" : "text-gray-900"}`}>
            {timeLeft}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
          <div className={`h-4 rounded-full transition-all duration-1000 shadow-lg ${percentage < 30 ? "bg-gradient-to-r from-red-600 to-rose-600 shadow-red-500/50 animate-pulse-glow" : percentage < 60 ? "bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/50" : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/50"}`} style={{
          width: `${Math.max(0, Math.min(100, percentage))}%`
        }}></div>
        </div>
      </div>;
  };

  // ===== PÁGINA BUSCAR FREELANCERS =====
  const PaginaBuscarFreelancers = () => {
    const freelancersFiltrados = freelancers.filter(freelancer => {
      if (filtrosFreelancers.busca && !freelancer.nome.toLowerCase().includes(filtrosFreelancers.busca.toLowerCase()) && !freelancer.profissao.toLowerCase().includes(filtrosFreelancers.busca.toLowerCase())) return false;
      if (filtrosFreelancers.profissao !== "todas" && freelancer.profissao !== filtrosFreelancers.profissao) return false;
      if (filtrosFreelancers.disponivel !== "todos" && (filtrosFreelancers.disponivel === "sim" && !freelancer.disponivel || filtrosFreelancers.disponivel === "nao" && freelancer.disponivel)) return false;
      if (filtrosFreelancers.avaliacao !== "todas") {
        const minRating = parseFloat(filtrosFreelancers.avaliacao);
        if (freelancer.rating < minRating) return false;
      }
      return true;
    });
    return <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-12">
        <div className="mb-8 sm:mb-12 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4">
            <span className="gradient-text">Buscar Freelancers</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-xl font-medium">Encontre profissionais de confiança 👥</p>
        </div>

        <div className="max-w-4xl mx-auto mb-6 sm:mb-10">
          <div className="flex gap-2 sm:gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 sm:w-6 h-5 sm:h-6 group-focus-within:scale-110 group-focus-within:text-purple-600 transition-all" />
              <input type="text" placeholder="Buscar por nome ou profissão..." className="w-full pl-10 sm:pl-14 pr-3 sm:pr-6 py-3 sm:py-5 glass rounded-xl sm:rounded-2xl text-sm sm:text-lg font-medium placeholder:text-gray-400 focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 transition-all duration-300" value={filtrosFreelancers.busca} onChange={e => setFiltrosFreelancers({
              ...filtrosFreelancers,
              busca: e.target.value
            })} />
            </div>
            <button className="px-5 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg shadow-xl shadow-purple-500/40 hover:shadow-2xl hover:shadow-purple-600/50 hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap">
              Buscar
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          <div className="flex-1 min-w-0">
            {freelancersFiltrados.length === 0 ? <div className="text-center py-12 sm:py-20 glass rounded-2xl sm:rounded-3xl">
                <div className="text-4xl sm:text-6xl mb-4 animate-float">🔍</div>
                <p className="text-gray-600 text-lg sm:text-xl font-semibold mb-2">Nenhum freelancer encontrado</p>
                <p className="text-gray-500 text-sm sm:text-base">Tente ajustar os filtros</p>
              </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {freelancersFiltrados.map((freelancer, idx) => <FreelancerCard key={freelancer.id} freelancer={freelancer} delay={idx * 0.1} />)}
              </div>}
          </div>

          <aside className="lg:w-80 flex-shrink-0">
            <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="font-black text-gray-900 text-lg sm:text-xl flex items-center gap-2">
                  <Filter className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" /> Filtros
                </h3>
                <button onClick={() => setFiltrosFreelancers({
                busca: "",
                profissao: "todas",
                disponivel: "todos",
                avaliacao: "todas"
              })} className="text-xs sm:text-sm font-bold text-purple-600 hover:text-pink-600 hover:scale-110 transition-all">
                  Limpar
                </button>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">Disponibilidade</label>
                  <select className="w-full p-3 sm:p-4 glass rounded-xl font-medium text-sm sm:text-base focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 transition-all duration-300" value={filtrosFreelancers.disponivel} onChange={e => setFiltrosFreelancers({
                  ...filtrosFreelancers,
                  disponivel: e.target.value
                })}>
                    <option value="todos">Todos</option>
                    <option value="sim">✅ Disponível</option>
                    <option value="nao">⏸️ Indisponível</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">Avaliação Mínima</label>
                  <select className="w-full p-3 sm:p-4 glass rounded-xl font-medium text-sm sm:text-base focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 transition-all duration-300" value={filtrosFreelancers.avaliacao} onChange={e => setFiltrosFreelancers({
                  ...filtrosFreelancers,
                  avaliacao: e.target.value
                })}>
                    <option value="todas">Todas</option>
                    <option value="4.5">⭐ 4.5+</option>
                    <option value="4.0">⭐ 4.0+</option>
                    <option value="3.5">⭐ 3.5+</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>;
  };

  // ===== PÁGINA CARTEIRA DE FREELANCERS =====
  const PaginaCarteiraFreelancers = () => {
    const freelancersFavoritos = freelancers.filter(f => carteiraFreelancers.includes(f.id));
    return <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-12">
        <div className="mb-8 sm:mb-12 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4 flex items-center justify-center gap-3">
            <Heart className="w-10 sm:w-14 h-10 sm:h-14 text-pink-600" />
            <span className="gradient-text">Favoritos</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-xl font-medium">
            Seus freelancers favoritos ({freelancersFavoritos.length})
          </p>
        </div>

        {freelancersFavoritos.length === 0 ? <div className="text-center py-12 sm:py-20 glass rounded-2xl sm:rounded-3xl max-w-2xl mx-auto">
            <Heart className="w-16 sm:w-20 h-16 sm:h-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
            <p className="text-gray-600 text-lg sm:text-2xl font-bold mb-2">Sua carteira está vazia</p>
            <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8">
              Adicione freelancers de confiança para convidá-los rapidamente
            </p>
            <button onClick={() => navegarPara("freelancers")} className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg shadow-xl shadow-pink-500/40 hover:shadow-2xl hover:shadow-pink-600/50 hover:scale-105 active:scale-95 transition-all duration-300">
              Buscar Freelancers
            </button>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {freelancersFavoritos.map((freelancer, idx) => <FreelancerCard key={freelancer.id} freelancer={freelancer} delay={idx * 0.1} showRemove />)}
          </div>}
      </div>;
  };

  // ===== COMPONENTE FREELANCER CARD =====
  const FreelancerCard = ({
    freelancer,
    delay = 0,
    showRemove = false
  }: {
    freelancer: Freelancer;
    delay?: number;
    showRemove?: boolean;
  }) => {
    const isFavorito = carteiraFreelancers.includes(freelancer.id);
    return <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 group hover:-translate-y-1 relative overflow-hidden animate-slide-up" style={{
      animationDelay: `${delay}s`
    }}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                {freelancer.foto}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-500 group-hover:bg-clip-text transition-all duration-300">
                  {freelancer.nome}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-purple-600">{freelancer.profissao}</p>
              </div>
            </div>

            <button onClick={e => {
            e.stopPropagation();
            toggleCarteiraFreelancer(freelancer.id);
          }} className="p-2 hover:bg-pink-50 rounded-xl transition-all duration-300 hover:scale-110">
              <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isFavorito ? "fill-pink-600 text-pink-600" : "text-gray-400"} transition-all`} />
            </button>
          </div>

          {/* Rating e Badge de Comparecimento */}
          <div className="flex items-center flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-base sm:text-lg font-black text-gray-900">{freelancer.rating}</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-600">• {freelancer.totalTrabalhos} trabalhos</span>
            
            {/* Badge de Comparecimento */}
            {(() => {
            const badge = getBadgeComparecimento(freelancer.historicoComparecimento.taxaComparecimento);
            return <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${badge.cor}`}>
                  {badge.icon} {badge.label}
                </span>;
          })()}
            
            <span className={`ml-auto px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${freelancer.disponivel ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
              {freelancer.disponivel ? "✅ Disponível" : "⏸️ Ocupado"}
            </span>
          </div>

          {/* Alerta de Faltas para Empresas */}
          {userType === "empresa" && freelancer.historicoComparecimento.taxaComparecimento < 90 && <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-xs text-red-700 font-medium">
                ⚠️ Atenção: {freelancer.historicoComparecimento.totalFaltas} falta(s) registrada(s)
                {freelancer.historicoComparecimento.ultimaFalta && <span className="text-red-600"> • Última: {new Date(freelancer.historicoComparecimento.ultimaFalta).toLocaleDateString("pt-BR")}</span>}
              </span>
            </div>}

          <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{freelancer.descricao}</p>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
            {freelancer.habilidades.slice(0, 3).map(skill => <span key={skill} className="px-2 sm:px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 text-purple-700 rounded-full text-xs font-bold">
                {skill}
              </span>)}
          </div>

          {/* Localização com bairro em destaque */}
          <div className="flex items-center gap-2 mb-4 text-gray-600">
            <MapPin className="w-4 h-4 text-scalador-orange" />
            <span className="text-sm">
              <span className="font-bold text-scalador-orange">{freelancer.localizacao.bairro}</span>
              {" • "}
              {freelancer.localizacao.cidade}/{freelancer.localizacao.estado}
            </span>
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              <button onClick={() => setSelectedFreelancer(freelancer)} className="px-3 sm:px-4 py-2 glass hover:bg-purple-50 rounded-xl text-xs sm:text-sm font-bold text-purple-600 hover:scale-105 transition-all">
                Ver perfil
              </button>
              <button onClick={() => convidarFreelancer(freelancer.id)} className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-1 sm:gap-2">
                <UserPlus className="w-3 sm:w-4 h-3 sm:h-4" /> Convidar
              </button>
            </div>
          </div>
        </div>
      </div>;
  };

  // ===== MODAL DETALHES FREELANCER =====
  const ModalDetalhesFreelancer = () => {
    if (!selectedFreelancer) return null;
    return <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in" onClick={() => setSelectedFreelancer(null)}>
        <div className="glass rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
          <div className="p-4 sm:p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl shadow-xl">
                  {selectedFreelancer.foto}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{selectedFreelancer.nome}</h2>
                  <p className="text-base sm:text-lg font-semibold text-purple-600">{selectedFreelancer.profissao}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-black">{selectedFreelancer.rating}</span>
                    <span className="text-sm text-gray-600">({selectedFreelancer.totalTrabalhos} trabalhos)</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedFreelancer(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className={`p-3 sm:p-4 rounded-xl mb-6 ${selectedFreelancer.disponivel ? "bg-green-50 border-2 border-green-200" : "bg-gray-50 border-2 border-gray-200"}`}>
              <p className="text-sm sm:text-base font-bold flex items-center gap-2">
                {selectedFreelancer.disponivel ? "✅ Disponível agora" : "⏸️ Indisponível no momento"}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3">Sobre</h3>
              <p className="text-sm sm:text-base text-gray-700">{selectedFreelancer.descricao}</p>
            </div>

            {/* ===== AVALIAÇÕES DETALHADAS ===== */}
            <div className="mb-6 p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Avaliações Detalhadas
              </h3>
              <div className="space-y-4">
                {[{
                label: "Pontualidade",
                value: selectedFreelancer.avaliacaoDetalhada.pontualidade,
                icon: "⏰"
              }, {
                label: "Qualidade do Trabalho",
                value: selectedFreelancer.avaliacaoDetalhada.qualidadeTrabalho,
                icon: "✨"
              }, {
                label: "Comunicação",
                value: selectedFreelancer.avaliacaoDetalhada.comunicacao,
                icon: "💬"
              }, {
                label: "Profissionalismo",
                value: selectedFreelancer.avaliacaoDetalhada.profissionalismo,
                icon: "👔"
              }, {
                label: "Apresentação",
                value: selectedFreelancer.avaliacaoDetalhada.apresentacao,
                icon: "🎯"
              }].map(criterio => <div key={criterio.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <span>{criterio.icon}</span>
                        {criterio.label}
                      </span>
                      <span className="text-sm font-black text-purple-600">{criterio.value.toFixed(1)}</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{
                    width: `${criterio.value / 5 * 100}%`
                  }} />
                    </div>
                  </div>)}
            </div>

            {/* ===== HISTÓRICO DE COMPARECIMENTO ===== */}
            <div className="mb-6 p-4 sm:p-6 rounded-2xl border-2 overflow-hidden" style={{
              background: selectedFreelancer.historicoComparecimento.taxaComparecimento >= 95 ? 'linear-gradient(to br, rgb(236, 253, 245), rgb(209, 250, 229))' : selectedFreelancer.historicoComparecimento.taxaComparecimento >= 90 ? 'linear-gradient(to br, rgb(239, 246, 255), rgb(219, 234, 254))' : 'linear-gradient(to br, rgb(254, 252, 232), rgb(254, 249, 195))',
              borderColor: selectedFreelancer.historicoComparecimento.taxaComparecimento >= 95 ? 'rgb(134, 239, 172)' : selectedFreelancer.historicoComparecimento.taxaComparecimento >= 90 ? 'rgb(147, 197, 253)' : 'rgb(252, 211, 77)'
            }}>
              <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" />
                Histórico de Comparecimento
              </h3>
              
              {/* Badge principal */}
              {(() => {
                const badge = getBadgeComparecimento(selectedFreelancer.historicoComparecimento.taxaComparecimento);
                return <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${badge.cor} mb-4`}>
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="font-black text-lg">{badge.label}</p>
                      <p className="text-xs opacity-80">{selectedFreelancer.historicoComparecimento.totalCompareceu} de {selectedFreelancer.historicoComparecimento.totalAgendados} trabalhos</p>
                    </div>
                  </div>;
              })()}

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-white/60 rounded-xl">
                  <p className="text-2xl font-black text-green-600">{selectedFreelancer.historicoComparecimento.totalCompareceu}</p>
                  <p className="text-xs text-gray-600 font-medium">Compareceu</p>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-xl">
                  <p className="text-2xl font-black text-red-500">{selectedFreelancer.historicoComparecimento.totalFaltas}</p>
                  <p className="text-xs text-gray-600 font-medium">Faltas</p>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-xl">
                  <p className="text-2xl font-black text-purple-600">{selectedFreelancer.historicoComparecimento.taxaComparecimento.toFixed(1)}%</p>
                  <p className="text-xs text-gray-600 font-medium">Taxa</p>
                </div>
              </div>

              {/* Alerta para empresas se taxa < 90% */}
              {userType === "empresa" && selectedFreelancer.historicoComparecimento.taxaComparecimento < 90 && <div className="p-3 bg-red-100 border-2 border-red-300 rounded-xl mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-700">⚠️ Alerta de Confiabilidade</p>
                      <p className="text-xs text-red-600 mt-1">
                        Este freelancer tem um histórico de {selectedFreelancer.historicoComparecimento.totalFaltas} falta(s) em {selectedFreelancer.historicoComparecimento.totalAgendados} trabalhos agendados.
                        {selectedFreelancer.historicoComparecimento.ultimaFalta && <span className="block mt-1">Última falta: {new Date(selectedFreelancer.historicoComparecimento.ultimaFalta).toLocaleDateString("pt-BR")}</span>}
                      </p>
                    </div>
                  </div>
                </div>}

              {/* Histórico detalhado (últimos 3) */}
              {selectedFreelancer.historicoComparecimento.historicoDetalhado.length > 0 && <div>
                  <p className="text-sm font-bold text-gray-700 mb-2">Últimos registros:</p>
                  <div className="space-y-2">
                    {selectedFreelancer.historicoComparecimento.historicoDetalhado.slice(0, 3).map((registro, idx) => <div key={idx} className={`flex items-center justify-between p-2 rounded-lg ${registro.compareceu ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className="flex items-center gap-2">
                          {registro.compareceu ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                          <span className="text-sm font-medium text-gray-700">{registro.empresa}</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-bold ${registro.compareceu ? 'text-green-600' : 'text-red-500'}`}>
                            {registro.compareceu ? 'Compareceu' : 'Faltou'}
                          </span>
                          <p className="text-xs text-gray-500">{new Date(registro.data).toLocaleDateString("pt-BR")}</p>
                          {registro.justificativa && <p className="text-xs text-gray-400 italic">{registro.justificativa}</p>}
                        </div>
                      </div>)}
                  </div>
                </div>}
            </div>
              
              {/* Pontos de melhoria se algum critério < 4.5 */}
              {(() => {
              const criteriosBaixos = [{
                label: "Pontualidade",
                value: selectedFreelancer.avaliacaoDetalhada.pontualidade
              }, {
                label: "Qualidade do Trabalho",
                value: selectedFreelancer.avaliacaoDetalhada.qualidadeTrabalho
              }, {
                label: "Comunicação",
                value: selectedFreelancer.avaliacaoDetalhada.comunicacao
              }, {
                label: "Profissionalismo",
                value: selectedFreelancer.avaliacaoDetalhada.profissionalismo
              }, {
                label: "Apresentação",
                value: selectedFreelancer.avaliacaoDetalhada.apresentacao
              }].filter(c => c.value < 4.5);
              if (criteriosBaixos.length === 0) return null;
              return <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs font-bold text-amber-700 mb-2">📊 Pontos de Melhoria:</p>
                    <ul className="text-xs text-amber-600 space-y-1">
                      {criteriosBaixos.map(c => <li key={c.label}>• {c.label} ({c.value.toFixed(1)})</li>)}
                    </ul>
                  </div>;
            })()}
            </div>

            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3">Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {selectedFreelancer.habilidades.map(skill => <span key={skill} className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-700 rounded-xl text-xs sm:text-sm font-bold">
                    {skill}
                  </span>)}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3">Últimos Trabalhos</h3>
              <div className="space-y-3">
                {selectedFreelancer.ultimosTrabalhos.map((trabalho, idx) => <div key={idx} className="p-3 sm:p-4 glass rounded-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{trabalho.cargo}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{trabalho.empresa}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{trabalho.avaliacao}</span>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => toggleCarteiraFreelancer(selectedFreelancer.id)} className="flex-1 px-6 py-4 glass hover:bg-pink-50 rounded-xl sm:rounded-2xl font-bold text-pink-600 hover:scale-105 transition-all flex items-center justify-center gap-2">
                <Heart className={`w-5 h-5 ${carteiraFreelancers.includes(selectedFreelancer.id) ? "fill-pink-600" : ""}`} />
                {carteiraFreelancers.includes(selectedFreelancer.id) ? "Remover da carteira" : "Adicionar à carteira"}
              </button>
              <button onClick={() => {
              convidarFreelancer(selectedFreelancer.id);
              setSelectedFreelancer(null);
            }} className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl sm:rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" /> Convidar para vaga
              </button>
            </div>
          </div>
        </div>
      </div>;
  };

  // ===== TIPOS DE MENSAGEM WHATSAPP =====
  type WhatsAppMessageType = "nova_vaga" | "confirmacao_empresa" | "confirmacao_freelancer" | "checkin_freelancer" | "checkin_confirmado" | "cancelamento" | "pagamento" | "mensagem_empresa" | "convite_direto" | "lembrete_vaga" | "avaliacao_solicitada" | "problema_relatado";

  // Helper para configuração de cada tipo de mensagem
  const getWhatsAppConfig = (tipo: string) => {
    const configs: Record<string, {
      icon: string;
      cor: string;
      titulo: string;
      corBadge: string;
    }> = {
      nova_vaga: {
        icon: "🎯",
        cor: "from-orange-500 to-amber-600",
        titulo: "Nova Vaga Disponível",
        corBadge: "bg-orange-100 text-orange-700 border-orange-300"
      },
      confirmacao_empresa: {
        icon: "✅",
        cor: "from-green-500 to-emerald-600",
        titulo: "Vaga Confirmada",
        corBadge: "bg-green-100 text-green-700 border-green-300"
      },
      confirmacao_freelancer: {
        icon: "🎉",
        cor: "from-purple-500 to-violet-600",
        titulo: "Freelancer Aceitou",
        corBadge: "bg-purple-100 text-purple-700 border-purple-300"
      },
      checkin_freelancer: {
        icon: "📍",
        cor: "from-blue-500 to-indigo-600",
        titulo: "Freelancer Chegou",
        corBadge: "bg-blue-100 text-blue-700 border-blue-300"
      },
      checkin_confirmado: {
        icon: "✅",
        cor: "from-teal-500 to-cyan-600",
        titulo: "Check-in Confirmado",
        corBadge: "bg-teal-100 text-teal-700 border-teal-300"
      },
      cancelamento: {
        icon: "❌",
        cor: "from-red-500 to-rose-600",
        titulo: "Cancelamento",
        corBadge: "bg-red-100 text-red-700 border-red-300"
      },
      pagamento: {
        icon: "💰",
        cor: "from-emerald-500 to-green-600",
        titulo: "Pagamento Realizado",
        corBadge: "bg-emerald-100 text-emerald-700 border-emerald-300"
      },
      mensagem_empresa: {
        icon: "💬",
        cor: "from-gray-500 to-slate-600",
        titulo: "Mensagem",
        corBadge: "bg-gray-100 text-gray-700 border-gray-300"
      },
      convite_direto: {
        icon: "🎁",
        cor: "from-pink-500 to-rose-600",
        titulo: "Convite Especial",
        corBadge: "bg-pink-100 text-pink-700 border-pink-300"
      },
      lembrete_vaga: {
        icon: "⏰",
        cor: "from-amber-500 to-yellow-600",
        titulo: "Lembrete de Vaga",
        corBadge: "bg-amber-100 text-amber-700 border-amber-300"
      },
      avaliacao_solicitada: {
        icon: "⭐",
        cor: "from-yellow-500 to-orange-600",
        titulo: "Avaliação Solicitada",
        corBadge: "bg-yellow-100 text-yellow-700 border-yellow-300"
      },
      problema_relatado: {
        icon: "⚠️",
        cor: "from-orange-600 to-red-600",
        titulo: "Problema Relatado",
        corBadge: "bg-orange-100 text-orange-700 border-orange-300"
      }
    };
    return configs[tipo] || {
      icon: "📱",
      cor: "from-green-500 to-emerald-600",
      titulo: "Mensagem WhatsApp",
      corBadge: "bg-green-100 text-green-700 border-green-300"
    };
  };

  // ===== COMPONENTE MODAL WHATSAPP MELHORADO =====
  const ModalWhatsApp = () => {
    if (!modalWhatsApp.isOpen) return null;
    const config = getWhatsAppConfig(modalWhatsApp.tipo);
    const {
      tipo,
      conteudo
    } = modalWhatsApp;

    // Gerar links de localização
    const getLocationLinks = () => {
      if (!conteudo?.coordenadas && !conteudo?.endereco && !conteudo?.local) return null;
      const mapsLink = conteudo.coordenadas ? `https://www.google.com/maps?q=${conteudo.coordenadas.lat},${conteudo.coordenadas.lng}` : `https://www.google.com/maps/search/${encodeURIComponent(conteudo.endereco || conteudo.local || "")}`;
      const wazeLink = conteudo.coordenadas ? `https://waze.com/ul?ll=${conteudo.coordenadas.lat},${conteudo.coordenadas.lng}&navigate=yes` : `https://waze.com/ul?q=${encodeURIComponent(conteudo.endereco || conteudo.local || "")}&navigate=yes`;
      return {
        mapsLink,
        wazeLink
      };
    };
    const locationLinks = getLocationLinks();
    const getMensagemWhatsApp = () => {
      switch (tipo) {
        case "convite_direto":
          return `🎁 *CONVITE ESPECIAL*

Olá ${conteudo?.freelancer || ""}!

A empresa *${conteudo?.empresa || "Scalador"}* gostaria de convidar você para uma vaga exclusiva!

📋 *${conteudo?.vaga || "Nova oportunidade"}*
💰 Valor: R$ ${conteudo?.valor || "A combinar"}/dia
📅 Data: ${conteudo?.data ? new Date(conteudo.data).toLocaleDateString("pt-BR") : "A definir"}

📞 Entre em contato: ${conteudo?.telefone || ""}

Estamos ansiosos para trabalhar com você! 🤝`;
        case "nova_vaga":
          return `🎯 *NOVA VAGA DISPONÍVEL*

📋 *${conteudo?.titulo || "Vaga"}*
🏢 Empresa: *${conteudo?.empresa || "Scalador"}*

💰 Valor: *R$ ${conteudo?.valor || 0}/dia*
📍 Local: ${conteudo?.bairro ? `${conteudo.bairro}, ` : ""}${conteudo?.local || ""}
📅 Data: ${conteudo?.data ? new Date(conteudo.data).toLocaleDateString("pt-BR") : ""}
⏰ Horário: ${conteudo?.horario || ""}
${conteudo?.vestimenta ? `👔 Vestimenta: ${conteudo.vestimenta}` : ""}

${locationLinks ? `🗺️ *COMO CHEGAR:*
📍 Google Maps: ${locationLinks.mapsLink}
🚗 Waze: ${locationLinks.wazeLink}` : ""}

Para *ACEITAR* esta vaga, responda com *SIM*.

_⏱️ Após aceitar, você terá 2:30h para chegar._
_❌ Cancelamentos frequentes afetam sua reputação._`;
        case "confirmacao_empresa":
          return `✅ *PARABÉNS! VOCÊ FOI SELECIONADO!*

Olá *${conteudo?.freelancer || modalWhatsApp.destinatario}*,

A empresa *${conteudo?.empresa || ""}* confirmou sua candidatura para:

📋 *${conteudo?.vaga || ""}*
📅 Data: ${conteudo?.data ? new Date(conteudo.data).toLocaleDateString("pt-BR") : ""}
⏰ Horário: ${conteudo?.horario || ""}
📍 Local: ${conteudo?.local || ""}

🚗 *Você pode se deslocar agora!*

⏰ Tempo máximo para chegada: *2:30h*
📍 Ao chegar, faça seu *CHECK-IN* no app.

${locationLinks ? `🗺️ *NAVEGUE ATÉ O LOCAL:*
📍 Google Maps: ${locationLinks.mapsLink}
🚗 Waze: ${locationLinks.wazeLink}` : ""}

Boa sorte! 🍀`;
        case "confirmacao_freelancer":
          return `🎉 *FREELANCER ACEITOU SUA VAGA!*

O freelancer *${conteudo?.freelancer || ""}* aceitou trabalhar em:

📋 *${conteudo?.vaga || ""}*
📅 ${conteudo?.data ? new Date(conteudo.data).toLocaleDateString("pt-BR") : ""}

👤 *Dados do Freelancer:*
⭐ Avaliação: ${conteudo?.rating || "N/A"}
📞 Telefone: ${conteudo?.telefone || ""}
📍 Localização: ${conteudo?.bairro || ""}

🚗 *Status:* Em deslocamento
⏱️ Previsão de chegada: ~2:30h

⚠️ *Você tem 20 minutos para cancelar* sem penalidades.

Acompanhe pelo aplicativo! 📱`;
        case "checkin_freelancer":
          return `📍 *FREELANCER CHEGOU!*

O freelancer *${conteudo?.freelancer || ""}* confirmou chegada no local.

📋 Vaga: *${conteudo?.vaga || ""}*
⏰ Horário de chegada: ${new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
          })}

✅ *Por favor, confirme o check-in* para liberar o início do trabalho.

_O freelancer aguarda sua confirmação._`;
        case "checkin_confirmado":
          return `✅ *CHECK-IN CONFIRMADO!*

Olá *${conteudo?.freelancer || modalWhatsApp.destinatario}*,

A empresa *${conteudo?.empresa || ""}* confirmou sua chegada!

📋 Vaga: *${conteudo?.vaga || ""}*
⏰ Início: ${new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
          })}
⏰ Término previsto: ${conteudo?.horarioSaida || ""}

🎉 *Você pode iniciar o trabalho!*

Dicas:
• Siga as orientações do responsável
• Mantenha o celular acessível
• Em caso de problemas, entre em contato

Boa sorte! 🍀`;
        case "cancelamento":
          return `❌ *VAGA CANCELADA*

${conteudo?.canceladoPor === "empresa" ? `Infelizmente, a empresa cancelou sua participação na vaga.

📋 *${conteudo?.vaga || ""}*

${conteudo?.motivo ? `📝 Motivo: ${conteudo.motivo}` : ""}

Não se preocupe! Novas oportunidades surgirão em breve. 💪` : `Você cancelou sua participação na vaga:

📋 *${conteudo?.vaga || ""}*

⚠️ *Atenção:* Cancelamentos frequentes afetam sua reputação e visibilidade para empresas.`}`;
        case "pagamento":
          return `💰 *PAGAMENTO RECEBIDO!*

Parabéns! Seu pagamento foi processado com sucesso.

💵 *Valor: R$ ${conteudo?.valor?.toFixed(2) || "0.00"}*

📋 Referente à vaga: *${conteudo?.vaga || ""}*
🏢 Empresa: ${conteudo?.empresa || ""}
📅 Data do trabalho: ${conteudo?.dataTrabalho ? new Date(conteudo.dataTrabalho).toLocaleDateString("pt-BR") : ""}

💳 O valor já está disponível em sua carteira Scalador.

Para sacar, acesse: Pagamentos → Sacar

Obrigado por usar o Scalador! 🧡`;
        case "lembrete_vaga":
          return `⏰ *LEMBRETE: VAGA AMANHÃ!*

Olá *${conteudo?.freelancer || modalWhatsApp.destinatario}*,

Lembre-se que você tem uma vaga confirmada para amanhã:

📋 *${conteudo?.vaga || ""}*
🏢 Empresa: ${conteudo?.empresa || ""}
📅 Data: ${conteudo?.data ? new Date(conteudo.data).toLocaleDateString("pt-BR") : ""}
⏰ Entrada: ${conteudo?.horarioEntrada || ""}
📍 Local: ${conteudo?.local || ""}

${locationLinks ? `🗺️ *SALVE O ENDEREÇO:*
📍 Google Maps: ${locationLinks.mapsLink}
🚗 Waze: ${locationLinks.wazeLink}` : ""}

👔 Vestimenta: ${conteudo?.vestimenta || ""}

_Chegue com 15 minutos de antecedência!_ ⏰`;
        case "avaliacao_solicitada":
          return `⭐ *AVALIE SEU TRABALHO!*

Olá!

${conteudo?.paraEmpresa ? `Como foi trabalhar com o freelancer *${conteudo?.freelancer || ""}*?` : `Como foi sua experiência com a empresa *${conteudo?.empresa || ""}*?`}

📋 Vaga: *${conteudo?.vaga || ""}*
📅 Data: ${conteudo?.data ? new Date(conteudo.data).toLocaleDateString("pt-BR") : ""}

Sua avaliação ajuda a melhorar a plataforma e auxilia outros usuários!

🔗 Avalie agora no app Scalador.

_Avaliações são anônimas e construtivas._ 🙏`;
        case "problema_relatado":
          return `⚠️ *PROBLEMA RELATADO*

Um problema foi reportado:

📋 Vaga: *${conteudo?.vaga || ""}*
📅 Data: ${conteudo?.data ? new Date(conteudo.data).toLocaleDateString("pt-BR") : ""}
${conteudo?.freelancer ? `👤 Freelancer: ${conteudo.freelancer}` : ""}
${conteudo?.empresa ? `🏢 Empresa: ${conteudo.empresa}` : ""}

📝 *Descrição:*
${conteudo?.problema || "Problema não especificado"}

Nossa equipe está analisando e entrará em contato em breve.

_Agradecemos sua paciência._ 🙏`;
        case "mensagem_empresa":
          return `💬 *MENSAGEM DA EMPRESA*

🏢 De: *${conteudo?.empresa || "Empresa"}*

${conteudo?.texto || ""}

---
_Responda diretamente por este chat._`;
        default:
          return conteudo?.mensagem || "Mensagem enviada via Scalador";
      }
    };
    const mensagem = getMensagemWhatsApp();
    return <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full shadow-2xl animate-scale-in border border-white/20 overflow-hidden">
          {/* Header com gradiente do tipo */}
          <div className={`bg-gradient-to-r ${config.cor} p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  {config.icon}
                </div>
                <div className="text-white">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-xl">{config.titulo}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${config.corBadge} border`}>
                      WhatsApp
                    </span>
                  </div>
                  <p className="text-white/80 text-sm font-medium">
                    Para: <span className="font-bold text-white">{modalWhatsApp.destinatario}</span>
                  </p>
                </div>
              </div>
              <button onClick={() => setModalWhatsApp({
              ...modalWhatsApp,
              isOpen: false
            })} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all duration-300 flex items-center justify-center hover:scale-110">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Balão de mensagem estilo WhatsApp */}
            <div className="bg-[#dcf8c6] rounded-2xl rounded-tl-md p-5 shadow-md border border-green-200 relative">
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#dcf8c6] border-l border-t border-green-200 transform rotate-45"></div>
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                {mensagem}
              </pre>
              <div className="flex items-center justify-end gap-1 mt-3 text-xs text-gray-500">
                <span>{new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}</span>
                <CheckCircle className="w-4 h-4 text-blue-500" />
              </div>
            </div>

            {/* Links de localização clicáveis */}
            {locationLinks && <div className="mt-4 grid grid-cols-2 gap-3">
                <a href={locationLinks.mapsLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-800 text-sm">Google Maps</p>
                    <p className="text-xs text-blue-600">Abrir navegação</p>
                  </div>
                  <Navigation className="w-4 h-4 text-blue-500 ml-auto" />
                </a>
                <a href={locationLinks.wazeLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl border border-cyan-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-cyan-800 text-sm">Waze</p>
                    <p className="text-xs text-cyan-600">Navegar agora</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-500 ml-auto" />
                </a>
              </div>}

            {/* Info sobre simulação */}
            <div className="mt-4 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 flex-shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">
                  <span className="font-bold text-gray-700">Simulação:</span> Em produção, esta mensagem seria enviada automaticamente via WhatsApp Business API.
                </p>
              </div>
            </div>
          </div>

          {/* Footer com ações */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex gap-4">
              <button onClick={() => setModalWhatsApp({
              ...modalWhatsApp,
              isOpen: false
            })} className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 font-bold text-gray-700 transition-all duration-300 hover:scale-[1.02]">
                Cancelar
              </button>
              <button onClick={() => {
              console.log("📱 ENVIANDO WHATSAPP:", modalWhatsApp);

              // Criar notificação de enviado
              const notifEnviada: Notification = {
                id: `n${Date.now()}`,
                tipo: "sistema",
                titulo: "WhatsApp enviado",
                mensagem: `Mensagem de ${config.titulo.toLowerCase()} enviada para ${modalWhatsApp.destinatario}`,
                timestamp: new Date(),
                lida: false
              };
              setNotifications(prev => [notifEnviada, ...prev]);
              toast({
                title: "✅ WhatsApp Enviado",
                description: `Mensagem enviada para ${modalWhatsApp.destinatario}`
              });
              setModalWhatsApp({
                ...modalWhatsApp,
                isOpen: false
              });
            }} className={`flex-1 px-6 py-4 bg-gradient-to-r ${config.cor} text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3`}>
                <Send className="w-5 h-5" /> Enviar WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>;
  };

  // ===== FERIADOS NACIONAIS BRASILEIROS 2024/2025 =====
  const FERIADOS_NACIONAIS = [{
    data: "2024-01-01",
    nome: "Confraternização Universal",
    tipo: "feriado"
  }, {
    data: "2024-02-12",
    nome: "Carnaval",
    tipo: "feriado"
  }, {
    data: "2024-02-13",
    nome: "Carnaval",
    tipo: "feriado"
  }, {
    data: "2024-03-29",
    nome: "Sexta-feira Santa",
    tipo: "feriado"
  }, {
    data: "2024-04-21",
    nome: "Tiradentes",
    tipo: "feriado"
  }, {
    data: "2024-05-01",
    nome: "Dia do Trabalhador",
    tipo: "feriado"
  }, {
    data: "2024-05-30",
    nome: "Corpus Christi",
    tipo: "feriado"
  }, {
    data: "2024-09-07",
    nome: "Independência do Brasil",
    tipo: "feriado"
  }, {
    data: "2024-10-12",
    nome: "Nossa Sra. Aparecida",
    tipo: "feriado"
  }, {
    data: "2024-11-02",
    nome: "Finados",
    tipo: "feriado"
  }, {
    data: "2024-11-15",
    nome: "Proclamação da República",
    tipo: "feriado"
  }, {
    data: "2024-12-25",
    nome: "Natal",
    tipo: "feriado"
  }, {
    data: "2025-01-01",
    nome: "Confraternização Universal",
    tipo: "feriado"
  }, {
    data: "2025-03-03",
    nome: "Carnaval",
    tipo: "feriado"
  }, {
    data: "2025-03-04",
    nome: "Carnaval",
    tipo: "feriado"
  }, {
    data: "2025-04-18",
    nome: "Sexta-feira Santa",
    tipo: "feriado"
  }, {
    data: "2025-04-21",
    nome: "Tiradentes",
    tipo: "feriado"
  }, {
    data: "2025-05-01",
    nome: "Dia do Trabalhador",
    tipo: "feriado"
  }, {
    data: "2025-06-19",
    nome: "Corpus Christi",
    tipo: "feriado"
  }, {
    data: "2025-09-07",
    nome: "Independência do Brasil",
    tipo: "feriado"
  }, {
    data: "2025-10-12",
    nome: "Nossa Sra. Aparecida",
    tipo: "feriado"
  }, {
    data: "2025-11-02",
    nome: "Finados",
    tipo: "feriado"
  }, {
    data: "2025-11-15",
    nome: "Proclamação da República",
    tipo: "feriado"
  }, {
    data: "2025-12-25",
    nome: "Natal",
    tipo: "feriado"
  }];
  const DATAS_ALTA_DEMANDA = [{
    data: "2024-12-20",
    nome: "Véspera de Natal",
    tipo: "alta_demanda",
    motivo: "Eventos de confraternização"
  }, {
    data: "2024-12-21",
    nome: "Véspera de Natal",
    tipo: "alta_demanda",
    motivo: "Eventos de confraternização"
  }, {
    data: "2024-12-22",
    nome: "Véspera de Natal",
    tipo: "alta_demanda",
    motivo: "Eventos de confraternização"
  }, {
    data: "2024-12-23",
    nome: "Véspera de Natal",
    tipo: "alta_demanda",
    motivo: "Eventos de confraternização"
  }, {
    data: "2024-12-24",
    nome: "Véspera de Natal",
    tipo: "alta_demanda",
    motivo: "Eventos de confraternização"
  }, {
    data: "2024-12-31",
    nome: "Réveillon",
    tipo: "alta_demanda",
    motivo: "Festas de Ano Novo"
  }, {
    data: "2025-02-14",
    nome: "Valentine's Day",
    tipo: "alta_demanda",
    motivo: "Restaurantes e hotéis"
  }, {
    data: "2025-05-11",
    nome: "Dia das Mães",
    tipo: "alta_demanda",
    motivo: "Restaurantes lotados"
  }, {
    data: "2025-06-12",
    nome: "Dia dos Namorados",
    tipo: "alta_demanda",
    motivo: "Restaurantes e hotéis"
  }, {
    data: "2025-08-10",
    nome: "Dia dos Pais",
    tipo: "alta_demanda",
    motivo: "Restaurantes e comércio"
  }, {
    data: "2025-10-12",
    nome: "Dia das Crianças",
    tipo: "alta_demanda",
    motivo: "Eventos infantis"
  }, {
    data: "2025-11-28",
    nome: "Black Friday",
    tipo: "alta_demanda",
    motivo: "Comércio e logística"
  }, {
    data: "2025-11-29",
    nome: "Black Friday",
    tipo: "alta_demanda",
    motivo: "Comércio e logística"
  }, {
    data: "2025-12-20",
    nome: "Véspera de Natal",
    tipo: "alta_demanda",
    motivo: "Eventos de confraternização"
  }, {
    data: "2025-12-21",
    nome: "Véspera de Natal",
    tipo: "alta_demanda",
    motivo: "Eventos de confraternização"
  }, {
    data: "2025-12-22",
    nome: "Véspera de Natal",
    tipo: "alta_demanda",
    motivo: "Eventos de confraternização"
  }, {
    data: "2025-12-23",
    nome: "Véspera de Natal",
    tipo: "alta_demanda",
    motivo: "Eventos de confraternização"
  }, {
    data: "2025-12-24",
    nome: "Véspera de Natal",
    tipo: "alta_demanda",
    motivo: "Eventos de confraternização"
  }, {
    data: "2025-12-31",
    nome: "Réveillon",
    tipo: "alta_demanda",
    motivo: "Festas de Ano Novo"
  }];

  // ===== PÁGINA CALENDÁRIO =====
  const PaginaCalendario = () => {
    const [mesAtual, setMesAtual] = useState(new Date());
    const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const primeiroDiaMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);
    const ultimoDiaMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0);
    const diasNoMes = ultimoDiaMes.getDate();
    const primeiroDiaSemana = primeiroDiaMes.getDay();
    const formatarDataParaComparacao = (data: Date) => {
      return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
    };
    const getInfoDia = (dia: number) => {
      const dataStr = formatarDataParaComparacao(new Date(mesAtual.getFullYear(), mesAtual.getMonth(), dia));
      const feriado = FERIADOS_NACIONAIS.find(f => f.data === dataStr);
      const altaDemanda = DATAS_ALTA_DEMANDA.find(d => d.data === dataStr);
      const vagasNoDia = jobs.filter(j => j.data === dataStr);
      return {
        feriado,
        altaDemanda,
        vagasNoDia
      };
    };
    const navegarMes = (direcao: number) => {
      setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + direcao, 1));
    };
    const hoje = new Date();
    const ehHoje = (dia: number) => {
      return dia === hoje.getDate() && mesAtual.getMonth() === hoje.getMonth() && mesAtual.getFullYear() === hoje.getFullYear();
    };

    // Próximas datas importantes
    const proximasDatas = [...FERIADOS_NACIONAIS, ...DATAS_ALTA_DEMANDA].filter(d => new Date(d.data) >= hoje).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()).slice(0, 6);
    return <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-5xl font-black mb-2">
                <span className="gradient-text">Calendário</span> 📅
              </h2>
              <p className="text-gray-600 text-base sm:text-lg font-medium">
                Planeje suas contratações com base em feriados e datas de alta demanda
              </p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-bold border border-red-200">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span> Feriado
              </span>
              <span className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-xl text-sm font-bold border border-orange-200">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span> Alta Demanda
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendário Principal */}
          <div className="lg:col-span-2 glass rounded-3xl p-6 sm:p-8 animate-fade-in">
            {/* Navegação do mês */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => navegarMes(-1)} className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-all hover:scale-110">
                <ChevronDown className="w-6 h-6 rotate-90" />
              </button>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                {meses[mesAtual.getMonth()]} {mesAtual.getFullYear()}
              </h3>
              <button onClick={() => navegarMes(1)} className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-all hover:scale-110">
                <ChevronDown className="w-6 h-6 -rotate-90" />
              </button>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
              {diasSemana.map(dia => <div key={dia} className="text-center py-2 text-sm font-bold text-gray-500">
                  {dia}
                </div>)}
            </div>

            {/* Dias do mês */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* Dias vazios antes do primeiro dia */}
              {Array.from({
              length: primeiroDiaSemana
            }).map((_, idx) => <div key={`empty-${idx}`} className="aspect-square"></div>)}

              {/* Dias do mês */}
              {Array.from({
              length: diasNoMes
            }).map((_, idx) => {
              const dia = idx + 1;
              const info = getInfoDia(dia);
              const dataAtual = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), dia);
              const passado = dataAtual < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
              return <button key={dia} onClick={() => setDiaSelecionado(dataAtual)} className={`aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all duration-300 relative ${ehHoje(dia) ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105" : info.feriado ? "bg-gradient-to-br from-red-100 to-rose-100 border-2 border-red-300 hover:shadow-lg hover:shadow-red-500/20" : info.altaDemanda ? "bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-300 hover:shadow-lg hover:shadow-orange-500/20" : passado ? "bg-gray-50 text-gray-400" : "glass hover:bg-orange-50 hover:scale-105"}`}>
                    <span className={`text-sm sm:text-lg font-bold ${passado && !ehHoje(dia) ? "text-gray-400" : ""}`}>
                      {dia}
                    </span>
                    {/* Indicadores */}
                    <div className="flex gap-0.5">
                      {info.feriado && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>}
                      {info.altaDemanda && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full"></span>}
                      {info.vagasNoDia.length > 0 && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></span>}
                    </div>
                  </button>;
            })}
            </div>

            {/* Legenda */}
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span> Feriado
              </span>
              <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span> Alta demanda
              </span>
              <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span> Vagas publicadas
              </span>
              <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span> Hoje
              </span>
            </div>
          </div>

          {/* Sidebar - Próximas datas importantes */}
          <div className="space-y-6">
            {/* Próximas datas */}
            <div className="glass rounded-3xl p-6 animate-fade-in">
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" /> Próximas Datas
              </h3>
              <div className="space-y-3">
                {proximasDatas.map((data, idx) => {
                const dataObj = new Date(data.data);
                const diasAte = Math.ceil((dataObj.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
                return <div key={`${data.data}-${idx}`} className={`p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] ${data.tipo === "feriado" ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-200" : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200"}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`font-bold text-sm ${data.tipo === "feriado" ? "text-red-700" : "text-orange-700"}`}>
                            {data.nome}
                          </p>
                          <p className="text-xs text-gray-600">
                            {dataObj.toLocaleDateString("pt-BR", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short"
                        })}
                          </p>
                          {"motivo" in data && <p className="text-xs text-gray-500 mt-1">💡 {(data as {
                          motivo: string;
                        }).motivo}</p>}
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${diasAte <= 7 ? "bg-red-100 text-red-700" : diasAte <= 30 ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}>
                          {diasAte === 0 ? "Hoje" : diasAte === 1 ? "Amanhã" : `${diasAte} dias`}
                        </span>
                      </div>
                    </div>;
              })}
              </div>
            </div>

            {/* Dica de planejamento */}
            <div className="glass rounded-3xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-800 mb-2">Dica de Planejamento</h4>
                  <p className="text-sm text-blue-700">
                    Datas de alta demanda costumam ter <strong>30% mais vagas</strong> e os freelancers são contratados mais rapidamente. 
                    Publique suas vagas com <strong>antecedência de 3-5 dias</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Estatísticas do mês */}
            <div className="glass rounded-3xl p-6 animate-fade-in">
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" /> Este Mês
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-center">
                  <p className="text-2xl font-black text-red-600">
                    {FERIADOS_NACIONAIS.filter(f => {
                    const d = new Date(f.data);
                    return d.getMonth() === mesAtual.getMonth() && d.getFullYear() === mesAtual.getFullYear();
                  }).length}
                  </p>
                  <p className="text-xs font-bold text-red-700">Feriados</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 text-center">
                  <p className="text-2xl font-black text-orange-600">
                    {DATAS_ALTA_DEMANDA.filter(d => {
                    const dt = new Date(d.data);
                    return dt.getMonth() === mesAtual.getMonth() && dt.getFullYear() === mesAtual.getFullYear();
                  }).length}
                  </p>
                  <p className="text-xs font-bold text-orange-700">Alta Demanda</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
                  <p className="text-2xl font-black text-green-600">
                    {jobs.filter(j => {
                    const d = new Date(j.data);
                    return d.getMonth() === mesAtual.getMonth() && d.getFullYear() === mesAtual.getFullYear();
                  }).length}
                  </p>
                  <p className="text-xs font-bold text-green-700">Vagas</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 text-center">
                  <p className="text-2xl font-black text-purple-600">
                    {(() => {
                    const diasUteis = Array.from({
                      length: diasNoMes
                    }).filter((_, i) => {
                      const d = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), i + 1);
                      const dataStr = formatarDataParaComparacao(d);
                      return d.getDay() !== 0 && d.getDay() !== 6 && !FERIADOS_NACIONAIS.some(f => f.data === dataStr);
                    }).length;
                    return diasUteis;
                  })()}
                  </p>
                  <p className="text-xs font-bold text-purple-700">Dias Úteis</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de dia selecionado */}
        {diaSelecionado && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass rounded-3xl max-w-lg w-full p-8 animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    {diaSelecionado.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric"
                })}
                  </h3>
                </div>
                <button onClick={() => setDiaSelecionado(null)} className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {(() => {
            const dataStr = formatarDataParaComparacao(diaSelecionado);
            const feriado = FERIADOS_NACIONAIS.find(f => f.data === dataStr);
            const altaDemanda = DATAS_ALTA_DEMANDA.find(d => d.data === dataStr);
            const vagasNoDia = jobs.filter(j => j.data === dataStr);
            return <div className="space-y-4">
                    {feriado && <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border-2 border-red-200">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">🎉</span>
                          <div>
                            <p className="font-bold text-red-700">{feriado.nome}</p>
                            <p className="text-sm text-red-600">Feriado Nacional</p>
                          </div>
                        </div>
                      </div>}

                    {altaDemanda && <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">🔥</span>
                          <div>
                            <p className="font-bold text-orange-700">{altaDemanda.nome}</p>
                            <p className="text-sm text-orange-600">{altaDemanda.motivo}</p>
                          </div>
                        </div>
                      </div>}

                    {vagasNoDia.length > 0 ? <div className="space-y-3">
                        <p className="font-bold text-gray-700">Vagas neste dia:</p>
                        {vagasNoDia.map(vaga => <button key={vaga.id} onClick={() => {
                  setDiaSelecionado(null);
                  setSelectedJob(vaga);
                  setCurrentPage("vaga-detalhes");
                }} className="w-full p-4 glass rounded-2xl text-left hover:bg-orange-50 transition-all hover:scale-[1.02]">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-bold text-gray-900">{vaga.titulo}</p>
                                <p className="text-sm text-gray-600">{vaga.empresa} • {vaga.horarioEntrada} - {vaga.horarioSaida}</p>
                              </div>
                              <span className="text-lg font-black text-green-600">R$ {vaga.valorDiaria}</span>
                            </div>
                          </button>)}
                      </div> : <div className="text-center py-6">
                        <p className="text-gray-500 mb-4">Nenhuma vaga publicada para este dia</p>
                        <button onClick={() => {
                  setDiaSelecionado(null);
                  navegarPara("publicar");
                }} className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:scale-105 transition-all">
                          + Publicar Vaga
                        </button>
                      </div>}

                    {!feriado && !altaDemanda && vagasNoDia.length === 0 && <p className="text-center text-gray-400 py-4">Dia comum sem eventos especiais</p>}
                  </div>;
          })()}
            </div>
          </div>}
      </div>;
  };
  return <div className="min-h-screen bg-gray-50">
      <Header />
      {showMenu && <MobileMenu />}

      <main>
        {currentPage === "vagas" && <PaginaVagas />}
        {currentPage === "freelancers" && <PaginaBuscarFreelancers />}
        {currentPage === "carteira" && <PaginaCarteiraFreelancers />}
        {currentPage === "publicar" && <PaginaPublicarVaga />}
        {currentPage === "minhas-vagas" && <PaginaMinhasVagas />}
        {currentPage === "vaga-detalhes" && <PaginaVagaDetalhes />}
        {currentPage === "notificacoes" && <PaginaNotificacoes />}
        {currentPage === "pagamentos" && <PaginaPagamentos />}
        {currentPage === "calendario" && <PaginaCalendario />}
      </main>

      <Footer />
      <ModalWhatsApp />
      {selectedFreelancer && <ModalDetalhesFreelancer />}
    </div>;
}