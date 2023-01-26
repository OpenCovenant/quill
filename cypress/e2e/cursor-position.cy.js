describe("test for position of the cursor in the edito", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });

    it("will click on hiq button and check if it deletes the text on editor", () => {
        // cy.get("#editor");
        cy.window().then(w => console.log(w.getSelection().getRangeAt(0)))
    });
});
