describe("editor focus on different resolutions", () => {
    context("Desktop - 1280x720 Resolution", () => {
        beforeEach(() => {
            cy.viewport(1280, 720);
            cy.visit("/");
        });

        it("should have focus on editor in desktop view (1280x720)", () => {
            cy.focused().should("have.attr", "id", "editor");
        });
    });

    context("Mobile - iPhone 7 Resolution", () => {
        beforeEach(() => {
            cy.viewport("iphone-7");
            cy.visit("/");
        });

        it("should not have focus on editor in iPhone 7 view (375x667)", () => {
            cy.focused().should("not.exist");
        });
    });
});
