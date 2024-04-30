import { Marking } from './marking';

export interface ProcessedText {
    text: string;
    markings: Array<Marking>;
}
