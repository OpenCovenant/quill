describe("Test request after suggestion selection", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should make a post request after rapidly selecting suggestions from cards", () => {
        cy.get(".typo").should("not.exist");

        cy.get('[data-test="editor"]').type("asd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \n");
        cy.wait(2000);

        cy.get('.sticky [data-test="marking-card"]').each((card, index) => {
            if(index < 9){
                cy.wrap(card).find('[data-test="suggestion"]').first().click();
            }
        });

        cy.wait(5000)

        cy.intercept("POST", 'http://localhost:3000/api/generateMarkingsForParagraphs').as("postRequest");
        cy.wait("@postRequest").then((interception) => {
            // we only need this to be true regardless of the status code
            expect(interception.response.statusCode).to.equal(404);
        });


    });
});
