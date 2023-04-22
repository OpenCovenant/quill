describe("test for button hiq", () => {
    let labels;

    beforeEach(() => {
        cy.visit("/");
        cy.fixture("labels").then((data) => {
            labels = data;
        });
    });

    it("will click on hiq button and check if it deletes the text on editor", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="dismiss-marking-button"]').contains("HIQ").click();
        cy.get('[data-test="suggestion"]').should("not.exist");
    });

    it("will click on `HIQ` buttons and check if it deletes the markings in the editor", () => {
        const text = "gabmim gabmim";
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type(text);
        cy.get('[data-test="dismiss-marking-button"]')
            .first()
            .contains(labels.dismissMarkingLabel)
            .click();
        cy.get('[data-test="dismiss-marking-button"]')
            .first()
            .contains(labels.dismissMarkingLabel)
            .click();
        cy.get('[data-test="suggestion"]').should("not.exist");
        cy.get('[data-test="editor"]').should("have.text", text);
    });
});
