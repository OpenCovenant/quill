describe("tests for upload document button", () => {
    let labels;

    beforeEach(() => {
        cy.visit("/");
        cy.fixture("labels").then((data) => {
            labels = data;
        });
    });

    it("will click on button and will check for loanword in output conainer on WORD file", () => {
        cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get(".btn-primary")
            .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.docx");
        cy.get("span.loanword").contains("lider").should("exist");
    });

    it("will click on button and will check for loanword in output conainer on WORD file", () => {
        cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get(".btn-primary")
            .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.docx");
        cy.get("span.typo").contains("asd").should("exist");
    });

    it("will click on button and will check for loanword in output conainer on PDF file", () => {
        cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get(".btn-primary")
            .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.pdf");
        cy.get("span.loanword").contains("lider").should("exist");
    });

    it("will click on button and will check for loanword in output conainer on PDF file", () => {
        cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get(".btn-primary")
            .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.pdf");
        cy.get("span.typo").contains("asd").should("exist");
    });

    it("will click on button and will check for loanword in output conainer on LIBRA file", () => {
        cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get(".btn-primary")
            .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.odt");
        cy.get("span.loanword").contains("lider").should("exist");
    });

    it("will click on button and will check for loanword in output conainer on LIBRA file", () => {
        cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get(".btn-primary")
            .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.odt");
        cy.get("span.typo").contains("asd").should("exist");
    });
});
