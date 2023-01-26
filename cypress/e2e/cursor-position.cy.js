describe("the position of the cursor in the editor after writing in it", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });

    // after every `cy.type`, it is assumed that the text is processed, hence the `cy.wait`
    // how can this code be improved?
    it("will properly move the position of the cursor based on the text written in the editor", () => {
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

        cy.get("#editor").type("gabmim");
        cy.wait(3000);
        cy.window().then(someWindow => {
            cy.document().then(someDocument => {
                const range = someWindow.getSelection().getRangeAt(0);

                assert(range.collapsed);
                assert(range.startOffset === 6);
                assert(range.startContainer.isEqualNode(someDocument.getElementById("editor").firstChild.firstChild));
                assert(range.endContainer.isEqualNode(someDocument.getElementById("editor").firstChild.firstChild));
                assert(range.endOffset === 6);
            })
        })

        cy.get("#editor").type("\n");
        cy.wait(3000);
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
        cy.wait(3000);
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
        cy.wait(3000);
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
