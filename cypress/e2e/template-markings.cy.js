describe("will perform checks over the default markings", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will check whether the default markings are shown when the home page is loaded", () => {
        cy.get("span.typo").contains("gabime shkrimi").should("exist");
        cy.get(".list-group-item b")
            .contains("shkrim pa gabime")
            .should("exist");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për fjalë të shkruara gabim, gabime fonetikore, shenja pikësimi"
            )
            .should("exist");

        cy.get("span.loanword").contains("sugjerime huazimesh").should("exist");
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
        cy.get("span.typo").contains("gabime shkrimi").should("exist");
        cy.get("span.loanword").contains("sugjerime huazimesh").should("exist");
        cy.get("span.stylistic")
            .contains("shenjime stilistike")
            .should("exist");

        cy.get('[data-test="editor"]').type("sakt eshte");
        cy.get('[data-test="suggestion"]').contains("është").click();

        cy.get("span.typo").contains("gabime shkrimi").should("exist");
        cy.get("span.loanword").contains("sugjerime huazimesh").should("exist");
        cy.get("span.stylistic")
            .contains("shenjime stilistike")
            .should("exist");
    });

    it("will check whether the default markings are shown when a marking is dismissed", () => {
        cy.get("span.typo").contains("gabime shkrimi").should("exist");
        cy.get("span.loanword").contains("sugjerime huazimesh").should("exist");
        cy.get("span.stylistic")
            .contains("shenjime stilistike")
            .should("exist");

        cy.get('[data-test="editor"]').type("sakt eshte");
        cy.get('[data-test="dismiss-marking-button"]').click();

        cy.get("span.typo").contains("gabime shkrimi").should("exist");
        cy.get("span.loanword").contains("sugjerime huazimesh").should("exist");
        cy.get("span.stylistic")
            .contains("shenjime stilistike")
            .should("exist");
    });
});
