// Translation helper - supports both string and object (multi-language) values

type LangObj = Record<string, string>;

export const getTranslatedText = (value: unknown, lang = 'en'): string => {
    if (!value) return '';
    if (typeof value === 'object' && !Array.isArray(value)) {
        const obj = value as LangObj;
        return obj[lang] || obj['en'] || Object.values(obj)[0] || '';
    }
    return String(value);
};

export const getTranslatedArray = <T extends Record<string, unknown>>(
    items: T[],
    lang = 'en'
): Record<string, string>[] => {
    if (!Array.isArray(items)) return [];
    return items.map(item => {
        if (typeof item !== 'object' || item === null) {
            return { value: getTranslatedText(item, lang) };
        }
        const result: Record<string, string> = {};
        for (const key in item) {
            result[key] = getTranslatedText(item[key], lang);
        }
        return result;
    });
};
