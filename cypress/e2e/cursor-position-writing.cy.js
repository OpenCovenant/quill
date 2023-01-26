describe("test for position of the cursor in the edito", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });

    it("will click on hiq button and check if it1 deletes the text on editor", () => {

        cy.window().then(someWindow => {
            // cy.document().then(someDocument => {
            cy.get("#editor").type("gabmim\n");
                const range = someWindow.getSelection().getRangeAt(0);
                console.log(range);
                console.log(range.startContainer);
                // console.log();
                // assert(range.startOffset === 0);
                // // assert(someDocument.getElementById("editor").firstChild.isEqualNode(range.startContainer))
                // assert(range.startContainer.isEqualNode(someDocument.getElementById("editor").firstChild));
                // assert(range.endContainer.isEqualNode(someDocument.getElementById("editor").firstChild));
                // // cy.get("#editor").children().eq(0).should('equal', range.startContainer);
                // assert(range.endOffset === 0);
            })
        // })
    });
});
