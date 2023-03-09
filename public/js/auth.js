const miFormulario = document.querySelector('form');

const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://node-restservice-cafe-production.up.railway.app';


miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();//Es para cuando toquemos el boton ya no refrescara el navegador por que es el evento por defecto y así lo prevenimos
    const formData = {};

    for (let el of miFormulario.elements ) {// el -> Elemento, leemos cada valor del formulario
        if( el.name.length > 0 ){ //Si el valor del input tiene datos los toma, si no no se ejecuta esta parte
            formData[el.name] = el.value
        }
    }
    
    fetch(url + 'login',{
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) =>{
        if( msg ){
            return console.error( msg );
        }
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch ( err => {
        console.log(err)
    })
})  

const button = document.querySelector('#google-signout');
button.onclick= () =>{
    google.accounts.id.disableAutoSelect();
    
    google.accounts.id.revoke(localStorage.getItem('email'), done =>{
        localStorage.clear();
        location.reload();
    });
}

function handleCredentialResponse(response) {
    // Google Token : ID_TOKEN
    const body = { id_token: response.credential };

    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp  => resp.json())
        .then(({ msg, token }) => {

            if( msg ){
                return console.error( msg ); 
            }

            localStorage.setItem('token',token);
            window.location = 'chat.html';
        })
        .catch(err => {
            console.log(err)
        });
}
