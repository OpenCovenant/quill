describe("Upload Document", () => {
    let labels;

    beforeEach(() => {
        cy.visit("/");
        cy.fixture("labels").then((data) => {
            labels = data;
        });
    });

    it("should check for generated markings on a WORD file", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.docx");
        cy.get('[data-test="editor"]').should("have.text", "lider asd");

        cy.get(".loanword").contains("lider").should("exist");
        cy.get(".typo").contains("asd").should("exist");

        cy.get('[data-test="characters-words-markings"]')
            .contains("9 karaktere, 2 fjalë, 2 shenjime")
            .should("exist");
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

    it("should check for generated markings on a PDF file", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.pdf");
        cy.get('[data-test="editor"]').should("have.text", "lider asd");

        cy.get(".loanword").contains("lider").should("exist");
        cy.get(".typo").contains("asd").should("exist");

        cy.get('[data-test="characters-words-markings"]')
            .contains("9 karaktere, 2 fjalë, 2 shenjime")
            .should("exist");
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

    it("should check for generated markings on a LIBRA file", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.odt");
        cy.get('[data-test="editor"]').should("have.text", "lider asd");

        cy.get(".loanword").contains("lider").should("exist");
        cy.get(".typo").contains("asd").should("exist");

        cy.get('[data-test="characters-words-markings"]')
            .contains("9 karaktere, 2 fjalë, 2 shenjime")
            .should("exist");
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

    it("should upload a big WORD file just fine", () => {
        cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/big-test.docx");

        cy.get(".typo").contains("asd").should("exist");

        cy.get(".max-editor-characters").should("be.visible");
        cy.get('[data-test="characters-words-markings"]')
            .contains("6839 karaktere, 1710 fjalë, 1 shenjim")
            .should("exist");
    });
});
