import {Given, Then} from "cypress-cucumber-preprocessor/steps";
import {createFolderInRoot} from "../../support/commands";

Given(/^Create folder with name "([^"]*)" in root without UI$/, (folder) => {
  cy.wait('@getFolder').then((xhr) => {
    expect(xhr.responseBody).to.not.have.property('stack')
    createFolderInRoot(folder)
    cy.server()
    cy.route('GET', '/api/v1/folder/*').as('getFolder')
    cy.reload()
  })
});

Given(/^Create folder with name "([^"]*)" in "([^"]*)"$/, (folder2, folder1) => {
  cy.wait('@getFolder').then((xhr) => {
    cy.server()
    cy.route('POST', '/api/v1/folder').as('getFolder')
    expect(xhr.responseBody).to.not.have.property('stack')
    cy.createFolderInFolder(folder2, folder1)
  })
});

Then(/^The user is located in "([^"]*)"$/, (folderName) => {
  cy.get('.currentFolder')
    .should('be.visible')
    .should('contain.text', folderName)
});
