// Default Block Configurations
// Contains default localOverrides for each block type

export const BLOCK_DEFAULTS: Record<string, any> = {
    'B0101': {
        data: {
            header: "000-GEN",
            links: [{ label: "System", url: "#" }, { label: "Nodes", url: "#" }],
            stickyLogic: "true"
        },
        control: { "F-C01": "header", "F-C06": "stickyLogic" },
        layout: { "F-L04": "80", "F-L06": "100%", paddingX: "40" },
        style: { "F-S02": null, "F-S06": "true", useGlobalDNA: true },
        effects: { "F-E02": "slide-down" },
        inheritance: "0111GL"
    },

    'B0102': {
        data: {
            header: "000-GEN",
            links: [{ label: "System", url: "#" }, { label: "Nodes", url: "#" }],
            stickyLogic: "true"
        },
        control: { "F-C01": "header", "F-C06": "stickyLogic" },
        layout: { "F-L04": "80", "F-L06": "100%", paddingX: "40" },
        style: { "F-S02": "rgba(255,255,255,0.05)", "F-S06": "true", useGlobalDNA: true },
        effects: { "F-E02": "slide-down" },
        inheritance: "0111GL"
    },

    'B0201': {
        data: {
            title: "ULTIMATE UI SYNCHRONIZATION",
            title_uk: "НАЙКРАЩА СИНХРОНІЗАЦІЯ ІНТЕРФЕЙСУ",
            title_ru: "ПРЕВОСХОДНАЯ СИНХРОНИЗАЦИЯ ИНТЕРФЕЙСА",
            titleTypo: { useGlobal: true, fontSize: '64', fontWeight: '900', letterSpacing: '-0.04', lineHeight: '0.9', uppercase: true },
            description: "14-Node architectural grid active. System stability: 100%.",
            description_uk: "Активна архітектурна сітка з 14 вузлів. Стабільність системи: 100%.",
            description_ru: "Активна архитектурная сетка из 14 узлов. Стабильность системы: 100%.",
            descriptionTypo: { useGlobal: true, fontSize: '20', fontWeight: '400', letterSpacing: '0', lineHeight: '1.6', uppercase: false },
            primaryBtnText: "Initialize System", primaryBtnVisible: true,
            secondaryBtnText: "View Protocol", secondaryBtnVisible: true
        },
        layout: { height: '85vh', alignment: 'center', paddingTop: '80px' },
        style: { useGlobalDNA: true, bgFill: '', titleColor: '', descColor: '' },
        media: { showImage: false, imageUrl: '', imagePosition: 'right', imageOpacity: 100, imageScale: 100 },
        background: { lockBackground: false, fixedColor: '#FFFFFF' },
        btnUseGlobal: true,
        animation: { useGlobal: true, duration: "0.8", stagger: "0.1", entranceY: "40" }
    },

    'B0301': {
        data: {
            groups: [
                { id: 'g1', title: 'Modular Architecture', items: [{ name: 'React 18', level: 95 }, { name: 'Zustand', level: 90 }] },
                { id: 'g2', title: 'Data Propagation', items: [{ name: 'Immer', level: 85 }, { name: 'DNA Sync', level: 100 }] }
            ]
        },
        layout: { columns: '2', gap: '60', paddingY: '120' },
        style: { useGlobalDNA: true }
    },

    'B0901': {
        layout: { height: '80' }
    }
};

export function getBlockDefaults(type: string): any {
    return BLOCK_DEFAULTS[type] || {
        data: {},
        layout: {},
        style: { useGlobalDNA: true },
        animation: { useGlobal: true }
    };
}
