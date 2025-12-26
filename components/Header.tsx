
import React, { useState, useEffect } from 'react';
import { Category, ViewState } from '../types';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: ViewState, category: Category | null) => void;
  currentCategory: Category | null;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentCategory }) => {
  const [isPlus, setIsPlus] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlus(prev => !prev);
    }, 4000);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const categories = Object.values(Category);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('home', null)}
          className="flex items-center gap-1 group"
        >
          <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">LIVE</span>
          <div className="relative h-8 flex items-center justify-center min-w-[3rem]">
            <span className={`text-2xl font-bold text-slate-900 transition-all duration-700 absolute ${isPlus ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'}`}>
              +
            </span>
            <span className={`text-lg font-bold tracking-widest text-slate-900 transition-all duration-700 absolute ${!isPlus ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              PLUS
            </span>
          </div>
        </button>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onNavigate('category', cat)}
              className={`text-sm font-semibold transition-all hover:text-slate-900 ${currentCategory === cat ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500'}`}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-slate-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-slate-100 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                onNavigate('category', cat);
                setIsMenuOpen(false);
              }}
              className={`text-lg font-semibold text-left p-2 rounded-lg ${currentCategory === cat ? 'bg-slate-50 text-slate-900' : 'text-slate-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
