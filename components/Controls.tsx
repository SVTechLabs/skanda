import React, { useState } from 'react';
import { Wand2, Image as ImageIcon, RefreshCcw, PenTool, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { EditorMode, TemplateImage } from '../types';

interface ControlsProps {
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectTemplate: (url: string) => void;
  onGenerateCaptions: () => void;
  onEditImage: (prompt: string) => void;
  captions: string[];
  onSelectCaption: (caption: string) => void;
  isGenerating: boolean;
  isEditing: boolean;
  hasImage: boolean;
  error: string | null;
}

// Sample picsum images for templates
const TEMPLATES: TemplateImage[] = [
  { id: '1', url: 'https://picsum.photos/seed/cat/400/400' },
  { id: '2', url: 'https://picsum.photos/seed/dog/400/400' },
  { id: '3', url: 'https://picsum.photos/seed/office/400/400' },
  { id: '4', url: 'https://picsum.photos/seed/computer/400/400' },
];

export const Controls: React.FC<ControlsProps> = ({
  mode,
  setMode,
  onUpload,
  onSelectTemplate,
  onGenerateCaptions,
  onEditImage,
  captions,
  onSelectCaption,
  isGenerating,
  isEditing,
  hasImage,
  error
}) => {
  const [editPrompt, setEditPrompt] = useState("");

  return (
    <div className="w-full bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex flex-col gap-6 h-full">
      
      {/* Mode Toggles */}
      <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl">
        <button
          onClick={() => setMode(EditorMode.CAPTION)}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
            mode === EditorMode.CAPTION 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
            : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Magic Caption
        </button>
        <button
          onClick={() => setMode(EditorMode.EDIT)}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
            mode === EditorMode.EDIT 
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
            : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <PenTool className="w-4 h-4" />
          AI Editor
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CONTENT BASED ON MODE */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
        
        {/* === UPLOAD SECTION (Always visible if no image, or condensed) === */}
        {!hasImage && (
          <div className="space-y-4">
            <h3 className="text-slate-200 font-semibold flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              Start with an image
            </h3>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer hover:bg-slate-800/50 hover:border-indigo-500 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-8 h-8 text-slate-500 mb-2 group-hover:text-indigo-400 transition-colors" />
                <p className="text-sm text-slate-500 group-hover:text-slate-300">Click to upload image</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
            </label>

            <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Trending Templates</p>
                <div className="grid grid-cols-4 gap-2">
                    {TEMPLATES.map(t => (
                        <button 
                            key={t.id}
                            onClick={() => onSelectTemplate(t.url)}
                            className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all opacity-80 hover:opacity-100"
                        >
                            <img src={t.url} alt="template" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>
          </div>
        )}

        {/* === CAPTION MODE === */}
        {hasImage && mode === EditorMode.CAPTION && (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                <h3 className="text-slate-300 font-medium mb-2 text-sm">Generate Captions</h3>
                <p className="text-xs text-slate-500 mb-4">AI analyzes the image context to write funny lines.</p>
                
                <button 
                    onClick={onGenerateCaptions}
                    disabled={isGenerating}
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Brewing magic...
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-5 h-5" />
                            Magic Caption
                        </>
                    )}
                </button>
            </div>

            {captions.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Suggestions</p>
                    <div className="space-y-2">
                        {captions.map((caption, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSelectCaption(caption)}
                                className="w-full p-3 text-left text-sm bg-slate-800 hover:bg-slate-700 rounded-lg border border-transparent hover:border-indigo-500 transition-all"
                            >
                                "{caption}"
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>
        )}

        {/* === EDIT MODE === */}
        {hasImage && mode === EditorMode.EDIT && (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                <h3 className="text-slate-300 font-medium mb-2 text-sm">AI Image Editor</h3>
                <p className="text-xs text-slate-500 mb-4">Powered by Advanced AI. Describe how to change the image.</p>
                
                <div className="space-y-3">
                    <textarea 
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        placeholder="E.g., 'Add a retro glitch filter', 'Make the cat wear sunglasses', 'Remove the background'"
                        className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                    />
                    
                    <button 
                        onClick={() => onEditImage(editPrompt)}
                        disabled={isEditing || !editPrompt.trim()}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isEditing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Editing...
                            </>
                        ) : (
                            <>
                                <RefreshCcw className="w-5 h-5" />
                                Generate Edit
                            </>
                        )}
                    </button>
                </div>
            </div>
            
            <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/30 text-xs text-blue-200">
                <strong>Pro Tip:</strong> Be specific. Try "Oil painting style" or "Turn the dog into a robot".
            </div>
          </div>
        )}
        
        {hasImage && (
            <div className="mt-auto pt-4 border-t border-slate-800">
                <label className="flex items-center justify-center gap-2 w-full py-2 text-sm text-slate-400 hover:text-white cursor-pointer transition-colors">
                   <ImageIcon className="w-4 h-4" />
                   Change Image
                   <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
                </label>
            </div>
        )}
      </div>
    </div>
  );
};