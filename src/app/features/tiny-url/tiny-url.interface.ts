export interface ITinyUrlMapping {
    url: string | null;
    tinyUrl: string | null;
    alias?: string | null;
    userName?: string | null;
}

export interface ITinyUrlAllMappings {
    mappings: ITinyUrlMapping[];
}

export interface ITinyUrlStats {
    tinyUrl: string;
    clickCount: number;
}