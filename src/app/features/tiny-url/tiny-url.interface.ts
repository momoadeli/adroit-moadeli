export interface ITinyUrlMapping {
    url: string | null;
    tinyUrl: string | null;
    alias?: string | null;
    userName?: string | null;
    clickCount: number;
}

export interface ITinyUrlAllMappings {
    mappings: ITinyUrlMapping[];
}

export interface ITinyUrlStats {
    tinyUrl: string;
    clickCount: number;
}