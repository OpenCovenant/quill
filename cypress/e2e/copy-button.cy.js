describe("going to test the copy button and paste it on editor", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });

    it("will click on copy button and paste on editor", () => {
        cy.get("[data-test='editor']").clear().type("test per butonin copy");

        cy.get("[data-test='copy-to-clipboard']").click();

        cy.window().then((win) => {
            win.navigator.clipboard.readText().then((text) => {
                expect(text).to.eq("test per butonin copy");
            });
        });
    });
});
