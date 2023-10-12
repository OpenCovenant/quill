describe("tests for uploaded files shown on editor", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will click on editor placeholder to upload a file in WORD, and will check if there is text shown in editor ", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.docx");
        cy.get('[data-test="editor"]').should("have.text", "lider asd");
    });

    it("will click on editor placeholder to upload a file in PDF, and will check if there is text shown in editor", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.pdf");
        cy.get('[data-test="editor"]').contains("lider asd").should("exist");
    });

    it("will click on editor placeholder to upload a file in LIBRA, and will check if there is text shown in editor", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.odt");
        cy.get('[data-test="editor"]').should("have.text", "lider asd");
    });
});
