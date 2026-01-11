import React, { useState, useCallback } from 'react';
import { handleExportProject } from './exportSystem';

export const ExportButton: React.FC = () => {
    const [isExporting, setIsExporting] = useState(false);

    const handleClick = useCallback(async () => {
        setIsExporting(true);
        try {
            await handleExportProject();
        } finally {
            setIsExporting(false);
        }
    }, []);

    return (
        <button
            onClick={handleClick}
            disabled={isExporting}
            style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isExporting ? 'not-allowed' : 'pointer',
                opacity: isExporting ? 0.6 : 1,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}
        >
            <span>{isExporting ? '⏳' : '📦'}</span>
            <span>{isExporting ? 'Exporting...' : 'Export Project (with i18n)'}</span>
        </button>
    );
};
