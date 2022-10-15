import {TextMarking} from "../models/text-marking";

const SPAN_TAG = 'span';

/// requires the markings to be ordered ASC by "from" and DESC by "to"
export function markText(node: HTMLElement, textMarkings: TextMarking[], additionalClasses: string[] = []): void {
    const childNodes = node.childNodes;
    while (0 < textMarkings.length) {
        let traversalIndex: number = 0;
        const textMarking: TextMarking = textMarkings.shift() as TextMarking;
        for (let j = 0; j < childNodes.length; j++) {
            const childNode: HTMLElement = childNodes[j] as HTMLElement;

            if (childNode.nodeType === 1) { // element node
                const currentTextContent: string = childNode.textContent!;
                const deeperTextMarking: TextMarking = {
                    ...textMarking,
                    from: textMarking.from - traversalIndex,
                    to: textMarking.to - traversalIndex,
                };

                markText(childNode, [deeperTextMarking], additionalClasses);

                traversalIndex += currentTextContent.length;
            } else if (childNode.nodeType === 3) { // text node
                const currentTextContent = childNode.textContent!;
                const trueFrom = textMarking.from;
                const trueTo = textMarking.to;
                const relativeFrom = textMarking.from - traversalIndex;
                const relativeTo = textMarking.to - traversalIndex;

                const trueLeft = traversalIndex;
                const trueRight = traversalIndex + currentTextContent.length;
                const relativeLeft = 0;
                const relativeRight = currentTextContent.length;

                if (trueRight < trueFrom || trueLeft > trueTo) { // no marking will be made to this child node
                    traversalIndex += currentTextContent.length;
                    continue;
                }

                let newNodes = [];

                if (trueLeft < trueFrom) {
                    const newTextContent = currentTextContent.slice(relativeLeft, relativeFrom);
                    newNodes.push(document.createTextNode(newTextContent));
                }

                if (relativeLeft <= relativeFrom && relativeRight >= relativeTo) {
                    const newNode = document.createElement(SPAN_TAG);
                    newNode.classList.add(...additionalClasses, textMarking.type);
                    newNode.textContent = currentTextContent.slice(relativeFrom, relativeTo);
                    newNodes.push(newNode)
                }

                if (trueRight > trueTo) {
                    const newTextContent = currentTextContent.slice(relativeTo, relativeRight);
                    newNodes.push(document.createTextNode(newTextContent));
                }

                childNode.replaceWith(...newNodes);

                break;
            } else {
                throw Error("Unexpected node type!")
            }
        }
    }
}


/// ASC by "paragraph", "from" and DESC by "to"
export function sortParagraphedTextMarkings(textMarkings: Array<TextMarking>): Array<TextMarking> {
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
export function sortTextMarkings(textMarkings: Array<TextMarking>): Array<TextMarking> {
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
