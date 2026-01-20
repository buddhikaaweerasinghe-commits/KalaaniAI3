
import { ThemeConfig } from './types';

export const THEMES: ThemeConfig[] = [
  {
    id: 'fearless',
    name: 'Fearless',
    previewColor: '#5C3977',
    styles: {
      background: 'bg-[#5C3977]',
      text: 'text-white',
      accent: 'text-[#EE5340]',
      card: 'bg-white/10 backdrop-blur-sm',
      titleFont: 'font-montserrat font-extrabold tracking-tighter',
      bodyFont: 'font-montserrat'
    }
  }
];

export const TONES = ['Professional', 'Creative', 'Casual', 'Academic', 'Sales Pitch'];
export const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];