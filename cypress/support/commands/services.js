Cypress.Commands.add('postUser', (user) => {
    cy.api({
        url: '/users',
        method: 'POST',
        body: user,
        failOnStatusCode: false
    }).then(response => { return response })
})

Cypress.Commands.add('postSession', (user) => {
    cy.api({
        url: '/sessions',
        method: 'POST',
        body: { email: user.email, password: user.password },
        failOnStatusCode: false
    }).then(response => { return response })
})

Cypress.Commands.add('postTask', (task, respSession) => {
    cy.api({
        url: '/tasks',
        method: 'POST',
        body: task,
        headers: {
            authorization: respSession.body.token
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('getTasks', (respSession) => {
    cy.api({
        url: '/tasks',
        method: 'GET',
        headers: {
            authorization: respSession.body.token
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('getUniqueTask', (respSession, respTask) => {
    cy.api({
        url: '/tasks/' + respTask.body._id,
        method: 'GET',
        headers: {
            authorization: respSession.body.token
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('deleteTask', (respSession, respTask) => {
    cy.api({
        url: '/tasks/' + respTask.body._id,
        method: 'DELETE',
        headers: {
            authorization: respSession.body.token
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('taskDone', (respSession, respTask) => {
    cy.api({
        url: `/tasks/${respTask.body._id}/done`,
        method: 'PUT',
        headers: {
            authorization: respSession.body.token
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('taskToDo', (respSession, respTask) => {
    cy.api({
        url: `/tasks/${respTask.body._id}/todo`,
        method: 'PUT',
        headers: {
            authorization: respSession.body.token
        },
        failOnStatusCode: false
    })
})