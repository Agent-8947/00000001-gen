import React, { useState } from 'react';
import { useStore } from '../store';
import { X, FileCode, Upload, Zap } from 'lucide-react';
import JSZip from 'jszip';
import { dictionary } from '../dictionary';

export const DataPanel: React.FC = () => {
  const { uiTheme, toggleDataPanel, exportProjectData, importProjectData } = useStore();
  const [exporting, setExporting] = useState(false);

  // ==================================================================================
  // 1. IRONCLAD REACT EXPORT (FIXED & VERIFIED)
  // ==================================================================================
  const handleExportReactProject = async () => {
    setExporting(true);

    try {
      const zip = new JSZip();
      const dnaDataRaw = exportProjectData();

      // ✅ ВАЛИДАЦИЯ: Проверяем, что данные корректны
      try {
        const parsed = JSON.parse(dnaDataRaw);

        // Проверка 1: Есть ли страницы?
        if (!parsed.pages || Object.keys(parsed.pages).length === 0) {
          throw new Error('No pages found in project data');
        }

        // Проверка 2: Есть ли блоки на главной странице?
        const homeBlocks = parsed.pages.home || parsed.pages[Object.keys(parsed.pages)[0]];
        if (!homeBlocks || homeBlocks.length === 0) {
          console.warn('⚠️ Warning: No blocks found on home page');
        }

        // Проверка 3: Размер данных
        const sizeInMB = dnaDataRaw.length / (1024 * 1024);
        const dictionarySize = JSON.stringify(dictionary).length / 1024;
        console.log(`📦 DNA Data size: ${sizeInMB.toFixed(2)} MB`);
        console.log(`🌍 Dictionary size: ${dictionarySize.toFixed(2)} KB`);

        if (sizeInMB > 5) {
          console.warn('⚠️ Warning: Data size is large (>5MB). Consider optimization.');
        }

        // Проверка 4: i18n данные
        const i18nFieldsCount = Object.values(parsed.pages).flat().reduce((count: number, block: any) => {
          const data = block.localOverrides?.data || {};
          const i18nFields = Object.keys(data).filter(key => key.includes('_'));
          return count + i18nFields.length;
        }, 0) as number;

        console.log(`🌍 i18n fields in blocks: ${i18nFieldsCount}`);

        if (i18nFieldsCount > 500) {
          console.warn('⚠️ Warning: Large number of i18n fields. Consider using dictionary-based translations.');
        }

        console.log('✅ DNA Data validation passed:', {
          pages: Object.keys(parsed.pages).length,
          totalBlocks: Object.values(parsed.pages).flat().length,
          hasGlobalSettings: !!parsed.globalSettings
        });
      } catch (validationError: any) {
        alert(`❌ Export validation failed:\n${validationError.message}\n\nPlease check your project data.`);
        setExporting(false);
        return;
      }

      // --- 0. ВЫНОСИМ ДАННЫЕ В ОТДЕЛЬНЫЙ ФАЙЛ (STABILITY FIX) ---
      // Это предотвращает зависание при парсинге огромных main.tsx
      zip.file('src/dnaData.ts', `export const dnaData = ${dnaDataRaw};`);

      // Хелпер: Безопасное чтение файлов
      const safeReadFile = async (path: string): Promise<string | null> => {
        try {
          const res = await fetch(path);
          if (!res.ok) return null;
          const text = await res.text();
          if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) return null;
          return text;
        } catch (e) {
          return null;
        }
      };

      // --- A. ВШИВАЕМ UTILS ---
      zip.file('src/utils/autoTranslate.ts', `
/**
 * DNA Auto-Translate Engine
 */
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  if (!text || !targetLang || targetLang === 'en') return text;
  
  try {
    const url = \`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=\${targetLang}&dt=t&q=\${encodeURIComponent(text)}\`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data[0]) {
      return data[0].map((segment: any) => segment[0]).join('');
    }
    return text;
  } catch (err) {
    return text;
  }
};
`);

      zip.file('src/utils/withTranslation.tsx', `
import { useStore } from '../store';
import { translateText } from './autoTranslate';

export const translateData = (data: any, lang: string) => {
  if (!data) return {};
  if (!lang || lang === 'en') return data;

  const state = useStore.getState();
  const translationCache = state.translationCache || {};
  const setTranslation = state.setTranslation || (() => {});

  const translated: any = Array.isArray(data) ? [] : {};

  Object.keys(data).forEach(key => {
    const value = data[key];

    // PROTECTED KEYS: copy directly without any processing (includes 'images' array)
    const protectedKeys = ['url', 'image', 'src', 'imageUrl', 'bgImage', 'avatar', 'images', 'logo', 'icon', 'photo', 'media'];
    if (protectedKeys.includes(key)) {
      translated[key] = value;
      return;
    }

    // PROTECTED VALUES: URLs and DataURLs
    if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('data:') || value.includes('://'))) {
      translated[key] = value;
      return;
    }

    // For objects/arrays that are NOT protected, recurse
    if (value !== null && typeof value === 'object') {
      translated[key] = translateData(value, lang);
      return;
    }

    // For non-strings, copy as-is
    if (typeof value !== 'string') {
      translated[key] = value;
      return;
    }

    // For regular strings, try translation
    const langKey = \`\${key}_\${lang}\`;
    const cacheKey = \`\${lang}:\${value}\`;
    
    if (data[langKey] !== undefined) {
      translated[key] = data[langKey];
    } else if (translationCache[cacheKey]) {
      translated[key] = translationCache[cacheKey];
    } else {
      translated[key] = value; 
      translateText(value, lang).then(result => {
        if (result && result !== value) setTranslation(cacheKey, result);
      });
    }
  });

  return translated;
};
`);

      // Копируем blockRegistry
      let registryContent = await safeReadFile('/src/utils/blockRegistry.ts') || await safeReadFile('/utils/blockRegistry.ts');
      if (registryContent) {
        zip.file('src/utils/blockRegistry.ts', registryContent);
      } else {
        zip.file('src/utils/blockRegistry.ts', `export const resolveBlock = () => null; export const BLOCK_MAPPING = {};`);
      }

      // --- B. ВШИВАЕМ СЛОВАРЬ ---
      zip.file('src/dictionary.ts', `export const dictionary = ${JSON.stringify(dictionary || {}, null, 2)} as const;`);

      // --- C. ВШИВАЕМ STORE С ЗАГЛУШКАМИ (STABILITY FIX) ---
      zip.file('src/store.ts', `
import { create } from 'zustand';
import { dnaData } from './dnaData';

const initialState = dnaData || {};

export const useStore = create((set, get) => ({
  contentBlocks: initialState.pages?.home || initialState.contentBlocks || [],
  globalSettings: initialState.globalSettings || {},
  currentLanguage: initialState.currentLanguage || 'en',
  uiTheme: initialState.uiTheme || {},
  translationCache: JSON.parse(localStorage.getItem('dna_trans_cache') || '{}'),
  
  // Production actions
  setTranslation: (key, value) => {
    const cache = get().translationCache;
    const newCache = { ...cache, [key]: value };
    localStorage.setItem('dna_trans_cache', JSON.stringify(newCache));
    set({ translationCache: newCache });
  },
  setCurrentLanguage: (lang) => set({ currentLanguage: lang }),
  
  toggleSiteTheme: () => {
    const newSettings = JSON.parse(JSON.stringify(get().globalSettings));
    const currentMode = newSettings['GL10']?.params?.[6]?.value || 'Dark';
    const newMode = currentMode === 'Light' ? 'Dark' : 'Light';
    newSettings['GL10'].params[6].value = newMode;
    // Simple color switch for production stability
    if (newSettings['GL02']?.params) {
        const isDark = newMode === 'Dark';
        newSettings['GL02'].params[0].value = isDark ? '#09090B' : '#FFFFFF';
        newSettings['GL02'].params[3].value = isDark ? '#FFFFFF' : '#18181B';
    }
    set({ globalSettings: newSettings });
  },

  // ⚠️ STABILITY STUBS: Prevent crashes if component calls editor methods
  updateBlockLocal: () => console.warn('updateBlockLocal is disabled in production'),
  refreshCanvas: () => {},
  setSelectedBlock: () => {},
  selectedBlockId: null,
  isPreviewMode: false,
  viewportMode: 'desktop',
  gridMode: 'off'
}));
`);

      // --- D. ВШИВАЕМ ЯЗЫКОВОЙ СТОР ---
      zip.file('src/languageStore.ts', `
import { create } from 'zustand';
import { dictionary } from './dictionary';
export const useLanguageStore = create((set, get) => ({
  currentLang: 'en',
  setLanguage: (lang) => set({ currentLang: lang }),
  t: (key) => (dictionary[get().currentLang]?.[key] || dictionary['en']?.[key] || key),
}));
`);

      // --- E. SELECTOR И APP ---
      zip.file('src/LanguageSelector.tsx', `
import React from 'react';
import { useLanguageStore } from './languageStore';
import { useStore } from './store';
import { Sun, Moon, Globe } from 'lucide-react';

export const LanguageSelector = () => {
  const { currentLang, setLanguage } = useLanguageStore();
  const { setCurrentLanguage, toggleSiteTheme, globalSettings } = useStore();
  const isDark = globalSettings['GL10']?.params?.[6]?.value === 'Dark';

  return (
    <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2">
      <div className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 border border-white/10">
        <Globe size={14} className="opacity-50" />
        <select 
          value={currentLang} 
          onChange={(e) => { setLanguage(e.target.value); setCurrentLanguage(e.target.value); }} 
          className="bg-transparent text-[10px] font-bold uppercase outline-none cursor-pointer"
        >
          {['en', 'ru', 'uk', 'de', 'fr', 'es', 'it', 'zh', 'pl'].map(l => <option key={l} value={l} className="text-black">{l}</option>)}
        </select>
      </div>
      <button onClick={toggleSiteTheme} className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
        {isDark ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </div>
  );
};
`);

      zip.file('src/App.tsx', `
import React, { useEffect } from 'react';
import { Viewer } from './components/Viewer';
import { LanguageSelector } from './LanguageSelector';
import { useStore } from './store';

export default function App() {
  const { globalSettings } = useStore();
  useEffect(() => {
    const isDark = globalSettings['GL10']?.params?.[6]?.value === 'Dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.body.style.backgroundColor = isDark ? '#09090B' : '#FFFFFF';
  }, [globalSettings]);

  return (
    <>
      <Viewer />
      <LanguageSelector />
    </>
  );
}
`);

      // Конфиги
      zip.file('package.json', JSON.stringify({
        "name": "dna-project",
        "private": true,
        "type": "module",
        "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
        "dependencies": {
          "react": "^19.0.0", "react-dom": "^19.0.0", "zustand": "^5.0.9",
          "lucide-react": "^0.562.0", "framer-motion": "^12.23.26"
        },
        "devDependencies": {
          "@vitejs/plugin-react": "^4.0.0", "vite": "^6.0.0", "tailwindcss": "^3.4.0",
          "autoprefixer": "^10.4.0", "postcss": "^8.4.0"
        }
      }, null, 2));

      // --- VITE CONFIG ---
      zip.file('vite.config.ts', `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  build: { outDir: 'dist' }
});`);

      // --- TSCONFIG ---
      zip.file('tsconfig.json', JSON.stringify({
        "compilerOptions": {
          "target": "ES2020",
          "useDefineForClassFields": true,
          "lib": ["ES2020", "DOM", "DOM.Iterable"],
          "module": "ESNext",
          "skipLibCheck": true,
          "moduleResolution": "bundler",
          "allowImportingTsExtensions": true,
          "resolveJsonModule": true,
          "isolatedModules": true,
          "noEmit": true,
          "jsx": "react-jsx",
          "strict": false,
          "noUnusedLocals": false,
          "noUnusedParameters": false
        },
        "include": ["src"]
      }, null, 2));

      // --- TAILWIND CONFIG ---
      zip.file('tailwind.config.js', `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: 'var(--dna-bg)',
        surface: 'var(--dna-surface)',
        accent: 'var(--dna-accent)',
        prim: 'var(--dna-text-prim)',
        sec: 'var(--dna-text-sec)',
      }
    }
  },
  plugins: []
};`);

      // --- POSTCSS CONFIG ---
      zip.file('postcss.config.js', `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`);

      // --- INDEX.HTML с шрифтами и лоадером ---
      zip.file('index.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DNA Site</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; background: #09090B; font-family: 'Inter', sans-serif; }
        .loader { width: 40px; height: 40px; border: 2px solid #3B82F6; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div id="root"><div class="loader"></div></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>`);

      // --- SRC/INDEX.CSS ---
      zip.file('src/index.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --dna-unit: 16px;
  --dna-bg: #09090B;
  --dna-surface: #18181B;
  --dna-accent: #3B82F6;
  --dna-text-prim: #FFFFFF;
  --dna-text-sec: #A1A1AA;
  --dna-border: #27272A;
  --dna-font-family: 'Inter', sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  font-family: var(--dna-font-family); 
  background-color: var(--dna-bg); 
  color: var(--dna-text-prim);
  -webkit-font-smoothing: antialiased;
}`);

      // --- КОПИРУЕМ ВСЕ КОМПОНЕНТЫ ---
      const compFolder = zip.folder('src/components');
      const comps = [
        'Viewer.tsx', 'Hero.tsx', 'Navbar.tsx', 'Footer.tsx', 'Article.tsx',
        'Portfolio.tsx', 'Stats.tsx', 'Timeline.tsx', 'IdentityCard.tsx',
        'ContentBlock.tsx', 'Skills.tsx', 'Accordion.tsx', 'Tabs.tsx',
        'Testimonials.tsx', 'SocialDock.tsx', 'Spacer.tsx', 'ContactForm.tsx',
        'Badges.tsx', 'Logos.tsx', 'Methodology.tsx', 'TechStack.tsx',
        'FeaturedProject.tsx', 'ProjectsGrid.tsx', 'CodeShowcase.tsx',
        'Preview.tsx', 'Features.tsx', 'RadarChart.tsx'
      ];

      if (compFolder) {
        for (const c of comps) {
          let content = await safeReadFile(`/src/components/${c}`) || await safeReadFile(`/components/${c}`);
          if (content) {
            // Удаляем конфликты в Navbar
            if (c === 'Navbar.tsx') {
              content = content.replace(/{\/\* Language Switcher \*\/}[\s\S]*?{\/\* Theme Toggle \*\/}[\s\S]*?<\/button>/g, '');
            }
            compFolder.file(c, content);
          }
        }
      }

      zip.file('src/main.tsx', `
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { dnaData } from './dnaData';

(window as any).__DNA_STATE__ = dnaData;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DNA_PROD_${Date.now()}.zip`;
      a.click();
      alert('✅ Экспорт успешно завершен! Проект оптимизирован для стабильной работы.');
    } catch (e) {
      alert('❌ Ошибка экспорта: ' + e);
    } finally {
      setExporting(false);
    }
  };

  const handleExportJSON = () => {
    try {
      const dnaData = exportProjectData();
      const blob = new Blob([dnaData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dna-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export JSON');
    }
  };

  const handleImportJSON = () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const json = event.target?.result as string;
            importProjectData(json);
            alert('✅ Backup restored successfully!');
          } catch (error) {
            alert('❌ Invalid JSON file');
          }
        };
        reader.readAsText(file);
      };
      input.click();
    } catch (error) {
      alert('Failed to import JSON');
    }
  };

  return (
    <div className="w-[360px] h-full border-l flex flex-col" style={{ backgroundColor: uiTheme.lightPanel }}>
      <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: uiTheme.elements }}>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Production Hub</span>
        <button onClick={toggleDataPanel} className="opacity-20 hover:opacity-100 transition-opacity">
          <X size={18} />
        </button>
      </div>

      <div className="p-8 flex-1 space-y-4">
        <button
          onClick={handleExportReactProject}
          disabled={exporting}
          className="w-full p-12 bg-blue-500/10 border-2 border-blue-500/20 rounded-[40px] flex flex-col items-center gap-6 hover:bg-blue-500/20 transition-all group disabled:opacity-50"
        >
          <Zap size={48} className="text-blue-500 group-hover:scale-110 transition-transform fill-current" />
          <div className="text-center">
            <div className="text-[14px] font-black uppercase text-blue-500 tracking-[0.2em]">
              {exporting ? 'Packing...' : 'Export React App'}
            </div>
            <div className="text-[9px] opacity-40 uppercase mt-2 font-bold">
              Vite • TypeScript • i18n
            </div>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
          <button
            onClick={handleExportJSON}
            className="p-4 bg-green-500/10 border border-green-500/20 rounded-[16px] flex flex-col items-center gap-2 hover:bg-green-500/20 transition-all"
          >
            <FileCode size={20} className="text-green-500" />
            <span className="text-[9px] font-bold text-green-500 uppercase">Save JSON</span>
          </button>

          <button
            onClick={handleImportJSON}
            className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-[16px] flex flex-col items-center gap-2 hover:bg-purple-500/20 transition-all"
          >
            <Upload size={20} className="text-purple-500" />
            <span className="text-[9px] font-bold text-purple-500 uppercase">Load JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataPanel;