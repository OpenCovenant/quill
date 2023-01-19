describe("going to test the copy button and paste it on editor", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });

    it("will click on copy button and paste on editor", () => {
        cy.get("#editor").clear().type("test per butonin copy");

        cy.get("#copyToClipboardButton ").click();

        cy.assertValueCopiedToClipboard("test per butonin copy");
    });

    Cypress.Commands.add("assertValueCopiedToClipboard", (value) => {
        cy.window().then((win) => {
            win.navigator.clipboard.readText().then((text) => {
                expect(text).to.eq(value);
            });
        });
    });
});
