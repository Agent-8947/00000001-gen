// Global Settings Factory
// Creates the default global settings structure

import type { GlobalSetting, ParamType } from './types';

interface ParamSpec {
    v: string;
    min: number;
    max: number;
    t: ParamType;
    opts?: string[];
}

const GL_GROUPS: Record<string, { name: string; params: string[] }> = {
    'GL01': { name: 'Text', params: ["Base Size", "Scale Ratio", "Line Height", "Weight", "Tracking", "Uppercase", "Smoothing", "Font Family"] },
    'GL02': { name: 'Colors', params: ["Base Bg", "Surface", "Accent", "Text Prim", "Text Sec", "Border", "Inversion", "BG Pattern", "Pattern Opacity", "Pattern Size"] },
    'GL03': { name: 'Spacing', params: ["Grid Unit", "Gap", "Pad X", "Pad Y", "Margin", "Container", "Flow"] },
    'GL04': { name: 'Buttons', params: ["Size", "Pad X", "Pad Y", "Typo", "Stroke", "Radius", "Shadow"] },
    'GL05': { name: 'Inputs', params: ["Height", "Radius", "Stroke", "Bg Fill", "Focus", "Placeholder", "Labels"] },
    'GL06': { name: 'Effects & Depth', params: ["Shadow Intensity", "Shadow Blur", "Glass Blur", "Glass Opacity", "Border Width", "Border Opacity", "Inner Glow"] },
    'GL07': { name: 'Radius', params: ["Global", "Inner", "Outer", "Button", "Input", "Card", "Multiplier"] },
    'GL08': { name: 'Icons', params: ["Size", "Stroke", "Optical", "Align", "Set ID", "Style", "Spacing"] },
    'GL09': { name: 'Animation', params: ["Duration", "Easing", "Entrance", "Hover", "Scroll", "Loop", "Physics"] },
    'GL10': { name: 'System Meta', params: ["SEO", "Analytics", "API Root", "Export", "Meta", "Environment", "Theme Mode"] },
    'GL11': { name: 'Sticky Navigation', params: ["Sticky Mode"] },
    'GL12': { name: 'Language Settings', params: ["Default Language", "Available Languages"] }
};

const GL_SPECS: Record<string, ParamSpec[]> = {
    'GL01': [
        { v: "16", min: 10, max: 24, t: 'range' },
        { v: "1.25", min: 1.1, max: 2.0, t: 'range' },
        { v: "1.5", min: 1.0, max: 2.5, t: 'range' },
        { v: "900", min: 100, max: 900, t: 'range' },
        { v: "-0.02", min: -0.05, max: 0.5, t: 'range' },
        { v: "false", min: 0, max: 0, t: 'toggle' },
        { v: "true", min: 0, max: 0, t: 'toggle' },
        { v: "Space Grotesk", min: 0, max: 0, t: 'select', opts: ['Space Grotesk', 'Inter', 'Roboto', 'Open Sans', 'Manrope', 'Agency', 'Ancorli', 'Share Tech', 'Lilex', 'Orbitron', 'Google Sans', 'Code'] }
    ],
    'GL02': [
        { v: "#09090B", min: 0, max: 0, t: 'color' },
        { v: "#18181B", min: 0, max: 0, t: 'color' },
        { v: "#3B82F6", min: 0, max: 0, t: 'color' },
        { v: "#FFFFFF", min: 0, max: 0, t: 'color' },
        { v: "#A1A1AA", min: 0, max: 0, t: 'color' },
        { v: "#27272A", min: 0, max: 0, t: 'color' },
        { v: "false", min: 0, max: 0, t: 'toggle' },
        { v: "None", min: 0, max: 0, t: 'select', opts: ["None", "Noise", "Dots", "Checkered", "Grid"] },
        { v: "10", min: 0, max: 100, t: 'range' },
        { v: "20", min: 4, max: 100, t: 'range' }
    ],
    'GL03': [
        { v: "8", min: 2, max: 16, t: 'range' },
        { v: "24", min: 0, max: 100, t: 'range' },
        { v: "40", min: 0, max: 120, t: 'range' },
        { v: "20", min: 0, max: 80, t: 'range' },
        { v: "0", min: 0, max: 60, t: 'range' },
        { v: "1200", min: 320, max: 1920, t: 'range' },
        { v: "1.0", min: 0.5, max: 2.0, t: 'range' }
    ],
    'GL04': [
        { v: "1.0", min: 0.5, max: 2.0, t: 'range' },
        { v: "24", min: 8, max: 64, t: 'range' },
        { v: "12", min: 4, max: 32, t: 'range' },
        { v: "12", min: 8, max: 24, t: 'range' },
        { v: "1", min: 0, max: 4, t: 'range' },
        { v: "4", min: 0, max: 40, t: 'range' },
        { v: "false", min: 0, max: 0, t: 'toggle' }
    ],
    'GL05': [
        { v: "44", min: 32, max: 64, t: 'range' },
        { v: "4", min: 0, max: 32, t: 'range' },
        { v: "1", min: 0, max: 3, t: 'range' },
        { v: "#FFFFFF", min: 0, max: 0, t: 'color' },
        { v: "#3B82F6", min: 0, max: 0, t: 'color' },
        { v: "#9CA3AF", min: 0, max: 0, t: 'color' },
        { v: "#374151", min: 0, max: 0, t: 'color' }
    ],
    'GL06': [
        { v: "10", min: 0, max: 100, t: 'range' },
        { v: "20", min: 0, max: 60, t: 'range' },
        { v: "0", min: 0, max: 40, t: 'range' },
        { v: "100", min: 0, max: 100, t: 'range' },
        { v: "0", min: 0, max: 4, t: 'range' },
        { v: "10", min: 0, max: 100, t: 'range' },
        { v: "0", min: 0, max: 100, t: 'range' }
    ],
    'GL07': [
        { v: "8", min: 0, max: 40, t: 'range' },
        { v: "4", min: 0, max: 40, t: 'range' },
        { v: "12", min: 0, max: 40, t: 'range' },
        { v: "4", min: 0, max: 40, t: 'range' },
        { v: "4", min: 0, max: 40, t: 'range' },
        { v: "16", min: 0, max: 40, t: 'range' },
        { v: "1.0", min: 0.5, max: 2.0, t: 'range' }
    ],
    'GL08': [
        { v: "20", min: 12, max: 48, t: 'range' },
        { v: "1.5", min: 0.5, max: 3.0, t: 'range' },
        { v: "0", min: -2, max: 2, t: 'range' },
        { v: "0.5", min: 0, max: 1.0, t: 'range' },
        { v: "1", min: 1, max: 10, t: 'range' },
        { v: "1", min: 1, max: 5, t: 'range' },
        { v: "8", min: 0, max: 24, t: 'range' }
    ],
    'GL09': [
        { v: "0.6", min: 0.1, max: 2.0, t: 'range' },
        { v: "0.1", min: 0, max: 0.5, t: 'range' },
        { v: "20", min: 0, max: 100, t: 'range' },
        { v: "0.95", min: 0.8, max: 1.1, t: 'range' },
        { v: "10", min: 0, max: 40, t: 'range' },
        { v: "1", min: 1, max: 5, t: 'range' },
        { v: "0.3", min: 0.1, max: 1.0, t: 'range' }
    ],
    'GL10': [
        { v: "0", min: 0, max: 0, t: 'range' },
        { v: "0", min: 0, max: 0, t: 'range' },
        { v: "0", min: 0, max: 0, t: 'range' },
        { v: "0", min: 0, max: 0, t: 'range' },
        { v: "0", min: 0, max: 0, t: 'range' },
        { v: "0", min: 0, max: 0, t: 'range' },
        { v: "Dark", min: 0, max: 0, t: 'select', opts: ['Light', 'Dark'] }
    ],
    'GL11': [
        { v: "true", min: 0, max: 0, t: 'toggle' }
    ],
    'GL12': [
        { v: "en", min: 0, max: 0, t: 'select', opts: ['en', 'uk', 'de', 'fr', 'es', 'it', 'zh', 'ru'] },
        { v: "en,uk,ru", min: 0, max: 0, t: 'select', opts: ['en', 'uk', 'de', 'fr', 'es', 'it', 'zh', 'ru'] }
    ]
};

export function createDefaultGlobalSettings(): Record<string, GlobalSetting> {
    return Object.entries(GL_GROUPS).reduce((acc, [id, group]) => {
        const specs = GL_SPECS[id] || [];

        acc[id] = {
            name: group.name,
            params: group.params.map((paramName, j) => {
                const spec = specs[j] || { v: '0', min: 0, max: 100, t: 'range' as ParamType };
                return {
                    id: `P${j + 1}`,
                    name: paramName,
                    type: spec.t,
                    value: spec.v,
                    min: spec.min,
                    max: spec.max,
                    options: spec.opts
                };
            })
        };

        return acc;
    }, {} as Record<string, GlobalSetting>);
}
