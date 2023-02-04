describe("a general flow of quill", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("contains the editor in which we want to write", () => {
        cy.get("[data-test='placeholder']").should('exist');
        cy.get("[data-test='editor'").type("gabmim ");
        cy.get("[data-test='write-text-toggle']").should("exist").click();
    });
});
