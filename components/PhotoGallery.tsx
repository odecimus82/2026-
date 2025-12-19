
import React, { useState, useRef } from 'react';

interface GalleryImage {
  id: string;
  url: string;
  name: string;
}

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<GalleryImage[]>([
    { id: '1', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800', name: '炭火烧烤' },
    { id: '2', url: 'https://images.unsplash.com/photo-1558030006-45c675171f23?q=80&w=800', name: '全羊盛宴' },
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto: GalleryImage = {
          id: Math.random().toString(36).substr(2, 9),
          url: event.target?.result as string,
          name: file.name || `照片_${new Date().toLocaleTimeString()}`
        };
        setPhotos(prev => [newPhoto, ...prev]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="autumn-card rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-2xl shadow-orange-100 border-orange-50">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black font-corsair text-zinc-800 uppercase tracking-tighter">活动精彩图集</h2>
        <p className="text-zinc-500 font-medium italic">欢迎各位组员拍照或上传团建精彩瞬间，共同珍藏欢乐时光</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 操作卡片：包含上传和拍照 */}
        <div className="flex flex-col gap-4 aspect-square">
          {/* 拍照按钮 */}
          <div 
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 group cursor-pointer relative overflow-hidden rounded-3xl border-4 border-dashed border-yellow-200 flex flex-col items-center justify-center hover:border-yellow-400 hover:bg-yellow-50/30 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-yellow-700 font-black uppercase text-xs tracking-widest">拍照上传</span>
            <input 
              type="file" 
              ref={cameraInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
            />
          </div>

          {/* 上传按钮 */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 group cursor-pointer relative overflow-hidden rounded-3xl border-4 border-dashed border-orange-100 flex flex-col items-center justify-center hover:border-orange-300 hover:bg-orange-50/30 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <span className="text-orange-600 font-black uppercase text-xs tracking-widest">选择相册</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              multiple 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        {/* 已上传照片列表 */}
        {photos.map((photo) => (
          <div key={photo.id} className="group relative overflow-hidden rounded-3xl aspect-square shadow-lg hover:shadow-xl transition-all">
            <img 
              src={photo.url} 
              alt={photo.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
              <div className="flex justify-end">
                <button 
                  onClick={(e) => { e.stopPropagation(); removePhoto(photo.id); }}
                  className="bg-white/20 hover:bg-red-500/80 p-2 rounded-full text-white backdrop-blur-md transition-colors"
                  title="删除照片"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <span className="text-white font-bold text-lg truncate">{photo.name}</span>
            </div>
          </div>
        ))}
      </div>
      
      {photos.length === 0 && (
        <div className="text-center py-12 opacity-30">
          <p className="text-zinc-400">目前还没有照片，快来当第一个分享者吧！</p>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
