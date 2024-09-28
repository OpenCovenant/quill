import { Marking } from '../models/marking';

export const EMPTY_STRING: string = '';
export const DISMISSED_MARKINGS_KEY: string = 'penda-dismissed-markings';

export const SPAN_TAG: string = 'span';
export const PARAGRAPH_TAG = 'p';
export const PARAGRAPH_TAG_NAME: string = PARAGRAPH_TAG.toUpperCase();
export const DIV_TAG = 'div';
export const LINE_BREAK_TAG = 'br';
export const LINE_BREAK_TAG_NAME = LINE_BREAK_TAG.toUpperCase();

export const LINE_BREAK: string = '<br>';
export const LINE_BROKEN_PARAGRAPH: string = '<p>' + LINE_BREAK + '</p>';

export const SECONDS: number = 1000;
export const EVENTUAL_MARKING_TIME: number = 1.5 * SECONDS;
export const EVENTUAL_WRITTEN_TEXT_STORAGE_TIME: number = 15 * SECONDS;

export const EDITOR_ID: string = 'editor';
export const PLACEHOLDER_ELEMENT_ID: string = 'editor-placeholder';
export const WRITINGS_INPUT_ID: string = 'writings-input';
export const MAX_EDITOR_CHARACTERS: number = 10000;
// think there's something about "i" as well (and of course maybe for some others)
export const UNCONVENTIONAL_CHARACTERS: string[] = ['ë'];

export const APPLY_SUGGESTION_MESSAGE = 'apply-suggestion';
export const DISMISS_MARKING_MESSAGE = 'dismiss-marking';

export function filterDismissedMarkings(
    markings: Marking[],
    text: string
): Marking[] {
    const dismissedMarkings: string[] =
        (JSON.parse(
            localStorage.getItem(DISMISSED_MARKINGS_KEY)!
        ) as string[]) ?? [];
    return markings.filter((m: Marking) => {
        const virtualEditor: HTMLDivElement = document.createElement(DIV_TAG);
        virtualEditor.innerHTML = text;

        const editorTextContent: string | null =
            virtualEditor.childNodes[m.paragraph!].textContent;

        const markingText: string = editorTextContent!.slice(m.from, m.to);

        return !dismissedMarkings.includes(markingText);
    });
}

export function filterUnselectedMarkingTypes(markings: Marking[]): Marking[] {
    return markings.filter((tM: Marking): boolean => {
        if (tM.id) {
            const items = { ...localStorage };
            let b = true;
            Object.entries(items).forEach((e: any) => {
                if (e[0] === tM.id) {
                    b = e[1] === 'true';
                }
            });
            return b;
        } else {
            return true;
        }
    });
}
