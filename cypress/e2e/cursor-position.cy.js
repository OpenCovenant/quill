describe("test for position of the cursor in the edito", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });

    // how can this code be improved?
    it("will properly move the position of the cursor based on the text written in the editor", () => {
        cy.window().then(someWindow => {
            cy.document().then(someDocument => {
                const range = someWindow.getSelection().getRangeAt(0);
                // console.log(range.startContainer);
                // console.log();
                assert(range.collapsed);
                assert(range.startOffset === 0);
                // assert(someDocument.getElementById("editor").firstChild.isEqualNode(range.startContainer))
                assert(range.startContainer.isEqualNode(someDocument.getElementById("editor").firstChild));
                assert(range.endContainer.isEqualNode(someDocument.getElementById("editor").firstChild));
                // cy.get("#editor").children().eq(0).should('equal', range.startContainer);
                assert(range.endOffset === 0);
            })
        })

        cy.get("#editor").type("gabmim");
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
    });

    // it("will click on hiq button and check if it2 deletes the text on editor", () => {
    //     // cy.window().then(w => console.log(w.getSelection().getRangeAt(0)))
    //     // cy.get("#editor").type("gabmim\n");
    //     // cy.window().then(w => console.log(w.getSelection().getRangeAt(0)))
    // });
});
