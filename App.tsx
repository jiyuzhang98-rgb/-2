import React, { useState, useMemo } from 'react';
import { Search, Book, LayoutGrid, Upload, Settings, Check, ArrowUpDown, ListFilter } from 'lucide-react';
import { Album, AlbumCategory } from './types';
import { MOCK_ALBUMS } from './constants';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import AIChat from './components/AIChat';
import AlbumFormModal from './components/AlbumFormModal';

const App: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>(MOCK_ALBUMS);
  const [selectedCategory, setSelectedCategory] = useState<AlbumCategory>(AlbumCategory.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'manual'>('newest');
  
  // Drag & Drop State
  const [draggedAlbumId, setDraggedAlbumId] = useState<string | null>(null);
  
  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  
  // Manage Mode State
  const [isManageMode, setIsManageMode] = useState(false);

  // Filter & Sort Logic
  const filteredAlbums = useMemo(() => {
    const filtered = albums.filter((album) => {
      const matchesCategory = selectedCategory === AlbumCategory.ALL || album.category === selectedCategory;
      const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortOrder === 'manual') {
      return filtered;
    }

    return filtered.sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.date.localeCompare(a.date);
      } else {
        return a.date.localeCompare(b.date);
      }
    });
  }, [selectedCategory, searchQuery, albums, sortOrder]);

  // Get unique categories from current albums + default categories
  const categories = useMemo(() => {
    const baseCategories = Object.values(AlbumCategory);
    return baseCategories.filter(cat => 
        cat !== AlbumCategory.CUSTOM || albums.some(a => a.category === AlbumCategory.CUSTOM)
    );
  }, [albums]);

  const handleOpenCreateModal = () => {
    setEditingAlbum(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (album: Album) => {
    setEditingAlbum(album);
    setIsFormModalOpen(true);
  };

  const handleSaveAlbum = (data: Partial<Album>, file?: File) => {
    if (editingAlbum) {
        // Update existing
        setAlbums(prev => prev.map(a => a.id === editingAlbum.id ? { ...a, ...data } : a));
        // If the currently viewed album is the one being edited, update it too
        if (selectedAlbum && selectedAlbum.id === editingAlbum.id) {
            setSelectedAlbum(prev => prev ? { ...prev, ...data } : null);
        }
    } else {
        // Create new
        if (!file) return;
        const newAlbum: Album = {
            id: `pdf-${Date.now()}`,
            title: data.title || '未命名画册',
            category: data.category || AlbumCategory.CUSTOM,
            date: data.date || new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' }),
            cover: data.cover || 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&q=80&w=1600',
            images: [],
            type: 'pdf',
            pdfUrl: URL.createObjectURL(file)
        };
        setAlbums(prev => [newAlbum, ...prev]);
        setSelectedCategory(AlbumCategory.CUSTOM);
        setSortOrder('manual'); // Switch to manual to show new item at top if we prepended
    }
  };

  const handleDeleteAlbum = (id: string) => {
      setAlbums(prev => prev.filter(a => a.id !== id));
      
      // If we are viewing the deleted album, close the viewer
      if (selectedAlbum && selectedAlbum.id === id) {
          setSelectedAlbum(null);
      }
      
      // Close the edit modal
      setIsFormModalOpen(false);
      setEditingAlbum(null);
  };

  const handleConfirmDelete = (album: Album) => {
      if (window.confirm(`确定要删除 "${album.title}" 吗？`)) {
          handleDeleteAlbum(album.id);
      }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, albumId: string) => {
    if (!isManageMode) return;
    setDraggedAlbumId(albumId);
    // Set effect allowed
    e.dataTransfer.effectAllowed = 'move';
    // Optional: set a custom drag image or data if needed
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isManageMode) return;
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    if (!isManageMode || !draggedAlbumId || draggedAlbumId === targetId) return;
    e.preventDefault();

    const draggedIndex = albums.findIndex(a => a.id === draggedAlbumId);
    const targetIndex = albums.findIndex(a => a.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create new array and move item
    const newAlbums = [...albums];
    const [removed] = newAlbums.splice(draggedIndex, 1);
    newAlbums.splice(targetIndex, 0, removed);

    setAlbums(newAlbums);
    setSortOrder('manual'); // Auto-switch to manual sort so the order persists visually
    setDraggedAlbumId(null);
  };

  const toggleSortOrder = () => {
      setSortOrder(prev => {
          if (prev === 'newest') return 'oldest';
          if (prev === 'oldest') return 'manual';
          return 'newest';
      });
  };

  const getSortLabel = () => {
      switch (sortOrder) {
          case 'newest': return '最新发布';
          case 'oldest': return '最早发布';
          case 'manual': return '自定义排序';
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-4 cursor-pointer shrink-0" onClick={() => {setSelectedCategory(AlbumCategory.ALL); setSearchQuery('')}}>
                <img 
                    src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 170 50'%3E%3Ctext x='0' y='42' font-family='Inter, sans-serif' font-weight='900' font-size='50' letter-spacing='-1' fill='black'%3EKANO%3C/text%3E%3C/svg%3E"
                    alt="KANO" 
                    className="h-7 md:h-9 w-auto object-contain"
                />
                <div className="hidden md:block border-l border-slate-200 pl-4 py-1">
                    <p className="text-[10px] text-slate-500 font-semibold tracking-[0.2em] uppercase leading-none">Digital Catalog</p>
                    <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase leading-none mt-1">产品电子画册</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-4 flex-1 justify-end">
                
                {/* Manage Button */}
                <button 
                    onClick={() => setIsManageMode(!isManageMode)}
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-full text-sm font-medium transition-all shadow-sm ${
                        isManageMode 
                        ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900/20' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                >
                    {isManageMode ? <Check size={16} /> : <Settings size={16} />}
                    <span className="hidden sm:inline">{isManageMode ? '完成管理' : '管理画册'}</span>
                </button>

                {/* Upload Button */}
                <button 
                    onClick={handleOpenCreateModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-medium transition-all shadow-sm shadow-indigo-200 group"
                >
                    <Upload size={16} className="text-indigo-200 group-hover:text-white transition-colors" />
                    <span className="hidden sm:inline">导入 PDF</span>
                    <span className="sm:hidden">导入</span>
                </button>

                {/* Search Bar */}
                <div className={`relative transition-all duration-300 ${isSearchFocused ? 'w-full md:w-[300px]' : 'w-[140px] md:w-[240px]'}`}>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="搜索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-slate-900 border border-slate-200 rounded-full text-sm transition-all outline-none placeholder:text-slate-400"
                        />
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Category Filter & Sort */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar w-full sm:w-auto mask-linear-fade">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                            selectedCategory === category
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            
            <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                <button
                    onClick={toggleSortOrder}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
                >
                    {sortOrder === 'manual' ? <ListFilter size={16} /> : <ArrowUpDown size={16} />}
                    <span>{getSortLabel()}</span>
                </button>

                <div className="hidden sm:flex items-center text-xs text-slate-400 font-medium border-l border-slate-200 pl-4">
                    共 {filteredAlbums.length} 本画册
                </div>
                
                {/* Mobile count display */}
                <div className="sm:hidden text-xs text-slate-400 font-medium">
                    {filteredAlbums.length} 本
                </div>
            </div>
        </div>

        {/* Product Grid */}
        {filteredAlbums.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 pb-20">
                {filteredAlbums.map((album) => (
                    <div 
                        key={album.id} 
                        className={`h-full transition-all duration-300 ${draggedAlbumId === album.id ? 'opacity-40 scale-95' : 'animate-in fade-in duration-500 slide-in-from-bottom-4'}`}
                        draggable={isManageMode}
                        onDragStart={(e) => handleDragStart(e, album.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, album.id)}
                    >
                        <ProductCard 
                            product={album} 
                            onClick={setSelectedAlbum}
                            isManageMode={isManageMode}
                            onEdit={handleOpenEditModal}
                            onDelete={handleConfirmDelete}
                        />
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Book size={32} className="opacity-50" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">未找到相关画册</h3>
                <p className="text-sm">请尝试调整搜索关键词或筛选条件</p>
                <button 
                    onClick={() => {setSearchQuery(''); setSelectedCategory(AlbumCategory.ALL);}}
                    className="mt-6 text-indigo-600 hover:text-indigo-700 font-medium hover:underline text-sm"
                >
                    清除所有筛选
                </button>
            </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">KANO</span>
                  <span>|</span>
                  <span>Design for future</span>
              </div>
              <div>
                  © {new Date().getFullYear()} Kano Furniture. All rights reserved.
              </div>
          </div>
      </footer>

      {/* Album Viewer Modal */}
      <ProductModal 
        product={selectedAlbum} 
        onClose={() => setSelectedAlbum(null)}
        onEdit={handleOpenEditModal}
      />
      
      {/* Upload/Edit Form Modal */}
      <AlbumFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveAlbum}
        onDelete={handleDeleteAlbum}
        initialData={editingAlbum}
      />
      
      <AIChat />
    </div>
  );
};

export default App;