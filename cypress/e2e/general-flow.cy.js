describe("a general flow of quill", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("contains the editor in which we want to write", () => {
        cy.get('[data-test="editor"]').should("exist");
    });

    it("will mark typos in the editor", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get("#editor > p > .typo").should("exist");
    });

    it("will mark loanwords in the editor", () => {
        cy.get('[data-test="editor"] > p > .loanword').should("not.exist");
        cy.get('[data-test="editor"]').type("lider ");
        cy.get("#editor > p > .loanword").should("exist");
    });

    it("will test if  Opening and closing the offcanvas works as expected.", () => {
        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get(".offcanvas.offcanvas-start.show").should("exist");
        cy.get("#offcanvasCloseButton").click();
    });
});
