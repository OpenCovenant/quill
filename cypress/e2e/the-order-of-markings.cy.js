describe("will check the order of markings are in the right order as we typed them in the text box", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will check the marking order as written on text box", () => {
        cy.get('[data-test="editor"]').type("lider ");
        cy.get("span.loanword").contains("lider").should("exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get("span.typo").contains("gabmim").should("exist");
        cy.get('[data-test="editor"]').type("Shkoi tek zyra.");
        cy.get("span.typo").contains("tek").should("exist");
    });
});
