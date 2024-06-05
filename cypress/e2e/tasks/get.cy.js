/// <reference types='Cypress' />

describe('GET /tasks', () => {
    beforeEach(function () {
        cy.fixture("tasks/get")
            .then(function (tasks) {
                this.tasks = tasks
            })
    });

    it('Get my tasks', function () {
        const { user, tasks } = this.tasks.list
        cy.task('removeUser', user.email)
        tasks.forEach(t => {
            cy.task('removeTask', t.name, user.email)
        });
        cy.postUser(user)
        cy.postSession(user)
            .then(respSession => {
                const taskPromises = tasks.map(t => {
                    cy.postTask(t, respSession)
                        .then(respTask => {
                            expect(respTask.status).to.eq(201)
                            t._id = respTask.body._id
                            t.user = respTask.body.user
                            t.is_done = respTask.body.is_done
                            t.name = respTask.body.name
                            t.tags = respTask.body.tags
                        })
                })
                cy.wrap(Promise.all(taskPromises)).then(() => {
                    cy.getTasks(respSession)
                        .then(responseGet => {
                            expect(responseGet.status).to.eq(200);

                            const tasksFromResponse = responseGet.body;

                            // Ensure the number of tasks matches
                            expect(tasksFromResponse).to.have.length(tasks.length);

                            // Validate each task
                            tasks.forEach((t, index) => {
                                const taskFromResponse = tasksFromResponse[index];
                                expect(taskFromResponse._id).to.eq(t._id);
                                expect(taskFromResponse.user).to.eq(t.user);
                                expect(taskFromResponse.is_done).to.eq(t.is_done);
                                expect(taskFromResponse.name).to.eq(t.name);
                                expect(taskFromResponse.tags).to.eql(t.tags);
                            });
                        });
                });
            });
    });

    it('Get my unique task', function () {
        const { user, task } = this.tasks.unique
        cy.task('removeUser', user.email)
        cy.task('removeTask', task.name, user.email)
        cy.postUser(user)
        cy.postSession(user)
            .then(respSession => {
                cy.postTask(task, respSession)
                    .then(respTask => {
                        expect(respTask.status).to.eq(201)
                        cy.getUniqueTask(respSession, respTask)
                            .then(responseGet => {
                                expect(responseGet.status).to.eq(200)
                                expect(responseGet.body.user).to.eq(respTask.body.user)
                                expect(responseGet.body.is_done).to.be.false
                                expect(responseGet.body.name).to.eq(task.name)
                                expect(responseGet.body.tags).to.eql(task.tags)
                            })
                    })
            })
    })
});