// cypress/integration/endpoint.spec.js

describe('Endpoint Tests', () => {
    it('should make a successful request to the endpoint', () => {
      cy.request('/Dashboard/Home')
        .its('status')
        .should('equal', 200);
    });
  
    // Add more tests as needed for other endpoints or specific functionality
  });
  