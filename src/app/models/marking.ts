import { Suggestion } from './suggestion';

export interface Marking {
    id?: string;
    from: number;
    to: number;
    type: string;
    subtype: string;
    description: string;
    suggestions: Array<Suggestion>;
    paragraph?: number;
}
