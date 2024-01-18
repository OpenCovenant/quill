describe("Shortcuts", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should accordingly to each shortcut", () => {
        cy.get('[data-test="editor"]').type("eshte keshtu si fjali me gabmime");
        cy.get('[data-test="marking-card"]').should("have.length", 3);

        cy.get('[data-test="contact"]').click();
        cy.get('body').type('2');

        cy.wait(5000); // TODO: bug here (see: issue #413)
        cy.get('[data-test="editor"]').should('have.text', 'është keshtu si fjali me gabmime');
        cy.get('[data-test="marking-card"]').should("have.length", 2);

        cy.get('body').type('{Shift} + 2');
        cy.get('[data-test="contact"]').click();
        cy.get('body').type('2');

        cy.get('body').type('{Shift} + 1');
        cy.get('[data-test="blur-marking-button"]').should("be.visible");
        cy.get('body').type('{Esc}');
        cy.get('[data-test="blur-marking-button"]').should("not.exist");

        cy.get('[data-test="marking-card"]').should("have.length", 1);
        cy.get('body').type('d');
        cy.get('[data-test="marking-card"]').should("not.exist");


        cy.get('body').type('c');
        cy.window().then((win) => {
            win.navigator.clipboard.readText().then((text) => {
                console.log(text)
                expect(text).to.eq("është reshtu si fjali me gabmime");
            });
        });

        cy.get('[data-test="modal-dialog"]').should('not.be.visible');
        cy.get('body').type('h');
        cy.get('[data-test="modal-dialog"]').should('be.visible');
        // TODO: fix two following lines
        // cy.get('body').type('h');
        // cy.get('[data-test="modal-dialog"]').should('not.be.visible');

        // write some text with > 3 markings
        // apply a suggestion
        // focus to a marking
        // apply another suggestion
        // focus to a marking
        // Escape
        // d
        // c
        // h
    });
});
