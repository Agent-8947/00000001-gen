// Store Types - Shared interfaces and types
import { create } from 'zustand';
import { produce } from 'immer';

// Re-export for convenience
export { create, produce };

export type ParamType = 'range' | 'color' | 'toggle' | 'select';

export interface DNAParameter {
    id: string;
    name: string;
    type: ParamType;
    value: string;
    min?: number;
    max?: number;
    options?: string[];
}

export interface GlobalSetting {
    name: string;
    params: DNAParameter[];
}

export interface ContentBlock {
    id: string;
    type: string;
    localOverrides: Record<string, any>;
    isVisible: boolean;
}

export interface UITheme {
    fonts: string;
    darkPanel: string;
    lightPanel: string;
    elements: string;
    accents: string;
    interfaceScale: number;
    uiFontWeight: number;
    uiElementStroke: number;
    uiTextBrightness: number;
    uiBaseFontSize: number;
    panelX: number;
    panelY: number;
    isFloating: boolean;
}

export interface Snapshot {
    id: string;
    name: string;
    timestamp: number;
}

// UI State Slice
export interface UISlice {
    isPreviewMode: boolean;
    uiTheme: UITheme;
    canvasKey: number;
    isGlobalOpen: boolean;
    isBlockListOpen: boolean;
    isManagerOpen: boolean;
    isDataPanelOpen: boolean;
    isThemePanelOpen: boolean;
    viewportMode: 'desktop' | 'mobile';
    gridMode: 'off' | 'columns' | 'mobile' | 'rows';
    ioFeedback: boolean;
}

// Blocks State Slice
export interface BlocksSlice {
    pages: Record<string, ContentBlock[]>;
    currentPage: string;
    contentBlocks: ContentBlock[];
    selectedBlockId: string | null;
}

// Settings State Slice
export interface SettingsSlice {
    globalSettings: Record<string, GlobalSetting>;
    currentLanguage: string;
}

// History State Slice
export interface HistorySlice {
    past: any[];
    future: any[];
    snapshots: Snapshot[];
}
