/// <reference types='Cypress' />

describe('POST /sessions', function () {
    beforeEach(() => {
        cy.fixture('users')
            .then(function (users) {
                this.users = users
            })
    });
    it('User session', function () {
        const userData = this.users.login
        cy.task('removeUser', userData.email)
        cy.postUser(userData)
        cy.postSession(userData)
            .then(response => {
                expect(response.status).to.eq(200)
                const { user, token } = response.body
                expect(user.name).to.eq(userData.name)
                expect(user.email).to.eq(userData.email)
                expect(token).not.to.be.empty
            })
    })

    it('Login with wrong email', function () {
        const initialData = this.users.inv_email.create
        const user = this.users.inv_email.wrong_email
        cy.task('removeUser', initialData.email)
        cy.postUser(initialData)
            .then(response => {
                expect(response.status).to.eq(201)
            })
        cy.postSession(user)
            .then(response => {
                expect(response.status).to.eq(401)
            })
    })

    it('Login with wrong password', function () {
        const initialData = this.users.inv_pass.create
        const user = this.users.inv_pass.wrong_pass
        cy.task('removeUser', initialData.email)
        cy.postUser(initialData)
            .then(response => {
                expect(response.status).to.eq(201)
            })
        cy.postSession(user)
            .then(response => {
                expect(response.status).to.eq(401)
            })
    })
});