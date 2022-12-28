import { Suggestion } from './suggestion';

export interface TextMarking {
    id?: string;
    from: number;
    to: number;
    type: string;
    subtype: string;
    description: string;
    suggestions: Array<Suggestion>;
    paragraph?: number; // TODO I don't like this... maybe create a ParagraphedTextMarking, then it's more bearable
}

// TODO finish the refactoring
export interface ParagraphedTextMarking extends TextMarking {
    paragraphIndex?: number;
}
