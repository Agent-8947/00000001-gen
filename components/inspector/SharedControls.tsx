// Toggle Switch Component - Reusable across inspector
import React from 'react';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between">
        {label && <span className="text-xs font-medium opacity-50 uppercase tracking-widest">{label}</span>}
        <button
            onClick={() => onChange(!checked)}
            className={`w-9 h-5 rounded-full transition-colors relative ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`} />
        </button>
    </div>
);

// Add Item Button
interface AddButtonProps {
    onClick: () => void;
    label?: string;
}

export const AddButton: React.FC<AddButtonProps> = ({ onClick, label = 'Add' }) => (
    <button
        onClick={onClick}
        className="p-1 px-2 bg-blue-500 text-white text-xs rounded uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
    >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        {label}
    </button>
);

// Delete Button
interface DeleteButtonProps {
    onClick: () => void;
    size?: number;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, size = 14 }) => (
    <button
        onClick={onClick}
        className="p-1 text-red-500 opacity-20 hover:opacity-100 transition-opacity"
        title="Delete"
    >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    </button>
);

// Section Header with optional action
interface SectionHeaderProps {
    title: string;
    action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action }) => (
    <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">{title}</label>
        {action}
    </div>
);

// Item Card wrapper
interface ItemCardProps {
    children: React.ReactNode;
    onDelete?: () => void;
    className?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({ children, onDelete, className = '' }) => (
    <div className={`p-3 bg-black/[0.03] rounded-lg border border-black/5 space-y-2 relative group ${className}`}>
        {onDelete && (
            <div className="absolute top-2 right-2">
                <DeleteButton onClick={onDelete} size={12} />
            </div>
        )}
        {children}
    </div>
);
