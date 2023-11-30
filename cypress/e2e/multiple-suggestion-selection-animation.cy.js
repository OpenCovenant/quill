describe("Test animation during multiple suggestion selections", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should select suggestions for all cards and display smooth animation", () => {
        cy.get(".typo").should("not.exist");

        cy.get('[data-test="editor"]').type("asd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \n");
        cy.wait(2000);

        cy.get(".sticky .card").each((card, index) => {
            cy.wrap(card).find('[data-test="suggestion"]').first().click();
            cy.wait(2000)

        });

        cy.get(".typo").should("not.exist");
    });
});
