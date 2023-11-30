describe("will perform checks over the default markings", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will check whether the default markings are shown when the home page is loaded", () => {
        cy.get(".typo").contains("gabime shkrimi").should("exist");
        cy.get(".list-group-item b")
            .contains("shkrim pa gabime")
            .should("exist");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për fjalë të shkruara gabim, gabime fonetikore, shenja pikësimi"
            )
            .should("exist");

        cy.get(".loanword").contains("sugjerime huazimesh").should("exist");
        cy.get(".list-group-item b")
            .contains("pa huazime për tani")
            .should("exist");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për huazime me origjinë italiane, angleze, sllave, gjermane, otomane, greke"
            )
            .should("exist");

        cy.get("span.stylistic")
            .contains("shenjime stilistike")
            .should("exist");
        cy.get(".list-group-item b")
            .contains("stilistikë e duhur")
            .should("exist");
        cy.get(".list-group-item span")
            .contains("shenjime për fjali tepër të gjata")
            .should("exist");
    });

    it("will check whether the default markings are shown when a suggestion is applied", () => {
        cy.get(".typo").contains("gabime shkrimi").should("exist");
        cy.get(".loanword").contains("sugjerime huazimesh").should("exist");
        cy.get(".stylistic")
            .contains("shenjime stilistike")
            .should("exist");

        cy.get('[data-test="editor"]').type("sakt");
        cy.get('[data-test="suggestion"]').contains("saktë").click();

        cy.get(".typo").contains("gabime shkrimi").should("exist");
        cy.get(".loanword").contains("sugjerime huazimesh").should("exist");
        cy.get(".stylistic")
            .contains("shenjime stilistike")
            .should("exist");
    });

    it("will check whether the default markings are shown when a marking is dismissed", () => {
        cy.get(".typo").contains("gabime shkrimi").should("exist");
        cy.get(".loanword").contains("sugjerime huazimesh").should("exist");
        cy.get(".stylistic")
            .contains("shenjime stilistike")
            .should("exist");

        cy.get('[data-test="editor"]').type("sakt");
        cy.get('[data-test="dismiss-marking-button"]').click();

        cy.get(".typo").contains("gabime shkrimi").should("exist");
        cy.get(".loanword").contains("sugjerime huazimesh").should("exist");
        cy.get(".stylistic")
            .contains("shenjime stilistike")
            .should("exist");
    });

    it("will check whether the default markings are shown when many suggestions are applied consecutively", () => {
        cy.get(".typo").contains("gabime shkrimi").should("exist");
        cy.get(".loanword").contains("sugjerime huazimesh").should("exist");
        cy.get(".stylistic")
            .contains("shenjime stilistike")
            .should("exist");

        cy.get('[data-test="editor"]').type("gabmim gabmim");
        cy.get(".sticky .card").eq(0).find('[data-test="suggestion"]').first().click();
        cy.get(".sticky .card").eq(1).find('[data-test="suggestion"]').first().click();

        cy.get(".typo").contains("gabime shkrimi").should("exist");
        cy.get(".loanword").contains("sugjerime huazimesh").should("exist");
        cy.get(".stylistic")
            .contains("shenjime stilistike")
            .should("exist");
    });
});
