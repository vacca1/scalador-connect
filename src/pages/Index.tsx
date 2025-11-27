import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Clock, MapPin, Calendar, DollarSign, User, 
  Bell, MessageSquare, Menu, Search, X, Plus, Check,
  TrendingUp, Users, Activity, ArrowRight, Phone, Navigation,
  AlertCircle, CheckCircle, XCircle, Timer, Send, Star,
  Edit, Settings, HelpCircle, LogOut, Filter, ChevronDown,
  Home, Wallet, FileText
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// ===== TIPOS E INTERFACES =====
type JobStatus = 'aberta' | 'aguardando_freelancer' | 'em_deslocamento' | 'em_andamento' | 'concluida' | 'cancelada';
type JobType = 'freelance' | 'temporario';

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
  status: JobStatus;
  publicadoEm: Date;
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

interface Notification {
  id: string;
  tipo: 'pagamento' | 'mensagem' | 'candidatura' | 'avaliacao' | 'checkin' | 'sistema';
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
  tipo: 'texto' | 'sistema' | 'whatsapp';
}

// ===== DADOS MOCKADOS =====
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    titulo: 'Auxiliar de Serviços Gerais',
    empresa: 'Scalador',
    logoEmpresa: '🏢',
    tipo: 'freelance',
    profissao: 'Auxiliar de serviços gerais',
    descricao: 'Precisamos de auxiliares para evento corporativo',
    atividades: [
      'Limpeza e organização do espaço',
      'Montagem de estruturas',
      'Suporte durante o evento'
    ],
    valorDiaria: 160.00,
    valorTotal: 320.00,
    taxaScalador: 32.00,
    valorComTaxa: 352.00,
    quantidadeFreelancers: 2,
    localizacao: {
      endereco: 'SAUS Quadra 4',
      cidade: 'Brasília',
      estado: 'DF',
      cep: '70070-040',
      coordenadas: { lat: -15.7942, lng: -47.8822 }
    },
    data: '2025-11-27',
    horarioEntrada: '10:30',
    horarioSaida: '22:30',
    vestimenta: 'Calça preta, camisa branca, sapato fechado',
    experienciaNecessaria: true,
    beneficios: ['Passagem', 'Alimentação'],
    status: 'aberta',
    publicadoEm: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: '2',
    titulo: 'Garçom para Evento',
    empresa: 'Restaurante Premium',
    logoEmpresa: '🍽️',
    tipo: 'freelance',
    profissao: 'Garçom',
    descricao: 'Evento de confraternização empresarial',
    atividades: [
      'Servir alimentos e bebidas',
      'Atendimento aos convidados',
      'Organização do buffet'
    ],
    valorDiaria: 200.00,
    valorTotal: 600.00,
    taxaScalador: 60.00,
    valorComTaxa: 660.00,
    quantidadeFreelancers: 3,
    localizacao: {
      endereco: 'Quadra 516 Bloco B, 66 - Asa Sul',
      cidade: 'Brasília',
      estado: 'DF',
      cep: '70000-000'
    },
    data: '2025-11-28',
    horarioEntrada: '18:00',
    horarioSaida: '23:00',
    vestimenta: 'Terno preto, gravata, sapato social',
    experienciaNecessaria: true,
    beneficios: ['Alimentação'],
    status: 'em_deslocamento',
    publicadoEm: new Date(Date.now() - 2 * 60 * 60 * 1000),
    freelancerSelecionado: {
      id: 'f1',
      nome: 'João Silva',
      foto: '👨',
      rating: 4.8,
      telefone: '(61) 98765-4321',
      tempoEstimadoChegada: '2:30h',
      horarioAceite: new Date(Date.now() - 30 * 60 * 1000),
    },
    tempoLimiteEmpresaCancelar: new Date(Date.now() + 10 * 60 * 1000),
  },
  {
    id: '3',
    titulo: 'Recepcionista',
    empresa: 'Hotel Central',
    logoEmpresa: '🏨',
    tipo: 'temporario',
    profissao: 'Recepcionista',
    descricao: 'Vaga temporária para cobertura de férias',
    atividades: [
      'Atendimento ao cliente',
      'Check-in e check-out',
      'Gestão de reservas'
    ],
    valorDiaria: 150.00,
    valorTotal: 150.00,
    taxaScalador: 15.00,
    valorComTaxa: 165.00,
    quantidadeFreelancers: 1,
    localizacao: {
      endereco: 'SHN Quadra 5',
      cidade: 'Brasília',
      estado: 'DF',
      cep: '70000-000'
    },
    data: '2025-11-29',
    horarioEntrada: '08:00',
    horarioSaida: '17:00',
    vestimenta: 'Social (blazer opcional)',
    experienciaNecessaria: false,
    beneficios: ['Vale transporte', 'Vale refeição'],
    status: 'aberta',
    publicadoEm: new Date(Date.now() - 1 * 60 * 60 * 1000),
  }
];

const MOCK_HISTORICO_FREELANCERS = [
  { id: 'h1', freelancerId: 'f1', nome: 'João Silva', jobId: '2', status: 'aceito', data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: 'h2', freelancerId: 'f2', nome: 'Maria Santos', jobId: '1', status: 'concluido', data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  { id: 'h3', freelancerId: 'f3', nome: 'Carlos Lima', jobId: '3', status: 'aceito', data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: 'h4', freelancerId: 'f4', nome: 'Ana Costa', jobId: '1', status: 'recusado', data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: 'h5', freelancerId: 'f5', nome: 'Pedro Oliveira', jobId: '2', status: 'cancelado_empresa', data: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
];

// ===== COMPONENTE PRINCIPAL =====
export default function Index() {
  const [currentPage, setCurrentPage] = useState('vagas');
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [saldoAtual, setSaldoAtual] = useState(500.00);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappData, setWhatsappData] = useState<any>(null);
  const [historicoFreelancers, setHistoricoFreelancers] = useState(MOCK_HISTORICO_FREELANCERS);
  const { toast } = useToast();

  // Filtros
  const [filtros, setFiltros] = useState({
    busca: '',
    tipo: 'todos',
    profissao: 'todas',
    estado: 'todos',
    experiencia: 'todas'
  });

  // Adicionar notificações automáticas
  useEffect(() => {
    const novasNotificacoes: Notification[] = [
      {
        id: 'n1',
        tipo: 'checkin',
        titulo: 'Freelancer a caminho',
        mensagem: 'João Silva aceitou a vaga e está se deslocando',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        lida: false,
        vagaId: '2'
      },
      {
        id: 'n2',
        tipo: 'pagamento',
        titulo: 'Pagamento realizado',
        mensagem: 'Seu pagamento foi aprovado com sucesso',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        lida: false
      }
    ];
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
    // Buscar job se tiver jobId
    const job = conteudo.jobId ? jobs.find(j => j.id === conteudo.jobId) : null;
    
    setWhatsappData({
      tipo,
      destinatario,
      conteudo,
      job: job || conteudo // Se não encontrar job, usa o próprio conteúdo como job
    });
    setShowWhatsAppModal(true);
  };

  const enviarWhatsApp = () => {
    console.log('📱 ENVIANDO WHATSAPP:', whatsappData);
    
    // Adicionar notificação de confirmação
    const novaNotif: Notification = {
      id: `n${Date.now()}`,
      tipo: 'sistema',
      titulo: 'WhatsApp enviado',
      mensagem: `Mensagem enviada para ${whatsappData.destinatario}`,
      timestamp: new Date(),
      lida: false
    };
    setNotifications(prev => [novaNotif, ...prev]);

    // Fechar modal e mostrar toast
    setShowWhatsAppModal(false);
    toast({
      title: "WhatsApp enviado!",
      description: `Mensagem enviada para ${whatsappData.destinatario}`,
    });

    // Simular resposta após alguns segundos
    setTimeout(() => {
      const respostaNotif: Notification = {
        id: `n${Date.now() + 1}`,
        tipo: 'mensagem',
        titulo: 'Resposta recebida',
        mensagem: `${whatsappData.destinatario} visualizou a mensagem`,
        timestamp: new Date(),
        lida: false
      };
      setNotifications(prev => [respostaNotif, ...prev]);
    }, 3000);
  };

  const publicarVaga = (dadosVaga: any) => {
    const novaVaga: Job = {
      ...dadosVaga,
      id: `job-${Date.now()}`,
      status: 'aberta' as JobStatus,
      publicadoEm: new Date(),
      taxaScalador: dadosVaga.valorTotal * 0.10,
      valorComTaxa: dadosVaga.valorTotal * 1.10
    };

    setJobs(prev => [novaVaga, ...prev]);
    setSaldoAtual(prev => prev - novaVaga.valorComTaxa);

    // Simular envio para freelancers via WhatsApp
    simularEnvioWhatsApp('nova_vaga', 'Todos os freelancers', {
      ...novaVaga,
      jobId: novaVaga.id
    });

    navegarPara('minhas-vagas');
  };

  const aceitarFreelancer = (jobId: string, freelancerId: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'em_deslocamento' as JobStatus,
          tempoLimiteEmpresaCancelar: new Date(Date.now() + 20 * 60 * 1000)
        };
      }
      return job;
    }));

    const job = jobs.find(j => j.id === jobId);
    if (job?.freelancerSelecionado) {
      simularEnvioWhatsApp('confirmacao_empresa', job.freelancerSelecionado.nome, {
        status: 'aprovado',
        mensagem: 'A empresa confirmou! Você pode se deslocar.'
      });
    }
  };

  const cancelarFreelancer = (jobId: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'aguardando_freelancer' as JobStatus,
          freelancerSelecionado: undefined,
          tempoLimiteEmpresaCancelar: undefined
        };
      }
      return job;
    }));

    simularEnvioWhatsApp('cancelamento', 'Freelancer', {
      mensagem: 'A empresa solicitou outro profissional'
    });
  };

  const confirmarChegada = (jobId: string, quem: 'freelancer' | 'empresa') => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    if (quem === 'freelancer') {
      simularEnvioWhatsApp('checkin_freelancer', job.empresa, {
        freelancer: job.freelancerSelecionado?.nome,
        mensagem: 'Freelancer chegou no local'
      });
    } else {
      setJobs(prev => prev.map(j => {
        if (j.id === jobId) {
          return { ...j, status: 'em_andamento' as JobStatus };
        }
        return j;
      }));
      
      simularEnvioWhatsApp('checkin_confirmado', job.freelancerSelecionado?.nome || '', {
        mensagem: 'Check-in confirmado pela empresa'
      });
    }
  };

  // ===== COMPONENTES DE UI =====
  const Header = () => (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 
            className="text-2xl font-bold text-indigo-600 cursor-pointer flex items-center gap-2"
            onClick={() => navegarPara('vagas')}
          >
            <span className="text-3xl">S</span> scalador
          </h1>
          <nav className="hidden md:flex gap-6">
            <button onClick={() => navegarPara('vagas')} className="text-gray-600 hover:text-indigo-600">Vagas</button>
            <button onClick={() => navegarPara('minhas-vagas')} className="text-gray-600 hover:text-indigo-600">Minhas Vagas</button>
            <button onClick={() => navegarPara('publicar')} className="text-gray-600 hover:text-indigo-600">Publicar Vaga</button>
            <button onClick={() => navegarPara('pagamentos')} className="text-gray-600 hover:text-indigo-600">Pagamentos</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg hidden md:block">
            <MessageSquare className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg relative"
            onClick={() => navegarPara('notificacoes')}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications.filter(n => !n.lida).length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          <button 
            className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold"
            onClick={() => setShowMenu(!showMenu)}
          >
            S
          </button>
        </div>
      </div>
      {showMenu && <MenuDropdown />}
    </header>
  );

  const MenuDropdown = () => (
    <div className="absolute right-4 top-16 bg-white rounded-lg shadow-xl border border-gray-200 w-64 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <div>
            <p className="font-semibold text-gray-900">Scalador</p>
            <p className="text-sm text-gray-500">contato.scalador@gmail.com</p>
          </div>
        </div>
      </div>
      <div className="py-2">
        <button onClick={() => navegarPara('publicar')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
          <Plus className="w-4 h-4" /> Publicar vaga
        </button>
        <button onClick={() => navegarPara('minhas-vagas')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
          <Briefcase className="w-4 h-4" /> Minhas Vagas
        </button>
        <button onClick={() => navegarPara('carteira')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
          <Wallet className="w-4 h-4" /> Minha Carteira
        </button>
        <button onClick={() => navegarPara('configuracoes')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
          <Settings className="w-4 h-4" /> Configurações
        </button>
        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
          <HelpCircle className="w-4 h-4" /> Preciso de ajuda
        </button>
        <hr className="my-2" />
        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>
    </div>
  );

  const Footer = () => (
    <footer className="bg-indigo-700 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">S</span> scalador
            </h3>
            <p className="text-indigo-200 text-sm mb-2">CNPJ: 41.264.266/0001-29</p>
            <p className="text-indigo-200 text-sm">Quadra Crs 516 Bloco B, 66 - Asa Sul, Brasília - DF</p>
            <p className="text-indigo-200 text-sm mt-4">© 2025 Scalador. Todos os direitos reservados</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contatos</h4>
            <p className="text-indigo-200 text-sm mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" /> (11) 92089-3500
            </p>
            <p className="text-indigo-200 text-sm flex items-center gap-2">
              📧 contato.scalador@gmail.com
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Soluções</h4>
            <ul className="space-y-2 text-indigo-200 text-sm">
              <li><button onClick={() => navegarPara('vagas')}>Vagas</button></li>
              <li><a href="#">Quero trabalhar</a></li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-indigo-200 hover:text-white">LinkedIn</a>
              <a href="#" className="text-indigo-200 hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-indigo-600 text-center text-indigo-200 text-sm">
          desenvolvido com 🔥 por Labi9
        </div>
      </div>
    </footer>
  );

  const JobCard = ({ job }: { job: Job }) => {
    const statusBadge = {
      aberta: { text: 'Vaga Aberta', color: 'bg-green-100 text-green-700' },
      aguardando_freelancer: { text: 'Aguardando', color: 'bg-yellow-100 text-yellow-700' },
      em_deslocamento: { text: 'Em Deslocamento', color: 'bg-blue-100 text-blue-700' },
      em_andamento: { text: 'Em Andamento', color: 'bg-purple-100 text-purple-700' },
      concluida: { text: 'Concluída', color: 'bg-gray-100 text-gray-700' },
      cancelada: { text: 'Cancelada', color: 'bg-red-100 text-red-700' }
    };

    return (
      <div 
        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => navegarPara('vaga-detalhes', job.id)}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
            {job.logoEmpresa}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm text-gray-500">{job.empresa}</p>
                <h3 className="text-lg font-semibold text-gray-800">{job.titulo}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge[job.status].color}`}>
                {statusBadge[job.status].text}
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 mb-3">
              R$ {job.valorDiaria.toFixed(2)} / dia
            </p>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.descricao}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">
                {job.tipo === 'freelance' ? 'Freelancer' : 'Temporário'}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {job.profissao}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {job.experienciaNecessaria ? 'Com experiência' : 'Sem experiência'}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {job.localizacao.cidade}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {new Date(job.data).toLocaleDateString('pt-BR')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {job.horarioEntrada} - {job.horarioSaida}
              </span>
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
      if (filtros.tipo !== 'todos' && job.tipo !== filtros.tipo) return false;
      return true;
    });

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Vagas Disponíveis</h2>
          <p className="text-gray-600">Encontre as melhores oportunidades</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Procure por trabalhos"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={filtros.busca}
                  onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                />
              </div>
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                Procurar
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filtros</h3>
              <button 
                onClick={() => setFiltros({ busca: '', tipo: 'todos', profissao: 'todas', estado: 'todos', experiencia: 'todas' })}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Limpar
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Vaga</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={filtros.tipo}
                  onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                >
                  <option value="todos">Todos os tipos</option>
                  <option value="freelance">Freelance</option>
                  <option value="temporario">Temporário</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profissão</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg">
                  <option>Todas as profissões</option>
                  <option>Auxiliar de serviços gerais</option>
                  <option>Garçom</option>
                  <option>Recepcionista</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experiência</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg">
                  <option>Todas</option>
                  <option>Com experiência</option>
                  <option>Sem experiência</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {jobsFiltrados.map(job => <JobCard key={job.id} job={job} />)}
        </div>

        {jobsFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma vaga encontrada com os filtros selecionados</p>
          </div>
        )}
      </div>
    );
  };

  const PaginaPublicarVaga = () => {
    const [step, setStep] = useState(1);
    const [tipoVaga, setTipoVaga] = useState<JobType | null>(null);
    const [formData, setFormData] = useState({
      titulo: '',
      profissao: '',
      descricao: '',
      valorDiaria: 0,
      quantidadeFreelancers: 1,
      data: '',
      horarioEntrada: '',
      horarioSaida: '',
      endereco: '',
      cidade: 'Brasília',
      estado: 'DF',
      cep: '',
      vestimenta: '',
      experienciaNecessaria: false,
      beneficios: [] as string[]
    });

    const valorTotal = formData.valorDiaria * formData.quantidadeFreelancers;
    const taxaScalador = valorTotal * 0.10;
    const valorComTaxa = valorTotal + taxaScalador;

    const handlePublicar = () => {
      if (!tipoVaga) return;

      const novaVaga = {
        titulo: formData.titulo || 'Nova Vaga',
        empresa: 'Scalador',
        logoEmpresa: '🏢',
        tipo: tipoVaga,
        profissao: formData.profissao || 'Não especificado',
        descricao: formData.descricao || 'Descrição não fornecida',
        atividades: [],
        valorDiaria: formData.valorDiaria,
        valorTotal: valorTotal,
        quantidadeFreelancers: formData.quantidadeFreelancers,
        localizacao: {
          endereco: formData.endereco,
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
      return (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Abra portas para <span className="text-indigo-600">talentos excepcionais</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Publique sua vaga e assista aos talentos se destacarem...
            </p>
          </div>

          <div className="text-center mb-8">
            <p className="text-gray-700 font-medium mb-6">Escolha o tipo de vaga</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <button
              onClick={() => { setTipoVaga('freelance'); setStep(2); }}
              className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-indigo-500 hover:shadow-lg transition-all text-left group"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-colors">
                <Briefcase className="w-6 h-6 text-indigo-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Freelance</h3>
              <p className="text-gray-600">
                Freelancers são profissionais temporários que oferecem à empresas a flexibilidade de contratar talentos sem necessidade de vínculo trabalhista.
              </p>
              <div className="mt-4 flex items-center text-indigo-600 font-medium">
                Selecionar <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </button>

            <button
              onClick={() => { setTipoVaga('temporario'); setStep(2); }}
              className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-indigo-500 hover:shadow-lg transition-all text-left group"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-colors">
                <Clock className="w-6 h-6 text-indigo-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vaga temporária</h3>
              <p className="text-gray-600">
                Vagas temporárias são posições de curto prazo que envolve a contratação de um funcionário por um período definido de tempo.
              </p>
              <div className="mt-4 flex items-center text-indigo-600 font-medium">
                Selecionar <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => setStep(1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          ← Voltar
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">Calcule seu orçamento</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título da vaga *</label>
              <input
                type="text"
                placeholder="Ex: Auxiliar de Serviços Gerais"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profissão *</label>
              <input
                type="text"
                placeholder="Ex: Auxiliar de serviços gerais"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={formData.profissao}
                onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição da vaga</label>
              <textarea
                rows={4}
                placeholder="Descreva as atividades e requisitos..."
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor da diária (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={formData.valorDiaria || ''}
                  onChange={(e) => setFormData({ ...formData, valorDiaria: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade de freelancers *</label>
                <input
                  type="number"
                  min="1"
                  placeholder="1"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={formData.quantidadeFreelancers}
                  onChange={(e) => setFormData({ ...formData, quantidadeFreelancers: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data do trabalho *</label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário de entrada *</label>
                <input
                  type="time"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={formData.horarioEntrada}
                  onChange={(e) => setFormData({ ...formData, horarioEntrada: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário de saída *</label>
                <input
                  type="time"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={formData.horarioSaida}
                  onChange={(e) => setFormData({ ...formData, horarioSaida: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Endereço completo *</label>
              <input
                type="text"
                placeholder="Rua, número, complemento"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vestimenta necessária</label>
              <input
                type="text"
                placeholder="Ex: Calça preta, camisa branca, sapato fechado"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={formData.vestimenta}
                onChange={(e) => setFormData({ ...formData, vestimenta: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="experiencia"
                checked={formData.experienciaNecessaria}
                onChange={(e) => setFormData({ ...formData, experienciaNecessaria: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <label htmlFor="experiencia" className="text-sm text-gray-700">
                Experiência necessária
              </label>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Resumo do Investimento</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Saldo atual:</span>
                  <span className="font-semibold text-gray-900">R$ {saldoAtual.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor total:</span>
                  <span className="font-semibold text-gray-900">R$ {valorTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxa Scalador (10%):</span>
                  <span className="font-semibold text-red-600">+ R$ {taxaScalador.toFixed(2)}</span>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Seu investimento:</span>
                    <span className="font-bold text-red-600">- R$ {valorComTaxa.toFixed(2)}</span>
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

              <button
                onClick={handlePublicar}
                disabled={!formData.titulo || !formData.valorDiaria || !formData.data}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Publicar Vaga
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Ao publicar, você concorda com nossos termos de serviço
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PaginaMinhasVagas = () => {
    const [periodoFiltro, setPeriodoFiltro] = useState<'7dias' | '30dias' | '90dias' | 'ano'>('30dias');
    const [visualizacao, setVisualizacao] = useState<'visao-geral' | 'financeiro' | 'freelancers' | 'vagas' | 'relatorios'>('visao-geral');

    // ===== CÁLCULOS DE MÉTRICAS =====
    const hoje = new Date();
    const diasFiltro = periodoFiltro === '7dias' ? 7 : periodoFiltro === '30dias' ? 30 : periodoFiltro === '90dias' ? 90 : 365;
    const dataInicio = new Date(hoje.getTime() - diasFiltro * 24 * 60 * 60 * 1000);

    const vagasFiltradas = jobs.filter(j => j.publicadoEm >= dataInicio);
    const gastoTotal = vagasFiltradas.reduce((acc, j) => acc + j.valorComTaxa, 0);
    const gastoMedio = vagasFiltradas.length > 0 ? gastoTotal / vagasFiltradas.length : 0;

    const vagasPreenchidas = vagasFiltradas.filter(j => j.status === 'concluida' || j.status === 'em_andamento').length;
    const vagasAbertas = vagasFiltradas.filter(j => j.status === 'aberta' || j.status === 'aguardando_freelancer').length;
    const vagasCanceladas = vagasFiltradas.filter(j => j.status === 'cancelada').length;
    const taxaPreenchimento = vagasFiltradas.length > 0 ? (vagasPreenchidas / vagasFiltradas.length) * 100 : 0;

    const freelancersAceitos = historicoFreelancers.filter(f => f.status === 'aceito' || f.status === 'concluido').length;
    const freelancersRecusados = historicoFreelancers.filter(f => f.status === 'recusado').length;
    const freelancersCancelados = historicoFreelancers.filter(f => f.status === 'cancelado_empresa').length;
    const taxaAceitacao = (freelancersAceitos + freelancersRecusados) > 0 ? (freelancersAceitos / (freelancersAceitos + freelancersRecusados)) * 100 : 0;

    // Dados para gráficos
    const gastosPorMes = [
      { mes: 'Jul', valor: 320, vagas: 2 },
      { mes: 'Ago', valor: 450, vagas: 3 },
      { mes: 'Set', valor: 380, vagas: 2 },
      { mes: 'Out', valor: 520, vagas: 4 },
      { mes: 'Nov', valor: gastoTotal, vagas: vagasFiltradas.length }
    ];

    const vagasPorStatus = [
      { status: 'Concluídas', quantidade: vagasPreenchidas, cor: 'bg-green-500' },
      { status: 'Em Aberto', quantidade: vagasAbertas, cor: 'bg-blue-500' },
      { status: 'Em Andamento', quantidade: jobs.filter(j => j.status === 'em_andamento' || j.status === 'em_deslocamento').length, cor: 'bg-purple-500' },
      { status: 'Canceladas', quantidade: vagasCanceladas, cor: 'bg-red-500' }
    ];

    const topProfissoes = [
      { profissao: 'Garçom', vagas: 5, gasto: 1000, mediaAvaliacao: 4.8 },
      { profissao: 'Auxiliar de Serviços', vagas: 3, gasto: 480, mediaAvaliacao: 4.5 },
      { profissao: 'Recepcionista', vagas: 2, gasto: 300, mediaAvaliacao: 4.9 }
    ];

    const freelancersRanking = [
      { id: 'f1', nome: 'João Silva', foto: '👨', vagas: 8, rating: 4.8, valorTotal: 1600, pontualidade: 95 },
      { id: 'f3', nome: 'Carlos Lima', foto: '👨‍💼', vagas: 5, rating: 5.0, valorTotal: 750, pontualidade: 100 },
      { id: 'f2', nome: 'Maria Santos', foto: '👩', vagas: 3, rating: 4.5, valorTotal: 450, pontualidade: 90 }
    ];

    const alertasUrgentes = [
      { id: 'a1', tipo: 'pagamento', mensagem: 'Pagamento pendente: R$ 200,00', urgencia: 'alta' },
      { id: 'a2', tipo: 'vaga', mensagem: '2 vagas sem candidatos há 24h', urgencia: 'media' },
      { id: 'a3', tipo: 'checkin', mensagem: 'Freelancer aguardando confirmação', urgencia: 'alta' }
    ];

    // ===== COMPONENTE: CARD DE MÉTRICA =====
    const MetricCard = ({ titulo, valor, subtitulo, icone, cor, tendencia }: any) => (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600 text-sm font-medium">{titulo}</span>
          <div className={`w-10 h-10 rounded-lg ${cor} bg-opacity-10 flex items-center justify-center`}>
            {icone}
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{valor}</p>
        {subtitulo && <p className="text-sm text-gray-500">{subtitulo}</p>}
        {tendencia && (
          <div className={`mt-2 text-xs font-medium ${tendencia > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {tendencia > 0 ? '↗' : '↘'} {Math.abs(tendencia).toFixed(1)}% vs período anterior
          </div>
        )}
      </div>
    );

    // ===== COMPONENTE: GRÁFICO DE BARRAS SIMPLES =====
    const BarChart = ({ data, label }: { data: any[]; label: string }) => {
      const maxValor = Math.max(...data.map(d => d.valor));
      return (
        <div className="space-y-3">
          {data.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-700 font-medium">{item.mes}</span>
                <span className="text-gray-900 font-bold">R$ {item.valor.toFixed(0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(item.valor / maxValor) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      );
    };

    // ===== COMPONENTE: GRÁFICO DE PIZZA (simulado com barras) =====
    const PieChart = ({ data }: { data: any[] }) => {
      const total = data.reduce((acc, d) => acc + d.quantidade, 0);
      return (
        <div className="space-y-3">
          {data.map((item, idx) => {
            const porcentagem = total > 0 ? (item.quantidade / total) * 100 : 0;
            return (
              <div key={idx}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.cor}`}></div>
                    <span className="text-gray-700 font-medium">{item.status}</span>
                  </div>
                  <span className="text-gray-900 font-bold">{item.quantidade} ({porcentagem.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${item.cor} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${porcentagem}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      );
    };

    // ===== VISÃO GERAL =====
    const VisaoGeral = () => (
      <div className="space-y-6">
        {/* Alertas Urgentes */}
        {alertasUrgentes.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-4">
            <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Alertas Urgentes
            </h3>
            <div className="space-y-2">
              {alertasUrgentes.map(alerta => (
                <div key={alerta.id} className={`flex items-center justify-between p-2 rounded ${
                  alerta.urgencia === 'alta' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  <span className="text-sm font-medium text-gray-800">{alerta.mensagem}</span>
                  <button className="px-3 py-1 bg-white rounded text-xs font-medium hover:bg-gray-50">
                    Resolver
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            titulo="Gastos no Período"
            valor={`R$ ${gastoTotal.toFixed(2)}`}
            subtitulo={`${vagasFiltradas.length} vagas`}
            icone={<DollarSign className="w-5 h-5 text-green-600" />}
            cor="bg-green-500"
            tendencia={15.5}
          />
          <MetricCard
            titulo="Taxa de Preenchimento"
            valor={`${taxaPreenchimento.toFixed(0)}%`}
            subtitulo={`${vagasPreenchidas} de ${vagasFiltradas.length} vagas`}
            icone={<TrendingUp className="w-5 h-5 text-indigo-600" />}
            cor="bg-indigo-500"
            tendencia={8.2}
          />
          <MetricCard
            titulo="Taxa de Aceitação"
            valor={`${taxaAceitacao.toFixed(0)}%`}
            subtitulo={`${freelancersAceitos} aceitos`}
            icone={<CheckCircle className="w-5 h-5 text-purple-600" />}
            cor="bg-purple-500"
            tendencia={-3.1}
          />
          <MetricCard
            titulo="Custo Médio/Vaga"
            valor={`R$ ${gastoMedio.toFixed(2)}`}
            subtitulo="Últimas vagas"
            icone={<Activity className="w-5 h-5 text-orange-600" />}
            cor="bg-orange-500"
          />
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
              <Briefcase className="w-5 h-5 text-purple-600" /> Vagas por Status
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
                {topProfissoes.map((prof, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{prof.profissao}</td>
                    <td className="px-4 py-3 text-gray-600">{prof.vagas}</td>
                    <td className="px-4 py-3 text-green-600 font-semibold">R$ {prof.gasto.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{prof.mediaAvaliacao}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    // ===== ANÁLISE FINANCEIRA =====
    const AnaliseFinanceira = () => {
      const taxaScaladorTotal = vagasFiltradas.reduce((acc, j) => acc + j.taxaScalador, 0);
      const valorLiquidoFreelancers = vagasFiltradas.reduce((acc, j) => acc + j.valorTotal, 0);

      return (
        <div className="space-y-6">
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

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-purple-100 text-sm">Taxa Scalador</p>
                  <p className="text-3xl font-bold">R$ {taxaScaladorTotal.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-purple-100 text-xs">10% sobre o valor total</p>
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
                  {vagasFiltradas.map(vaga => (
                    <tr key={vaga.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{vaga.titulo}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{new Date(vaga.data).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3 text-gray-600">{vaga.quantidadeFreelancers}x</td>
                      <td className="px-4 py-3 text-gray-900">R$ {vaga.valorTotal.toFixed(2)}</td>
                      <td className="px-4 py-3 text-orange-600">R$ {vaga.taxaScalador.toFixed(2)}</td>
                      <td className="px-4 py-3 font-bold text-green-600">R$ {vaga.valorComTaxa.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 font-bold">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-gray-900">TOTAL</td>
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
                const porcentagem = gastoTotal > 0 ? (prof.gasto / gastoTotal) * 100 : 0;
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">{prof.profissao}</span>
                      <span className="text-gray-900 font-bold">R$ {prof.gasto} ({porcentagem.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${porcentagem}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    };

    // ===== RANKING DE FREELANCERS =====
    const RankingFreelancers = () => (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">🏆 Ranking de Freelancers</h2>
          <p className="text-purple-100">Os melhores profissionais que trabalharam com você</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {freelancersRanking.slice(0, 3).map((freelancer, idx) => (
            <div key={freelancer.id} className={`bg-white rounded-lg border-2 p-6 ${
              idx === 0 ? 'border-yellow-400 shadow-lg' : 'border-gray-200'
            }`}>
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
            </div>
          ))}
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
                {freelancersRanking.map((freelancer, idx) => (
                  <tr key={freelancer.id} className="hover:bg-gray-50">
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
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${freelancer.pontualidade}%` }}
                          ></div>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    // ===== ANÁLISE DE VAGAS =====
    const AnaliseVagas = () => {
      const vagasPorDia = [
        { dia: 'Seg', quantidade: 2 },
        { dia: 'Ter', quantidade: 1 },
        { dia: 'Qua', quantidade: 3 },
        { dia: 'Qui', quantidade: 2 },
        { dia: 'Sex', quantidade: 4 },
        { dia: 'Sáb', quantidade: 1 },
        { dia: 'Dom', quantidade: 0 }
      ];

      const maxVagas = Math.max(...vagasPorDia.map(d => d.quantidade));

      return (
        <div className="space-y-6">
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
              {vagasPorDia.map((dia, idx) => (
                <div key={idx} className="text-center">
                  <div className="mb-2">
                    <div 
                      className="mx-auto bg-indigo-500 rounded-t"
                      style={{ 
                        height: `${(dia.quantidade / maxVagas) * 120}px`,
                        width: '40px',
                        minHeight: dia.quantidade > 0 ? '20px' : '0'
                      }}
                    ></div>
                  </div>
                  <p className="text-xs font-medium text-gray-600">{dia.dia}</p>
                  <p className="text-sm font-bold text-gray-900">{dia.quantidade}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Calendário de Próximas Vagas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">🗓️ Calendário de Vagas</h3>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(30)].map((_, idx) => {
                const temVaga = idx === 5 || idx === 12 || idx === 20;
                return (
                  <div 
                    key={idx}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium ${
                      temVaga 
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-100 border-2 border-indigo-500 rounded"></div>
                <span className="text-gray-600">Dia com vaga agendada</span>
              </div>
            </div>
          </div>
        </div>
      );
    };

    // ===== RELATÓRIOS =====
    const Relatorios = () => (
      <div className="space-y-6">
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
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
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
              <span className="font-medium text-green-600">{vagasPreenchidas} ({taxaPreenchimento.toFixed(0)}%)</span>
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
      </div>
    );

    // ===== RENDER PRINCIPAL =====
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Dashboard Completo</h1>
          <p className="text-gray-600">Análise completa do seu negócio na Scalador</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Período:</span>
            <div className="flex gap-2">
              {['7dias', '30dias', '90dias', 'ano'].map((periodo) => (
                <button
                  key={periodo}
                  onClick={() => setPeriodoFiltro(periodo as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    periodoFiltro === periodo
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {periodo === '7dias' ? '7 dias' : periodo === '30dias' ? '30 dias' : periodo === '90dias' ? '90 dias' : 'Ano'}
                </button>
              ))}
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
            {[
              { id: 'visao-geral', label: 'Visão Geral', icon: <Activity className="w-4 h-4" /> },
              { id: 'financeiro', label: 'Financeiro', icon: <DollarSign className="w-4 h-4" /> },
              { id: 'freelancers', label: 'Freelancers', icon: <Users className="w-4 h-4" /> },
              { id: 'vagas', label: 'Vagas', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'relatorios', label: 'Relatórios', icon: <FileText className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setVisualizacao(tab.id as any)}
                className={`flex-1 min-w-[120px] py-4 px-6 font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
                  visualizacao === tab.id
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo */}
        {visualizacao === 'visao-geral' && <VisaoGeral />}
        {visualizacao === 'financeiro' && <AnaliseFinanceira />}
        {visualizacao === 'freelancers' && <RankingFreelancers />}
        {visualizacao === 'vagas' && <AnaliseVagas />}
        {visualizacao === 'relatorios' && <Relatorios />}
      </div>
    );
  };

  const PaginaVagaDetalhes = () => {
    if (!selectedJob) return null;

    const job = jobs.find(j => j.id === selectedJob.id) || selectedJob;

    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => navegarPara('vagas')} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          ← Voltar para vagas
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
              {job.logoEmpresa}
            </div>
            <div className="flex-1">
              <p className="text-indigo-600 font-medium mb-1">{job.empresa}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.titulo}</h1>
              <p className="text-sm text-gray-500">
                publicado há: {Math.floor((Date.now() - job.publicadoEm.getTime()) / (1000 * 60 * 60))} horas
              </p>
            </div>
          </div>

          {job.status === 'em_deslocamento' && job.freelancerSelecionado && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">🚶 Freelancer a caminho</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{job.freelancerSelecionado.foto}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{job.freelancerSelecionado.nome}</p>
                      <p className="text-sm text-gray-600">{job.freelancerSelecionado.telefone}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1,2,3,4,5].map(i => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i <= job.freelancerSelecionado!.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">{job.freelancerSelecionado.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-blue-700 mt-3">
                    ⏱️ Tempo estimado de chegada: <strong>{job.freelancerSelecionado.tempoEstimadoChegada}</strong>
                  </p>
                </div>
                {job.tempoLimiteEmpresaCancelar && new Date() < job.tempoLimiteEmpresaCancelar && (
                  <button
                    onClick={() => cancelarFreelancer(job.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm"
                  >
                    Solicitar outro
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => simularEnvioWhatsApp('mensagem_empresa', job.freelancerSelecionado!.nome, { 
                    texto: 'Olá! Estamos aguardando você.',
                    jobId: job.id
                  })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  <Phone className="w-4 h-4" /> Enviar WhatsApp
                </button>
                <button
                  onClick={() => confirmarChegada(job.id, 'empresa')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                  <CheckCircle className="w-4 h-4" /> Confirmar Chegada
                </button>
              </div>

              {job.tempoLimiteEmpresaCancelar && (
                <p className="text-xs text-gray-600 text-center mt-3">
                  ⚠️ Você tem até {new Date(job.tempoLimiteEmpresaCancelar).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} para cancelar
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-4">SOBRE A VAGA</h2>
              <p className="text-gray-700 mb-6">{job.descricao}</p>

              {job.atividades.length > 0 && (
                <>
                  <h3 className="font-semibold text-gray-900 mb-3">Atividades:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                    {job.atividades.map((atividade, idx) => (
                      <li key={idx}>{atividade}</li>
                    ))}
                  </ul>
                </>
              )}

              <div className="bg-gray-50 rounded-lg p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">PERGUNTAS FREQUENTES</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">É necessário ter experiência?</p>
                    <p className="text-gray-600">{job.experienciaNecessaria ? 'Sim' : 'Não'}</p>
                  </div>
                  {job.beneficios.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Quais são os benefícios inclusos?</p>
                      <p className="text-gray-600">{job.beneficios.join(', ')}</p>
                    </div>
                  )}
                  {job.vestimenta && (
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Qual é o padrão de apresentação?</p>
                      <p className="text-gray-600">{job.vestimenta}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">INFORMAÇÕES DA VAGA</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Remuneração</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {job.valorDiaria.toFixed(2)} / dia
                    </p>
                    <p className="text-xs text-gray-500">
                      (R$ {(job.valorDiaria * 0.98).toFixed(2)} / dia com taxas incluídas)
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Tipo de Vaga</p>
                      <p className="font-medium text-gray-900">
                        {job.tipo === 'freelance' ? 'Vaga Freelancer' : 'Vaga Temporária'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Profissão</p>
                      <p className="font-medium text-gray-900">{job.profissao}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Localização</p>
                      <p className="font-medium text-gray-900">{job.localizacao.endereco}</p>
                      <p className="text-sm text-gray-600">{job.localizacao.cidade} - {job.localizacao.estado}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Data</p>
                      <p className="font-medium text-gray-900">
                        {new Date(job.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Horário</p>
                      <p className="font-medium text-gray-900">
                        {job.horarioEntrada} - {job.horarioSaida}
                      </p>
                    </div>
                  </div>

                  {job.localizacao.coordenadas && (
                    <button
                      onClick={() => window.open(`https://www.google.com/maps?q=${job.localizacao.coordenadas!.lat},${job.localizacao.coordenadas!.lng}`, '_blank')}
                      className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                    >
                      <Navigation className="w-4 h-4" /> Ver no Mapa
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PaginaNotificacoes = () => {
    const marcarComoLida = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
    };

    const iconeNotificacao = (tipo: Notification['tipo']) => {
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

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Notificações</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm">
              Todas <span className="ml-1 px-2 py-0.5 bg-white text-indigo-600 rounded-full text-xs">{notifications.length}</span>
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm">
              Apenas mensagens <span className="ml-1 px-2 py-0.5 bg-gray-200 rounded-full text-xs">
                {notifications.filter(n => n.tipo === 'mensagem').length}
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                !notif.lida ? 'border-l-4 border-l-indigo-600' : ''
              }`}
              onClick={() => marcarComoLida(notif.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notif.tipo === 'pagamento' ? 'bg-green-100' :
                  notif.tipo === 'mensagem' ? 'bg-blue-100' :
                  notif.tipo === 'checkin' ? 'bg-indigo-100' :
                  'bg-gray-100'
                }`}>
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
                  {notif.vagaId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navegarPara('vaga-detalhes', notif.vagaId);
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-2"
                    >
                      Ver vaga →
                    </button>
                  )}
                </div>
                {!notif.lida && (
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma notificação ainda</p>
          </div>
        )}
      </div>
    );
  };

  const PaginaPagamentos = () => {
    const [valor, setValor] = useState(0);

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pague seus freelancers de <span className="text-indigo-600">forma segura</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Pague seus freelancers de forma segura e rápida, sem burocracia.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">R$</span>
              <input
                type="number"
                step="0.01"
                placeholder="00,00"
                className="w-full pl-12 pr-4 py-4 text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={valor || ''}
                onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Esse valor multiplicará pela quantidade de freelancers escolhidos.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              💰 Saldo disponível: <strong>R$ {saldoAtual.toFixed(2)}</strong>
            </p>
          </div>

          <button
            disabled={valor === 0 || valor > saldoAtual}
            onClick={() => {
              setSaldoAtual(prev => prev - valor);
              simularEnvioWhatsApp('pagamento', 'Freelancers', { valor });
              setValor(0);
              navegarPara('minhas-vagas');
            }}
            className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  };

  // ===== COMPONENTE MODAL WHATSAPP =====
  const ModalWhatsApp = () => {
    if (!whatsappData) return null;

    const formatarMensagem = () => {
      const { tipo, conteudo, job } = whatsappData;

      if (tipo === 'nova_vaga') {
        const vaga = job || conteudo;
        const googleMapsUrl = vaga.localizacao?.coordenadas 
          ? `https://www.google.com/maps?q=${vaga.localizacao.coordenadas.lat},${vaga.localizacao.coordenadas.lng}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vaga.localizacao?.endereco || vaga.local)}`;
        
        const wazeUrl = vaga.localizacao?.coordenadas
          ? `https://waze.com/ul?ll=${vaga.localizacao.coordenadas.lat},${vaga.localizacao.coordenadas.lng}&navigate=yes`
          : `https://waze.com/ul?q=${encodeURIComponent(vaga.localizacao?.endereco || vaga.local)}`;

        return {
          titulo: '🎯 NOVA VAGA DISPONÍVEL',
          linhas: [
            `📋 *${vaga.titulo || conteudo.titulo}*`,
            `💰 Valor: R$ ${(vaga.valorDiaria || conteudo.valor)?.toFixed(2)}/dia`,
            `📍 Local: ${vaga.localizacao?.cidade || conteudo.local}`,
            `📅 Data: ${vaga.data || conteudo.data}`,
            `⏰ Horário: ${vaga.horarioEntrada || conteudo.horario?.split(' - ')[0]} - ${vaga.horarioSaida || conteudo.horario?.split(' - ')[1]}`,
            vaga.vestimenta && `👔 Vestimenta: ${vaga.vestimenta}`,
          ].filter(Boolean),
          links: [
            { texto: '📍 Google Maps', url: googleMapsUrl },
            { texto: '🚗 Waze', url: wazeUrl }
          ]
        };
      }

      if (tipo === 'confirmacao_empresa') {
        return {
          titulo: '✅ VAGA CONFIRMADA',
          linhas: [
            `Olá! A empresa *confirmou sua participação*.`,
            ``,
            `Você pode se deslocar para o local da vaga.`,
            ``,
            `Boa sorte! 🚀`
          ]
        };
      }

      if (tipo === 'mensagem_empresa') {
        return {
          titulo: '💬 MENSAGEM DA EMPRESA',
          linhas: [
            conteudo.texto || 'Olá! Estamos aguardando você.'
          ]
        };
      }

      if (tipo === 'cancelamento') {
        return {
          titulo: '⚠️ VAGA CANCELADA',
          linhas: [
            `Infelizmente a empresa solicitou outro profissional.`,
            ``,
            `Mas não se preocupe, novas oportunidades surgirão em breve!`
          ]
        };
      }

      return {
        titulo: '📱 MENSAGEM',
        linhas: [conteudo.mensagem || 'Mensagem do sistema']
      };
    };

    const mensagemFormatada = formatarMensagem();

    return (
      <Dialog open={showWhatsAppModal} onOpenChange={setShowWhatsAppModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              Enviar via WhatsApp
            </DialogTitle>
            <DialogDescription>
              Para: {whatsappData.destinatario}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-semibold text-green-700 mb-3">{mensagemFormatada.titulo}</p>
              {mensagemFormatada.linhas.map((linha, idx) => (
                <p key={idx} className="text-sm text-gray-700 mb-1">{linha}</p>
              ))}
              
              {mensagemFormatada.links && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">🗺️ LOCALIZAÇÃO:</p>
                  {mensagemFormatada.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-600 hover:text-blue-700 underline mb-1"
                    >
                      {link.texto}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowWhatsAppModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={enviarWhatsApp}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // ===== RENDER PRINCIPAL =====
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {currentPage === 'vagas' && <PaginaVagas />}
        {currentPage === 'publicar' && <PaginaPublicarVaga />}
        {currentPage === 'minhas-vagas' && <PaginaMinhasVagas />}
        {currentPage === 'vaga-detalhes' && <PaginaVagaDetalhes />}
        {currentPage === 'notificacoes' && <PaginaNotificacoes />}
        {currentPage === 'pagamentos' && <PaginaPagamentos />}
      </main>

      <Footer />
      <ModalWhatsApp />
    </div>
  );
}
