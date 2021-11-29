async function tryJoin() {
    const id = document.querySelector('input[name="id"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const passwordConfirm = document.querySelector('input[name="password-confirm"]').value;
    const nickname = document.querySelector('input[name="nickname"]').value;

    if (!id || !password || !nickname) {
        alert('항목을 빠짐없이 입력해주십시오.');
        return;
    }

    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    const result = await axios({
        "method": "POST",
        "url": "https://api.chat.okayu.xyz/user/join",
        "data": {
            "id": id,
            "password": password,
            "nickname": nickname
        }
    });

    if (result.data.success){
        location.href = 'login.html';
    }else {
        alert(result.data.error);
    }
}