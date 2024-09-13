describe("markings board", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should navigate to the detailed information page when the information button of a marking is clicked", () => {
        cy.get('[data-test="editor"]').type("Shkoi tek zyra.");
        cy.get('[data-test="marking-information-icon"]').click();
        cy.url().should("include", "/te-dhe-tek");
    });

    it("should click on expand/collapse arrows and choose a suggestion", () => {
        cy.get('[data-test="editor"]').type("sakt eshte");
        cy.get('[data-test="suggestion"]').children().should("have.length", 8);
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-right-square'
        )
            .first()
            .click();
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-right-square'
        ).click();
        cy.get('[data-test="suggestion"]')
            .children()
            .should("have.length.gt", 8);
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-left-square'
        )
            .first()
            .click();
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-left-square'
        ).click();
        cy.get('[data-test="suggestion"]').children().should("have.length", 8);
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-right-square'
        )
            .first()
            .click();
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-right-square'
        ).click();
        cy.get('[data-test="suggestion"]')
            .children()
            .should("have.length.gt", 8);
        cy.get('[data-test="suggestion"]').contains("saktë").click();
        cy.wait(5000);
        cy.get(
            '[data-test="oscillate-suggestions-button"].bi-arrow-right-square'
        ).click();
        cy.get('[data-test="suggestion"]').contains("është").click();
        cy.get('[data-test="editor"]').should("have.text", "saktë është");
    });

    it("should hide marking types after being disabled and reappear after enabling", () => {
        cy.visit("/settings");
        cy.get('[data-test="marking-type-switch"]').should("be.checked");
        cy.get('[data-test="marking-type-switch"]').click({
            multiple: true,
            force: true
        });
        cy.get('[data-test="marking-type-switch"]').should("not.be.checked");

        cy.visit("/");
        cy.get('[data-test="editor"]').type("Pra shkoi tek zyra. ");
        cy.get(".typo-marking-header").should("be.visible");
        cy.get(".list-group-item b")
            .contains("shkrim pa gabime")
            .should("be.visible");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për fjalë të shkruara gabim, gabime fonetikore, shenja pikësimi"
            )
            .should("be.visible");
        cy.get('[data-test="editor"]').type("{enter}");
        cy.get('[data-test="editor"]').type("Pra  kaq.");
        cy.get(".typo-marking-header").should("be.visible");
        cy.get(".list-group-item b")
            .contains("shkrim pa gabime")
            .should("be.visible");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për fjalë të shkruara gabim, gabime fonetikore, shenja pikësimi"
            )
            .should("be.visible");
        cy.get('[data-test="editor"]').clear();

        cy.visit("/settings");
        cy.get('[data-test="marking-type-switch"]').should("not.be.checked");
        cy.get('[data-test="marking-type-switch"]').click({
            multiple: true,
            force: true
        });
        cy.get('[data-test="marking-type-switch"]').should("be.checked");

        cy.visit("/");
        cy.get('[data-test="editor"]').type("Pra shkoi tek zyra. ");
        cy.get('[data-test="marking-span"]')
            .contains("tek")
            .should("be.visible");
        cy.get('[data-test="editor"]').type("{enter}"); // TODO why do we enter here?
    });

    // TODO
    xit("should not immediately apply markings after being disabled and actually do so after enabling", () => {
        cy.visit("/settings");
        cy.get('[data-test="immediate-markings-switch"]').should("be.checked");
        cy.get('[data-test="immediate-markings-switch"]').click();
        cy.get('[data-test="immediate-markings-switch"]').should(
            "not.be.checked"
        );

        cy.visit("/");
        cy.get('[data-test="editor"]').type(
            "Pra çmimi është i perballueshem e kaq."
        );
        cy.get(".typo-marking-header").should("be.visible"); // TODO
        cy.get(".list-group-item b")
            .contains("shkrim pa gabime")
            .should("be.visible");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për fjalë të shkruara gabim, gabime fonetikore, shenja pikësimi"
            )
            .should("be.visible");
        cy.get('[data-test="editor"]').type("{enter}");
        cy.get('[data-test="editor"]').type("Pra  kaq.");
        cy.get(".typo-marking-header").should("be.visible");
        cy.get(".list-group-item b")
            .contains("shkrim pa gabime")
            .should("be.visible");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për fjalë të shkruara gabim, gabime fonetikore, shenja pikësimi"
            )
            .should("be.visible");
        cy.get('[data-test="editor"]').clear();

        cy.visit("/settings");
        cy.get('[data-test="immediate-markings-switch"]').should(
            "not.be.checked"
        );
        cy.get('[data-test="immediate-markings-switch"]').click();
        cy.get('[data-test="immediate-markings-switch"]').should("be.checked");

        cy.visit("/");
        cy.get('[data-test="editor"]').type("Pra shkoi tek zyra. ");
        cy.get('[data-test="marking-span"]')
            .contains("tek")
            .should("be.visible");
        cy.get('[data-test="editor"]').type("{enter}");
    });

    it("should delete the marking in the editor when the dismiss-marking button is clicked", () => {
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="dismiss-marking-button"]').click();
        cy.get('[data-test="suggestion"]').should("not.exist");
    });

    it("should delete the markings in the editor when dismiss-marking buttons are clicked", () => {
        const text = "gabmim gabmim";
        cy.get('[data-test="editor"]').type(text);
        // TODO: we're currently allowing dismiss-marking to dismiss ALL occurrences of a marking, position regardless
        cy.get('[data-test="marking-card"]').first().find('[data-test="dismiss-marking-button"]').first().click();
        cy.get('[data-test="marking-card"]').should('not.exist');
        // cy.get('[data-test="marking-card"]').each((card) => {
        //     cy.wrap(card).find('[data-test="dismiss-marking-button"]').first().click();
        //     cy.wrap(card).should("not.exist");
        // });
        cy.get('[data-test="suggestion"]').should("not.exist");
        cy.get('[data-test="editor"]').should("have.text", text);
    });
});
