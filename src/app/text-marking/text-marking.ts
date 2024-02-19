import { TextMarking } from '../models/text-marking';

const SPAN_TAG = 'span';
const ANIMATED_TYPO_MARKING_CLASS = 'animated-typo-marking';
const ANIMATED_LOANWORD_MARKING_CLASS = 'animated-loanword-marking';
const ANIMATED_STYLISTIC_MARKING_CLASS = 'animated-stylistic-marking';
const ANIMATED_GRAMMATICAL_MARKING_CLASS = 'animated-grammatical-marking';
const highlightedMarkingWords: Array<string> = [];
const lastHighlightedMarkingWords: Array<string> = [];
let markingIndex = 0;
let maxMarkings = 0;
let lastIterationCounter = 0;

/// requires the markings to be ordered ASC by "from" and DESC by "to"
export function markText(
    node: HTMLElement,
    numberOfTextMarkings: number,
    isLastChildNode: boolean,
    textMarkings: TextMarking[],
    additionalClasses: string[] = [],
    replaceSpacesWithNBSP = true
): void {
    const childNodes = node.childNodes;
    maxMarkings = markingIndex === 0 ? numberOfTextMarkings : maxMarkings;

    while (0 < textMarkings.length) {
        let traversalIndex: number = 0;
        const textMarking: TextMarking = textMarkings.shift() as TextMarking;
        for (let j = 0; j < childNodes.length; j++) {
            const childNode: HTMLElement = childNodes[j] as HTMLElement;
            lastIterationCounter = j;
            if (childNode.nodeType === 1) {
                // element node
                const currentTextContent: string = childNode.textContent!;
                const deeperTextMarking: TextMarking = {
                    ...textMarking,
                    from: textMarking.from - traversalIndex,
                    to: textMarking.to - traversalIndex
                };

                markText(
                    childNode,
                    numberOfTextMarkings,
                    isLastChildNode,
                    [deeperTextMarking],
                    additionalClasses
                );

                traversalIndex += currentTextContent.length;
            } else if (childNode.nodeType === 3) {
                // text node
                const currentTextContent = childNode.textContent!;
                const trueFrom = textMarking.from;
                const trueTo = textMarking.to;
                const relativeFrom = textMarking.from - traversalIndex;
                const relativeTo = textMarking.to - traversalIndex;

                const trueLeft = traversalIndex;
                const trueRight = traversalIndex + currentTextContent.length;
                const relativeLeft = 0;
                const relativeRight = currentTextContent.length;

                if (trueRight < trueFrom || trueLeft > trueTo) {
                    // no marking will be made to this child node
                    traversalIndex += currentTextContent.length;
                    continue;
                }

                const newNodes = [];

                if (trueLeft < trueFrom) {
                    const newTextContent = currentTextContent.slice(
                        relativeLeft,
                        relativeFrom
                    );
                    newNodes.push(document.createTextNode(newTextContent));
                }

                if (
                    relativeLeft <= relativeFrom &&
                    relativeRight >= relativeTo
                ) {
                    const newNode = document.createElement(SPAN_TAG);

                    newNode.classList.add(
                        ...additionalClasses,
                        textMarking.type
                    );
                    let newTextContent = currentTextContent.slice(
                        relativeFrom,
                        relativeTo
                    );
                    if (
                        replaceSpacesWithNBSP &&
                        newTextContent.trim().length === 0
                    ) {
                        // TODO improve the following two lines, use the g flag?
                        const occurrences = newTextContent.length;
                        newTextContent = newTextContent.replace(
                            ' '.repeat(occurrences),
                            '&nbsp;'.repeat(occurrences)
                        );
                    }

                    applyMarkingFadein(
                        newNode,
                        textMarking.type,
                        newTextContent
                    ); // Text Highlighting logic
                    newNode.innerHTML = newTextContent;
                    newNodes.push(newNode);
                }

                if (trueRight > trueTo) {
                    const newTextContent = currentTextContent.slice(
                        relativeTo,
                        relativeRight
                    );
                    newNodes.push(document.createTextNode(newTextContent));
                    lastIterationCounter++;
                }

                childNode.replaceWith(...newNodes);

                break;
            } else {
                throw Error('Unexpected node type!');
            }
        }
    }

    isLastCall(isLastChildNode, lastIterationCounter);
}

/**
 * Updates the state of text markings and applies animations to the HTML element based on changes detected
 * after invoking the `markText` function.
 *
 * @param {HTMLElement} newNode - The newly created or modified HTML element.
 * @param {string} textMarkingType - The type of the marking.
 * @param {string} newTextContent - The text content of the HTML element.
 *
 * This function adds the new text content to the `highlightedMarkingWords` array.
 * It then checks the previous state (`lastHighlightedMarkingWords`) and determines
 * whether to apply animations to the nodes based on the changes detected.
 * The logic considers scenarios where nodes are added, removed, or modified.
 */
function applyMarkingFadein(
    newNode: HTMLElement,
    textMarkingType: string,
    newTextContent: string
) {
    highlightedMarkingWords.push(newTextContent);

    // Check if there are any previous markings
    if (lastHighlightedMarkingWords.length === 0) {
        // If no previous markings (first time marking), apply animation to the new node
        updateHighlightingMarkings(newNode, textMarkingType, 'add');
    } else if (lastHighlightedMarkingWords.length < markingIndex) {
        // If fewer markings than old state, apply animation to the new node
        updateHighlightingMarkings(newNode, textMarkingType, 'add');
    } else if (lastHighlightedMarkingWords[markingIndex] === newTextContent) {
        // If the current marking is the same, remove animation
        updateHighlightingMarkings(newNode, textMarkingType, 'remove');
    } else if (lastHighlightedMarkingWords[markingIndex] !== newTextContent) {
        // Handle scenarios for adding, removing, nodes
        updatedMarkings(newNode, textMarkingType, newTextContent);
    } else {
        updateHighlightingMarkings(newNode, textMarkingType, 'remove');
    }

    markingIndex++;
}

/**
 * Updates the array of highlighted marking words based on changes in the text content.
 * This function is called when a node has been added, removed, or modified.
 *
 * @param {HTMLElement} newNode - The HTML element representing the updated node.
 * @param {string} textMarkingType - The type of the marking.
 * @param {string} newTextContent - The new text content of the updated node.
 */
function updatedMarkings(
    newNode: HTMLElement,
    textMarkingType: string,
    newTextContent: string
): void {
    // Handle scenarios for additions, removals, and modifications
    const deletedNodeNum: number =
        lastHighlightedMarkingWords.length - maxMarkings; // gets the difference between the old state's length and the new one.
    const addedNodes: number = maxMarkings - lastHighlightedMarkingWords.length; // gets the number of new nodes being added

    if (
        addedNodes >= 0 &&
        lastHighlightedMarkingWords[markingIndex + 1] !== newTextContent
    ) {
        // If a new first node was added, insert it and apply animation
        lastHighlightedMarkingWords.splice(markingIndex, 0, newTextContent);
        updateHighlightingMarkings(newNode, textMarkingType, 'add');
    } else if (
        lastHighlightedMarkingWords[markingIndex + deletedNodeNum] ===
        newTextContent
    ) {
        // Remove the item if it was changed back to the previous content
        updateHighlightingMarkings(newNode, textMarkingType, 'remove');
        lastHighlightedMarkingWords.splice(markingIndex, 1);
    } else {
        updateHighlightingMarkings(newNode, textMarkingType, 'remove');
        lastHighlightedMarkingWords.splice(markingIndex, 1, newTextContent);
    }
}

/**
 * Monitors the progress of the `markText` function and triggers an action when the specified
 * number of text markings is reached. This function is designed to be called after each invocation
 * of the `markText` function to check if it has completed processing.
 *
 * @param isLastChildNode - Contains the signal for the last child element
 * @param {number} typoElements - The expected total count of text markings to be processed.
 *
 * When the number of processed text markings equals the total expected count (typoElements),
 * this function triggers the `pushArrayItems` action and resets the marking count.
 */
function isLastCall(isLastChildNode: boolean, typoElements: number): void {
    if (isLastChildNode && typoElements > 0) {
        pushArrayItems();
        markingIndex = 0;
    }
}

/**
 * Updates the highlighting markings on a given HTML element by adding or removing
 * the animation class based on the specified status.
 *
 * @param {HTMLElement} newNode - The HTML element whose highlighting markings need to be updated.
 * @param {string} textMarkingType - The type of the marking.
 * @param {string} status - The status indicating whether to 'add' or 'remove' the animation class.
 */
function updateHighlightingMarkings(
    newNode: HTMLElement,
    textMarkingType: string,
    status: string
): void {
    if (status === 'add') {
        if (textMarkingType === 'typo') {
            newNode.classList.add(ANIMATED_TYPO_MARKING_CLASS);
        } else if (textMarkingType === 'loanword') {
            newNode.classList.add(ANIMATED_LOANWORD_MARKING_CLASS);
        } else if (textMarkingType === 'stylistic') {
            newNode.classList.add(ANIMATED_STYLISTIC_MARKING_CLASS);
        } else if (textMarkingType === 'grammatical') {
            newNode.classList.add(ANIMATED_GRAMMATICAL_MARKING_CLASS);
        }
    } else {
        if (textMarkingType === 'typo') {
            newNode.classList.remove(ANIMATED_TYPO_MARKING_CLASS);
        } else if (textMarkingType === 'loanword') {
            newNode.classList.remove(ANIMATED_LOANWORD_MARKING_CLASS);
        } else if (textMarkingType === 'stylistic') {
            newNode.classList.remove(ANIMATED_STYLISTIC_MARKING_CLASS);
        } else if (textMarkingType === 'grammatical') {
            newNode.classList.remove(ANIMATED_GRAMMATICAL_MARKING_CLASS);
        }
    }
}

/**
 * Updates the state of the lastHighlightedMarkingWords array. This function is designed to be
 * called when a specific condition is met, ensuring that the lastHighlightedMarkingWords array
 * reflects the current state of the highlightedMarkingWords array.
 *
 * This action is typically triggered after the completion of a specific operation or task, ensuring
 * that the arrays are synchronized for future comparisons.
 */
function pushArrayItems(): void {
    lastHighlightedMarkingWords.length = 0;
    highlightedMarkingWords.forEach((item) => {
        lastHighlightedMarkingWords.push(item);
    });
    highlightedMarkingWords.length = 0;
}

/// ASC by "paragraph", "from" and DESC by "to"
export function sortParagraphedTextMarkings(
    textMarkings: Array<TextMarking>
): Array<TextMarking> {
    return textMarkings.sort((tM: TextMarking, otherTM: TextMarking) => {
        if (tM.paragraph! > otherTM.paragraph!) {
            return 1;
        } else {
            if (tM.from > otherTM.from) {
                return 1;
            } else if (tM.from < otherTM.from) {
                return -1;
            } else {
                if (tM.to < otherTM.to) {
                    return 1;
                } else {
                    return -1;
                }
            }
        }
    });
}

/// ASC by "from" and DESC by "to"
export function sortTextMarkings(
    textMarkings: Array<TextMarking>
): Array<TextMarking> {
    return textMarkings.sort((tM: TextMarking, otherTM: TextMarking) => {
        if (tM.from > otherTM.from) {
            return 1;
        } else if (tM.from < otherTM.from) {
            return -1;
        } else {
            if (tM.to < otherTM.to) {
                return 1;
            } else {
                return -1;
            }
        }
    });
}

/**
 * Checks if the given emitted event key is included in a list of key non-triggers in order to not mark the editor.
 * For example pressing one of the arrow keys in the keyboard should not alter the editor's markings.
 * @param {KeyboardEvent} keyboardEvent from the keyup in the editor
 * @private
 * @returns {boolean} true if the editor should be not marked, false otherwise
 */
export function shouldNotMarkEditor(keyboardEvent: KeyboardEvent): boolean {
    const eventKey: string = keyboardEvent.key;
    const NON_TRIGGERS: string[] = [
        'Control',
        'CapsLock',
        'Shift',
        'Alt',
        'ArrowRight',
        'ArrowUp',
        'ArrowLeft',
        'ArrowDown'
    ];

    const copyOrPasteOrSelectAllEvent: boolean =
        keyboardEvent.ctrlKey &&
        (eventKey === 'v' ||
            eventKey === 'V' ||
            eventKey === 'c' ||
            eventKey === 'C' ||
            eventKey === 'a' ||
            eventKey === 'A');
    return NON_TRIGGERS.includes(eventKey) || copyOrPasteOrSelectAllEvent;
}
