// Timeline Block Controls
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Scrubber } from '../InspectorControls';
import type { BlockControlProps } from './types';
import { AddButton, SectionHeader } from './SharedControls';

export const TimelineControls: React.FC<BlockControlProps> = ({ block, overrides, updateBlockLocal }) => {
    const items = overrides.data?.items || [];

    const addItem = () => {
        const newItems = [...items, { date: '2024', title: 'New Event', desc: 'Detailed description.' }];
        updateBlockLocal(block.id, 'data.items', newItems);
    };

    const removeItem = (idx: number) => {
        const newItems = items.filter((_: any, i: number) => i !== idx);
        updateBlockLocal(block.id, 'data.items', newItems);
    };

    const updateItem = (idx: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[idx] = { ...items[idx], [field]: value };
        updateBlockLocal(block.id, 'data.items', newItems);
    };

    return (
        <div className="space-y-6">
            <SectionHeader title="Milestones" action={<AddButton onClick={addItem} label="Add Milestone" />} />

            <div className="space-y-4">
                {items.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 bg-black/[0.03] rounded-xl border border-black/5 space-y-3 relative group">
                        <button
                            onClick={() => removeItem(idx)}
                            className="absolute top-2 right-2 p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={12} />
                        </button>

                        <Scrubber
                            label="Date / Year"
                            value={item.date || '2024'}
                            min={1900} max={2100}
                            onChange={(val) => updateItem(idx, 'date', val)}
                        />

                        <input
                            className="w-full bg-white text-slate-900 border border-black/5 rounded-lg p-2 text-sm font-semibold outline-none"
                            placeholder="Title"
                            value={item.title || ''}
                            onChange={(e) => updateItem(idx, 'title', e.target.value)}
                        />

                        <textarea
                            className="w-full bg-white text-slate-900 border border-black/5 rounded-lg p-2 text-sm outline-none h-16"
                            placeholder="Description"
                            value={item.desc || ''}
                            onChange={(e) => updateItem(idx, 'desc', e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineControls;
