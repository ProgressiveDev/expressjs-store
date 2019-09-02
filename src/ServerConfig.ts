
export interface ServerItem {
    name: string;
    errorFrequency: number;
}

export interface ConfigSpec {
    servers: ServerItem[];
}