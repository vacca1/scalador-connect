import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import scaladorLogo from "@/assets/scalador-logo.png";
import { Briefcase, Users, ArrowLeft, Mail, Lock, Eye, EyeOff, Building2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"empresa" | "freelancer">("freelancer");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userType", userType);
    navigate(`/${userType}`);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-100/20 to-blue-100/20 rounded-full blur-3xl -z-10"></div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6 transition-colors font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </motion.button>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-100/50 relative overflow-hidden"
        >
          {/* Gradient border effect */}
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${
            userType === "freelancer" 
              ? "from-amber-500/10 to-orange-500/5" 
              : "from-blue-500/10 to-indigo-500/5"
          } pointer-events-none`}></div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="text-center mb-8">
              <motion.img
                src={scaladorLogo}
                alt="Scalador"
                className="h-12 mx-auto mb-4"
                whileHover={{ scale: 1.05 }}
              />
              <h1 className="text-2xl font-black text-gray-900">Bem-vindo de volta!</h1>
              <p className="text-gray-600 mt-2">Selecione seu tipo de perfil para continuar</p>
            </div>

            {/* User Type Toggle */}
            <div className="flex gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserType("freelancer")}
                className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                  userType === "freelancer"
                    ? "border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg shadow-amber-500/20"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                {userType === "freelancer" && (
                  <motion.div
                    layoutId="activeType"
                    className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl"
                  />
                )}
                <div className="relative z-10">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                    userType === "freelancer"
                      ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30"
                      : "bg-gray-100"
                  }`}>
                    <Users className={`w-6 h-6 ${userType === "freelancer" ? "text-white" : "text-gray-400"}`} />
                  </div>
                  <p className={`font-bold ${userType === "freelancer" ? "text-amber-700" : "text-gray-500"}`}>
                    Freelancer
                  </p>
                  <p className={`text-xs mt-1 ${userType === "freelancer" ? "text-amber-600" : "text-gray-400"}`}>
                    Encontre trabalhos
                  </p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserType("empresa")}
                className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                  userType === "empresa"
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/20"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                {userType === "empresa" && (
                  <motion.div
                    layoutId="activeType"
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl"
                  />
                )}
                <div className="relative z-10">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                    userType === "empresa"
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30"
                      : "bg-gray-100"
                  }`}>
                    <Building2 className={`w-6 h-6 ${userType === "empresa" ? "text-white" : "text-gray-400"}`} />
                  </div>
                  <p className={`font-bold ${userType === "empresa" ? "text-blue-700" : "text-gray-500"}`}>
                    Empresa
                  </p>
                  <p className={`text-xs mt-1 ${userType === "empresa" ? "text-blue-600" : "text-gray-400"}`}>
                    Contrate freelancers
                  </p>
                </div>
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-gray-700 font-semibold">E-mail</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 py-6 rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="senha" className="text-gray-700 font-semibold">Senha</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10 pr-12 py-6 rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                  <span className="text-gray-600">Lembrar de mim</span>
                </label>
                <a href="#" className={`font-semibold transition-colors ${
                  userType === "freelancer" ? "text-amber-600 hover:text-amber-700" : "text-blue-600 hover:text-blue-700"
                }`}>
                  Esqueci a senha
                </a>
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="submit"
                  className={`w-full py-6 text-lg font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl ${
                    userType === "freelancer"
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/30"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30"
                  }`}
                >
                  Entrar como {userType === "freelancer" ? "Freelancer" : "Empresa"}
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400">ou</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Login */}
            <button className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar com Google
            </button>

            {/* Register Link */}
            <p className="mt-6 text-center text-gray-600">
              Não tem conta?{" "}
              <button
                onClick={() => navigate(`/${userType}`)}
                className={`font-bold transition-colors ${
                  userType === "freelancer" ? "text-amber-600 hover:text-amber-700" : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Cadastre-se grátis
              </button>
            </p>
          </div>
        </motion.div>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Ao continuar, você concorda com nossos{" "}
          <a href="#" className="underline hover:text-gray-700">Termos de Uso</a>
          {" "}e{" "}
          <a href="#" className="underline hover:text-gray-700">Política de Privacidade</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
