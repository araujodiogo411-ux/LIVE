
import React from 'react';
import { Category, ViewState } from '../types';

interface HeroProps {
  onNavigate: (view: ViewState, category: Category | null) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 rounded-[2rem] text-white p-12 md:p-24 shadow-2xl">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none overflow-hidden">
        <div className="text-[10rem] font-bold leading-none rotate-12 -mr-20 -mt-10 font-heading">LIVE+</div>
      </div>
      
      <div className="relative z-10 max-w-2xl">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
          Excelência em Informação Corporativa
        </span>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 font-heading">
          Conectando Ciência, Tecnologia e Cultura.
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light">
          A Live+ é uma plataforma corporativa dedicada ao compartilhamento de avanços tecnológicos, produções audiovisuais e marcos científicos globais.
        </p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => onNavigate('category', Category.TECNOLOGIA)}
            className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all transform hover:-translate-y-1 shadow-lg shadow-white/10"
          >
            Explorar Tecnologia
          </button>
          <button 
            onClick={() => onNavigate('category', Category.CIENCIA)}
            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-xl hover:bg-white/20 transition-all"
          >
            Conhecer Ciência
          </button>
        </div>
      </div>
    </section>
  );
};
