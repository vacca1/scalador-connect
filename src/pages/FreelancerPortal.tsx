import { useState } from "react";
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
  Building2,
  Award,
  TrendingUp,
  Phone,
  Mail,
  Plus,
  Trash2,
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
import scaladorLogo from "@/assets/scalador-logo.png";

// Mock data for jobs
const vagasDisponiveis = [
  {
    id: 1,
    empresa: "Restaurante Sabor & Arte",
    logo: "🍽️",
    titulo: "Garçom/Garçonete",
    tipo: "Freelancer",
    bairro: "Asa Norte",
    cidade: "Brasília - DF",
    valor: 180,
    horario: "18:00 às 23:00",
    data: "20/12/2025",
    atividades: ["Atendimento ao cliente", "Servir pratos e bebidas", "Organização de mesas"],
    beneficios: ["Refeição inclusa", "Gorjeta"],
    distancia: 2.5,
  },
  {
    id: 2,
    empresa: "Hotel Grand Brasília",
    logo: "🏨",
    titulo: "Recepcionista",
    tipo: "Freelancer",
    bairro: "Asa Sul",
    cidade: "Brasília - DF",
    valor: 200,
    horario: "07:00 às 15:00",
    data: "21/12/2025",
    atividades: ["Check-in e check-out", "Atendimento telefônico", "Gestão de reservas"],
    beneficios: ["Refeição inclusa", "Transporte"],
    distancia: 4.2,
  },
  {
    id: 3,
    empresa: "Buffet Elegance",
    logo: "🎉",
    titulo: "Auxiliar de Cozinha",
    tipo: "Freelancer",
    bairro: "Taguatinga",
    cidade: "Brasília - DF",
    valor: 150,
    horario: "14:00 às 22:00",
    data: "22/12/2025",
    atividades: ["Preparação de alimentos", "Organização da cozinha", "Apoio ao chef"],
    beneficios: ["Refeição inclusa"],
    distancia: 12.0,
  },
];

const minhasCandidaturas = [
  {
    id: 1,
    empresa: "Bar do João",
    titulo: "Barman",
    status: "aceito",
    data: "18/12/2025",
    valor: 220,
  },
  {
    id: 2,
    empresa: "Restaurante Italiano",
    titulo: "Garçom",
    status: "aguardando",
    data: "19/12/2025",
    valor: 180,
  },
  {
    id: 3,
    empresa: "Café Central",
    titulo: "Atendente",
    status: "recusado",
    data: "17/12/2025",
    valor: 120,
  },
];

const historicoPagamentos = [
  { id: 1, data: "15/12/2025", empresa: "Restaurante Sabor & Arte", valor: 180, status: "Pago" },
  { id: 2, data: "10/12/2025", empresa: "Hotel Grand Brasília", valor: 200, status: "Pago" },
  { id: 3, data: "05/12/2025", empresa: "Buffet Elegance", valor: 300, status: "Pago" },
  { id: 4, data: "01/12/2025", empresa: "Bar do João", valor: 220, status: "Pago" },
];

const bairrosBrasilia = [
  "Asa Norte", "Asa Sul", "Taguatinga", "Ceilândia", "Gama",
  "Águas Claras", "Samambaia", "Guará", "Sudoeste", "Lago Norte",
];

const profissoes = [
  "Garçom/Garçonete", "Barman", "Recepcionista", "Auxiliar de Cozinha",
  "Promotor de Vendas", "Copeiro", "Segurança", "Manobrista",
];

const FreelancerPortal = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("vagas");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBairro, setSelectedBairro] = useState("");
  const [selectedProfissao, setSelectedProfissao] = useState("");
  const [selectedDistancia, setSelectedDistancia] = useState("");
  const [valorMinimo, setValorMinimo] = useState("");

  // Profile state
  const [perfilNome, setPerfilNome] = useState("João Silva");
  const [perfilTelefone, setPerfilTelefone] = useState("(61) 99999-9999");
  const [perfilCPF, setPerfilCPF] = useState("123.456.789-00");
  const [perfilNascimento, setPerfilNascimento] = useState("1990-05-15");
  const [perfilProfissao, setPerfilProfissao] = useState("Garçom/Garçonete");
  const [perfilHabilidades, setPerfilHabilidades] = useState(["Atendimento ao cliente", "Inglês básico", "Trabalho em equipe"]);
  const [novaHabilidade, setNovaHabilidade] = useState("");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "vagas", label: "Vagas Disponíveis", icon: Briefcase },
    { id: "candidaturas", label: "Minhas Candidaturas", icon: FileText },
    { id: "ativos", label: "Trabalhos Ativos", icon: Clock },
    { id: "historico", label: "Histórico", icon: CheckCircle },
    { id: "ganhos", label: "Meus Ganhos", icon: DollarSign },
    { id: "perfil", label: "Meu Perfil", icon: User },
    { id: "notificacoes", label: "Notificações", icon: Bell },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userType");
    navigate("/");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBairro("");
    setSelectedProfissao("");
    setSelectedDistancia("");
    setValorMinimo("");
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

  // Filter component (reusable for sidebar and mobile sheet)
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar vagas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Bairro */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Bairro</Label>
        <Select value={selectedBairro} onValueChange={setSelectedBairro}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o bairro" />
          </SelectTrigger>
          <SelectContent>
            {bairrosBrasilia.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Profissão */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Profissão</Label>
        <Select value={selectedProfissao} onValueChange={setSelectedProfissao}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a profissão" />
          </SelectTrigger>
          <SelectContent>
            {profissoes.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Distância */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Distância máxima</Label>
        <Select value={selectedDistancia} onValueChange={setSelectedDistancia}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">Até 5 km</SelectItem>
            <SelectItem value="10">Até 10 km</SelectItem>
            <SelectItem value="20">Até 20 km</SelectItem>
            <SelectItem value="30">Até 30 km</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Valor mínimo */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Valor mínimo (R$)</Label>
        <Input
          type="number"
          placeholder="Ex: 150"
          value={valorMinimo}
          onChange={(e) => setValorMinimo(e.target.value)}
        />
      </div>

      {/* Clear filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Limpar filtros
      </Button>
    </div>
  );

  // Render pages
  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">Dashboard</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
                <Briefcase className="w-8 h-8 text-amber-600 mb-2" />
                <p className="text-2xl font-black text-gray-900">12</p>
                <p className="text-sm text-gray-600">Trabalhos este mês</p>
              </div>
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
                <DollarSign className="w-8 h-8 text-green-600 mb-2" />
                <p className="text-2xl font-black text-gray-900">R$ 2.450</p>
                <p className="text-sm text-gray-600">Ganhos do mês</p>
              </div>
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
                <Star className="w-8 h-8 text-yellow-500 mb-2" />
                <p className="text-2xl font-black text-gray-900">4.8</p>
                <p className="text-sm text-gray-600">Avaliação</p>
              </div>
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
                <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                <p className="text-2xl font-black text-gray-900">95%</p>
                <p className="text-sm text-gray-600">Comparecimento</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Próximos Trabalhos</h2>
              <div className="space-y-3">
                {minhasCandidaturas
                  .filter((c) => c.status === "aceito")
                  .map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                      <div>
                        <p className="font-bold text-gray-900">{c.titulo}</p>
                        <p className="text-sm text-gray-600">{c.empresa} • {c.data}</p>
                      </div>
                      <Badge className="bg-green-500 text-white">Confirmado</Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );

      case "vagas":
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900">Vagas Disponíveis</h1>
              
              {/* Mobile Filter Button */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filtrar Vagas
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
                  <SheetHeader>
                    <SheetTitle>Filtrar Vagas</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 overflow-y-auto max-h-[calc(85vh-120px)]">
                    <FilterContent />
                    <Button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-600"
                    >
                      Aplicar Filtros
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Desktop Sidebar Filters */}
              <aside className="hidden lg:block w-80 flex-shrink-0 lg:sticky lg:top-24 lg:self-start">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-amber-600" />
                    Filtros
                  </h2>
                  <FilterContent />
                </div>
              </aside>

              {/* Jobs List */}
              <main className="flex-1 space-y-4">
                {vagasDisponiveis.map((vaga) => (
                  <div key={vaga.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
                          {vaga.logo}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{vaga.empresa}</p>
                          <p className="text-sm text-gray-500">{vaga.distancia} km de distância</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700">{vaga.tipo}</Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{vaga.titulo}</h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-amber-600">{vaga.bairro}</span>
                      <span className="text-gray-500">• {vaga.cidade}</span>
                    </div>

                    {/* Value Card */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 mb-4 text-white">
                      <p className="text-sm opacity-90">Você recebe</p>
                      <p className="text-2xl font-black">R$ {vaga.valor},00</p>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        {vaga.horario}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {vaga.data}
                      </div>
                    </div>

                    {/* Activities */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Atividades:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {vaga.atividades.map((a, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {vaga.beneficios.map((b, i) => (
                        <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700">
                          {b}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        Ver Detalhes
                      </Button>
                      <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                        Me Candidatar
                      </Button>
                    </div>
                  </div>
                ))}
              </main>
            </div>
          </div>
        );

      case "candidaturas":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">Minhas Candidaturas</h1>
            
            <div className="space-y-4">
              {minhasCandidaturas.map((c) => (
                <div
                  key={c.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all ${
                    c.status === "aceito"
                      ? "border-green-300 bg-green-50"
                      : c.status === "recusado"
                      ? "border-red-200"
                      : "border-yellow-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{c.titulo}</h3>
                      <p className="text-gray-600">{c.empresa}</p>
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
                      {c.status === "aceito" ? "Aceito" : c.status === "recusado" ? "Recusado" : "Aguardando"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {c.data}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      R$ {c.valor}
                    </span>
                  </div>

                  {c.status === "aceito" && (
                    <div className="bg-green-100 rounded-xl p-4 border border-green-300">
                      <p className="font-bold text-green-800">🎉 Parabéns! Você foi selecionado!</p>
                      <p className="text-sm text-green-700 mt-1">
                        Compareça no local e horário indicados.
                      </p>
                      <Button className="mt-3 bg-green-600 hover:bg-green-700">Ver Detalhes</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "ganhos":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">Meus Ganhos</h1>

            {/* Hero Card */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-6 md:p-8 text-white">
              <p className="text-lg opacity-90">Ganhos este mês</p>
              <p className="text-4xl md:text-5xl font-black mt-2">R$ 2.450,00</p>
              <p className="text-sm opacity-80 mt-2">Pagamento direto após cada trabalho</p>
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
                    {historicoPagamentos.map((p) => (
                      <tr key={p.id} className="border-b border-gray-100">
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

      case "perfil":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">Meu Perfil</h1>

            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-4xl">
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
                      {profissoes.map((p) => (
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
            <Button className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
              Salvar Alterações
            </Button>
          </div>
        );

      case "notificacoes":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">Notificações</h1>
            <div className="space-y-3">
              {[
                { title: "Candidatura aceita!", desc: "Bar do João aceitou sua candidatura", time: "2h atrás", type: "success" },
                { title: "Nova vaga disponível", desc: "Vaga de Garçom em Asa Norte", time: "5h atrás", type: "info" },
                { title: "Lembrete de trabalho", desc: "Você tem um trabalho amanhã às 18h", time: "1d atrás", type: "warning" },
              ].map((n, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-xl p-4 shadow-lg border-l-4 ${
                    n.type === "success" ? "border-l-green-500" : n.type === "warning" ? "border-l-yellow-500" : "border-l-blue-500"
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

      default:
        return (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">Página em construção</h1>
            <p className="text-gray-600 mt-2">Esta funcionalidade estará disponível em breve.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <img src={scaladorLogo} alt="Scalador" className="h-8 md:h-10" />
            <Badge className="hidden md:block bg-amber-100 text-amber-700 font-semibold">
              Freelancer
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
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
            <div className="p-6 border-b border-gray-200">
              <img src={scaladorLogo} alt="Scalador" className="h-10" />
            </div>
            <nav className="flex-1 p-4 space-y-1">
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

      {/* Main Layout */}
      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentPage === item.id
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                    : "text-gray-700 hover:bg-amber-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FreelancerPortal;
