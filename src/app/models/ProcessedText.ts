import {TextMarking} from "./TextMarking";

export interface ProcessedText {
    text: string;
    textMarkings: Array<TextMarking>;
}
