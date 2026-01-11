// UI Theme Presets
export const UI_THEME_PRESETS = {
    'Architect': {
        fonts: "#111827",
        darkPanel: "#E5E7EB",
        lightPanel: "#FFFFFF",
        elements: "#9CA3AF",
        accents: "#3B82F6"
    },
    'Onyx': {
        fonts: "#F9FAFB",
        darkPanel: "#111111",
        lightPanel: "#1A1A1A",
        elements: "#374151",
        accents: "#60A5FA"
    },
    'Blueprint': {
        fonts: "#FFFFFF",
        darkPanel: "#0F172A",
        lightPanel: "#1E293B",
        elements: "#334155",
        accents: "#38BDF8"
    }
} as const;

export type ThemePresetName = keyof typeof UI_THEME_PRESETS;

// Default UI Theme
export const DEFAULT_UI_THEME = {
    fonts: '#FFFFFF',
    darkPanel: '#0F172A',
    lightPanel: '#1E293B',
    elements: '#38BDF8',
    accents: '#3B82F6',
    interfaceScale: 105,
    uiFontWeight: 900,
    uiElementStroke: 1,
    uiTextBrightness: 100,
    uiBaseFontSize: 16,
    panelX: 0,
    panelY: 0,
    isFloating: false
};
