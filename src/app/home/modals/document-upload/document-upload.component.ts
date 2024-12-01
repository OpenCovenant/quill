import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Output
} from '@angular/core';

import { DarkModeService } from '../../../services/dark-mode.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { DocumentUploadService } from './document-upload.service';
import { Suggestion } from '../../../models/suggestion';

export interface MarkedPage {
    pageNumber: number;
    markings: DocumentMarking[];
}

export interface DocumentMarking {
    text: string;
    description: string;
    subtype: string;
    suggestions: Array<Suggestion>;
}

@Component({
    selector: 'app-document-upload',
    templateUrl: './document-upload.component.html',
    styleUrl: './document-upload.component.css',
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentUploadComponent {
    @Output() uploadDocumentEmitter: EventEmitter<Event> = new EventEmitter();
    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    markedPages: MarkedPage[] | undefined = undefined;
    totalMarkingsCount: any;
    totalPagesMarkedCount: any;

    constructor(
        public darkModeService: DarkModeService,
        private documentUploadService: DocumentUploadService
    ) {}

    uploadDocument($event: Event): void {
        this.loading$.next(true);
        this.uploadDocumentEmitter.emit($event);
        this.documentUploadService.markedPages$.subscribe(
            (markedPages: MarkedPage[]) => {
                this.markedPages = markedPages;
                console.log(markedPages.map((mP) => mP.markings.length));
                this.totalMarkingsCount = markedPages
                    .map((mP) => mP.markings.length)
                    .reduce((a, b) => a + b);
                this.totalPagesMarkedCount = markedPages.length;
                this.loading$.next(false);
            }
        );
    }

    renewModal(): void {
        console.log('renewModal');
        // TODO:
    }
}
