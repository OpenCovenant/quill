describe("click on editor and check if changes are made on textfield for typos", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });

    it("will click on editor and check if changes are made on textfield for typos", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get("#editor").type("gabmim ");
        cy.get("button.suggestion").contains("gabime").click();
        cy.get("#editor").contains("gabime").should("exist");
        cy.get("#editor").clear();

        cy.get("#editor > p > .typo").should("not.exist");
        cy.get("#editor").type("gabmim ");
        cy.get("button.suggestion").contains("gabimi").click();
        cy.get("#editor").contains("gabimi").should("exist");
        cy.get("#editor").clear();

        cy.get("#editor > p > .typo").should("not.exist");
        cy.get("#editor").type("gabmim ");
        cy.get("button.suggestion").contains("gazmim").click();
        cy.get("#editor").contains("gazmim").should("exist");
        cy.get("#editor").clear();

        cy.get("#editor > p > .typo").should("not.exist");
        cy.get("#editor").type("gabmim ");
        cy.get("button.suggestion").contains("gabim").click();
        cy.get("#editor").contains("gabim").should("exist");
        cy.get("#editor").clear();
    });
});
