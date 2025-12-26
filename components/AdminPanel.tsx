
import React, { useState } from 'react';
import { Post, Category } from '../types';
import { Plus, Trash2, Edit2, LogOut, Save, X, FileText, Music, Image as ImageIcon, Video, CheckCircle, Clock } from 'lucide-react';

interface AdminPanelProps {
  posts: Post[];
  onSave: (posts: Post[]) => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ posts, onSave, onLogout }) => {
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);

  const handleAddPost = () => {
    setEditingPost({
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      content: '',
      category: Category.TECNOLOGIA,
      mediaType: 'none',
      mediaUrl: '',
      createdAt: Date.now(),
      author: 'Informante Live',
      views: 0,
      comments: [],
      reactions: {},
      status: 'draft'
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditingPost(prev => ({ ...prev, mediaUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePost = (publishNow: boolean = false) => {
    if (!editingPost || !editingPost.title || !editingPost.content) {
      alert('Preencha os campos obrigatórios (Título e Conteúdo).');
      return;
    }

    const newStatus = publishNow ? 'published' : (editingPost.status || 'draft');
    const postToSave = { 
      ...editingPost, 
      status: newStatus,
      createdAt: Date.now() // Update time on publish/re-publish
    } as Post;

    const newPosts = [...posts];
    const index = newPosts.findIndex(p => p.id === postToSave.id);
    
    if (index > -1) {
      newPosts[index] = postToSave;
    } else {
      newPosts.push(postToSave);
    }

    onSave(newPosts);
    setEditingPost(null);
    if (publishNow) {
      alert('Publicação enviada com sucesso! Agora está visível para todo o mundo.');
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
        <div>
          <h2 className="text-2xl font-bold font-heading">Painel de Controle</h2>
          <p className="text-slate-400 text-sm font-light">Ambiente restrito: Informante Live</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleAddPost}
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" /> Novo Conteúdo
          </button>
          <button onClick={onLogout} className="p-3 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-2xl">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid gap-4">
          {posts.map(post => (
            <div key={post.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all group">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg ${post.status === 'published' ? 'bg-slate-900' : 'bg-slate-300'}`}>
                  {post.mediaType === 'image' && <ImageIcon className="w-6 h-6" />}
                  {post.mediaType === 'video' && <Video className="w-6 h-6" />}
                  {post.mediaType === 'audio' && <Music className="w-6 h-6" />}
                  {post.mediaType === 'pdf' && <FileText className="w-6 h-6" />}
                  {post.mediaType === 'none' && <span className="font-bold text-xs">TEXT</span>}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.2em]">{post.category}</span>
                    {post.status === 'published' ? (
                      <span className="flex items-center gap-1 text-[8px] font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        <CheckCircle className="w-2 h-2" /> Live
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[8px] font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        <Clock className="w-2 h-2" /> Rascunho
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">{post.title}</h3>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingPost(post)} className="p-3 text-slate-400 hover:text-slate-900 transition-colors bg-white rounded-xl shadow-sm border border-slate-100"><Edit2 className="w-5 h-5" /></button>
                <button onClick={() => { if(window.confirm('Excluir esta publicação definitivamente?')) onSave(posts.filter(p => p.id !== post.id)) }} className="p-3 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-xl shadow-sm border border-slate-100"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
               <Plus className="w-12 h-12 text-slate-200 mx-auto mb-4" />
               <p className="text-slate-400 font-medium">Nenhum conteúdo publicado ainda.</p>
               <button onClick={handleAddPost} className="mt-4 text-slate-900 font-bold underline">Criar minha primeira publicação</button>
            </div>
          )}
        </div>
      </div>

      {editingPost && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="text-2xl font-bold text-slate-900 font-heading">Compor Informação</h3>
              <button onClick={() => setEditingPost(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="p-10 overflow-y-auto space-y-8 custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Título do Post</label>
                  <input 
                    className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                    placeholder="Ex: Novo marco na ciência..."
                    value={editingPost.title}
                    onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Categoria Institucional</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none appearance-none"
                    value={editingPost.category}
                    onChange={e => setEditingPost({...editingPost, category: e.target.value as Category})}
                  >
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Formato de Mídia</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none"
                    value={editingPost.mediaType}
                    onChange={e => setEditingPost({...editingPost, mediaType: e.target.value as any})}
                  >
                    <option value="none">Texto Puro</option>
                    <option value="image">Fotografia / Gráfico</option>
                    <option value="video">Material Audiovisual</option>
                    <option value="audio">Relatório em Áudio</option>
                    <option value="pdf">Documentação PDF</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Anexo Local (Upload)</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      onChange={handleFileUpload}
                      className="w-full text-[10px] text-slate-500 file:mr-4 file:py-3.5 file:px-6 file:rounded-2xl file:border-0 file:text-[10px] file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 transition-all cursor-pointer"
                      accept={editingPost.mediaType === 'image' ? 'image/*' : editingPost.mediaType === 'video' ? 'video/*' : editingPost.mediaType === 'audio' ? 'audio/*' : '.pdf'}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Ou Link Remoto (Internet)</label>
                <input 
                  className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                  placeholder="https://cloud.liveplus.com/file..."
                  value={editingPost.mediaUrl}
                  onChange={e => setEditingPost({...editingPost, mediaUrl: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Corpo do Conteúdo</label>
                <textarea 
                  className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none min-h-[180px] resize-none leading-relaxed"
                  placeholder="Redija aqui as informações da corporação..."
                  value={editingPost.content}
                  onChange={e => setEditingPost({...editingPost, content: e.target.value})}
                />
              </div>
            </div>
            <div className="p-10 border-t border-slate-100 bg-slate-50 flex flex-col md:flex-row gap-4 shrink-0">
              <button 
                onClick={() => handleSavePost(true)}
                className="flex-grow flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-[1.25rem] font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 active:scale-[0.98]"
              >
                <CheckCircle className="w-6 h-6" /> Publicar Imediatamente
              </button>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleSavePost(false)}
                  className="flex-grow md:flex-none px-10 py-5 bg-white text-slate-600 border border-slate-200 rounded-[1.25rem] font-bold hover:bg-slate-50 transition-all"
                >
                  Salvar Rascunho
                </button>
                <button 
                  onClick={() => setEditingPost(null)} 
                  className="px-6 py-5 text-slate-400 hover:text-slate-600 font-bold transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
