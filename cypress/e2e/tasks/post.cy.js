/// <reference types='Cypress' />

describe('POST /tasks', () => {
    beforeEach(function () {
        cy.fixture('tasks/post')
            .then(function (tasks) {
                this.tasks = tasks
            })
    });

    context('Register a new task', function () {
        before(function () {
            cy.purgeQueueMessages()
                .then(response => {
                    expect(response.status).to.eq(204)
                })
        })

        it('Post task', function () {
            const { user, task } = this.tasks.create
            cy.postUser(user)
                .then(response => {
                    if (response.status === 409) {
                        cy.postSession(user)
                            .then(respSession => {
                                cy.task('removeTask', task.name, user.email)
                                cy.postTask(task, respSession)
                                    .then(response => {
                                        expect(response.status).to.eq(201)
                                        expect(response.body.user).to.eq(respSession.body.user._id)
                                        expect(response.body._id.length).to.eq(24)
                                        expect(response.body.is_done).to.be.false
                                        expect(response.body.name).to.eq(task.name)
                                        expect(response.body.tags).to.eql(task.tags)
                                    })
                            })
                    } else {
                        cy.postSession(user)
                            .then(respSession => {
                                cy.postTask(task, respSession)
                                    .then(response => {
                                        expect(response.status).to.eq(201)
                                        expect(response.body.user).to.eq(respSession.body.user._id)
                                        expect(response.body._id.length).to.eq(24)
                                        expect(response.body.is_done).to.be.false
                                        expect(response.body.name).to.eq(task.name)
                                        expect(response.body.tags).to.eql(task.tags)
                                    })
                            })
                    }
                })
        })

        after(function () {
            const { user, task } = this.tasks.create
            cy.wait(3000)
            cy.getMessageQueue()
                .then(response => {
                    expect(response.status).to.eq(200)
                    expect(response.body[0].payload).to.include(user.name.split(' ')[0])
                    expect(response.body[0].payload).to.include(task.name)
                    expect(response.body[0].payload).to.include(user.email)
                })
        })
    });

    context('Validate duplicate task', function () {
        it('should not allow duplicate tasks', function () {
            const { user, task } = this.tasks.dupTask
            cy.task('removeUser', user.email)
            cy.task('removeTask', task.name, user.email)
            cy.postUser(user)
            cy.postSession(user)
                .then(respSession => {
                    cy.postTask(task, respSession)
                    cy.postTask(task, respSession)
                        .then(response => {
                            expect(response.status).to.eq(409)
                            expect(response.body.message).to.eq('Duplicated task!')
                        })
                })
        })
    })
})