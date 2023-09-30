import { TextMarking } from '../models/text-marking';

const SPAN_TAG = 'span';
const highlightedMarkingWords: Array<string> = [];
const lastHighlightedMarkingWords: Array<string> = [];
let markingCount = 0;

/// requires the markings to be ordered ASC by "from" and DESC by "to"
export function markText(
    node: HTMLElement,
    textMarkings: TextMarking[],
    additionalClasses: string[] = [],
    replaceSpacesWithNBSP = true
): void {
    const childNodes = node.childNodes;
    const currentTextMarkings = document.getElementById('editor')!;
    const typoElements = currentTextMarkings.querySelectorAll('#editor p .typo');

    while (0 < textMarkings.length) {
        let traversalIndex: number = 0;
        const textMarking: TextMarking = textMarkings.shift() as TextMarking;
        for (let j = 0; j < childNodes.length; j++) {
            const childNode: HTMLElement = childNodes[j] as HTMLElement;

            if (childNode.nodeType === 1) {
                // element node
                const currentTextContent: string = childNode.textContent!;
                const deeperTextMarking: TextMarking = {
                    ...textMarking,
                    from: textMarking.from - traversalIndex,
                    to: textMarking.to - traversalIndex
                };

                markText(childNode, [deeperTextMarking], additionalClasses);

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
                    newNode.innerHTML = newTextContent;
                    newNodes.push(newNode);

                    // Text Highlighting logic
                    makeTextMarkings(newNode, newTextContent)

                }

                if (trueRight > trueTo) {
                    const newTextContent = currentTextContent.slice(
                        relativeTo,
                        relativeRight
                    );
                    newNodes.push(document.createTextNode(newTextContent));
                }

                childNode.replaceWith(...newNodes);

                break;
            } else {
                throw Error('Unexpected node type!');
            }

        }

    }

    isLastCall(textMarkings.length, typoElements.length)

}


/**
 * Updates the state of text markings and applies animations to the HTML element based on changes detected
 * after invoking the `markText` function.
 *
 * @param {HTMLElement} newNode - The newly created or modified HTML element.
 * @param {string} newTextContent - The text content of the HTML element.
 *
 * This function adds the new text content to the `highlightedMarkingWords` array.
 * It then checks the previous state (`lastHighlightedMarkingWords`) and determines
 * whether to apply animations to the nodes based on the changes detected.
 * The logic considers scenarios where nodes are added, removed, or modified.
 */
function makeTextMarkings(newNode: HTMLElement, newTextContent: string){
    highlightedMarkingWords.push(newTextContent)

    // Check if there are any previous markings
    if(lastHighlightedMarkingWords.length === 0){
        // If no previous markings, apply animation to the new node
        newNode.style.animation = 'fillBackground 500ms linear forwards';
    }else{
        // Check various scenarios based on changes in markings
        if(lastHighlightedMarkingWords.length < markingCount){
            // If fewer markings than expected, apply animation to the new node
            newNode.style.animation = 'fillBackground 500ms linear forwards';
        }else if(lastHighlightedMarkingWords[markingCount] === newTextContent){
            // If the current marking is the same, remove animation
            newNode.style.animation = '';
        }else if(lastHighlightedMarkingWords[markingCount] !== newTextContent){
            // Handle scenarios for additions, removals, and modifications
            if(lastHighlightedMarkingWords[markingCount + 1] === newTextContent){
                newNode.style.animation = '';
                // Remove the item if it was changed back to the previous content
                removeItemAtIndex(markingCount)
            }else if(markingCount === 0 && lastHighlightedMarkingWords[markingCount + 1] !== newTextContent){
                // If a new first node was added, insert it and apply animation
                addItemAtIndex(0, newTextContent)
                newNode.style.animation = 'fillBackground 500ms linear forwards';
            }else if(lastHighlightedMarkingWords[markingCount - 1] !== newTextContent || lastHighlightedMarkingWords[markingCount + 1] !== newTextContent){
                // If the node was modified or inserted somewhere in the middle, apply animation
                addItemAtIndex(markingCount, newTextContent)
                newNode.style.animation = 'fillBackground 500ms linear forwards';
            }else{
                newNode.style.animation = 'fillBackground 500ms linear forwards';
            }

        }else{
            newNode.style.animation = '';
        }
    }

    markingCount++;
}


/**
 * Monitors the progress of the `markText` function and triggers an action when the specified
 * number of text markings is reached. This function is designed to be called after each invocation
 * of the `markText` function to check if it has completed processing.
 *
 * @param {number} textMarkings - The current count of text markings processed by the `markText` function.
 * @param {number} typoElements - The expected total count of text markings to be processed.
 *
 * When the number of processed text markings equals the total expected count (typoElements),
 * this function triggers the `pushArrayItems` action and resets the marking count.
 */
function isLastCall(textMarkings: number, typoElements: number){
    if(textMarkings === typoElements){
        pushArrayItems()
        markingCount = 0
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
function pushArrayItems() {
    lastHighlightedMarkingWords.length = 0
    highlightedMarkingWords.forEach((item) => {
        lastHighlightedMarkingWords.push(item);
    });
    highlightedMarkingWords.length = 0;
}

/**
 * Removes an item from the lastHighlightedMarkingWords array at the specified index.
 * @param {number} index - The index of the item to be removed from the array.
 */
function removeItemAtIndex(index: number){
    if (index >= 0 && index < lastHighlightedMarkingWords.length) {

      lastHighlightedMarkingWords.splice(index, 1);
    } else {
      console.error('Invalid index');
    }
}

/**
 * Adds a new item to the lastHighlightedMarkingWords array at the specified index.
 * @param {number} index - The index at which to insert the new item.
 * @param {string} newItem - The new item to be added to the array.
 */
function addItemAtIndex(index: number, newItem: string){
    if (index >= 0 && index <= lastHighlightedMarkingWords.length) {

      lastHighlightedMarkingWords.splice(index, 0, newItem);
    } else {
      console.error('Invalid index');
    }
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
