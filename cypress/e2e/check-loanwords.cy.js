describe("click on editor and check if changes are made on textfield for loanwords", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will click on editor and check if changes are made on textfield for loanwords", () => {
        cy.get("#editor > p > .loanword").should("not.exist");
        cy.get('[data-test="editor"]').type("lider ");
        cy.get("button.suggestion").contains("prijës").click();
        cy.get('[data-test="editor"]').contains("prijës").should("exist");
        cy.get('[data-test="editor"]').clear();

        cy.get("#editor > p > .loanword").should("not.exist");
        cy.get('[data-test="editor"]').type("lider ");
        cy.get("button.suggestion").contains("drejtues").click();
        cy.get('[data-test="editor"]').contains("drejtues").should("exist");
        cy.get('[data-test="editor"]').clear();

        cy.get("#editor > p > .loanword").should("not.exist");
        cy.get('[data-test="editor"]').type("lider ");
        cy.get("button.suggestion").contains("udhëheqës").click();
        cy.get('[data-test="editor"]').contains("udhëheqës").should("exist");
        cy.get('[data-test="editor"]').clear();
    });
});
