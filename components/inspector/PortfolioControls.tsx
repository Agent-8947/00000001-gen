// Portfolio Block Controls
import React from 'react';
import { Plus, Trash2, X, Upload } from 'lucide-react';
import { TextInput, ControlGroup, Scrubber } from '../InspectorControls';
import type { BlockControlProps } from './types';
import { AddButton, ItemCard, SectionHeader, ToggleSwitch } from './SharedControls';

export const PortfolioControls: React.FC<BlockControlProps> = ({ block, overrides, updateBlockLocal }) => {
    const items = overrides.data?.items || [];

    const addItem = () => {
        const newItems = [...items, { id: crypto.randomUUID(), type: 'image', url: '', title: 'New Project' }];
        updateBlockLocal(block.id, 'data.items', newItems);
    };

    const removeItem = (id: string) => {
        const newItems = items.filter((i: any) => i.id !== id);
        updateBlockLocal(block.id, 'data.items', newItems);
    };

    const updateItem = (idx: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[idx] = { ...newItems[idx], [field]: value };
        updateBlockLocal(block.id, 'data.items', newItems);
    };

    const handleImageUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateItem(idx, 'url', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <ControlGroup title="Portfolio Header">
                <TextInput
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-black tracking-widest uppercase"
                    placeholder="Section Title"
                    value={overrides.data?.title || ''}
                    onChange={(val) => updateBlockLocal(block.id, 'data.title', val)}
                />
                <textarea
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium h-20"
                    placeholder="Section Subtitle"
                    value={overrides.data?.subtitle || ''}
                    onChange={(e) => updateBlockLocal(block.id, 'data.subtitle', e.target.value)}
                />
            </ControlGroup>

            <ControlGroup title="Gallery Items" action={<AddButton onClick={addItem} label="Add Item" />}>
                <div className="space-y-3">
                    {items.map((item: any, idx: number) => (
                        <ItemCard key={item.id} onDelete={() => removeItem(item.id)}>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono opacity-20">Item_{idx + 1}</span>
                            </div>

                            <TextInput
                                className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-sm outline-none focus:border-blue-500/30"
                                placeholder="Title"
                                value={item.title || ''}
                                onChange={(val) => updateItem(idx, 'title', val)}
                            />

                            <div className="space-y-2">
                                <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Media Source (URL or Upload)</label>
                                <div className="flex items-center gap-2">
                                    <TextInput
                                        className="flex-1 bg-white text-slate-900 border border-black/5 rounded p-2 text-xs outline-none focus:border-blue-500/30 font-mono"
                                        placeholder="https://..."
                                        value={item.url || ''}
                                        onChange={(val) => updateItem(idx, 'url', val)}
                                    />
                                    <label className="cursor-pointer p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shadow-sm shrink-0" title="Upload Image">
                                        <Upload size={14} />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(idx, e)} />
                                    </label>
                                </div>

                                {item.url && (
                                    <div className="relative group/preview w-full h-24 rounded-lg border border-black/5 overflow-hidden bg-black/5 shadow-inner">
                                        <img
                                            src={item.url}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-105"
                                            alt="Preview"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+URL';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => updateItem(idx, 'url', '')}
                                                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all transform hover:scale-110 active:scale-95"
                                                title="Clear Media"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <ControlGroup title="Link URL (Optional)" className="space-y-2 pt-2 border-t border-black/5">
                                <TextInput
                                    className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs outline-none focus:border-blue-500/30 font-mono"
                                    placeholder="https://example.com"
                                    value={item.link || ''}
                                    onChange={(val) => updateItem(idx, 'link', val)}
                                />
                            </ControlGroup>

                            <ToggleSwitch
                                label="Show Play Button"
                                checked={!!item.showPlayButton}
                                onChange={(checked) => updateItem(idx, 'showPlayButton', checked)}
                            />
                        </ItemCard>
                    ))}
                </div>
            </ControlGroup>
        </div>
    );
};

export default PortfolioControls;
