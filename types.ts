
export enum AppStep {
  PROMPT = 'PROMPT',
  OUTLINE = 'OUTLINE',
  THEME = 'THEME',
  VIEWER = 'VIEWER'
}

export type SlideType = 'title' | 'content' | 'image' | 'split' | 'closing' | 'quote' | 'highlight' | 'section' | 'agenda';

export interface SlideContent {
  id: string;
  type: SlideType;
  title: string;
  points: string[];
  imagePrompt?: string;
  imageUrl?: string;
  layout?: 'default' | 'inverted' | 'centered';
}

export interface Presentation {
  id: string;
  topic: string;
  tone: string;
  language: string;
  slides: SlideContent[];
  themeId: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  previewColor: string;
  styles: {
    background: string;
    text: string;
    accent: string;
    card: string;
    titleFont: string;
    bodyFont: string;
  };
}

export interface OutlineItem {
  id: string;
  title: string;
  description: string;
  slideType: SlideType;
}

export interface GammaTheme {
  id: string;
  name: string;
  type: 'standard' | 'custom';
  colorKeywords: string[];
  toneKeywords: string[];
}

export interface GammaFolder {
  id: string;
  name: string;
}
