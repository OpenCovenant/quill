export function applyFirstSuggestionOfFirstMarking(markingHeaderSelector) {
    cy.get(markingHeaderSelector)
        .parent()
        .parent()
        .parent()
        .first()
        .find('[data-test="suggestion"]')
        .first()
        .click();
}

export function dismissFirstMarking(markingHeaderSelector) {
    cy.get(markingHeaderSelector)
        .parent()
        .parent()
        .parent()
        .find('[data-test="dismiss-marking-button"]')
        .click();
}
