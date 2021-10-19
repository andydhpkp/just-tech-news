//async is more readable than a fetch().then() situation, it requires an await
async function signupFormHandler(event) {
    event.preventDefault()
 
    const username = document.querySelector('#username-signup').value.trim()
    const email = document.querySelector('#email-signup').value.trim()
    const password = document.querySelector('#password-signup').value.trim()

    if (username && email && password) {
        //the aforementioned await that took away the fetch().then() combo
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        
        //part of the async/await combo, .ok does the error handling
        if (response.ok) {
            console.log('success')
        } else {
            alert(response.statusText)
        }
    }
}

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler)

//login function. Same except for api/users/login
async function loginFormHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (email && password) {
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        })

        if (response.ok) {
            document.location.replace('/')
        } else {
            alert(response.statusText)
        }
    }
}

document.querySelector('.login-form').addEventListener('submit', loginFormHandler)