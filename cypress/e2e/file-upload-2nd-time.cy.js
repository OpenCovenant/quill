describe("same file upload tests", () => {

    beforeEach(() => {
        cy.visit("/");
    });

    it("will upload the same WORD file 3 times in a row", () => {

        for(let n = 0; n < 3; n ++){
            cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.docx");
            cy.get('[data-test="editor"]').should("have.text", "lider asd")
            cy.get('[data-test="editor"]').clear();
          }
        });

    it("will upload the same PDF file 3 times in a row", () => {

        for(let n = 0; n < 3; n ++){
            cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.pdf");
            cy.get('[data-test="editor"]').contains("lider asd").should("exist")
            cy.get('[data-test="editor"]').clear();
            }
        });
    
    it("will upload the same LIBRA file 3 times in a row", () => {

        for(let n = 0; n < 3; n ++){
            cy.get('[data-test="editor-placeholder-upload"]')
            .click()
            .selectFile("cypress/fixtures/test.odt");
            cy.get('[data-test="editor"]').should("have.text", "lider asd")
            cy.get('[data-test="editor"]').clear();
            }
        });
        
    });     
   


