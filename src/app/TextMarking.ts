export interface TextMarking {
    from: number;
    to: number;
    type: string;
    description: string;
    corrections: Array<string>;
}
