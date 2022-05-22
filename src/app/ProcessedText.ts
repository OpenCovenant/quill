import {TextMarking} from "./Models/TextMarking";

export interface ProcessedText {
    text: string;
    textMarkings: Array<TextMarking>;
}
