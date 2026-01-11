// Shared types and utilities for inspector components
import type { ContentBlock } from '../../store';

export interface BlockControlProps {
    block: ContentBlock;
    overrides: Record<string, any>;
    updateBlockLocal: (id: string, path: string, value: any) => void;
}

export interface TabContentProps extends BlockControlProps {
    contentBlocks: ContentBlock[];
}

// Helper to check block type
export const isBlockType = (block: ContentBlock, ...prefixes: string[]): boolean => {
    const type = block.type || '';
    return prefixes.some(prefix =>
        type.startsWith(prefix) || type === prefix
    );
};

// Common CSS classes
export const INSPECTOR_CLASSES = {
    label: 'text-xs uppercase tracking-[0.2em] opacity-30 font-bold',
    labelSmall: 'text-[9px] font-bold opacity-30 uppercase tracking-widest',
    sectionSpace: 'space-y-4 pt-4 border-t border-black/5',
    inputBase: 'w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30',
    inputWhite: 'w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-sm outline-none',
    addButton: 'p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1',
    deleteButton: 'p-1 text-red-500 opacity-20 hover:opacity-100 transition-opacity',
    itemCard: 'p-3 bg-black/[0.03] rounded-lg border border-black/5 space-y-2 relative group',
    toggleOn: 'bg-blue-500',
    toggleOff: 'bg-gray-300',
} as const;
