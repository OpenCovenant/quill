import { DocumentMarking } from './document-marking';

export interface MarkedPage {
    pageNumber: number;
    markings: DocumentMarking[];
}
