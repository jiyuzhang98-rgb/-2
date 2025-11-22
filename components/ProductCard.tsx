import React from 'react';
import { Album } from '../types';
import { Calendar, BookOpen, FileText, Edit3, Trash2, GripHorizontal } from 'lucide-react';

interface ProductCardProps {
  product: Album;
  onClick: (album: Album) => void;
  isManageMode?: boolean;
  onEdit?: (album: Album) => void;
  onDelete?: (album: Album) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product: album, onClick, isManageMode, onEdit, onDelete }) => {
  const isPdf = album.type === 'pdf';

  const handleCardClick = () => {
      if (isManageMode && onEdit) {
          onEdit(album);
      } else {
          onClick(album);
      }
  }

  return (
    <div 
      className={`group relative bg-white rounded-xl shadow-sm border hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full ${isManageMode ? 'border-indigo-500 ring-2 ring-indigo-500/20 cursor-move' : 'border-slate-100 cursor-pointer'}`}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <img 
          src={album.cover} 
          alt={album.title}
          className={`w-full h-full object-cover object-center transition-transform duration-700 ${isManageMode ? 'scale-105 blur-[2px]' : 'group-hover:scale-105'}`}
        />
        
        {/* Manage Mode Overlay */}
        {isManageMode ? (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 animate-in fade-in duration-200">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white/50">
                     <GripHorizontal size={24} />
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit?.(album); }}
                    className="p-3 bg-white text-slate-900 rounded-full hover:bg-indigo-600 hover:text-white transition-colors shadow-lg transform hover:scale-110 z-10"
                    title="编辑"
                >
                    <Edit3 size={20} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete?.(album); }}
                    className="p-3 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg transform hover:scale-110 z-10"
                    title="删除"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        ) : (
            // Normal Hover Overlay
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-white/90 backdrop-blur text-slate-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {isPdf ? <FileText size={16} /> : <BookOpen size={16} />}
                    {isPdf ? '查看 PDF' : '查看画册'}
                </span>
            </div>
        )}

        {!isManageMode && (
            <>
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-medium text-white tracking-wide uppercase">
                {album.category}
                </div>
                {isPdf && (
                    <div className="absolute bottom-3 right-3 bg-red-500/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white tracking-wide uppercase shadow-sm">
                        PDF
                    </div>
                )}
            </>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-1">
            {album.title}
        </h3>
        
        <div className="mt-auto flex items-center justify-between text-slate-500 text-sm">
            <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{album.date}</span>
            </div>
            {!isManageMode && (
                <button className="text-indigo-600 font-medium text-xs px-3 py-1 bg-indigo-50 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    查看
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;