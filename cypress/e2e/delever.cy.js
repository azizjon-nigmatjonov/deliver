describe('empty spec', () => {
  it('passes', () => {
    cy.visit("#/auth/login")
    cy.get('#login').type('oybek3')
    cy.get('#password').type('oybek1024')
    cy.get('button').click()
    cy.wait(3000)
    cy.url().should('include','dashboard')
  })
})