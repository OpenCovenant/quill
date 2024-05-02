describe("Upload Document", () => {
    let labels;

    beforeEach(() => {
        cy.visit("/");
        cy.fixture("labels").then((data) => {
            labels = data;
        });
    });

    // TODO: also check for updated word/character/marking information

    it("should check for loanword in output container on WORD file", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.docx");
        cy.get('[data-test="editor"]').should("have.text", "lider asd");
        cy.get(".loanword").contains("lider").should("exist");
    });

    it("should check for typo in output container on WORD file", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.docx");
        cy.get('[data-test="editor"]').should("have.text", "lider asd");
        cy.get(".typo").contains("asd").should("exist");
    });

    it("should upload the same WORD file 3 times in a row", () => {
        for (let n = 0; n < 3; n++) {
            cy.get('[data-test="editor-placeholder-upload"]')
                .click()
                .selectFile("cypress/fixtures/test.docx");
            cy.get('[data-test="editor"]').should("have.text", "lider asd");
            cy.get('[data-test="editor"]').clear();
        }
    });

    it("should check for loanword in output container on PDF file", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.pdf");
        cy.get('[data-test="editor"]').should("have.text", "lider asd");
        cy.get(".loanword").contains("lider").should("exist");
    });

    it("should check for typo in output container on PDF file", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.pdf");
        cy.get('[data-test="editor"]').should("have.text", "lider asd");
        cy.get(".typo").contains("asd").should("exist");
    });

    it("should upload the same PDF file 3 times in a row", () => {
        for (let n = 0; n < 3; n++) {
            cy.get('[data-test="editor-placeholder-upload"]')
                .click()
                .selectFile("cypress/fixtures/test.pdf");
            cy.get('[data-test="editor"]')
                .contains("lider asd")
                .should("exist");
            cy.get('[data-test="editor"]').clear();
        }
    });

    it("should check for loanword in output container on LIBRA file", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.odt");
        cy.get('[data-test="editor"]').should("have.text", "lider asd");
        cy.get(".loanword").contains("lider").should("exist");
    });

    it("should check for typo in output container on LIBRA file", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            // .contains(labels.uploadFileLabel)
            .click()
            .selectFile("cypress/fixtures/test.odt");
        cy.get('[data-test="editor"]').should("have.text", "lider asd");
        cy.get(".typo").contains("asd").should("exist");
    });

    it("should upload the same LIBRA file 3 times in a row", () => {
        for (let n = 0; n < 3; n++) {
            cy.get('[data-test="editor-placeholder-upload"]')
                .click()
                .selectFile("cypress/fixtures/test.odt");
            cy.get('[data-test="editor"]').should("have.text", "lider asd");
            cy.get('[data-test="editor"]').clear();
        }
    });
});
