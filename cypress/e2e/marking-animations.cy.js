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

    it("should trigger move-up animation for remaining cards after deleting one card", () => {
        cy.get('[data-test="editor"]').type("sakt eshte");
        cy.get('[data-test="suggestion"]').should("be.visible");

        cy.get('[data-test="marking-card"]')
            .first()
            .find('[data-test="suggestion"]')
            .first()
            .click();
        cy.get('[data-test="marking-card"]')
            .first()
            .should("have.class", "fade-out");
        cy.get('[data-test="marking-card"]')
            .first()
            .should("have.class", "move-up-animation");
        cy.get('[data-test="marking-card"]').should("have.length", 2);
    });

    // TODO how is the fade-out animation checked here?
    it("should remove all cards and trigger fade-out animation", () => {
        cy.get('[data-test="editor"]').type("sakt eshte");
        cy.get('[data-test="dismiss-marking-button"]').should("be.visible");

        cy.get('[data-test="marking-card"]')
            .first()
            .find('[data-test="dismiss-marking-button"]')
            .first()
            .click();
        cy.wait(2000);
        cy.get('[data-test="marking-card"]')
            .find('[data-test="dismiss-marking-button"]')
            .click();

        cy.get('[data-test="marking-card"]').should("not.exist");
    });

    // TODO how is the animation checked here?
    it("should display smooth animations while selecting suggestions for all markings", () => {
        cy.get('[data-test="editor"]').type(
            "asd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \n"
        );
        cy.wait(2000);
        cy.get('[data-test="marking-card"]').each((card, index) => {
            cy.wrap(card).find('[data-test="suggestion"]').first().click();
        });
        cy.get(".typo").should("not.exist");
    });
});
