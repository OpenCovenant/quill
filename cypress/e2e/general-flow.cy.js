describe("General Quill Flow", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should contain the editor in which we want to write", () => {
        cy.get('[data-test="editor"]').should("exist");
    });

    it("should mark typos in the editor", () => {
        cy.get('[data-test="editor"] > p > .typo').should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="editor"] > p > .typo').should("exist");
    });

    it("should mark loanwords in the editor", () => {
        cy.get('[data-test="editor"] > p > .loanword').should("not.exist");
        cy.get('[data-test="editor"]').type("lider ");
        cy.get('[data-test="editor"] > p > .loanword').should("exist");
    });

    it("should open and close the offcanvas as expected", () => {
        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get(".offcanvas.offcanvas-start.show").should("exist");
        cy.get('[data-test="close-offcanvas-button"]').click();
    });

    it("should handle suggestion expansion, collapse, and selection", () => {
        cy.get('[data-test="editor"]').type("eshte");
        cy.get('[data-test="suggestion"]').children().should("have.length", 4);
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-right-square'
        ).click();
        cy.get('[data-test="suggestion"]')
            .children()
            .should("have.length.gt", 4);
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-left-square'
        ).click();
        cy.get('[data-test="suggestion"]').children().should("have.length", 4);
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-right-square'
        ).click();
        cy.get('[data-test="suggestion"]')
            .children()
            .should("have.length.gt", 4);
        cy.get('[data-test="suggestion"]').contains("është").click();
        cy.get('[data-test="editor"]').should("have.text", "është");
    });
});
