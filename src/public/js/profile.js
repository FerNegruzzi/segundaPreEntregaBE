const logOutBtn = document.getElementById('profileForm')

logOutBtn.addEventListener('submit', e => {
    e.preventDefault()
    const url = '/auth/logout'
    const method = 'GET'

    fetch(url,{
        method
    })
    .then(response => response.json.toString('Loged out'))
    .catch(error => console.log(error.message))
})