import React, { useCallback, useMemo } from 'react';
import {
    CircleDot, Plus, Minus, Layout, Image, Grid, Square,
    ArrowUp, ArrowDown, Trash2, Type, GitGraph, BarChart, MoveVertical,
    Phone, MapPin, Tags, Monitor, MessageSquare, Share2, Layers, LucideIcon
} from 'lucide-react';
import { useStore } from '../store';

// Static icon mapping - created once at module load
const ICON_MAP: Record<string, LucideIcon> = {
    B0101: Layout, Navbar: Layout,
    B0201: Image, Hero: Image,
    B0301: Grid, Skills: Grid,
    B0401: Type, Article: Type,
    B0501: Layers, Portfolio: Layers,
    B0601: GitGraph, Timeline: GitGraph,
    B0801: BarChart, Stats: BarChart,
    B0901: MoveVertical, Spacer: MoveVertical,
    B1301: Phone,
    B1401: MapPin,
    B1501: Tags, Badges: Tags,
    B1601: Monitor, Preview: Monitor,
    B2101: Image, ContactForm: Image,
    B2201: MessageSquare, RadarChart: MessageSquare,
    B2401: Share2, Socials: Share2
};

const ICON_PROPS = { size: 20, strokeWidth: 1.5 };

export const Sidebar: React.FC = () => {
    const {
        isGlobalOpen, toggleGlobal,
        isBlockListOpen, toggleBlockList,
        isManagerOpen, toggleManager,
        contentBlocks, selectedBlockId, setSelectedBlock,
        moveBlock, removeBlock, uiTheme
    } = useStore();

    const getBlockIcon = useCallback((type: string) => {
        const Icon = ICON_MAP[type] || Square;
        return <Icon {...ICON_PROPS} />;
    }, []);

    return (
        <aside
            className="w-[60px] h-full border-r z-50 flex flex-col items-center py-6 transition-colors duration-500 sidebar"
            style={{
                backgroundColor: uiTheme.lightPanel,
                borderColor: uiTheme.elements,
                color: uiTheme.fonts,
                borderRightWidth: 'var(--ui-stroke-width)'
            }}
        >
            <div className="mb-8 flex flex-col items-center gap-6 w-full">
                {/* Master Logo Button */}
                <button
                    onClick={toggleGlobal}
                    className="p-1.5 transition-all duration-300 relative group flex items-center justify-center rounded-lg"
                    style={{
                        color: isGlobalOpen ? uiTheme.accents : `${uiTheme.fonts}40`,
                        backgroundColor: isGlobalOpen ? `${uiTheme.accents}10` : 'transparent'
                    }}
                >
                    <CircleDot size={28} strokeWidth={1.5} />
                    {isGlobalOpen && (
                        <div
                            className="absolute left-[-11px] w-[3px] h-6 rounded-r-full shadow-sm"
                            style={{ backgroundColor: uiTheme.accents }}
                        />
                    )}
                </button>

                {/* Add Registry Button */}
                <button
                    onClick={toggleBlockList}
                    className="p-1.5 transition-all duration-300 relative group flex items-center justify-center rounded-lg"
                    style={{
                        color: isBlockListOpen ? uiTheme.accents : `${uiTheme.fonts}40`,
                        backgroundColor: isBlockListOpen ? `${uiTheme.accents}10` : 'transparent'
                    }}
                >
                    <Plus size={32} strokeWidth={1} />
                    {isBlockListOpen && (
                        <div
                            className="absolute left-[-11px] w-[3px] h-6 rounded-r-full shadow-sm"
                            style={{ backgroundColor: uiTheme.accents }}
                        />
                    )}
                </button>

                {/* Manage Architecture Button */}
                <button
                    onClick={toggleManager}
                    className={`p-3 transition-all duration-300 relative group flex items-center justify-center rounded-xl ${isManagerOpen ? 'shadow-sm' : 'hover:bg-black/5'}`}
                    style={{
                        color: isManagerOpen ? uiTheme.accents : `${uiTheme.fonts}40`,
                        backgroundColor: isManagerOpen ? `${uiTheme.accents}10` : 'transparent'
                    }}
                >
                    <Minus size={24} strokeWidth={2.5} />
                    {isManagerOpen && (
                        <div
                            className="absolute left-[-11px] w-[3px] h-6 rounded-r-full shadow-sm"
                            style={{ backgroundColor: uiTheme.accents }}
                        />
                    )}
                </button>

                <div className="w-8 h-[1px] opacity-30 my-2" style={{ backgroundColor: uiTheme.elements }} />

                {/* Layers / Active Blocks List */}
                <div className="flex-1 flex flex-col gap-3 w-full items-center overflow-y-auto overflow-x-hidden max-h-[60vh] custom-scrollbar px-2">
                    {contentBlocks.map((block, index) => (
                        <div key={block.id} className="relative group w-full flex justify-center">
                            <button
                                onClick={() => setSelectedBlock(selectedBlockId === block.id ? null : block.id)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:brightness-95 overflow-visible"
                                style={{
                                    color: selectedBlockId === block.id ? uiTheme.accents : `${uiTheme.fonts}40`,
                                    backgroundColor: selectedBlockId === block.id ? `${uiTheme.accents}10` : 'transparent'
                                }}
                                title={block.type}
                            >
                                {getBlockIcon(block.type)}
                            </button>



                            {/* Architectural Controls Panel (Floating on Hover) */}
                            <div
                                className="absolute left-full ml-2 top-0 bg-white shadow-xl rounded-lg flex flex-col items-center gap-1 p-1 border opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 origin-left z-[100]"
                                style={{
                                    backgroundColor: uiTheme.lightPanel,
                                    borderColor: uiTheme.elements,
                                    color: uiTheme.fonts
                                }}
                            >
                                <button
                                    disabled={index === 0}
                                    onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }}
                                    className="p-1.5 hover:bg-black/5 rounded disabled:opacity-20 transition-colors"
                                >
                                    <ArrowUp size={16} />
                                </button>
                                <button
                                    disabled={index === contentBlocks.length - 1}
                                    onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }}
                                    className="p-1.5 hover:bg-black/5 rounded disabled:opacity-20 transition-colors"
                                >
                                    <ArrowDown size={16} />
                                </button>
                                <div className="w-full h-[1px] my-1 opacity-10" style={{ backgroundColor: uiTheme.fonts }} />
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                                    className="p-1.5 hover:bg-red-500 hover:text-white rounded transition-colors group/trash"
                                >
                                    <Trash2 size={16} className="group-hover/trash:scale-110 transition-transform" />
                                </button>
                            </div>

                            {selectedBlockId === block.id && (
                                <div
                                    className="absolute left-[-11px] top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full shadow-sm"
                                    style={{ backgroundColor: uiTheme.accents }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};
