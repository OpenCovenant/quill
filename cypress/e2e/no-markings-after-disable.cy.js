describe("A marking type does not appear after being disabled.", () => {
    beforeEach(() => {
        cy.visit("/settings");
    });

    it("will disable all the marking types and check if they appeared on the main page", () => {
        cy.get('[data-test="switch-check-testing"]').should("be.checked");
        cy.get('[data-test="switch-check-testing"]').click({
            multiple: true,
            force: true
        });
        cy.get('[data-test="switch-check-testing"]').should("not.be.checked");
        cy.visit("/");
        cy.get('[data-test="editor"]').type("Pra shkoi tek zyra. ");
        cy.get(".typo").contains("gabime shkrimi").should("exist");
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
        cy.get(".typo").contains("gabime shkrimi").should("exist");
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
        cy.get('[data-test="text-marking-span"]')
            .contains("tek")
            .should("exist");
        cy.get('[data-test="editor"]').type("{enter}");
    });
});
