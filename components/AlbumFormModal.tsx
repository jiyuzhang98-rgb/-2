import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, FileText, Check, Trash2 } from 'lucide-react';
import { Album, AlbumCategory } from '../types';

interface AlbumFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Album>, file?: File) => void;
  onDelete: (id: string) => void;
  initialData?: Album | null;
}

const AlbumFormModal: React.FC<AlbumFormModalProps> = ({ isOpen, onClose, onSave, onDelete, initialData }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AlbumCategory>(AlbumCategory.CUSTOM);
  const [dateStr, setDateStr] = useState('');
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setCategory(initialData.category);
        setCoverPreview(initialData.cover);
        setCoverFile(null);
        setPdfFile(null);
        
        // Parse date from "YYYY年MM月" to "YYYY-MM" for input
        const match = initialData.date.match(/(\d{4})年(\d{1,2})月/);
        if (match) {
            setDateStr(`${match[1]}-${match[2].padStart(2, '0')}`);
        } else {
            setDateStr(new Date().toISOString().slice(0, 7));
        }
      } else {
        setTitle('');
        setCategory(AlbumCategory.CUSTOM);
        setDateStr(new Date().toISOString().slice(0, 7)); // Default to current month
        setCoverPreview('');
        setCoverFile(null);
        setPdfFile(null);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const isEditMode = !!initialData;

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      if (!title) {
        setTitle(file.name.replace('.pdf', ''));
      }
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCoverFile(file);
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!isEditMode && !pdfFile) return;
    if (!title.trim()) return;

    // Format date back to "YYYY年MM月"
    let formattedDate = dateStr;
    if (dateStr) {
       const [y, m] = dateStr.split('-');
       formattedDate = `${y}年${m}月`;
    }

    const albumData: Partial<Album> = {
      title,
      category,
      date: formattedDate,
      // If coverFile is present, the parent will handle generating the URL/blob
      // If not, we keep the existing cover (if edit mode) or use a placeholder
    };

    // Pass the cover file separately if it exists, otherwise the preview string might be the old URL
    if (coverFile) {
        // We pass the blob URL temporarily for immediate UI update, 
        // but in a real app you'd upload 'coverFile' to a server.
        albumData.cover = coverPreview; 
    } else if (isEditMode) {
        albumData.cover = initialData?.cover;
    }

    onSave(albumData, pdfFile || undefined);
    onClose();
  };
  
  const handleDelete = () => {
      if (initialData && window.confirm(`确定要删除 "${initialData.title}" 吗？此操作无法撤销。`)) {
          onDelete(initialData.id);
      }
  };

  const categories = Object.values(AlbumCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">
            {isEditMode ? '编辑画册信息' : '导入 PDF 画册'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* PDF File Input (Only for Create Mode) */}
          {!isEditMode && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">PDF 文件</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${pdfFile ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handlePdfChange}
                  accept="application/pdf" 
                  className="hidden" 
                />
                {pdfFile ? (
                  <>
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-2">
                      <FileText size={24} />
                    </div>
                    <p className="text-sm font-medium text-indigo-900 truncate max-w-full px-4">{pdfFile.name}</p>
                    <p className="text-xs text-indigo-500 mt-1">点击更换文件</p>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center mb-2">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-medium text-slate-700">点击上传 PDF 文件</p>
                    <p className="text-xs text-slate-400 mt-1">支持最大 50MB</p>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Left Column: Inputs */}
             <div className="space-y-5">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">画册标题</label>
                    <input 
                        type="text" 
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="输入标题..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">发布时间</label>
                    <input 
                        type="month"
                        required
                        value={dateStr}
                        onChange={(e) => setDateStr(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">所属分类</label>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value as AlbumCategory)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
             </div>

             {/* Right Column: Cover Image */}
             <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                    封面图片 <span className="text-slate-400 font-normal text-xs">(可选)</span>
                </label>
                <div 
                    onClick={() => coverInputRef.current?.click()}
                    className="relative aspect-[3/4] md:aspect-auto md:h-[136px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group h-full min-h-[200px] md:min-h-0"
                >
                    <input 
                        type="file" 
                        ref={coverInputRef}
                        onChange={handleCoverChange}
                        accept="image/*" 
                        className="hidden" 
                    />
                    {coverPreview ? (
                        <>
                            <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">更换封面</span>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors">
                            <ImageIcon size={24} className="mb-2" />
                            <span className="text-xs">上传封面</span>
                        </div>
                    )}
                </div>
             </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-100">
            <div>
                {isEditMode && (
                    <button 
                        type="button"
                        onClick={handleDelete}
                        className="text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">删除画册</span>
                        <span className="sm:hidden">删除</span>
                    </button>
                )}
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                    取消
                </button>
                <button 
                    type="submit"
                    disabled={!isEditMode && !pdfFile}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-black rounded-full transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Check size={16} />
                    {isEditMode ? '保存修改' : '确认导入'}
                </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AlbumFormModal;