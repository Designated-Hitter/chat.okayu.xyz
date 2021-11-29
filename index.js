let lastChatId = 0;
let flagNovation = false;

;(async () => {

    //로그인 확인
    if(!localStorage.getItem('token')) {
        location.href = 'login.html';
        return;
    }

    await novation();
    setInterval(novation, 500);

})();

function parseJWT (token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch(e) {
        return null;
    }
}

async function sendMessage() {
    const inputMessage = document.querySelector('input[name="message"]');
    const message = inputMessage.value;
    if(!message.trim()) {
        return
    }

    const token = localStorage.getItem('token');
    const decoded = parseJWT(token);

    const result = await axios({
        method: "POST",
        url: "https://api.chat.okayu.xyz/chat",
        headers: { Authorization: token },
        data: { "message": message }
    })

    if (result.data.success) { 
        inputMessage.value = "";
        inputMessage.focus();

        const main = document.querySelector('main');
        const article = document.createElement('article');
        article.dataset.chatNo = -1;
        article.classList.add("mine");

        const label = document.createElement('label');
        label.innerText = decoded.id;

        const div = document.createElement('div');
        div.innerText = message;

        article.append(label, div);
        main.append(article);

        main.scrollTop = main.scrollHeight - main.offsetHeight;

    } else {
        alert("메시지 전송에 실패하였습니다.");

    }
}

async function novation() {
    if (flagNovation) {
        return;
    }
    flagNovation = true;

    const main = document.querySelector('main');

    let toBottom = false;
    if (main.scrollHeight == main.scrollTop + main.offsetHeight) {
        toBottom = true;
    }

    const token = localStorage.getItem('token');
    const decoded = parseJWT(token);

    const result = await axios({
        method: "GET",
        url: `https://api.chat.okayu.xyz/chat/${lastChatId}`
    })

    const list = result.data.list;
    console.log(list)

    document.querySelectorAll('article[data-chat-no="-1"]').forEach((o) => {
        o.remove()
    })

    for (const item of list) {
        const article = document.createElement('article');
        article.dataset.chatNo = item.chat_no;

        if(item.id === decoded.id) {
            article.classList.add('mine')
        } else {
            article.classList.add('others')
        }

        const label = document.createElement('label');
        label.innerText = item.id;

        const div = document.createElement('div');
        div.innerText = item.message;

        article.append(label, div);
        main.append(article);

        if(list.length) {
            lastChatId = list[list.length - 1].chat_no
        }

        if(toBottom) {
            main.scrollTop = main.scrollHeight - main.offsetHeight
        }
        flagNovation = false;  
    }
}

async function enterkey() {
    if (window.event.keyCode == 13) {
        sendMessage()
    }
}