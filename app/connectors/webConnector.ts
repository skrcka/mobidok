export enum MessageType {
    LOG,
    TOKEN,
    PRINT,
}

export enum MessageResult {
    OK,
    ERROR,
}

export interface Message {
    id: string;
    type: MessageType;
    payload?: any;
}

export interface Response {
    id: string;
    type: MessageType;
    result: MessageResult;
    payload?: any;
    error?: string;
}
