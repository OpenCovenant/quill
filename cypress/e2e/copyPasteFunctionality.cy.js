describe("Copy and Paste Functionality Test", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should copy the text from the editor and paste it correctly", () => {
        cy.get('[data-test="editor"]').clear().type("test per butonin copy");

        cy.get('[data-test="copy-to-clipboard-button"]').click();

        cy.window().then((win) => {
            win.navigator.clipboard.readText().then((text) => {
                expect(text).to.eq("test per butonin copy");
            });
        });
    });
});
