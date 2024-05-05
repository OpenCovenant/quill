describe("general flows", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should reflect changes in the editor when suggestions of typos are applied", () => {
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="suggestion"]').contains("gabime").click();
        cy.get('[data-test="editor"]').contains("gabime").should("be.visible");
        cy.get('[data-test="editor"]').clear();
        cy.get(".typo").should("not.exist");

        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="suggestion"]').contains("gabim").click();
        cy.get('[data-test="editor"]').contains("gabim").should("be.visible");
    });

    it("should reflect changes in the editor when suggestions of loanwords are applied", () => {
        cy.get('[data-test="editor"]').type("lider ");
        cy.get('[data-test="suggestion"]').contains("prijës").click();
        cy.get('[data-test="editor"]').contains("prijës").should("be.visible");
        cy.get('[data-test="clear-editor-icon"]').click();
        cy.get(".loanword").should("not.exist");

        cy.get('[data-test="editor"]').type("lider ");
        cy.get('[data-test="suggestion"]').contains("udhëheqës").click();
        cy.get('[data-test="editor"]').contains("udhëheqës").should("be.visible");
    });

    it("should mark typos in the editor", () => {
        cy.get('[data-test="editor"] > p > .typo').should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="editor"] > p > .typo').should("exist");
    });

    it("should mark loanwords in the editor", () => {
        cy.get('[data-test="editor"] > p > .loanword').should("not.exist");
        cy.get('[data-test="editor"]').type("lider ");
        cy.get('[data-test="editor"] > p > .loanword').should("exist");
    });

    it("should open and close the side menu as expected", () => {
        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get(".offcanvas.offcanvas-start.show").should("exist");
        cy.get('[data-test="close-offcanvas-button"]').click();
    });

    it("should behave properly when performing different operations on expanding and collapsing on the markings", () => {
        cy.get('[data-test="editor"]').type("eshte");
        cy.get('[data-test="suggestion"]').children().should("have.length", 4);
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-right-square'
        ).click();
        cy.get('[data-test="suggestion"]')
            .children()
            .should("have.length.gt", 4);

        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-left-square'
        ).click();
        cy.get('[data-test="suggestion"]').children().should("have.length", 4);

        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-right-square'
        ).click();
        cy.get('[data-test="suggestion"]')
            .children()
            .should("have.length.gt", 4);
        cy.get('[data-test="suggestion"]').contains("është").click();
        cy.get('[data-test="editor"]').should("have.text", "është");
    });

    it("should behave properly when performing different operations on the markings", () => {
        cy.get('[data-test="editor"]').type("asd gabmim asd ");
        cy.get(".typo").should("be.visible");

        cy.get(".typo").first().click();
        cy.get('[data-test="marking-card"]')
            .find('[data-test="blur-marking-button"]')
            .click();
        cy.get(".typo").first().click();
        cy.get("#editor > p > .typo").should("have.length", 3).should('be.visible');

        cy.get('[data-test="marking-card"]')
            .find('[data-test="suggestion"]')
            .first()
            .click();
        cy.get(".typo").first().click();
        cy.get("#editor > p > .typo").should("have.length", 2).should('be.visible');

        cy.get('[data-test="marking-card"]')
            .find('[data-test="suggestion"]')
            .first()
            .click();
        cy.get("#editor > p > .typo").should("have.length", 1).should('be.visible');

        cy.get('[data-test="marking-card"]')
            .find('[data-test="dismiss-marking-button"]')
            .click();
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="marking-card"]').should("not.exist");
    });

    it("should remove the highlighted marking when selecting all text in the editor and deleting it", () => {
        cy.get('[data-test="editor"]').type("asd gabmim asd ");
        cy.get(".typo").first().click();
        cy.get('[data-test="editor"]').type("{selectall}");
        cy.get('[data-test="editor"]').type("{del}");
        cy.get('[data-test="highlighted-marking"]').should("not.exist");
    });

    it("should retain the text in editor when navigating to and from other pages", () => {
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="settings-gear-button"]').click();
        cy.url().should("include", "/settings");

        cy.get('[data-test="home-button"]').click();
        cy.url().should("include", "");
        cy.get('[data-test="editor"]').contains("gabmim").should("be.visible");
        cy.get('[data-test="marking-span"').contains("gabmim").should("be.visible");
    });

    it("should only removed selected markings even if they might be duplicated in content", () => {
        const totalNumberOfMarkings = 9;

        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type(
            "asd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \nasd Për kryerjen e programeve gabmim asd \n"
        );
        cy.get('[data-test="dismiss-marking-button"]').should("be.visible");

        // TODO: rework?
        cy.get('[data-test="marking-card"] ').each((card, index, list) => {
            if (index <= 2) {
                cy.wrap(card)
                    .find('[data-test="dismiss-marking-button"]')
                    .click()
                    .then(() => {
                        cy.wrap(card).should("not.exist");
                        cy.wait(1000);
                    });
            }
        });

        // TODO: rework?
        //final count of markings
        cy.get(".typo")
            .its("length")
            .then((numberOfMarkings) => {
                expect(numberOfMarkings).to.equal(totalNumberOfMarkings);
            });
    });

    xit("should stick the highlighted remain on the top after adding multiple new lines", () => {
        cy.get('[data-test="editor"]').type("gabmim");

        for (let i = 0; i < 30; ++i) {
            cy.get('[data-test="editor"]').type("{enter}");
        }

        cy.get(".typo").first().click();
        // TODO: similar effect to cy.scrollTo("bottom"); cy.wait(3000); so why does the scroll "take time"?
        cy.get('[data-test="contact"]').dblclick();
        cy.get('[data-test="highlighted-marking"]').should("be.visible");
    });

    // TODO think this should be checked against the order in the markings board, but it isn't?
    it("should verify the order of markings matches the order in the editor", () => {
        cy.get('[data-test="editor"]').type("gabmi lider gabmim");
        cy.get('[data-test="editor"] > p > span')
            .eq(0)
            .should("have.text", "gabmi");
        cy.get('[data-test="editor"] > p > span')
            .eq(1)
            .should("have.text", "lider");
        cy.get('[data-test="editor"] > p > span')
            .eq(2)
            .should("have.text", "gabmim");
    });

    it("should correctly generate marked text on the right-hand side without false updates when writing before marking", () => {
        const initialText = "pra gabmim kaq";
        cy.get('[data-test="editor"]').type(initialText);
        cy.wait(3000);
        for (let i = 0; i < initialText.length; i++) {
            cy.get('[data-test="editor"]').type("{leftArrow}");
        }
        cy.get('[data-test="editor"]').type("edhe ");
        // NOTE: timeout of 100 ms so that no other request will be made in the meantime
        cy.get(".typo-marking-header", { timeout: 100 }).should(
            "have.text",
            "gabmim "
        );
    });

    it("should remove the highlighted marking when typing in the editor", () => {
        cy.get('[data-test="editor"]').type("gabmim asd ");
        cy.get(".typo").first().click();
        cy.get('[data-test="highlighted-marking"]').should(
            "have.text",
            "gabmim"
        );
        cy.get('[data-test="highlighted-marking"]')
            .contains("asd")
            .should("not.exist");

        cy.get('[data-test="editor"]').type("{end}");
        cy.get('[data-test="editor"]').type("pra ");
        cy.get('[data-test="highlighted-marking"]').should("not.exist");
        cy.get('[data-test="marking-span"]').contains("gabmim").should("be.visible");
        cy.get('[data-test="marking-span"]').contains("asd").should("be.visible");
    });
});
