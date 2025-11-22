import React, { useState, useEffect } from 'react';
import { Album } from '../types';
import { X, ChevronLeft, ChevronRight, Hash, PenLine } from 'lucide-react';

interface AlbumViewerProps {
  product: Album | null; 
  onClose: () => void;
  onEdit?: (album: Album) => void;
}

const ProductModal: React.FC<AlbumViewerProps> = ({ product: album, onClose, onEdit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pdfPage, setPdfPage] = useState(1);
  const [inputPage, setInputPage] = useState("1");
  
  // Reset state when album changes
  useEffect(() => {
    if (album) {
        setCurrentIndex(0);
        setPdfPage(1);
        setInputPage("1");
    }
  }, [album]);

  const handlePdfPageChange = (newPage: number) => {
      if (newPage < 1) return;
      setPdfPage(newPage);
      setInputPage(newPage.toString());
  };

  const nextPage = () => {
    if (album?.images) {
        setCurrentIndex((prev) => (prev + 1) % album.images.length);
    }
  };

  const prevPage = () => {
    if (album?.images) {
        setCurrentIndex((prev) => (prev - 1 + album.images.length) % album.images.length);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!album) return;
      if (e.key === 'Escape') onClose();
      
      if (album.type === 'pdf') {
         if (e.key === 'ArrowLeft') handlePdfPageChange(pdfPage - 1);
         if (e.key === 'ArrowRight') handlePdfPageChange(pdfPage + 1);
      } else {
        if (e.key === 'ArrowLeft') prevPage();
        if (e.key === 'ArrowRight') nextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [album, currentIndex, pdfPage]);

  if (!album) return null;

  const isPdf = album.type === 'pdf';
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Allow only numbers
      const val = e.target.value.replace(/\D/g, '');
      setInputPage(val);
  };

  const handleInputSubmit = () => {
      const page = parseInt(inputPage);
      if (!isNaN(page) && page > 0) {
          handlePdfPageChange(page);
      } else {
          setInputPage(pdfPage.toString());
      }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          handleInputSubmit();
          (e.target as HTMLInputElement).blur();
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 flex justify-between items-center px-6 z-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <div className="text-white pointer-events-auto">
             <h2 className="text-lg font-medium shadow-black drop-shadow-md flex items-center gap-2">
                {album.title}
                {isPdf && <span className="px-1.5 py-0.5 bg-red-500 rounded text-[10px] font-bold">PDF</span>}
             </h2>
             {!isPdf && <p className="text-xs text-white/70">{currentIndex + 1} / {album.images.length}</p>}
        </div>
        
        <div className="flex items-center gap-2 pointer-events-auto">
            {onEdit && (
                <button
                    onClick={() => onEdit(album)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm group"
                    title="编辑信息"
                >
                    <PenLine size={20} className="opacity-80 group-hover:opacity-100" />
                </button>
            )}
            <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
            >
            <X size={24} />
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12 select-none">
        
        {isPdf ? (
            <>
                {/* PDF Viewer */}
                <div className="w-full h-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
                    <iframe 
                        key={pdfPage} // Force re-render on page change to ensure navigation
                        src={`${album.pdfUrl}#page=${pdfPage}&toolbar=0&view=FitH`}
                        className="w-full h-full"
                        title={album.title}
                    />
                </div>

                {/* PDF Controls */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-slate-900/90 backdrop-blur-md rounded-full shadow-2xl z-30 text-white animate-in slide-in-from-bottom-4 duration-300">
                    <button 
                        onClick={() => handlePdfPageChange(pdfPage - 1)}
                        disabled={pdfPage <= 1}
                        className="p-1.5 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                        title="上一页"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    <div className="flex items-center gap-3 text-sm font-medium border-x border-white/10 px-4">
                        <span className="text-white/60 text-xs uppercase tracking-wider">Page</span>
                        <div className="relative group">
                            <Hash size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/80 pointer-events-none" />
                            <input 
                                type="text" 
                                value={inputPage}
                                onChange={handleInputChange}
                                onBlur={handleInputSubmit}
                                onKeyDown={handleInputKeyDown}
                                className="w-16 bg-black/40 border border-white/10 rounded-md text-center py-1.5 pl-6 pr-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder:text-white/20"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={() => handlePdfPageChange(pdfPage + 1)}
                        className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                        title="下一页"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </>
        ) : (
            // Image Carousel
            <>
                {/* Left Arrow */}
                <button 
                    onClick={(e) => { e.stopPropagation(); prevPage(); }}
                    className="absolute left-4 md:left-8 z-10 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all backdrop-blur-sm hover:scale-110"
                >
                    <ChevronLeft size={32} />
                </button>

                {/* Image */}
                <div className="relative max-w-full max-h-full shadow-2xl transition-all duration-300">
                    <img 
                        key={currentIndex}
                        src={album.images[currentIndex]} 
                        alt={`Page ${currentIndex + 1}`}
                        className="max-h-[85vh] max-w-full object-contain rounded-md shadow-2xl animate-in zoom-in-95 duration-300"
                    />
                </div>

                {/* Right Arrow */}
                <button 
                    onClick={(e) => { e.stopPropagation(); nextPage(); }}
                    className="absolute right-4 md:right-8 z-10 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all backdrop-blur-sm hover:scale-110"
                >
                    <ChevronRight size={32} />
                </button>

                {/* Bottom Thumbnails */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full overflow-x-auto max-w-[90vw] no-scrollbar z-20">
                    {album.images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/80'}`}
                        />
                    ))}
                </div>
            </>
        )}

      </div>
    </div>
  );
};

export default ProductModal;