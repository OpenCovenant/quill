describe("Remove Marking - Fade Right Animation", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should remove all cards and trigger fade-out animation", () => {
        cy.get('[data-test="editor"]').type("sakt eshte");
        cy.get('[data-test="dismiss-marking-button"]').should("be.visible");

        cy.get('[data-test="marking-card"]').each((card, index) => {
            cy.wrap(card).find('[data-test="dismiss-marking-button"]').click();
            cy.wrap(card).should("not.exist");
        });
    });
});
