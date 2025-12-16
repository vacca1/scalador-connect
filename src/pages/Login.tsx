import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import scaladorLogo from "@/assets/scalador-logo.png";
import { Briefcase, Users, ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"empresa" | "freelancer">("freelancer");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userType", userType);
    navigate(`/${userType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={scaladorLogo} alt="Scalador" className="h-12 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-gray-900">Entrar na plataforma</h1>
            <p className="text-gray-600 mt-2">Selecione seu tipo de perfil</p>
          </div>

          {/* User Type Toggle */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setUserType("freelancer")}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 ${
                userType === "freelancer"
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Users
                className={`w-8 h-8 mx-auto mb-2 ${
                  userType === "freelancer" ? "text-amber-600" : "text-gray-400"
                }`}
              />
              <p
                className={`font-bold ${
                  userType === "freelancer" ? "text-amber-700" : "text-gray-500"
                }`}
              >
                Freelancer
              </p>
            </button>
            <button
              onClick={() => setUserType("empresa")}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 ${
                userType === "empresa"
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Briefcase
                className={`w-8 h-8 mx-auto mb-2 ${
                  userType === "empresa" ? "text-indigo-600" : "text-gray-400"
                }`}
              />
              <p
                className={`font-bold ${
                  userType === "empresa" ? "text-indigo-700" : "text-gray-500"
                }`}
              >
                Empresa
              </p>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              className={`w-full py-6 text-lg font-bold rounded-xl transition-all ${
                userType === "freelancer"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              }`}
            >
              Entrar como {userType === "freelancer" ? "Freelancer" : "Empresa"}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
              Esqueci minha senha
            </a>
            <p className="mt-4 text-gray-600">
              Não tem conta?{" "}
              <a href="#" className="font-bold text-indigo-600 hover:text-indigo-700">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
