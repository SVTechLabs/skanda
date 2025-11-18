export enum EditorMode {
  CAPTION = 'CAPTION',
  EDIT = 'EDIT'
}

export interface MemeState {
  originalImage: string | null; // Base64 data URL
  currentImage: string | null; // Base64 data URL (could be edited)
  selectedCaption: string;
  generatedCaptions: string[];
  isGenerating: boolean;
  isEditing: boolean;
  error: string | null;
  mode: EditorMode;
}

export interface TemplateImage {
  id: string;
  url: string;
}