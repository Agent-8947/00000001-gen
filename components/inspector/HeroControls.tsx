// Hero Block Controls
import React from 'react';
import { X, Upload } from 'lucide-react';
import { Scrubber, TypoControls } from '../InspectorControls';
import type { BlockControlProps } from './types';
import { ToggleSwitch, SectionHeader } from './SharedControls';

export const HeroControls: React.FC<BlockControlProps> = ({ block, overrides, updateBlockLocal }) => {
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateBlockLocal(block.id, 'media.imageUrl', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            {/* Main Content */}
            <div className="space-y-4">
                <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Main Content</label>
                <textarea
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium h-24"
                    placeholder="Title"
                    value={overrides.data?.title || ''}
                    onChange={(e) => updateBlockLocal(block.id, 'data.title', e.target.value)}
                />
                <TypoControls
                    label="Title"
                    typo={overrides.data?.titleTypo}
                    basePath="data.titleTypo"
                    onUpdate={(path, val) => updateBlockLocal(block.id, path, val)}
                />
                <textarea
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-medium h-32"
                    placeholder="Description"
                    value={overrides.data?.description || ''}
                    onChange={(e) => updateBlockLocal(block.id, 'data.description', e.target.value)}
                />
                <TypoControls
                    label="Description"
                    typo={overrides.data?.descriptionTypo}
                    basePath="data.descriptionTypo"
                    onUpdate={(path, val) => updateBlockLocal(block.id, path, val)}
                />
            </div>

            {/* Primary Button */}
            <div className="space-y-4 pt-4 border-t border-black/5">
                <ToggleSwitch
                    label="Primary Button"
                    checked={overrides.data?.primaryBtnVisible !== false}
                    onChange={(checked) => updateBlockLocal(block.id, 'data.primaryBtnVisible', checked)}
                />
                <input
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-2 text-sm outline-none"
                    placeholder="Button Text"
                    value={overrides.data?.primaryBtnText || ''}
                    onChange={(e) => updateBlockLocal(block.id, 'data.primaryBtnText', e.target.value)}
                />
            </div>

            {/* Secondary Button */}
            <div className="space-y-4 pt-4 border-t border-black/5">
                <ToggleSwitch
                    label="Secondary Button"
                    checked={overrides.data?.secondaryBtnVisible !== false}
                    onChange={(checked) => updateBlockLocal(block.id, 'data.secondaryBtnVisible', checked)}
                />
                <input
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-2 text-[12px] outline-none"
                    placeholder="Button Text"
                    value={overrides.data?.secondaryBtnText || ''}
                    onChange={(e) => updateBlockLocal(block.id, 'data.secondaryBtnText', e.target.value)}
                />
            </div>

            {/* Media Content */}
            <div className="space-y-4 pt-4 border-t border-black/5">
                <ToggleSwitch
                    label="Media Content"
                    checked={overrides.media?.showImage !== false}
                    onChange={(checked) => updateBlockLocal(block.id, 'media.showImage', checked)}
                />

                {overrides.media?.showImage !== false && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                            <label className="block w-full cursor-pointer">
                                <div className="w-full bg-black/[0.02] border border-dashed border-black/10 rounded-lg p-4 text-center hover:bg-black/[0.05] transition-all">
                                    <span className="text-xs opacity-40 uppercase font-bold">Upload Hero Photo</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </div>
                            </label>
                            {overrides.media?.imageUrl && (
                                <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-black/5">
                                    <img src={overrides.media.imageUrl} className="w-8 h-8 object-cover rounded" alt="Preview" />
                                    <span className="text-[10px] opacity-30 truncate flex-1">hero_image.png</span>
                                    <button onClick={() => updateBlockLocal(block.id, 'media.imageUrl', '')} className="p-1 hover:text-red-500 opacity-30 hover:opacity-100">
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold italic">Position</label>
                            <div className="flex p-0.5 bg-black/5 rounded-lg">
                                {[
                                    { id: 'left', label: 'Left' },
                                    { id: 'right', label: 'Right' },
                                    { id: 'background', label: 'Full' }
                                ].map(pos => (
                                    <button
                                        key={pos.id}
                                        onClick={() => updateBlockLocal(block.id, 'media.imagePosition', pos.id)}
                                        className={`flex-1 py-1.5 text-[9px] uppercase font-bold tracking-widest rounded-md transition-all ${overrides.media?.imagePosition === pos.id
                                                ? 'bg-white text-slate-900 shadow-sm opacity-100'
                                                : 'opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        {pos.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Scrubber
                            label="Image Opacity"
                            value={overrides.media?.imageOpacity || 100}
                            min={0} max={100}
                            onChange={(val) => updateBlockLocal(block.id, 'media.imageOpacity', val)}
                        />
                        <Scrubber
                            label="Image Scale (%)"
                            value={overrides.media?.imageScale || 100}
                            min={20} max={150}
                            onChange={(val) => updateBlockLocal(block.id, 'media.imageScale', val)}
                        />

                        {block.type === 'B0202' && (
                            <div className="space-y-2 pt-4 border-t border-black/5">
                                <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Video URL Override</label>
                                <input
                                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-mono"
                                    placeholder="https://..."
                                    value={overrides.media?.videoUrl || ''}
                                    onChange={(e) => updateBlockLocal(block.id, 'media.videoUrl', e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeroControls;
