describe("click on editor and check if changes are made on textfield for loanwords", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });

    it("will click on editor and check if changes are made on textfield for loanwords", () => {
        cy.get("#editor > p > .loanword").should("not.exist");
        cy.get("#editor").type("lider ");
        cy.get("button.suggestion").contains("prijës").click();
        cy.get("#editor").contains("prijës").should("exist");
        cy.get("#editor").clear();

        cy.get("#editor > p > .loanword").should("not.exist");
        cy.get("#editor").type("lider ");
        cy.get("button.suggestion").contains("drejtues").click();
        cy.get("#editor").contains("drejtues").should("exist");
        cy.get("#editor").clear();

        cy.get("#editor > p > .loanword").should("not.exist");
        cy.get("#editor").type("lider ");
        cy.get("button.suggestion").contains("udhëheqës").click();
        cy.get("#editor").contains("udhëheqës").should("exist");
        cy.get("#editor").clear();
    });
});
