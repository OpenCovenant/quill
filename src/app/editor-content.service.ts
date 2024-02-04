import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EditorContentService {
    public editorInnerHTML: any = undefined;
}
