// Stats Block Controls
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Scrubber } from '../InspectorControls';
import type { BlockControlProps } from './types';
import { AddButton, SectionHeader } from './SharedControls';

export const StatsControls: React.FC<BlockControlProps> = ({ block, overrides, updateBlockLocal }) => {
    const stats = overrides.data?.stats || [];

    const addStat = () => {
        const newStats = [...stats, { value: '0', label: 'Metric' }];
        updateBlockLocal(block.id, 'data.stats', newStats);
    };

    const removeStat = (idx: number) => {
        const newStats = stats.filter((_: any, i: number) => i !== idx);
        updateBlockLocal(block.id, 'data.stats', newStats);
    };

    const updateStat = (idx: number, field: string, value: any) => {
        const newStats = [...stats];
        newStats[idx] = { ...stats[idx], [field]: value };
        updateBlockLocal(block.id, 'data.stats', newStats);
    };

    return (
        <div className="space-y-6">
            <SectionHeader title="Metrics" action={<AddButton onClick={addStat} label="Add Metric" />} />

            <div className="space-y-3">
                {stats.map((stat: any, idx: number) => (
                    <div key={idx} className="p-3 bg-black/[0.03] rounded-lg border border-black/5 flex items-center gap-3">
                        <div className="flex-1 space-y-2">
                            <Scrubber
                                label="Value"
                                value={String(stat.value ?? '').replace(/[^0-9.-]/g, '') || '0'}
                                min={0} max={1000000}
                                onChange={(val) => {
                                    const original = String(stat.value ?? '');
                                    const suffix = original.replace(/[0-9.-]/g, '');
                                    updateStat(idx, 'value', val + suffix);
                                }}
                            />
                            <input
                                className="w-full bg-white text-slate-900 border border-black/5 rounded p-2 text-sm outline-none"
                                placeholder="Label"
                                value={stat.label}
                                onChange={(e) => updateStat(idx, 'label', e.target.value)}
                            />
                        </div>
                        <button onClick={() => removeStat(idx)} className="p-1 text-red-500 opacity-20 hover:opacity-100 transition-opacity">
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsControls;
