describe("will check the order of markings are in the right order as we typed them in the text box", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will check the marking order as written in the editor", () => {
        cy.get('[data-test="editor"]').type("lider gabmim Shkoi tek zyra.");
        cy.get("span.loanword").eq(0).should("have.text", "lider");
        cy.get("span.typo").eq(0).should("have.text", "gabmim");
        cy.get("span.typo").eq(1).should("have.text", "tek");
    });
});
