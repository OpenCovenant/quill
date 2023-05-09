describe("its going to test if the characters change, words, typos change as we write", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will correctly update karaktere, fjalë, shenjime", () => {
        cy.get("#editor > p > .typo").should("not.exist");

        cy.get('[data-test="editor"]').type("gabmim ");
        cy.wait(2000);
        // TODO consider using should have text instead of contains
        cy.get('[data-test="character-count"]')
            .contains("7 karaktere, 1 fjalë, 1 shenjim")
            .should("exist");

        cy.get('[data-test="editor"]').type(" gabim");
        cy.get('[data-test="character-count"]')
            .contains("13 karaktere, 2 fjalë, 1 shenjim")
            .should("exist");

        cy.get('[data-test="editor"]').type(" njeri-tjetri dhe ç'kemi");
        cy.get('[data-test="character-count"]')
            .contains("37 karaktere, 5 fjalë, 2 shenjime")
            .should("exist");
        cy.get('[data-test="editor"]').clear();
        cy.get('[data-test="character-count"]')
            .contains("0 karaktere, 0 fjalë, 0 shenjime")
            .should("exist");

        cy.get('[data-test="editor"]').type("{shift}");
        cy.get('[data-test="character-count"]')
            .contains("0 karaktere, 0 fjalë, 0 shenjime")
            .should("exist");

        cy.get('[data-test="editor"]').type("{enter}");
        cy.get('[data-test="character-count"]')
            .contains("0 karaktere, 0 fjalë, 0 shenjime")
            .should("exist");
    });
});
