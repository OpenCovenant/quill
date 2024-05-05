describe("Default Markings Checks", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should display default markings on the home page", () => {
        cy.get(".typo-marking-header").should("be.visible");
        cy.get(".list-group-item b")
            .contains("shkrim pa gabime")
            .should("be.visible");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për fjalë të shkruara gabim, gabime fonetikore, shenja pikësimi"
            )
            .should("be.visible");

        cy.get(".loanword-marking-header").should("be.visible");
        cy.get(".list-group-item b")
            .contains("pa huazime për tani")
            .should("be.visible");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për huazime me origjinë italiane, angleze, sllave, gjermane, otomane, greke"
            )
            .should("be.visible");

        cy.get(".stylistic-marking-header").should("be.visible");
        cy.get(".list-group-item b")
            .contains("stilistikë e duhur")
            .should("be.visible");
        cy.get(".list-group-item span")
            .contains("shenjime për fjali tepër të gjata")
            .should("be.visible");
    });

    it("should display default markings after applying a suggestion", () => {
        cy.get(".typo-marking-header").should("be.visible");
        cy.get(".loanword-marking-header").should("be.visible");
        cy.get(".stylistic-marking-header").should("be.visible");
        cy.get(".grammatical-marking-header").should("be.visible");

        cy.get('[data-test="editor"]').type("sakt");
        cy.get('[data-test="suggestion"]').contains("saktë").click();

        cy.get(".typo-marking-header").should("be.visible");
        cy.get(".loanword-marking-header").should("be.visible");
        cy.get(".stylistic-marking-header").should("be.visible");
        cy.get(".grammatical-marking-header").should("be.visible");
    });

    it("should display default markings after dismissing a marking", () => {
        cy.get(".typo-marking-header").should("be.visible");
        cy.get(".loanword-marking-header").should("be.visible");
        cy.get(".stylistic-marking-header").should("be.visible");
        cy.get(".grammatical-marking-header").should("be.visible");

        cy.get('[data-test="editor"]').type("sakt");
        cy.get('[data-test="dismiss-marking-button"]').click();

        cy.get(".typo-marking-header").should("be.visible");
        cy.get(".loanword-marking-header").should("be.visible");
        cy.get(".stylistic-marking-header").should("be.visible");
        cy.get(".grammatical-marking-header").should("be.visible");
    });

    it("should display default markings after applying many suggestions consecutively", () => {
        cy.get(".typo-marking-header").should("be.visible");
        cy.get(".loanword-marking-header").should("be.visible");
        cy.get(".stylistic-marking-header").should("be.visible");
        cy.get(".grammatical-marking-header").should("be.visible");

        cy.get('[data-test="editor"]').type("gabmim gabmim");
        cy.get('[data-test="marking-card"]')
            .eq(0)
            .find('[data-test="suggestion"]')
            .first()
            .click();
        cy.get('[data-test="marking-card"]')
            .eq(1)
            .find('[data-test="suggestion"]')
            .first()
            .click();

        cy.get(".typo-marking-header").should("be.visible");
        cy.get(".loanword-marking-header").should("be.visible");
        cy.get(".stylistic-marking-header").should("be.visible");
        cy.get(".grammatical-marking-header").should("be.visible");
    });
});
