import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DocumentUploadService {
    private markedPagesSubject$: Subject<any> = new Subject<any>();
    public markedPages$ = this.markedPagesSubject$.asObservable();

    updateData(newData: any) {
        this.markedPagesSubject$.next(newData);
    }
}
