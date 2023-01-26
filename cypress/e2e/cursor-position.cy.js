describe("the position of the cursor in the editor after writing in it", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });

    // after every `cy.type`, it is assumed that the text is processed, hence the `cy.wait`
    // how can this code be improved?
    it("will properly move the position of the cursor based on the text written in the editor", () => {
        const THREE_SECONDS = 3000;
        cy.window().then(someWindow => {
            cy.document().then(someDocument => {
                const range = someWindow.getSelection().getRangeAt(0);

                assert(range.collapsed);
                assert(range.startOffset === 0);
                assert(range.startContainer.isEqualNode(someDocument.getElementById("editor").firstChild));
                assert(range.endContainer.isEqualNode(someDocument.getElementById("editor").firstChild));
                assert(range.endOffset === 0);
            })
        })

        cy.get("#editor").type("saktë gabmim ");
        cy.wait(THREE_SECONDS);
        cy.window().then(someWindow => {
            cy.document().then(someDocument => {
                const range = someWindow.getSelection().getRangeAt(0);

                assert(range.collapsed);
                assert(range.startOffset === 1);
                assert(range.startContainer.isEqualNode(someDocument.getElementById("editor").firstChild.childNodes[2]));
                assert(range.endContainer.isEqualNode(someDocument.getElementById("editor").firstChild.childNodes[2]));
                assert(range.endOffset === 1);
            })
        })

        cy.get("#editor").type("\n");
        cy.wait(THREE_SECONDS);
        cy.window().then(someWindow => {
            cy.document().then(someDocument => {
                const range = someWindow.getSelection().getRangeAt(0);

                assert(range.collapsed);
                assert(range.startOffset === 0);
                assert(range.startContainer.isEqualNode(someDocument.getElementById("editor").childNodes[1]));
                assert(range.endContainer.isEqualNode(someDocument.getElementById("editor").childNodes[1]));
                assert(range.endOffset === 0);
            })
        });

        cy.get("#editor").type("\n\n");
        cy.wait(THREE_SECONDS);
        cy.window().then(someWindow => {
            cy.document().then(someDocument => {
                const range = someWindow.getSelection().getRangeAt(0);

                assert(range.collapsed);
                assert(range.startOffset === 0);
                assert(range.startContainer.isEqualNode(someDocument.getElementById("editor").childNodes[3]));
                assert(range.endContainer.isEqualNode(someDocument.getElementById("editor").childNodes[3]));
                assert(range.endOffset === 0);
            })
        });

        cy.get("#editor").type("saktë saktë");
        cy.wait(THREE_SECONDS);
        cy.window().then(someWindow => {
            cy.document().then(someDocument => {
                const range = someWindow.getSelection().getRangeAt(0);

                assert(range.collapsed);
                assert(range.startOffset === 11);
                assert(range.startContainer.isEqualNode(someDocument.getElementById("editor").childNodes[3].firstChild));
                assert(range.endContainer.isEqualNode(someDocument.getElementById("editor").childNodes[3].firstChild));
                assert(range.endOffset === 11);
            })
        });
    });
});
