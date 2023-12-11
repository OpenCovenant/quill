describe("Text Marking Dismissal/removal Test", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should dismiss three markings and verify the count", () => {
        const totalNumberOfMarkings = 9;

        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type(
            "asd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \n"
        );
        cy.get('[data-test="dismiss-marking-button"]').should("be.visible");

        cy.get('[data-test="marking-card"] ').each((card, index, list) => {
            if (index <= 2) {
                cy.wrap(card)
                    .find('[data-test="dismiss-marking-button"]')
                    .click()
                    .then(() => {
                        cy.wrap(card).should("not.exist");
                        cy.wait(1000);
                    });
            }
        });

        //final count of markings
        cy.get(".typo")
            .its("length")
            .then((numberOfMarkings) => {
                expect(numberOfMarkings).to.equal(totalNumberOfMarkings);
            });
    });
});
