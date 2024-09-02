export function applySuggestionByIndex(markingHeaderSelector, index = 0) {
    cy.get(markingHeaderSelector)
        .parent()
        .parent()
        .parent()
        .eq(index)
        .find('[data-test="suggestion"]')
        .first()
        .click();
}

export function dismissMarking(markingHeaderSelector) {
    cy.get(markingHeaderSelector)
        .parent()
        .parent()
        .parent()
        .find('[data-test="dismiss-marking-button"]')
        .click();
}
