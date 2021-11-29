async function tryLogin() {
    const id = document.querySelector('input[name="id"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const result = await axios({
        "method": "POST",
        "url": "https://api.chat.okayu.xyz/user/login",
        "data": {
            "id": id,
            "password": password
        }
    });

    if (result.data.success){
        localStorage.setItem('token', result.data.token);
        location.href = 'index.html';
    } else {
        alert(result.data.error);
    }
}

async function join() {
    location.href = "join.html"
}

async function enterkey() {
	if (window.event.keyCode == 13) {
    	tryLogin()
    }
}