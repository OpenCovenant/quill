describe("a general flow of quill", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("contains the editor in which we want to write", () => {
        cy.get("[data-test='placeholder']").should('exist').should('be.visible');
        cy.get("[data-test='editor'").type("gabmim ");
        cy.get("[data-test='placeholder']").should('exist').should('not.be.visible');

        // TODO comment out once bug is fixed
        // cy.get("[data-test='upload-document-toggle']").should("exist").click();
        // cy.get("[data-test='write-text-toggle']").should("exist").click();
        // cy.get("[data-test='placeholder']").should('exist').should('not.be.visible');

        cy.get("[data-test='card-header-marking']").should('exist').should('have.text', "gabmim");
        // TODO comment out once bug is fixed
        // cy.get("[data-test='upload-document-toggle']").should("exist").click();
        // cy.get("[data-test='card-header-marking']").should('exist').should('have.text', "gabmim");
    });
});
