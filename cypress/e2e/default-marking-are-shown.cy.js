describe("will check the default markings are show when home page is loaded", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will check the default markings are show when home page is loaded", () => {
        //checks for gabime shkrimi default marking
        cy.get("span.typo").contains("gabime shkrimi").should("exist");
        cy.get(".list-group-item b")
            .contains("shkrim pa gabime")
            .should("exist");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për fjalë të shkruara gabim, gabime fonetikore, shenja pikësimi"
            )
            .should("exist");
        //cheks for sugjerime huazimesh default marking
        cy.get("span.loanword").contains("sugjerime huazimesh").should("exist");
        cy.get(".list-group-item b")
            .contains("pa huazime për tani")
            .should("exist");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për huazime me origjinë italiane, angleze, sllave, gjermane, otomane, greke"
            )
            .should("exist");
        //cheks for sugjerime huazimesh default marking
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
});
