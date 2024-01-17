describe("Uploaded Files Shown on Editor Tests", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should click on editor placeholder to upload a WORD file and check if the text is shown in the editor", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.docx");
        cy.get('[data-test="editor"]').should("have.text", "lider asd");
    });

    it("should click on editor placeholder to upload a PDF file and check if the text is shown in the editor", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.pdf");
        cy.get('[data-test="editor"]').contains("lider asd").should("exist");
    });

    it("should click on editor placeholder to upload a LIBRA file and check if the text is shown in the editor", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.odt");
        cy.get('[data-test="editor"]').should("have.text", "lider asd");
    });
});
