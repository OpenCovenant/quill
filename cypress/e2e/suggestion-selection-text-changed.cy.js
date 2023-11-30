describe("Test editor marking's change in text", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should reflect rapid changes in text when selecting multiple suggestions", () => {
        let shouldBe = "aks Për kryerjen e programeve gazmim aso aks Për kryerjen e programeve gazmim aso aks Për kryerjen e programeve gazmim aso aks Për kryerjen e programeve gazmim aso "

        cy.get(".typo").should("not.exist");

        cy.get('[data-test="editor"]').type("asd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \n");
        cy.wait(2000);

        cy.get(".sticky .card").each((card, index) => {
            cy.wrap(card).find('[data-test="suggestion"]').first().click();
        });

        cy.wait(3000)
        cy.get('#editor > p').invoke('text').then((actualText) => {
            actualText = actualText.replace(/\s+/g, ' ').trim();
            shouldBe = shouldBe.replace(/\s+/g, ' ').trim();

            expect(actualText).to.equal(shouldBe);
        });
    });
});
