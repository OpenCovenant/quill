describe("Test animation during multiple suggestion selections", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should select suggestions for all cards with smooth animation", () => {
        let shouldBe = "aks Për kryerjen e programeve gazmim aso aks Për kryerjen e programeve gazmim aso aks Për kryerjen e programeve gazmim aso aks Për kryerjen e programeve gazmim aso "

        cy.get("#editor > p > .typo").should("not.exist");

        cy.get('[data-test="editor"]').type("asd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \n");
        cy.wait(2000);

        cy.get(".sticky .card").each((card, index) => {
            cy.wrap(card).find('[data-test="suggestion"]').first().click();
            cy.wait(2000)

        });

        cy.get("#editor > p > .typo").should("not.exist");

        cy.wait(3000)
        cy.get('#editor > p').invoke('text').then((actualText) => {
            actualText = actualText.replace(/\s+/g, ' ').trim();
            shouldBe = shouldBe.replace(/\s+/g, ' ').trim();

            expect(actualText).to.equal(shouldBe);
        });




    });
});
