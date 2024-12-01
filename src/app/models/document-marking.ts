import { Suggestion } from './suggestion';

export interface DocumentMarking {
    text: string;
    description: string;
    subtype: string;
    suggestions: Array<Suggestion>;
}
