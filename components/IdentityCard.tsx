import React, { useRef, useState } from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

export const IdentityCard: React.FC<{ id: string, localOverrides: any, isPreview?: boolean }> = ({ id, localOverrides, isPreview = true }) => {
    const { globalSettings, updateBlockLocal } = useStore();
    const gl02 = globalSettings['GL02'].params;
    const gl07 = globalSettings['GL07'].params;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

    const data = localOverrides.data || {
        title: 'IDENTITY PROFILE',
        subtitle: 'Digital Access Card',
        images: [
            { url: 'https://placehold.co/100', shape: 'circle' },
            { url: 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=DNA', shape: 'square' },
            { url: 'https://placehold.co/100', shape: 'circle' }
        ],
        buttons: [{ label: 'Contact', url: '#' }],
        text: 'Identity Block V1.0'
    };

    const layoutConfig = localOverrides.layout || {};
    const paddingY = layoutConfig.paddingY || '40';
    const titleSize = layoutConfig.titleSize || '18';
    const subtitleSize = layoutConfig.subtitleSize || '12';
    const textSize = layoutConfig.textSize || '12';
    const textLineHeight = layoutConfig.textLineHeight || '1.2';
    const textSpacing = layoutConfig.textSpacing || '0';

    const accent = gl02[2].value;

    const handleButtonClick = (e: React.MouseEvent) => {
        if (isPreview) {
            e.preventDefault();
            console.log("Navigation blocked in constructor mode.");
        }
    };

    const handleImageClick = (index: number) => {
        if (!isPreview) return;
        setActiveImageIndex(index);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeImageIndex !== null) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImages = [...data.images];
                newImages[activeImageIndex] = { ...newImages[activeImageIndex], url: reader.result as string };
                updateBlockLocal(id, 'data.images', newImages);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <section id={id} className="w-full flex justify-center px-4" style={{ paddingTop: `${paddingY}px`, paddingBottom: `${paddingY}px` }}>
            <motion.div
                className="max-w-sm w-full p-6 border flex flex-col items-center"
                style={{
                    backgroundColor: localOverrides.style?.bgFill || 'transparent',
                    borderColor: gl02[5].value + '40',
                    borderRadius: `${gl07[0].value}px`,
                    fontFamily: 'var(--dna-font-family)'
                }}
            >
                {/* Заголовок и подзаголовок (с динамическими размерами) */}
                {(data.title || data.subtitle) && (
                    <div className="w-full text-center mb-6">
                        {data.title && (
                            <h3
                                className="font-black uppercase tracking-tight mb-1"
                                style={{
                                    color: gl02[3].value,
                                    fontSize: `${titleSize}px`
                                }}
                            >
                                {data.title}
                            </h3>
                        )}
                        {data.subtitle && (
                            <p
                                className="opacity-50 uppercase tracking-wider"
                                style={{
                                    color: gl02[3].value,
                                    fontSize: `${subtitleSize}px`
                                }}
                            >
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                )}

                {/* Три фото в ряд (увеличены на ~15%) */}
                <div className="flex justify-center items-center gap-4 mb-6">
                    {data.images.map((img: any, i: number) => (
                        <div
                            key={i}
                            onClick={() => handleImageClick(i)}
                            className={`relative overflow-hidden border border-black/5 shadow-sm group ${isPreview ? 'cursor-pointer hover:border-blue-500/50 transition-all' : ''} ${i === 1 ? 'w-20 h-20' : 'w-14 h-14'}`}
                            style={{ borderRadius: img.shape === 'circle' ? '999px' : `${gl07[3].value}px` }}
                        >
                            <img src={img.url} className="w-full h-full object-cover" alt="" />
                            {isPreview && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Upload className="text-white" size={i === 1 ? 24 : 18} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {isPreview && (
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                )}

                {/* Кнопки (вертикально, крупнее) */}
                <div className="flex flex-col items-stretch gap-3 mb-4 w-full">
                    {data.buttons.map((btn: any, i: number) => (
                        <a
                            key={i}
                            href={btn.url}
                            onClick={handleButtonClick}
                            className="px-6 py-3 text-xs font-black uppercase tracking-tight text-center transition-all hover:scale-105"
                            style={{ backgroundColor: accent, color: '#FFF', borderRadius: '6px' }}
                        >
                            {btn.label}
                        </a>
                    ))}
                </div>

                {/* Текст (с динамическим размером) */}
                <div
                    className="text-center opacity-60 uppercase font-bold tracking-widest"
                    style={{
                        color: gl02[3].value,
                        fontSize: `${textSize}px`,
                        lineHeight: textLineHeight,
                        marginTop: `${textSpacing}px`
                    }}
                >
                    {data.text}
                </div>
            </motion.div>
        </section>
    );
};
