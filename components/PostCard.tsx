
import React from 'react';
import { Post } from '../types';
import { PlayCircle, Eye, MessageSquare, Music, FileText, Share2 } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <article 
      className="group cursor-pointer bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-slate-100 flex flex-col h-full transform hover:-translate-y-2"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {post.mediaType === 'image' && post.mediaUrl ? (
          <img 
            src={post.mediaUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : post.mediaType === 'video' ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-900">
            <PlayCircle className="w-16 h-16 text-white/30 group-hover:text-white/80 transition-all group-hover:scale-110" />
          </div>
        ) : post.mediaType === 'audio' ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-900">
            <Music className="w-16 h-16 text-slate-700 group-hover:text-slate-300 transition-all" />
          </div>
        ) : post.mediaType === 'pdf' ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <FileText className="w-16 h-16 text-slate-300 group-hover:text-slate-500 transition-all" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
             <span className="text-4xl font-bold font-heading text-slate-100 group-hover:text-slate-200 transition-colors uppercase tracking-[0.2em]">LIVE+</span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-6 left-6">
          <span className="px-4 py-1.5 bg-white/95 backdrop-blur shadow-xl text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 rounded-full border border-white">
            {post.category}
          </span>
        </div>

        {/* Share Hint Overlay */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-500 flex items-center justify-center">
            <Share2 className="text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 w-8 h-8" />
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors leading-tight font-heading">
          {post.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-3 mb-8 flex-grow leading-relaxed font-light">
          {post.content}
        </p>
        
        <div className="flex items-center justify-between border-t border-slate-50 pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Eye className="w-3.5 h-3.5" /> <span>{post.views || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <MessageSquare className="w-3.5 h-3.5" /> <span>{post.comments?.length || 0}</span>
            </div>
          </div>
          <span className="text-[9px] font-bold tracking-[0.2em] text-slate-300 uppercase">
            {new Date(post.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </article>
  );
};
