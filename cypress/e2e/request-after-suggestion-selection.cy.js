describe("Test Request After Suggestion Selection", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should make a request after rapidly applying suggestions", () => {
const text = "asd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \n";
        cy.get('[data-test="editor"]').type(
            text
        );
        cy.wait(2000);

        cy.get('[data-test="marking-card"]').each((card, index) => {
            if (index < 9) {
                cy.wrap(card).find('[data-test="suggestion"]').first().click();
            }
        });

        cy.intercept(
            "POST",
            "api/generateMarkingsForParagraphs"
        ).as("postRequest");
        cy.wait("@postRequest").then((interception) => {
            expect(interception.response.statusCode).to.equal(200);
        });
    });
});
