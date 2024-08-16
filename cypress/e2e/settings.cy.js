describe("settings", () => {
    beforeEach(() => {
        cy.visit("/settings");
    });

    it("should persist the enabled/disabled status of marking types after reloading", () => {
        cy.get('[data-test="marking-type-switch"]').should("be.checked");
        cy.get('[data-test="marking-type-switch"]').click({
            multiple: true,
            force: true
        });
        cy.get('[data-test="marking-type-switch"]').should("not.be.checked");
        cy.reload();
        cy.get('[data-test="marking-type-switch"]').should("not.be.checked");
        cy.get('[data-test="marking-type-switch"]').click({
            multiple: true,
            force: true
        });
        cy.get('[data-test="marking-type-switch"]').should("be.checked");
        cy.reload();
        cy.get('[data-test="marking-type-switch"]').should("be.checked");
    });

    it("should persist the enabled/disabled status of immediately applied marking after reloading", () => {
        cy.get('[data-test="immediately-applied-markings-switch"]').should("not.be.checked");
        cy.get('[data-test="immediately-applied-markings-switch"]').click({force: true});
        cy.get('[data-test="immediately-applied-markings-switch"]').should("be.checked");

        cy.reload();
        cy.get('[data-test="immediately-applied-markings-switch"]').should("be.checked");
        cy.get('[data-test="immediately-applied-markings-switch"]').click({force: true});
        cy.get('[data-test="immediately-applied-markings-switch"]').should("not.be.checked");
        cy.reload();
        cy.get('[data-test="immediately-applied-markings-switch"]').should("not.be.checked");
    });
});
