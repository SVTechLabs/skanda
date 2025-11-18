import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageCanvas } from './components/ImageCanvas';
import { Controls } from './components/Controls';
import { EditorMode, MemeState } from './types';
import { fileToBase64, urlToBase64 } from './utils';
import { generateMemeCaptions, editImageWithPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<MemeState>({
    originalImage: null,
    currentImage: null,
    selectedCaption: "",
    generatedCaptions: [],
    isGenerating: false,
    isEditing: false,
    error: null,
    mode: EditorMode.CAPTION
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setState(prev => ({
          ...prev,
          originalImage: base64,
          currentImage: base64,
          generatedCaptions: [],
          selectedCaption: "",
          error: null
        }));
      } catch (err) {
        setState(prev => ({ ...prev, error: "Failed to upload image." }));
      }
    }
  };

  const handleSelectTemplate = async (url: string) => {
      try {
          const base64 = await urlToBase64(url);
          setState(prev => ({
              ...prev,
              originalImage: base64,
              currentImage: base64,
              generatedCaptions: [],
              selectedCaption: "",
              error: null
          }));
      } catch (err) {
          setState(prev => ({ ...prev, error: "Failed to load template." }));
      }
  }

  const handleGenerateCaptions = useCallback(async () => {
    if (!state.currentImage) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const captions = await generateMemeCaptions(state.currentImage);
      setState(prev => ({
        ...prev,
        generatedCaptions: captions,
        isGenerating: false
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: "Failed to generate captions. AI might be busy."
      }));
    }
  }, [state.currentImage]);

  const handleEditImage = useCallback(async (prompt: string) => {
    if (!state.currentImage) return;

    setState(prev => ({ ...prev, isEditing: true, error: null }));

    try {
      // We typically want to edit the *original* or the *current*? 
      // Let's edit the current one to allow stacking edits, 
      // but usually editing the original yields cleaner results for completely different styles.
      // For this app, let's edit the currentImage so users can "iterate".
      const newImage = await editImageWithPrompt(state.currentImage, prompt);
      setState(prev => ({
        ...prev,
        currentImage: newImage,
        isEditing: false,
        // Reset caption when image changes drastically? Maybe keep it.
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        isEditing: false,
        error: "Failed to edit image. Ensure your prompt is clear."
      }));
    }
  }, [state.currentImage]);

  const setMode = (mode: EditorMode) => {
      setState(prev => ({ ...prev, mode }));
  }

  const setSelectedCaption = (caption: string) => {
      setState(prev => ({ ...prev, selectedCaption: caption }));
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        {/* Left Column: Canvas/Preview */}
        <div className="flex-1 flex flex-col gap-4">
          <ImageCanvas 
            image={state.currentImage} 
            caption={state.selectedCaption} 
          />
          
          {state.currentImage && (
             <div className="flex gap-2 justify-center">
                 <button 
                    onClick={() => setState(prev => ({ ...prev, currentImage: prev.originalImage, selectedCaption: "", generatedCaptions: [] }))}
                    className="text-xs text-slate-500 hover:text-slate-300 underline decoration-dashed"
                 >
                    Reset to Original
                 </button>
             </div>
          )}
        </div>

        {/* Right Column: Controls */}
        <div className="w-full lg:w-[400px] shrink-0 h-[600px] sticky top-24">
          <Controls 
            mode={state.mode}
            setMode={setMode}
            onUpload={handleUpload}
            onSelectTemplate={handleSelectTemplate}
            onGenerateCaptions={handleGenerateCaptions}
            onEditImage={handleEditImage}
            captions={state.generatedCaptions}
            onSelectCaption={setSelectedCaption}
            isGenerating={state.isGenerating}
            isEditing={state.isEditing}
            hasImage={!!state.currentImage}
            error={state.error}
          />
        </div>
      </main>
      
      <footer className="w-full py-6 text-center border-t border-slate-900 bg-slate-950/50">
        <p className="text-slate-500 text-sm font-medium">By Skanda</p>
      </footer>
    </div>
  );
};

export default App;