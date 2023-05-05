describe("it will check if the focus is on editor on desktop and not in mobiles", () => {
    context("720p resolution", () => {
        beforeEach(() => {
            cy.viewport(1280, 720);
            cy.visit("/");
        });

        it("tests on resolution 1280-720 (desktop)", () => {
            cy.focused().should("have.attr", "id", "editor");
        });
    });

    context("iphone-7", () => {
        beforeEach(() => {
            cy.viewport("iphone-7");
            cy.visit("/");
        });

        it("tests on iphone 7 resolution 375-667", () => {
            cy.focused().should("not.exist");
        });
    });
});
