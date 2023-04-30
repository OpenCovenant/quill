describe("will check the order of markings are in the right order as we typed them in the text box", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will check the order of the markings as written in the editor", () => {
        cy.get('[data-test="editor"]').type("gabmi lider gabmim");
        cy.get('[data-test="editor"] > p > span')
            .eq(0)
            .should("have.text", "gabmi");
        cy.get('[data-test="editor"] > p > span')
            .eq(1)
            .should("have.text", "lider");
        cy.get('[data-test="editor"] > p > span')
            .eq(2)
            .should("have.text", "gabmim");
    });
});
