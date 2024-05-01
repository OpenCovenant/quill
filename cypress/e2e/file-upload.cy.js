xdescribe("Upload Document Button Test", () => {
    let labels;

    beforeEach(() => {
        cy.visit("/");
        cy.fixture("labels").then((data) => {
            labels = data;
        });
    });

    // TODO: also check for updated word/character/marking information

    it("should check for loanword in output container on WORD file", () => {
        // TODO update?
        // cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get('[data-test="editor-placeholder-upload"]')
            // .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.docx");
        cy.get(".loanword").contains("lider").should("exist");
    });

    it("should check for typo in output container on WORD file", () => {
        // TODO update?
        // cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get('[data-test="editor-placeholder-upload"]')
            // .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.docx");
        cy.get(".typo").contains("asd").should("exist");
    });

    it("should check for loanword in output container on PDF file", () => {
        // TODO update?
        // cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get('[data-test="editor-placeholder-upload"]')
            // .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.pdf");
        cy.get(".loanword").contains("lider").should("exist");
    });

    it("should check for typo in output container on PDF file", () => {
        // TODO update?
        // cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get('[data-test="editor-placeholder-upload"]')
            // .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.pdf");
        cy.get(".typo").contains("asd").should("exist");
    });

    it("should check for loanword in output container on LIBRA file", () => {
        // TODO update?
        // cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get('[data-test="editor-placeholder-upload"]')
            // .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.odt");
        cy.get(".loanword").contains("lider").should("exist");
    });

    it("should check for typo in output container on LIBRA file", () => {
        // TODO update?
        // cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get('[data-test="editor-placeholder-upload"]')
            // .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.odt");
        cy.get(".typo").contains("asd").should("exist");
    });
});
