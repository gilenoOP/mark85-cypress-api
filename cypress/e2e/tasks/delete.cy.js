/// <reference types='Cypress'/>

describe('DELETE /tasks:id', () => {
    beforeEach(function () {
        cy.fixture("tasks/delete")
            .then(function (tasks) {
                this.tasks = tasks
            })
    });

    it('Remove a task', function () {
        const { user, task } = this.tasks.remove
        cy.task('removeUser', user.email)
        cy.task('removeTask', task.name, user.email)
        cy.postUser(user)
        cy.postSession(user)
            .then(respSession => {
                cy.postTask(task, respSession)
                    .then(respTask => {
                        cy.deleteTask(respSession, respTask)
                            .then(respDelete => {
                                expect(respDelete.status).to.eq(204)
                            })
                        cy.getUniqueTask(respSession, respTask)
                            .then(response => {
                                expect(response.status).to.eq(404)
                            })
                    })
            })
    })

    it('Task not found', function () {
        const { user, task } = this.tasks.notFoundTask
        cy.task('removeUser', user.email)
        cy.task('removeTask', task.name, user.email)
        cy.postUser(user)
        cy.postSession(user)
            .then(respSession => {
                cy.postTask(task, respSession)
                    .then(respTask => {
                        cy.deleteTask(respSession, respTask)
                            .then(respDelete => {
                                expect(respDelete.status).to.eq(204)
                            })
                        cy.deleteTask(respSession, respTask)
                            .then(response => {
                                expect(response.status).to.eq(404)
                            })
                    })
            })
    })
})