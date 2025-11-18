import React from 'react';
import { Download } from 'lucide-react';

interface ImageCanvasProps {
  image: string | null;
  caption: string;
}

export const ImageCanvas: React.FC<ImageCanvasProps> = ({ image, caption }) => {
  const canvasRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    // Simple download for MVP - in a real app, we'd use html2canvas or draw to a real <canvas>
    // Here we just download the base source image for now, as html2canvas adds complexity to deps
    if (image) {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'meme-gen-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  if (!image) {
    return (
      <div className="w-full h-[400px] md:h-[600px] bg-slate-900 rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 p-8 animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <p className="text-lg font-medium">No image selected</p>
        <p className="text-sm">Upload or select a template to begin</p>
      </div>
    );
  }

  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-2xl bg-black ring-1 ring-slate-800 w-full" ref={canvasRef}>
      {/* Image Container */}
      <div className="relative w-full flex justify-center bg-slate-950">
          <img 
            src={image} 
            alt="Meme workspace" 
            className="max-h-[600px] w-auto object-contain" 
          />
          
          {/* Caption Overlay */}
          {caption && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20 pb-8 text-center">
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
                {caption}
              </h2>
            </div>
          )}
      </div>

      {/* Action overlay */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
            onClick={handleDownload}
            className="p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-lg text-white transition-colors"
            title="Download Base Image"
        >
            <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};