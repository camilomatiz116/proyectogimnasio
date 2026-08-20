"use client";

import { useState, useEffect } from "react";
import { Dumbbell, User, ShieldCheck, Activity, Heart, Clock, MapPin, Menu, X, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEntry = async (role: "admin" | "alumno") => {
    setLoading(role);
    const email = role === "admin" ? "admin@jpesgym.com" : "alumno@jpesgym.com"; 
    const password = role === "admin" ? "admin123" : "alumno123";
    
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-yellow-500 selection:text-zinc-950">
      
      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('inicio')}>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                <Dumbbell className="text-zinc-950 w-6 h-6 transform -rotate-12" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase text-white">JPES <span className="text-yellow-500">GYM</span></span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('servicios')} className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors uppercase tracking-wider">Servicios</button>
              <button onClick={() => scrollToSection('nosotros')} className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors uppercase tracking-wider">Nosotros</button>
              <button onClick={() => scrollToSection('planes')} className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors uppercase tracking-wider">Planes</button>
            </div>

            {/* Desktop Access Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => handleEntry("alumno")}
                disabled={loading !== null}
                className="flex items-center space-x-2 text-sm font-bold text-zinc-300 hover:text-white transition-colors"
              >
                {loading === "alumno" ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <User className="w-4 h-4" />}
                <span>Soy Alumno</span>
              </button>
              <button
                onClick={() => handleEntry("admin")}
                disabled={loading !== null}
                className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 px-5 py-2.5 rounded-full font-bold transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
              >
                {loading === "admin" ? <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div> : <ShieldCheck className="w-4 h-4" />}
                <span>Admin</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-zinc-300 hover:text-white focus:outline-none">
                {mobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-zinc-900 border-b border-zinc-800 absolute w-full">
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              <button onClick={() => scrollToSection('servicios')} className="text-left py-3 border-b border-zinc-800 text-zinc-300 font-semibold uppercase tracking-wider">Servicios</button>
              <button onClick={() => scrollToSection('nosotros')} className="text-left py-3 border-b border-zinc-800 text-zinc-300 font-semibold uppercase tracking-wider">Nosotros</button>
              <button onClick={() => scrollToSection('planes')} className="text-left py-3 border-b border-zinc-800 text-zinc-300 font-semibold uppercase tracking-wider mb-4">Planes</button>
              
              <button
                onClick={() => handleEntry("alumno")}
                disabled={loading !== null}
                className="flex items-center justify-center space-x-2 w-full bg-zinc-800 text-white py-3 rounded-xl font-bold mb-2"
              >
                <User className="w-5 h-5" />
                <span>Portal Alumnos</span>
              </button>
              <button
                onClick={() => handleEntry("admin")}
                disabled={loading !== null}
                className="flex items-center justify-center space-x-2 w-full bg-yellow-500 text-zinc-950 py-3 rounded-xl font-bold"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Panel Administrativo</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section id="inicio" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 transform motion-safe:animate-[pulse_10s_ease-in-out_infinite_alternate]"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop")' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/50"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700 backdrop-blur-sm mb-6">
              <MapPin className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-bold tracking-widest uppercase text-zinc-300">Guatavita, Cundinamarca</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight mb-6">
              Esculpe tu mejor <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Versión Aquí</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 font-medium mb-10 max-w-2xl leading-relaxed">
              Únete al centro de acondicionamiento físico más moderno y equipado de Guatavita. Instalaciones de primer nivel, entrenadores certificados y un ambiente diseñado para romper tus límites.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={() => scrollToSection('planes')} className="bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-black uppercase tracking-wider py-4 px-8 rounded-full transition-transform transform hover:-translate-y-1 shadow-[0_10px_30px_rgba(234,179,8,0.3)]">
                Inscríbete Ahora
              </button>
              <button onClick={() => scrollToSection('servicios')} className="bg-transparent border-2 border-zinc-700 hover:border-zinc-500 text-white font-bold uppercase tracking-wider py-4 px-8 rounded-full transition-colors">
                Conocer Más
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS SECTION */}
      <section id="servicios" className="py-20 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Nuestros <span className="text-yellow-500">Servicios</span></h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Todo lo que necesitas para alcanzar tus objetivos en un solo lugar. Equipamiento premium y asesoría profesional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 hover:bg-zinc-800/50 transition-colors group">
              <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors">
                <Dumbbell className="w-7 h-7 text-white group-hover:text-zinc-950" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wide mb-3">Zona de Musculación</h3>
              <p className="text-zinc-400 leading-relaxed">Máquinas de última tecnología y peso libre para hipertrofia, fuerza y tonificación muscular.</p>
            </div>
            
            {/* Service 2 */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 hover:bg-zinc-800/50 transition-colors group">
              <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors">
                <Activity className="w-7 h-7 text-white group-hover:text-zinc-950" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wide mb-3">Cardio Avanzado</h3>
              <p className="text-zinc-400 leading-relaxed">Cintas, elípticas y escaladoras con pantallas interactivas para un acondicionamiento cardiovascular óptimo.</p>
            </div>

            {/* Service 3 */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 hover:bg-zinc-800/50 transition-colors group">
              <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors">
                <Heart className="w-7 h-7 text-white group-hover:text-zinc-950" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wide mb-3">Clases Grupales</h3>
              <p className="text-zinc-400 leading-relaxed">Spinning, Zumba, Yoga y HIIT. Dinamismo y comunidad para mantenerte motivado todos los días.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NOSOTROS SECTION */}
      <section id="nosotros" className="py-20 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-yellow-500 translate-x-4 translate-y-4 rounded-3xl opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop" 
                alt="Interior del gimnasio" 
                className="relative z-10 rounded-3xl shadow-2xl object-cover h-[500px] w-full"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">El Orgullo de <span className="text-yellow-500">Guatavita</span></h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                JPES GYM nació con una misión clara: traer a Guatavita un espacio de entrenamiento de nivel internacional. No somos solo un cuarto con pesas, somos una comunidad dedicada a la salud, la disciplina y el crecimiento personal.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-yellow-500" />
                  <span className="font-semibold text-zinc-200">Abierto de Lunes a Domingo</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-yellow-500" />
                  <span className="font-semibold text-zinc-200">Entrenadores Certificados</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-yellow-500" />
                  <span className="font-semibold text-zinc-200">App Móvil Exclusiva para Alumnos</span>
                </li>
              </ul>
              <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center space-x-4">
                <Clock className="w-10 h-10 text-yellow-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wide">Horario de Atención</h4>
                  <p className="text-zinc-400 text-sm">Lunes a Viernes: 5:00 AM - 10:00 PM <br/> Fines de Semana: 7:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLANES SECTION */}
      <section id="planes" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Nuestros <span className="text-yellow-500">Planes</span></h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Invierte en tu salud. Sin contratos engañosos, solo resultados reales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plan 1 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Mensual</h3>
              <p className="text-zinc-500 mb-6">Para empezar con todo.</p>
              <div className="mb-8">
                <span className="text-4xl font-black">$70.000</span>
                <span className="text-zinc-500">/mes</span>
              </div>
              <ul className="space-y-4 flex-grow mb-8">
                <li className="flex items-center space-x-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-zinc-600" /><span>Acceso a Zona de Pesas</span></li>
                <li className="flex items-center space-x-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-zinc-600" /><span>Acceso a Cardio</span></li>
                <li className="flex items-center space-x-3 text-zinc-600 line-through"><CheckCircle2 className="w-5 h-5 text-zinc-800" /><span>Clases Grupales</span></li>
              </ul>
              <button className="w-full py-4 rounded-xl font-bold bg-zinc-800 hover:bg-zinc-700 transition-colors">Elegir Plan</button>
            </div>

            {/* Plan 2 - Destacado */}
            <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border-2 border-yellow-500 rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(234,179,8,0.15)]">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-zinc-950 font-black uppercase tracking-widest text-xs py-1 px-4 rounded-full">
                Más Popular
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-yellow-500">Trimestral</h3>
              <p className="text-zinc-400 mb-6">Compromiso y resultados.</p>
              <div className="mb-8">
                <span className="text-4xl font-black">$180.000</span>
                <span className="text-zinc-500">/trimestre</span>
              </div>
              <ul className="space-y-4 flex-grow mb-8">
                <li className="flex items-center space-x-3 text-zinc-100"><CheckCircle2 className="w-5 h-5 text-yellow-500" /><span>Acceso Ilimitado</span></li>
                <li className="flex items-center space-x-3 text-zinc-100"><CheckCircle2 className="w-5 h-5 text-yellow-500" /><span>Clases Grupales VIP</span></li>
                <li className="flex items-center space-x-3 text-zinc-100"><CheckCircle2 className="w-5 h-5 text-yellow-500" /><span>App de Rutinas Exclusiva</span></li>
              </ul>
              <button className="w-full py-4 rounded-xl font-black bg-yellow-500 text-zinc-950 hover:bg-yellow-400 transition-colors shadow-lg">Elegir Plan</button>
            </div>

            {/* Plan 3 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Anual</h3>
              <p className="text-zinc-500 mb-6">Estilo de vida definitivo.</p>
              <div className="mb-8">
                <span className="text-4xl font-black">$600.000</span>
                <span className="text-zinc-500">/año</span>
              </div>
              <ul className="space-y-4 flex-grow mb-8">
                <li className="flex items-center space-x-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-zinc-600" /><span>Todo lo del plan Trimestral</span></li>
                <li className="flex items-center space-x-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-zinc-600" /><span>1 Mes Gratis para un amigo</span></li>
                <li className="flex items-center space-x-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-zinc-600" /><span>Congelamiento de plan (30 días)</span></li>
              </ul>
              <button className="w-full py-4 rounded-xl font-bold bg-zinc-800 hover:bg-zinc-700 transition-colors">Elegir Plan</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Dumbbell className="text-yellow-500 w-8 h-8 mr-2 transform -rotate-12" />
              <span className="text-xl font-black tracking-tighter uppercase text-white">JPES <span className="text-yellow-500">GYM</span></span>
            </div>
            <div className="text-zinc-500 text-sm text-center md:text-right">
              <p>&copy; 2026 JPES GYM Guatavita. Todos los derechos reservados.</p>
              <p className="mt-1 flex items-center justify-center md:justify-end">
                <MapPin className="w-3 h-3 mr-1" /> Parque Principal, Guatavita, Colombia.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
