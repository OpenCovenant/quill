describe("Disabled Marking Type Visibility", () => {
    beforeEach(() => {
        cy.visit("/settings");
    });

    it("should hide marking types after being disabled and reappear after enabling", () => {
        cy.get('[data-test="switch-check-testing"]').should("be.checked");
        cy.get('[data-test="switch-check-testing"]').click({
            multiple: true,
            force: true
        });
        cy.get('[data-test="switch-check-testing"]').should("not.be.checked");
        cy.visit("/");
        cy.get('[data-test="editor"]').type("Pra shkoi tek zyra. ");
        cy.get(".typo-marking-header").should("be.visible");
        cy.get(".list-group-item b")
            .contains("shkrim pa gabime")
            .should("exist");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për fjalë të shkruara gabim, gabime fonetikore, shenja pikësimi"
            )
            .should("exist");
        cy.get('[data-test="editor"]').type("{enter}");
        cy.get('[data-test="editor"]').type("Pra  kaq.");
        cy.get(".typo-marking-header").should("be.visible");
        cy.get(".list-group-item b")
            .contains("shkrim pa gabime")
            .should("exist");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për fjalë të shkruara gabim, gabime fonetikore, shenja pikësimi"
            )
            .should("exist");
        cy.get('[data-test="editor"]').clear();
        cy.visit("/settings");
        cy.get('[data-test="switch-check-testing"]').should("not.be.checked");
        cy.get('[data-test="switch-check-testing"]').click({
            multiple: true,
            force: true
        });
        cy.get('[data-test="switch-check-testing"]').should("be.checked");
        cy.visit("/");
        cy.get('[data-test="editor"]').type("Pra shkoi tek zyra. ");
        cy.get('[data-test="marking-span"]')
            .contains("tek")
            .should("exist");
        cy.get('[data-test="editor"]').type("{enter}");
    });
});
