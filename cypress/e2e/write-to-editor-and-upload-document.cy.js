describe("a general flow of quill", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("contains the editor in which we want to write", () => {
        cy.get("[data-test='editor']").should("exist");
    });
});
