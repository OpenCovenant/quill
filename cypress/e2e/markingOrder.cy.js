describe("Marking Order Verification", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should verify the order of markings matches the order in the editor", () => {
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
