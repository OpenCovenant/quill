describe("test for history button", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will test the history section and togle the history button on/off", () => {
        cy.get("[data-test='editor'] > p > .typo").should("not.exist");
        cy.get("[data-test='editor']").type("saktë");
        cy.wait(16000);
        cy.get("button.bi-clock-history").click();
        cy.get("p#writtenText").contains("saktë").should("exist");
        cy.get("button#closeWrittenTextsModalButton").click();
        cy.get("input#flexSwitchCheckChecked").click();
        cy.get("div.modal-body").contains("p#writtenText").should("not.exist");
    });
});
