import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { DarkModeService } from '../../../services/dark-mode.service';
import { environment } from '../../../../environments/environment';
import { MarkedPage } from '../../../models/marked-page';

@Component({
    selector: 'app-document-upload',
    templateUrl: './document-upload.component.html',
    styleUrl: './document-upload.component.css',
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentUploadComponent {
    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    markedPages: MarkedPage[] | undefined = undefined;
    totalMarkingsCount: any;
    totalPagesMarkedCount: any;

    private baseURL!: string;
    private uploadDocumentURL!: string;

    constructor(
        public darkModeService: DarkModeService,
        private httpClient: HttpClient
    ) {
        this.initializeURLs();
    }

    /**
     * Uploads the selected document to be marked
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
            this.loading$.next(true);
            document.getElementById('fileName')!.textContent = file.name;
            const formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            this.httpClient
                .post(this.uploadDocumentURL, formData)
                .subscribe((value) => {
                    const markedPages = value as MarkedPage[];
                    this.markedPages = markedPages;
                    this.totalMarkingsCount = markedPages
                        .map((mP) => mP.markings.length)
                        .reduce((a, b) => a + b, 0);
                    this.totalPagesMarkedCount = markedPages.length;
                    this.loading$.next(false);
                });
        } else {
            alert('Ngarko vetëm një dokument!');
        }
    }

    renewModal(): void {
        console.log('renewModal');
        // TODO:
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.uploadDocumentURL = this.baseURL + '/api/uploadDocument';
    }
}
