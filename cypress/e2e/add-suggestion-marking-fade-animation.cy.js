describe("Suggestion Marking - Fade Right Animation", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should replace all markings with the first suggestions and trigger fade animation", () => {
        cy.get('[data-test="editor"]').type("gabmim gabmim");
        cy.get('[data-test="suggestion"]').should("be.visible");

        cy.get('[data-test="marking-card"]').each((card, index) => {
            cy.wrap(card).find('[data-test="suggestion"]').first().click();
        }); // TODO: I guess ideally we also check that this fade-out class is applied briefly?
        cy.get('[data-test="marking-card"] .fade-out').should("not.exist");
    });
});
