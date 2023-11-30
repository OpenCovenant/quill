describe("tests for upload document button", () => {
    let labels;

    beforeEach(() => {
        cy.visit("/");
        cy.fixture("labels").then((data) => {
            labels = data;
        });
    });

    it("will click on button and will check for loanword in output container on WORD file", () => {
        // TODO update?
        // cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get('[data-test="editor-placeholder-upload"]')
            // .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.docx");
        cy.get("span.loanword").contains("lider").should("exist");
    });

    it("will click on button and will check for loanword in output container on WORD file", () => {
        // TODO update?
        // cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get('[data-test="editor-placeholder-upload"]')
            // .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.docx");
        cy.get(".typo").contains("asd").should("exist");
    });

    it("will click on button and will check for loanword in output container on PDF file", () => {
        // TODO update?
        // cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get('[data-test="editor-placeholder-upload"]')
            // .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.pdf");
        cy.get(".loanword").contains("lider").should("exist");
    });

    it("will click on button and will check for loanword in output container on PDF file", () => {
        // TODO update?
        // cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get('[data-test="editor-placeholder-upload"]')
            // .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.pdf");
        cy.get(".typo").contains("asd").should("exist");
    });

    it("will click on button and will check for loanword in output container on LIBRA file", () => {
        // TODO update?
        // cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get('[data-test="editor-placeholder-upload"]')
            // .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.odt");
        cy.get(".loanword").contains("lider").should("exist");
    });

    it("will click on button and will check for loanword in output container on LIBRA file", () => {
        // TODO update?
        // cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get('[data-test="editor-placeholder-upload"]')
            // .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.odt");
        cy.get(".typo").contains("asd").should("exist");
    });
});
