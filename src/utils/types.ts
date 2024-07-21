// Ownership: Robert Roach

export interface StringMap {
    [key: string]: string;
}

export enum Functions {
    SUM = 'SUM',
    IF = "IF",
    MIN = 'MIN',
    MAX = 'MAX',
    AVG = 'AVG',
    CONCAT = 'CONCAT',
    DEBUG = 'DEBUG',
    COPY = 'COPY'
}

export interface RefDetails {
    column: number;
    row: number;
    value: string | number;
}