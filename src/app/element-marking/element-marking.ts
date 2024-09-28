import { Marking } from '../models/marking';
import {
    SPAN_TAG
} from '../services/constants';

/**
 * requires the markings to be ordered ASC by "from" and DESC by "to"
 *
 * @param node
 * @param numberOfMarkings
 * @param markings
 * @param additionalClasses
 * @param replaceSpacesWithNBSP
 */
export function markElement(
    node: HTMLElement,
    numberOfMarkings: number,
    markings: Marking[],
    additionalClasses: string[] = [],
    replaceSpacesWithNBSP: boolean = true
): void {
    const childNodes: NodeListOf<ChildNode> = node.childNodes;

    while (0 < markings.length) {
        let traversalIndex: number = 0;
        const marking: Marking = markings.shift() as Marking;
        for (let j: number = 0; j < childNodes.length; j++) {
            const childNode: HTMLElement = childNodes[j] as HTMLElement;
            if (childNode.nodeType === Node.ELEMENT_NODE) {
                const currentTextContent: string = childNode.textContent!;
                const deeperMarking: Marking = {
                    ...marking,
                    from: marking.from - traversalIndex,
                    to: marking.to - traversalIndex
                };

                markElement(
                    childNode,
                    numberOfMarkings,
                    [deeperMarking],
                    additionalClasses
                );

                traversalIndex += currentTextContent.length;
            } else if (childNode.nodeType === Node.TEXT_NODE) {
                const currentTextContent = childNode.textContent!;
                const trueFrom = marking.from;
                const trueTo = marking.to;
                const relativeFrom = marking.from - traversalIndex;
                const relativeTo = marking.to - traversalIndex;

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
                    const newTextContent: string = currentTextContent.slice(
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

                    newNode.classList.add(...additionalClasses, marking.type);
                    let newTextContent: string = currentTextContent.slice(
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
                }

                if (trueRight > trueTo) {
                    const newTextContent: string = currentTextContent.slice(
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
}

/// ASC by "paragraph", "from" and DESC by "to"
export function sortMarkings(markings: Array<Marking>): Array<Marking> {
    return markings.sort((m: Marking, otherM: Marking): number => {
        if (m.paragraph! > otherM.paragraph!) {
            return 1;
        } else {
            if (m.from > otherM.from) {
                return 1;
            } else if (m.from < otherM.from) {
                return -1;
            } else {
                if (m.to < otherM.to) {
                    return 1;
                } else {
                    return -1;
                }
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
