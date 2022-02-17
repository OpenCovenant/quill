export interface TextMarking {
    from: number;
    to: number;
    type: string;
    description: string;
    suggestions: Array<string>;
}
