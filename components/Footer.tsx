
import React, { useState } from 'react';
import { ViewState, Category } from '../types';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewState, category: Category | null) => void;
  onAdminAccess: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onAdminAccess }) => {
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [inputCode, setInputCode] = useState('');

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode === 'Live47056453') {
      onAdminAccess();
      setShowAccessCode(false);
      setInputCode('');
    } else {
      alert('Código incorreto.');
    }
  };

  return (
    <footer className="bg-slate-100 border-t border-slate-200 py-16 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-1 mb-6">
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-heading">LIVE+</span>
          </div>
          <p className="text-slate-500 max-w-sm leading-relaxed mb-6">
            Portal corporativo focado na curadoria de conteúdo de alto impacto tecnológico, científico e audiovisual.
          </p>
          <button 
            onClick={() => setShowAccessCode(true)} 
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" /> Informantes Live
          </button>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs font-heading">Acessos</h4>
          <ul className="space-y-4 text-sm text-slate-500 font-medium">
            <li><button onClick={() => onNavigate('home', null)} className="hover:text-slate-900 transition-colors">Home</button></li>
            <li><button onClick={() => onNavigate('privacy', null)} className="hover:text-slate-900 transition-colors">Privacidade</button></li>
            <li><button onClick={() => onNavigate('terms', null)} className="hover:text-slate-900 transition-colors">Termos de Uso</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs font-heading">Corporation</h4>
          <ul className="space-y-4 text-sm text-slate-500 font-medium">
            <li><button onClick={() => onNavigate('category', Category.SEDES)} className="hover:text-slate-900 transition-colors">Nossas Sedes</button></li>
            <li><button onClick={() => onNavigate('category', Category.PARCERIAS)} className="hover:text-slate-900 transition-colors">Parcerias</button></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <span className="text-slate-900 text-lg">©</span>
          <span>2025 LIVE PLUS GLOBAL CORPORATION. TODOS OS DIREITOS RESERVADOS.</span>
        </div>
        <div className="flex gap-8">
          <span className="hover:text-slate-600 transition-colors cursor-default">TECNOLOGIA</span>
          <span className="hover:text-slate-600 transition-colors cursor-default">CIÊNCIA</span>
          <span className="hover:text-slate-600 transition-colors cursor-default">CULTURA</span>
        </div>
      </div>

      {showAccessCode && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4 text-slate-900 font-heading">Acesso Restrito</h3>
            <p className="text-slate-500 text-sm mb-6">Insira o código de autenticação para acessar o painel do Informante.</p>
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <input 
                type="password" 
                placeholder="Código de Acesso" 
                className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-slate-800 outline-none"
                autoFocus
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-grow py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Entrar</button>
                <button 
                  type="button" 
                  onClick={() => setShowAccessCode(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
};
