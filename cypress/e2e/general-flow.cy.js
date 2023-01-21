describe("a general flow of quill", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });

    it("contains the editor in which we want to write", () => {
        cy.get("#editor").should("exist");
    });

    it("will mark typos in the editor", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get("#editor").type("gabmim ");
        cy.get("#editor > p > .typo").should("exist");
    });

    it("will mark loanwords in the editor", () => {
        cy.get("#editor > p > .loanword").should("not.exist");
        cy.get("#editor").type("lider ");
        cy.get("#editor > p > .loanword").should("exist");
    });

    it("will test if  Opening and closing the offcanvas works as expected.", () => {
        cy.get(".navbar-toggler-icon").click();
        cy.get(".offcanvas.offcanvas-start.show").should("exist");
        cy.get("#offcanvasCloseButton").click();
    });
});
