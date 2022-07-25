import {Suggestion} from "./suggestion";

export interface TextMarking {
    from: number;
    to: number;
    type: string;
    subtype: string;
    description: string;
    suggestions: Array<Suggestion>;
}
