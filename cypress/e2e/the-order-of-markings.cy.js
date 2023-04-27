describe("will check the order of markings are in the right order as we typed them in the text box", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will check the marking order as written on text box", () => {
        cy.get('[data-test="editor"]').type("lider gabmim");
        cy.get("span.loanword").eq(0).should("have.text", "lider");
        cy.get("span.typo").eq(0).should("have.text", "gabmim");
    });
});
