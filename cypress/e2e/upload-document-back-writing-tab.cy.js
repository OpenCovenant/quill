describe("when clicking upload-document tab and then back on the writing-tab, the text should be kept.", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });
    it("will test if clicking on the upload-document tab and then back on the writing-tab, the text should be kept.", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get("#editor").type("test");
        cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get('button[id="writeTextToggleButton"]').click();
        cy.get("#editor").contains("test").should("exist");
    });
});
