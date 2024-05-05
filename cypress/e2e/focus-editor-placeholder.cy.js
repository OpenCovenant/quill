describe("Clicking on editor placeholder must not lose the focus on editor", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should place (retain) the focus on the editor when clicking on the placeholder text", () => {
        cy.get('[data-test="editor-placeholder-text"]').then((v) => {
            // TODO: derive (40, 10) or equivalent from `v[0].getBoundingClientRect();` or whatever is needed
            cy.get('[data-test="editor"]').click(40, 10);
        });
        cy.get('[data-test="editor"]').should("be.focused");
    });
});
