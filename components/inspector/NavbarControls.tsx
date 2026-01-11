// Navbar Block Controls
import React from 'react';
import { Plus, Trash2, Anchor } from 'lucide-react';
import { TextInput } from '../InspectorControls';
import type { TabContentProps } from './types';
import { ToggleSwitch, AddButton, ItemCard, SectionHeader } from './SharedControls';

export const NavbarControls: React.FC<TabContentProps> = ({ block, overrides, updateBlockLocal, contentBlocks }) => {
    const links = overrides.data?.links || [];

    const addLink = () => {
        const newLinks = [...links, { label: 'Link', url: '#' }];
        updateBlockLocal(block.id, 'data.links', newLinks);
    };

    const removeLink = (idx: number) => {
        const newLinks = links.filter((_: any, i: number) => i !== idx);
        updateBlockLocal(block.id, 'data.links', newLinks);
    };

    const updateLink = (idx: number, field: string, value: string) => {
        const newLinks = [...links];
        newLinks[idx] = { ...links[idx], [field]: value };
        updateBlockLocal(block.id, 'data.links', newLinks);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">Navigation Data</label>
                <TextInput
                    className="w-full bg-black/[0.03] border border-black/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/30 font-black tracking-widest uppercase"
                    placeholder="Brand Header"
                    value={overrides.data?.header || ''}
                    onChange={(val) => updateBlockLocal(block.id, 'data.header', val)}
                />

                <ToggleSwitch
                    label="Sticky Mode"
                    checked={overrides.data?.stickyLogic === 'true'}
                    onChange={(checked) => updateBlockLocal(block.id, 'data.stickyLogic', checked ? 'true' : 'false')}
                />
            </div>

            <div className="space-y-4 pt-4 border-t border-black/5">
                <SectionHeader title="Links" action={<AddButton onClick={addLink} label="Add" />} />

                <div className="space-y-3">
                    {links.map((link: any, idx: number) => (
                        <ItemCard key={idx} onDelete={() => removeLink(idx)} className="hover:bg-black/[0.05]">
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Label</label>
                                <TextInput
                                    className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-xs font-bold outline-none uppercase"
                                    value={link.label}
                                    placeholder="MENU ITEM"
                                    onChange={(val) => updateLink(idx, 'label', val)}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Target Anchor</label>
                                <div className="flex items-center gap-2">
                                    <TextInput
                                        className="flex-1 bg-white text-slate-900 border border-black/5 rounded p-2 text-[11px] outline-none font-mono text-blue-600 truncate"
                                        value={link.url}
                                        placeholder="#section-id"
                                        onChange={(val) => updateLink(idx, 'url', val)}
                                    />
                                    <div className="relative" title="Pick Block Anchor">
                                        <div className="p-2 bg-white border border-black/5 rounded hover:bg-blue-50 text-blue-500 transition-colors shadow-sm">
                                            <Anchor size={14} />
                                        </div>
                                        <select
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            value=""
                                            onChange={(e) => {
                                                if (e.target.value) updateLink(idx, 'url', e.target.value);
                                            }}
                                        >
                                            <option value="">Select Target...</option>
                                            {contentBlocks.map(b => (
                                                <option key={b.id} value={`#${b.id}`}>
                                                    {b.type} - {b.localOverrides?.data?.title?.slice(0, 15) || 'Untitled'} (#{b.id.slice(0, 4)})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </ItemCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NavbarControls;
