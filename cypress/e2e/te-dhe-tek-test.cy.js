describe("Clicking on the information button of some markings that lead to pages with further details on the markings.", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });

    it("will test if Clicking on the information button of some markings that lead to pages with further details on the markings. ", () => {
        cy.get("#editor").type("Shkoi tek zyra.");
        cy.get(".bi.bi-info-circle").click();
        cy.url().should("include", "/te-dhe-tek");
    });
});
