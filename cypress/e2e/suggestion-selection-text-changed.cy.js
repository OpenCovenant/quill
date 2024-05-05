describe("Editor Marking Change Test", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should behave properly when consecutively applying many suggestions", () => {
            let text =
            "aks Për kryerjen e programeve gazmim aso aks Për kryerjen e programeve gazmim aso aks Për kryerjen e programeve gazmim aso aks Për kryerjen e programeve gazmim aso ";

        cy.get(".typo").should("not.exist");

        // TODO improve
        cy.get('[data-test="editor"]').type(
            "asd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \n"
        );
        cy.wait(2000);

        cy.get('[data-test="marking-card"]').each((card, index) => {
            cy.wrap(card).find('[data-test="suggestion"]').first().click();
        });

        cy.wait(3000);
        cy.get("#editor > p")
            .invoke("text")
            .then((t) => {
                t = t.replace(/\s+/g, " ").trim();
                text = text.replace(/\s+/g, " ").trim();
                expect(t).to.equal(text);
            });
    });
});
