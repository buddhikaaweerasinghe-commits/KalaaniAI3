
import React from 'react';
import { SlideContent, ThemeConfig } from '../types';

interface SlideRendererProps {
  slide: SlideContent;
  theme: ThemeConfig;
  isActive: boolean;
  customLogoUrl?: string | null;
}

const BrandLogo = ({ color, size = 32 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 25C20 20 25 15 50 15C75 15 80 20 80 25V35C80 40 75 45 50 45C25 45 20 40 20 35V25Z" fill={color} fillOpacity="0.8" />
    <path d="M35 45V75C35 80 40 85 50 85C60 85 65 80 65 75V45H35Z" fill={color} />
  </svg>
);

export const SlideRenderer: React.FC<SlideRendererProps> = ({ slide, theme, isActive, customLogoUrl }) => {
  const s = theme.styles;
  const isFearless = theme.id === 'fearless';

  const getDynamicTitleSize = (text: string, baseClass: string, longClass: string, maxLength = 30) => {
    return text.length > maxLength ? longClass : baseClass;
  };

  const renderLayout = () => {
    switch (slide.type) {
      case 'title':
        return (
          <div className="flex flex-col h-full justify-center items-start pl-12 md:pl-24 space-y-8 pr-12">
            {customLogoUrl && (
              <img src={customLogoUrl} alt="Logo" className="h-12 md:h-16 w-auto object-contain mb-4 animate-in fade-in slide-in-from-left-4 duration-1000" />
            )}
            <h1 className={`${s.titleFont} ${getDynamicTitleSize(slide.title, 'text-6xl md:text-8xl lg:text-[90px]', 'text-5xl md:text-6xl lg:text-7xl')} max-w-5xl leading-[0.9] ${s.text} break-words`}>
              {slide.title}
            </h1>
            <p className={`${s.bodyFont} text-lg md:text-2xl font-medium opacity-60 max-w-2xl`}>
              {slide.points[0] || 'Strategic Presentation Architecture'}
            </p>
          </div>
        );

      case 'agenda':
        return (
          <div className="relative h-full w-full">
            <div className="grid grid-cols-2 h-full">
              <div className="flex flex-col justify-center items-start pl-12 md:pl-20 pr-8 space-y-12">
                <div className="space-y-4">
                  {customLogoUrl && (
                    <img src={customLogoUrl} alt="Logo" className="h-8 md:h-10 w-auto object-contain mb-2" />
                  )}
                  <h2 className={`${s.titleFont} text-5xl md:text-6xl text-white tracking-tight`}>
                    {slide.title || 'Agenda'}
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <h3 className={`${s.titleFont} text-xl md:text-2xl text-[#EE5340] uppercase tracking-widest`}>
                    Schedule
                  </h3>
                  <ul className="space-y-3">
                    {slide.points.map((p, i) => {
                      const [time, ...rest] = p.split(':');
                      const desc = rest.join(':').trim();
                      return (
                        <li key={i} className="flex items-start space-x-4">
                          <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-white/30 shrink-0"></span>
                          <p className="text-lg md:text-xl font-medium">
                            <span className="text-white/40 mr-2 font-bold">{time}</span>
                            <span className="text-white/80">{desc}</span>
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-center p-12">
                {slide.imageUrl ? (
                  <div className="w-full h-full max-w-md aspect-square relative group">
                    <img 
                      src={slide.imageUrl} 
                      alt="Agenda visual" 
                      className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform duration-700 group-hover:scale-105" 
                    />
                  </div>
                ) : (
                  <div className="w-full h-full max-w-md aspect-square bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center animate-pulse">
                    <BrandLogo color="white" size={64} />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'section':
        return (
          <div className="relative h-full w-full">
            <div className="grid grid-cols-2 h-full">
              <div className="flex flex-col justify-center items-start pl-12 md:pl-20 pr-8">
                <h2 className={`${s.titleFont} ${getDynamicTitleSize(slide.title, 'text-5xl md:text-7xl lg:text-8xl', 'text-4xl md:text-5xl lg:text-6xl', 15)} leading-[0.9] text-white tracking-tighter break-words max-w-full`}>
                  {slide.title.split(' ').map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h2>
              </div>

              <div className="flex flex-col justify-center items-start pl-12 md:pl-16 pr-12 md:pr-24">
                <div className="max-w-md space-y-4">
                  <p className={`${s.bodyFont} text-xl md:text-3xl font-bold text-white/90 leading-tight`}>
                    {slide.points[0]?.split('. ')[0]}.
                  </p>
                  <p className={`${s.bodyFont} text-lg md:text-xl font-medium text-white/50 leading-relaxed`}>
                    {slide.points[0]?.split('. ').slice(1).join('. ') || 'Exploring the core components and strategic vision of this initiative.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'highlight':
        const highlightWords = slide.title.split(' ');
        const highlightWord = highlightWords[0];
        const remainingWords = highlightWords.slice(1).join(' ');

        return (
          <div className="flex flex-col h-full justify-center items-start pl-12 md:pl-24 pr-12">
            <h2 className={`${s.titleFont} text-5xl md:text-7xl lg:text-[100px] leading-[1.1] text-white`}>
              <span className="bg-white text-[#5C3977] px-4 py-2 mr-4 inline-block transform -skew-x-2">
                {highlightWord}
              </span>
              <span className="inline-block">{remainingWords}</span>
            </h2>
            {slide.points[0] && (
               <p className="mt-8 text-xl md:text-2xl opacity-60 font-medium max-w-2xl italic">
                 {slide.points[0]}
               </p>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="flex flex-col h-full justify-center items-center px-12 md:px-32 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] leading-none opacity-10 pointer-events-none select-none font-montserrat font-black text-[#EE5340]">
              “
            </div>
            <div className="space-y-10 relative z-10">
              <h2 className={`${s.titleFont} ${getDynamicTitleSize(slide.title, 'text-4xl md:text-6xl lg:text-7xl', 'text-2xl md:text-4xl lg:text-5xl', 80)} leading-[1.1] text-white italic tracking-tight`}>
                {slide.title}
              </h2>
              <div className="flex flex-col items-center space-y-4">
                <div className="h-1 w-12 bg-[#EE5340]"></div>
                <p className={`${s.bodyFont} text-xl md:text-3xl font-bold opacity-60 tracking-widest uppercase`}>
                  — {slide.points[0] || 'Fearless Insight'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'split':
        return (
          <div className="flex h-full w-full absolute inset-0">
            <div className="w-1/2 h-full flex flex-col justify-center px-12 md:px-20 bg-[#5C3977] overflow-hidden">
              <div className="space-y-10 max-w-full">
                <h2 className={`${s.titleFont} ${getDynamicTitleSize(slide.title, 'text-4xl md:text-6xl lg:text-7xl', 'text-3xl md:text-4xl lg:text-5xl', 20)} text-white leading-[0.95] tracking-tighter break-words`}>
                  {slide.title}
                </h2>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30 text-white">
                    Strategic Insight
                  </p>
                  <div className="h-1 w-16 bg-[#EE5340]"></div>
                </div>
              </div>
            </div>
            <div className="w-1/2 h-full relative overflow-hidden flex flex-col justify-center px-12 md:px-20 bg-white text-[#2c1810]">
              <div className="space-y-6 max-w-full">
                <h3 className={`${s.titleFont} text-xl md:text-2xl text-[#5C3977] opacity-40 uppercase tracking-[0.2em] font-black`}>
                  Key Takeaways
                </h3>
                <div className="space-y-4">
                  {slide.points.slice(0, 5).map((p, i) => (
                    <div key={i} className="flex flex-col" style={{ paddingLeft: `${Math.min(i * 16, 48)}px` }}>
                      <div className="flex items-center space-x-3">
                        <span className={`w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-[#5C3977]' : 'border-2 border-slate-300'} shrink-0`}></span>
                        <span className="text-base md:text-lg opacity-80 font-semibold leading-snug">{p}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="absolute inset-0 w-full h-full">
            {slide.imageUrl && <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-[#5C3977] via-transparent to-transparent opacity-90"></div>
            <div className="absolute bottom-32 left-12 md:left-24 max-w-[80%]">
              <h2 className={`${s.titleFont} ${getDynamicTitleSize(slide.title, 'text-5xl md:text-8xl', 'text-4xl md:text-6xl')} text-white drop-shadow-2xl leading-[0.85] break-words`}>
                {slide.title}
              </h2>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="grid h-full grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col justify-center space-y-10 pl-4 pr-8">
              <h2 className={`${s.titleFont} ${getDynamicTitleSize(slide.title, 'text-4xl md:text-6xl', 'text-3xl md:text-5xl')} text-[#EE5340] uppercase leading-tight`}>
                {slide.title}
              </h2>
              <ul className="space-y-6">
                {slide.points.slice(0, 4).map((p, i) => (
                  <li key={i} className="flex items-start space-x-4">
                    <span className="mt-2 h-2 w-2 rounded-full shrink-0 bg-white/20"></span>
                    <span className={`${s.bodyFont} text-lg md:text-2xl opacity-90 font-medium leading-snug`}>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            {slide.imageUrl && (
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border border-white/5">
                <img src={slide.imageUrl} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            )}
          </div>
        );

      case 'closing':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-12 relative z-10">
            <div className="p-8 bg-white/5 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center min-w-[200px] min-h-[200px]">
              {customLogoUrl ? (
                <img src={customLogoUrl} alt="Logo" className="max-w-[240px] max-h-[160px] object-contain" />
              ) : (
                <BrandLogo color="white" size={120} />
              )}
            </div>
            <div className="space-y-3">
              <p className="text-2xl md:text-4xl font-black text-white tracking-tighter">
                {customLogoUrl ? 'Thank You' : 'presenton.ai'}
              </p>
              <p className="text-lg md:text-xl font-bold text-white/30 tracking-[0.4em] uppercase">
                {customLogoUrl ? 'For Your Attention' : 'Built with Gemini'}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative w-full aspect-video ${s.background} ${s.text} p-12 md:p-20 shadow-2xl transition-all duration-500 overflow-hidden font-montserrat ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
      
      {/* Global Branding Element (Bottom Right) - Removed from title and closing slides */}
      {slide.type !== 'closing' && slide.type !== 'title' && (
        <div className="absolute bottom-6 right-6 z-40">
           {customLogoUrl ? (
              <div className="bg-white/10 backdrop-blur-xl p-3 rounded-xl border border-white/10 shadow-2xl">
                <img src={customLogoUrl} alt="Branding" className="h-8 md:h-12 w-auto object-contain max-w-[120px]" />
              </div>
           ) : (
              <div className="p-4 rounded-lg shadow-xl flex items-center justify-center bg-[#EE5340]">
                <BrandLogo color="white" size={24} />
              </div>
           )}
        </div>
      )}

      {/* Visual Decor Layer for Fearless */}
      {isFearless && (
        <>
          <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]">
            {[0, 25, 50, 75].map(top => (
              <div key={top} className="absolute left-0 w-full h-[1px] bg-white" style={{ top: `${top}%` }}></div>
            ))}
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white border-dashed border-l"></div>
          </div>

          {slide.type !== 'closing' && slide.type !== 'title' && (
            <div className="absolute bottom-0 right-0 z-40 flex">
               <div className="bg-white/5 backdrop-blur-xl px-4 py-8 flex flex-col items-center justify-end border-t border-l border-white/5">
                  <div className="[writing-mode:vertical-lr] text-[10px] font-black tracking-[0.4em] text-white/20 rotate-180 uppercase">
                    SLIDE {parseInt(slide.id) + 1 < 10 ? `0${parseInt(slide.id) + 1}` : parseInt(slide.id) + 1}
                  </div>
               </div>
               {!customLogoUrl && (
                 <div className="bg-[#5C3977]/80 backdrop-blur-3xl p-8 flex items-center justify-center border-l border-t border-white/10 shadow-2xl">
                    <BrandLogo color="white" size={40} />
                 </div>
               )}
            </div>
          )}
        </>
      )}

      {!isFearless && (
        <>
          <div className={`absolute top-0 right-0 w-80 h-80 ${s.accent} bg-current opacity-[0.03] rounded-bl-full`}></div>
          <div className="absolute bottom-12 right-12 text-sm opacity-30 font-black tracking-[0.4em] uppercase z-20">
            {theme.name.toUpperCase()} • {parseInt(slide.id) + 1}
          </div>
        </>
      )}
      
      <div className="relative z-10 h-full">
        {renderLayout()}
      </div>
    </div>
  );
};
