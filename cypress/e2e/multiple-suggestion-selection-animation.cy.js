describe("Test animation during multiple suggestion selections", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should display smooth animations while selecting suggestions for all markings", () => {
        cy.get('[data-test="editor"]').type(
            "asd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \n"
        );
        cy.wait(2000);
        cy.get('[data-test="marking-card"]').each((card, index) => {
            cy.wrap(card).find('[data-test="suggestion"]').first().click();
            cy.wait(2000);
        });
        cy.get(".typo").should("not.exist");
    });
});
