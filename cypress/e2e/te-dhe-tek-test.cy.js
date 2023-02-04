describe("Clicking on the information button of some markings that lead to pages with further details on the markings.", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will test if Clicking on the information button of some markings that lead to pages with further details on the markings. ", () => {
        cy.get("[data-test='editor']").type("Shkoi tek zyra.");
        cy.get(".bi.bi-info-circle").click();
        cy.url().should("include", "/te-dhe-tek");
    });
});
