
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PostCard } from './components/PostCard';
import { AdminPanel } from './components/AdminPanel';
import { Hero } from './components/Hero';
import { Category, Post, ViewState, Comment } from './types';
import { Search, ChevronRight, X, MessageSquare, Eye, Send, FileText, Share2, Copy } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const selectedPost = posts.find(p => p.id === selectedPostId);

  useEffect(() => {
    const savedPosts = localStorage.getItem('live_plus_posts_v3');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const initialPosts: Post[] = [
        {
          id: '1',
          title: 'Exploração de Novos Horizontes Tecnológicos',
          category: Category.TECNOLOGIA,
          content: 'A Live+ anuncia sua nova divisão focada em inteligência espacial e comunicações quânticas.',
          mediaUrl: 'https://picsum.photos/id/1/1200/600',
          mediaType: 'image',
          createdAt: Date.now(),
          author: 'Informante Live',
          views: 124,
          comments: [],
          reactions: { '🚀': 5, '🔥': 3 },
          status: 'published'
        }
      ];
      setPosts(initialPosts);
      localStorage.setItem('live_plus_posts_v3', JSON.stringify(initialPosts));
    }
  }, []);

  const savePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    localStorage.setItem('live_plus_posts_v3', JSON.stringify(newPosts));
  };

  const handleNavigate = (view: ViewState, category: Category | null = null) => {
    setActiveView(view);
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPost = (id: string) => {
    setSelectedPostId(id);
    const newPosts = posts.map(p => p.id === id ? { ...p, views: (p.views || 0) + 1 } : p);
    savePosts(newPosts);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedPostId) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      text: commentInput,
      createdAt: Date.now(),
    };

    const newPosts = posts.map(p => 
      p.id === selectedPostId ? { ...p, comments: [newComment, ...(p.comments || [])] } : p
    );
    savePosts(newPosts);
    setCommentInput('');
  };

  const handleReaction = (emoji: string) => {
    if (!selectedPostId) return;
    const newPosts = posts.map(p => {
      if (p.id === selectedPostId) {
        const reactions = { ...p.reactions || {} };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...p, reactions };
      }
      return p;
    });
    savePosts(newPosts);
  };

  const handleShare = (platform: 'whatsapp' | 'copy' | 'instagram') => {
    if (!selectedPost) return;
    const shareText = `Confira esta publicação na Live+: ${selectedPost.title}`;
    const shareUrl = window.location.href;

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    } else if (platform === 'instagram') {
      // Instagram doesn't have a direct share URL for web stories/posts, so we copy link
      navigator.clipboard.writeText(shareUrl);
      alert('Link copiado! Compartilhe no seu Instagram.');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  const filteredPosts = posts.filter(post => {
    // Only visitors see published posts
    if (activeView !== 'admin' && post.status !== 'published') return false;
    
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header onNavigate={handleNavigate} currentCategory={selectedCategory} />
      
      <main className="flex-grow pt-32 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {activeView === 'admin' ? (
          <AdminPanel 
            posts={posts} 
            onSave={savePosts} 
            onLogout={() => handleNavigate('home')} 
          />
        ) : activeView === 'privacy' ? (
          <PrivacyPage />
        ) : activeView === 'terms' ? (
          <TermsPage />
        ) : (
          <>
            {activeView === 'home' && !selectedCategory && (
              <>
                <Hero onNavigate={handleNavigate} />
                <div className="mt-16 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-3xl font-bold tracking-tight text-slate-800 font-heading">Destaques Recentes</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Buscar conteúdo..." 
                      className="pl-10 pr-4 py-2 border border-slate-200 rounded-full bg-white focus:ring-2 focus:ring-slate-800 outline-none transition-all w-full md:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {selectedCategory && (
              <div className="mb-12">
                <div className="flex items-center gap-2 text-slate-500 mb-4 text-sm font-medium">
                  <button onClick={() => handleNavigate('home')} className="hover:text-slate-800 transition-colors">Início</button>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-slate-900">{selectedCategory}</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-8 font-heading">{selectedCategory}</h1>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} onClick={() => handleOpenPost(post.id)} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-slate-500">
                  Nenhuma publicação encontrada no momento.
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer 
        onNavigate={handleNavigate} 
        onAdminAccess={() => handleNavigate('admin')} 
      />

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 md:p-8 border-b border-slate-100 shrink-0">
              <div className="flex-grow">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1 block">{selectedPost.category}</span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-heading">{selectedPost.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                  onClick={() => handleShare('whatsapp')}
                  className="p-2.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                  title="Compartilhar no WhatsApp"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleShare('copy')}
                  className="p-2.5 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors relative"
                  title="Copiar Link"
                >
                  <Copy className="w-5 h-5" />
                  {showShareTooltip && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">Link Copiado!</span>
                  )}
                </button>
                <button onClick={() => setSelectedPostId(null)} className="p-2.5 hover:bg-slate-100 rounded-full transition-colors ml-2">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto p-6 md:p-8 space-y-8">
              {/* Media Rendering */}
              {selectedPost.mediaType === 'image' && selectedPost.mediaUrl && (
                <img src={selectedPost.mediaUrl} alt={selectedPost.title} className="w-full h-auto rounded-2xl object-cover shadow-lg" />
              )}
              {selectedPost.mediaType === 'video' && selectedPost.mediaUrl && (
                <video src={selectedPost.mediaUrl} controls className="w-full h-auto rounded-2xl shadow-lg bg-black" />
              )}
              {selectedPost.mediaType === 'audio' && selectedPost.mediaUrl && (
                <div className="bg-slate-900 p-8 rounded-2xl flex items-center justify-center shadow-inner">
                  <audio src={selectedPost.mediaUrl} controls className="w-full" />
                </div>
              )}
              {selectedPost.mediaType === 'pdf' && selectedPost.mediaUrl && (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-10 rounded-2xl flex flex-col items-center gap-4 text-center">
                  <FileText className="w-16 h-16 text-slate-300" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xl font-heading mb-1">Documento Oficial</h4>
                    <p className="text-sm text-slate-500 max-w-xs">Este conteúdo possui um anexo em formato PDF para consulta detalhada.</p>
                  </div>
                  <a href={selectedPost.mediaUrl} target="_blank" rel="noopener noreferrer" className="mt-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                    Visualizar PDF Completo
                  </a>
                </div>
              )}

              <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed text-lg font-light">
                {selectedPost.content}
              </div>

              {/* Interaction Bar */}
              <div className="pt-10 border-t border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                      <Eye className="w-4 h-4" /> <span>{selectedPost.views} Views</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                      <MessageSquare className="w-4 h-4" /> <span>{selectedPost.comments?.length || 0} Comments</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {['👍', '❤️', '🔥', '🚀', '💡'].map(emoji => (
                      <button 
                        key={emoji}
                        onClick={() => handleReaction(emoji)}
                        className="group p-2.5 bg-slate-50 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 transition-all hover:scale-110 active:scale-95 flex items-center gap-2"
                      >
                        <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{emoji}</span>
                        {selectedPost.reactions?.[emoji] > 0 && (
                          <span className="text-xs font-bold text-slate-600">{selectedPost.reactions[emoji]}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Section */}
                <div className="space-y-8 bg-slate-50/50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 font-heading">Conversa Corporativa</h3>
                  <form onSubmit={handleAddComment} className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="Adicione um comentário institucional..." 
                      className="flex-grow px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all shadow-sm"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <button type="submit" className="px-6 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95">
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                  
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                    {selectedPost.comments?.map(comment => (
                      <div key={comment.id} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm animate-in slide-in-from-left-2">
                        <p className="text-slate-700 text-sm mb-3 leading-relaxed">{comment.text}</p>
                        <div className="flex justify-between items-center opacity-40">
                           <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">Usuário Corporativo</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            {new Date(comment.createdAt).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    ))}
                    {(!selectedPost.comments || selectedPost.comments.length === 0) && (
                      <div className="text-center py-10">
                        <p className="text-slate-400 text-sm font-medium">Nenhum comentário registrado ainda.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PrivacyPage = () => (
  <div className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h1 className="text-4xl font-bold mb-8 text-slate-900 font-heading">Política de Privacidade – Live+</h1>
    <div className="prose prose-slate max-w-none text-slate-600 space-y-6 leading-relaxed">
      <p>A Live+ respeita a sua privacidade e está comprometida com a proteção dos dados pessoais dos usuários que acessam nosso site.</p>
      <h2 className="text-2xl font-bold text-slate-800 pt-4 font-heading">Coleta de informações</h2>
      <p>O site pode coletar informações básicas de navegação, como endereço IP, tipo de dispositivo, navegador e páginas acessadas, exclusivamente para fins estatísticos, de segurança e melhoria da experiência do usuário.</p>
      <h2 className="text-2xl font-bold text-slate-800 pt-4 font-heading">Uso das informações</h2>
      <p>As informações coletadas são utilizadas para garantir o funcionamento adequado do site, melhorar conteúdos e serviços, e proteger a plataforma contra acessos indevidos.</p>
    </div>
  </div>
);

const TermsPage = () => (
  <div className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h1 className="text-4xl font-bold mb-8 text-slate-900 font-heading">Termos de Uso – Live+</h1>
    <div className="prose prose-slate max-w-none text-slate-600 space-y-6 leading-relaxed">
      <p>Ao acessar o site Live+, você concorda com os termos e condições descritos abaixo.</p>
      <h2 className="text-2xl font-bold text-slate-800 pt-4 font-heading">Uso do site</h2>
      <p>O conteúdo disponibilizado no site é de caráter informativo, corporativo e público. O acesso é livre para visualização, sendo proibido qualquer uso que viole a legislação vigente.</p>
    </div>
  </div>
);

export default App;
