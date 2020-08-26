import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {getHash} from "../../support/commands";

Given(/^Choose the needed "([^"]*)" file from its PC directory for update$/, (f) => {
    const hashFile = getHash(f, Cypress.env('filesInRoot'))
    cy.server()
    cy.route('PUT', '/api/v1/file').as('updateFile')
    cy.get(`#Update_${hashFile} input[type=file]`).attachFile(f);
});

Then(/^The file "([^"]*)" is uploaded$/, (file) => {
    cy.contains(file).should('be.visible')
});

Given(/^The user upload "([^"]*)" without UI$/, (fullFileName) => {
    cy.wait('@getFolder').then((xhr) => {
        cy.wait(5000)
        expect(xhr.responseBody).to.not.have.property('stack')
        cy.uploadFile(fullFileName)
        cy.server()
        cy.route('GET', '/api/v1/folder/*').as('uploadFile')
        cy.reload()
    })
});

When(/^Choose the needed "([^"]*)" file from its PC directory$/, (file) => {
    cy.server()
    cy.route('POST', '/api/v1/file').as('uploadFile')
    cy.get(`input[type=file]`).attachFile(file);
});

Then(/^Message about update file "([^"]*)"$/, (messUploadFile) => {
    cy.get('.ant-message-custom-content').as(messUploadFile)
        .should('be.visible')
        .should("contain.text", messUploadFile)
    cy.wait('@updateFile').then((xhr) => {
        expect(xhr.responseBody).to.not.have.property('stack')
    })
});

Then(/^Button Download is visible$/, () => {
    cy.get(`#Download_${Cypress.env('versions')[0].cid}`).should("be.visible")
    cy.get(`#Download_${Cypress.env('versions')[1].cid}`).should("be.visible")
});

Then(/^The file "([^"]*)" is visible$/, (file) => {
    cy.contains(file).should('be.visible')

});
Then(/^The file "([^"]*)" is not visible$/, (file) => {
    cy.wait(1000)
    cy.contains(file).should('not.be.visible')
});

Given(/^The user has access to file "([^"]*)"$/, (filename) => {
    cy.wait('@uploadFile').then((xhr) => {
        expect(200).to.equal(xhr.status)
        for (let key in xhr.responseBody.files) {
            if (filename === xhr.responseBody.files[key].fileName) {
                expect(Cypress.env('login')).to.equal(xhr.responseBody.files[key].ownerId)
            }
        }
    })
});
