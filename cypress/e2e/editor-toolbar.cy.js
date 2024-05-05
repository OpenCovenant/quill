describe("editor toolbar", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should correctly update the `karaktere, fjalë, shenjime` counts as we type", () => {
        cy.get('[data-test="characters-words-markings"]')
            .contains("0 karaktere, 0 fjalë, 0 shenjime")
            .should("be.visible");

        cy.get('[data-test="characters-words-markings"]')
            .contains("0 karaktere, 0 fjalë, 0 shenjime")
            .should("be.visible");

        cy.get('[data-test="editor"]').type("gabmim ");
        cy.wait(2000); // TODO: instead wait on request to be made? intercept it I think?
        // TODO consider using should have text instead of contains
        cy.get('[data-test="characters-words-markings"]')
            .contains("7 karaktere, 1 fjalë, 1 shenjim")
            .should("be.visible");

        cy.get('[data-test="editor"]').type(" gabim");
        cy.get('[data-test="characters-words-markings"]')
            .contains("13 karaktere, 2 fjalë, 1 shenjim")
            .should("be.visible");

        cy.get('[data-test="clear-editor-icon"]').click();
        cy.get('[data-test="editor"]').type("njeri-tjetri dhe  ckemi ");
        cy.get('[data-test="characters-words-markings"]')
            .contains("24 karaktere, 3 fjalë, 2 shenjime")
            .should("be.visible");

        cy.get('[data-test="clear-editor-icon"]').click();
        cy.get('[data-test="characters-words-markings"]')
            .contains("0 karaktere, 0 fjalë, 0 shenjime")
            .should("be.visible");

        cy.get('[data-test="editor"]').type("{shift}");
        cy.get('[data-test="characters-words-markings"]')
            .contains("0 karaktere, 0 fjalë, 0 shenjime")
            .should("be.visible");

        cy.get('[data-test="editor"]').type("{enter}");
        cy.get('[data-test="characters-words-markings"]')
            .contains("0 karaktere, 0 fjalë, 0 shenjime")
            .should("be.visible");
    });

    it("should correctly copy the text from one paragraph the editor", () => {
        const text = "test per butonin copy";
        cy.get('[data-test="editor"]').clear().type(text);

        cy.get('[data-test="copy-to-clipboard-button"]').click();

        cy.window().then((win) => {
            win.navigator.clipboard.readText().then((t) => {
                expect(t).to.eq(text);
            });
        });
    });

    it("should correctly copy the text from some paragraphs in the editor", () => {
        const text = "test\n per butonin \ncopy";
        cy.get('[data-test="editor"]').clear().type(text);

        cy.get('[data-test="copy-to-clipboard-button"]').click();

        cy.window().then((win) => {
            win.navigator.clipboard.readText().then((t) => {
                t = t.replace(/\u00A0/g, " "); // TODO: extract to replaceNBSPWithSP
                expect(t).to.eq(text);
            });
        });
    });

    it("should clear the text in the editor when the `clear editor button` is clicked", () => {
        cy.get('[data-test="clear-editor-icon"]').should("not.exist");
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("saktë");
        cy.get('[data-test="clear-editor-icon"]').click();
        cy.get('[data-test="editor"]').contains("saktë").should("not.exist");
        cy.get('[data-test="clear-editor-icon"]').should("not.exist");
    });
});
