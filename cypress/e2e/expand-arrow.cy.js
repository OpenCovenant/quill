describe("click on expand/collapse arrow and then choose on a suggestion and check if it exist on editor", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will click on the expand/collapse arrows and then choose on a suggestion", () => {
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
        cy.get('[data-test="suggestion"]').contains("fakt").click();
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-right-square'
        ).click();
        cy.get('[data-test="suggestion"]').contains("ishte").click();
        cy.get('[data-test="editor"]').should("have.text", "fakt ishte");
    });
});
