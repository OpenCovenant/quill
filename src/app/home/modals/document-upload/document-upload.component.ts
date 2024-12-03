import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    interval,
    map,
    Observable,
    startWith,
    Subject,
    Subscription,
    takeUntil
} from 'rxjs';

import { DarkModeService } from '../../../services/dark-mode.service';
import { environment } from '../../../../environments/environment';
import { MarkedPage } from '../../../models/marked-page';

@Component({
    selector: 'app-document-upload',
    templateUrl: './document-upload.component.html',
    styleUrl: './document-upload.component.css',
    imports: [CommonModule]
})
export class DocumentUploadComponent implements OnDestroy {
    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    markedPages: MarkedPage[] | undefined = undefined;
    totalMarkingsCount: number | undefined = undefined;
    totalPagesMarkedCount: number | undefined = undefined;
    processingTimeLeft: string | undefined = undefined;

    private baseURL!: string;
    private uploadDocumentURL!: string;
    private documentUploadSubscription$: Subscription | undefined = undefined;
    private countdownSubject: Subject<void> = new Subject();
    private countdown$: Observable<number> | undefined = undefined;

    constructor(
        public darkModeService: DarkModeService,
        private httpClient: HttpClient
    ) {
        this.initializeURLs();
    }

    ngOnDestroy(): void {
        this.documentUploadSubscription$?.unsubscribe();
    }

    /**
     * Uploads the selected document to be marked.
     * @param {Event} $event the event emitted when the file is selected
     */
    uploadDocument($event: Event): void {
        const fileList: FileList | null = ($event.target as HTMLInputElement)
            .files;
        if (fileList && fileList.length === 1) {
            const file: File = fileList[0];
            const fileSize = file.size / (1024 * 1024);
            if (fileSize > 20) {
                alert(
                    'File is too large. Please select a file smaller than 20 MB.'
                );
            }
            this.clearModal();
            this.loading$.next(true);

            const sizeBasedTimerEstimation =
                (Math.round(fileSize) + 1) * 60 * 1000;
            this.startProcessingTimer(sizeBasedTimerEstimation);

            document.getElementById('file-name')!.textContent = file.name;
            const formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            this.documentUploadSubscription$ = this.httpClient
                .post(this.uploadDocumentURL, formData)
                .subscribe((value) => {
                    const markedPages = value as MarkedPage[];
                    this.markedPages = markedPages;
                    this.totalMarkingsCount = markedPages
                        .map((mP) => mP.markings.length)
                        .reduce((a, b) => a + b, 0);
                    this.totalPagesMarkedCount = markedPages.length;
                    this.loading$.next(false);
                    this.stopProcessingTimer();
                });
        } else {
            alert('Ngarko vetëm një dokument!');
        }
    }

    clearModal(): void {
        this.markedPages = undefined;
        this.totalMarkingsCount = undefined;
        this.totalPagesMarkedCount = undefined;
        (document.getElementById('document-upload-input')! as any).value = null;
        document.getElementById('file-name')!.textContent = '';
    }

    private startProcessingTimer(totalMinutes: number = 3 * 60 * 1000): void {
        this.countdown$ = interval(60 * 1000).pipe(
            startWith(0),
            map((_, index) => totalMinutes - index * 60 * 1000),
            takeUntil(this.countdownSubject)
        );

        this.countdown$.subscribe((count: any) => {
            const countInMinutes = count / 60000;
            this.processingTimeLeft =
                countInMinutes === 1 ? '1 minutë' : `${countInMinutes} minuta`;
            if (count === 0) {
                this.stopProcessingTimer();
            }
        });
    }

    private stopProcessingTimer(): void {
        this.countdownSubject.next();
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.uploadDocumentURL = this.baseURL + '/api/uploadDocument';
    }
}
