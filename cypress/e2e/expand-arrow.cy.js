describe("Expand/Collapse Suggestion Test", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should click on expand/collapse arrows and choose a suggestion", () => {
        cy.get('[data-test="editor"]').type("sakt eshte");
        cy.get('[data-test="suggestion"]').children().should("have.length", 8);
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-right-square'
        )
            .first()
            .click();
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-right-square'
        ).click();
        cy.get('[data-test="suggestion"]')
            .children()
            .should("have.length.gt", 8);
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-left-square'
        )
            .first()
            .click();
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-left-square'
        ).click();
        cy.get('[data-test="suggestion"]').children().should("have.length", 8);
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-right-square'
        )
            .first()
            .click();
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-right-square'
        ).click();
        cy.get('[data-test="suggestion"]')
            .children()
            .should("have.length.gt", 8);
        cy.get('[data-test="suggestion"]').contains("saktë").click();
        cy.wait(5000);
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-right-square'
        ).click();
        cy.get('[data-test="suggestion"]').contains("është").click();
        cy.get('[data-test="editor"]').should("have.text", "saktë është");
    });
});
