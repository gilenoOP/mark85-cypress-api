/// <reference types="Cypress" />

describe("PUT /tasks/:id", () => {
    beforeEach(function () {
        cy.fixture("tasks/put")
            .then(function (tasks) {
                this.tasks = tasks
            })
    })

    it('Update task to done', function () {
        const { user, task } = this.tasks.taskToDo
        cy.task('removeUser', user.email)
        cy.task('removeTask', task.name, user.email)
        cy.postUser(user)
        cy.postSession(user)
            .then(respSession => {
                cy.postTask(task, respSession)
                    .then(respTask => {
                        cy.taskDone(respSession, respTask)
                            .then(response => {
                                expect(response.status).to.eq(204)
                                cy.getUniqueTask(respSession, respTask)
                                    .then(respGetUnique => {
                                        expect(respGetUnique.status).to.eq(200)
                                        expect(respGetUnique.body.user).to.eq(respTask.body.user)
                                        expect(respGetUnique.body.is_done).to.be.true
                                        expect(respGetUnique.body.name).to.eq(task.name)
                                        expect(respGetUnique.body.tags).to.eql(task.tags)
                                    })
                            })
                    })
            })
    })

    it('Update task not found to done', function () {
        const { user, task } = this.tasks.taskNotFoundToDo
        cy.task('removeUser', user.email)
        cy.task('removeTask', task.name, user.email)
        cy.postUser(user)
        cy.postSession(user)
            .then(respSession => {
                cy.postTask(task, respSession)
                    .then(respTask => {
                        cy.deleteTask(respSession, respTask)
                            .then(respDeleteTask => {
                                expect(respDeleteTask.status).to.eq(204)
                            })
                        cy.taskDone(respSession, respTask)
                            .then(response => {
                                expect(response.status).to.eq(404)
                            })
                    })
            })
    })

    it('Update task to do', function () {
        const { user, task } = this.tasks.taskToUndo
        cy.task('removeUser', user.email)
        cy.task('removeTask', task.name, user.email)
        cy.postUser(user)
        cy.postSession(user)
            .then(respSession => {
                cy.postTask(task, respSession)
                    .then(respTask => {
                        cy.taskToDo(respSession, respTask)
                            .then(response => {
                                expect(response.status).to.eq(204)
                                cy.getUniqueTask(respSession, respTask)
                                    .then(respGetUnique => {
                                        expect(respGetUnique.status).to.eq(200)
                                        expect(respGetUnique.body.user).to.eq(respTask.body.user)
                                        expect(respGetUnique.body.is_done).to.be.false
                                        expect(respGetUnique.body.name).to.eq(task.name)
                                        expect(respGetUnique.body.tags).to.eql(task.tags)
                                    })
                            })
                    })
            })
    })

    it('Update task not found to do', function () {
        const { user, task } = this.tasks.taskNotFoundToUndo
        cy.task('removeUser', user.email)
        cy.task('removeTask', task.name, user.email)
        cy.postUser(user)
        cy.postSession(user)
            .then(respSession => {
                cy.postTask(task, respSession)
                    .then(respTask => {
                        cy.deleteTask(respSession, respTask)
                            .then(respDeleteTask => {
                                expect(respDeleteTask.status).to.eq(204)
                            })
                        cy.taskToDo(respSession, respTask)
                            .then(response => {
                                expect(response.status).to.eq(404)
                            })
                    })
            })
    })
})