import {
    AfterViewInit,
    Component,
    EventEmitter,
    OnDestroy,
    Output
} from '@angular/core';
import { debounceTime, fromEvent, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

import { DarkModeService } from '../../../services/dark-mode.service';
import { WritingsHistoryService } from '../../../services/writings-history.service';
import {
    CLOSE_WRITINGS_HISTORY_ID,
    EDITOR_ID,
    EVENTUAL_WRITTEN_TEXT_STORAGE_TIME,
    WRITINGS_INPUT_ID
} from '../../../services/constants';

@Component({
    selector: 'app-writings-history',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './writings-history.component.html',
    styleUrl: './writings-history.component.css'
})
export class WritingsHistoryComponent implements AfterViewInit, OnDestroy {
    @Output() markEditorEmitter = new EventEmitter<any>();

    private fromEditorInputEvent$: any;
    private eventualTextStoringSubscription$: any;

    constructor(
        public darkModeService: DarkModeService,
        public writingsHistoryService: WritingsHistoryService
    ) {}

    ngAfterViewInit() {
        (
            document.getElementById(WRITINGS_INPUT_ID) as HTMLInputElement
        ).checked = this.writingsHistoryService.canStoreWritings;

        // TODO can this be shared among components?
        this.fromEditorInputEvent$ = fromEvent(
            document.getElementById(EDITOR_ID)!,
            'input'
        );

        this.subscribeForStoringWrittenText();
    }

    ngOnDestroy(): void {
        this.eventualTextStoringSubscription$.unsubscribe();
    }

    toggleStoringOfWritings(): void {
        this.writingsHistoryService.toggleWritingPermission(
            (document.getElementById(WRITINGS_INPUT_ID) as HTMLInputElement)
                .checked
        );
    }

    /**
     * Replaces the text of the editor with the given **writtenText** and generates its markings
     * @param {string} writtenText
     */
    placeWriting(writtenText: string): void {
        document.getElementById(EDITOR_ID)!.innerText = writtenText;
        document.getElementById(CLOSE_WRITINGS_HISTORY_ID)!.click();
        this.markEditorEmitter.emit();
    }

    private subscribeForStoringWrittenText(): void {
        this.eventualTextStoringSubscription$ = this.fromEditorInputEvent$
            .pipe(
                debounceTime(EVENTUAL_WRITTEN_TEXT_STORAGE_TIME),
                tap(() =>
                    this.writingsHistoryService.storeWriting(
                        document.getElementById(EDITOR_ID)!.innerText
                    )
                )
            )
            .subscribe();
    }
}
