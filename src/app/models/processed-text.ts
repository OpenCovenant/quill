import {TextMarking} from "./text-marking";

export interface ProcessedText {
    text: string;
    textMarkings: Array<TextMarking>;
}
