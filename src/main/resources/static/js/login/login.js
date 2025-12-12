function login() {
    let userId = document.querySelector('#loginId')?.value;
    let userPwd = document.querySelector('#loginPwd')?.value;
    const rememberMe = document.querySelector('#ckbox1').checked;

    if (isEmpty(userId))
        focusAlert('아이디를 입력해 주세요.', '#loginId');
    if (isEmpty(userPwd))
        focusAlert('비밀번호를 입력해 주세요.', '#loginPwd');


    let form = document.createElement('form');
    form.method = 'POST';
    form.action = `${contextPath}/auth`;

    let idInput = document.createElement('input');
    idInput.type = 'hidden';
    idInput.name = 'id';
    idInput.value = userId;
    form.appendChild(idInput);

    let pwdInput = document.createElement('input');
    pwdInput.type = 'hidden';
    pwdInput.name = 'pwd';
    pwdInput.value = userPwd;
    form.appendChild(pwdInput);

    if (rememberMe) {
        const rememberInput = document.querySelector('input');
        rememberInput.type = 'hidden';
        rememberInput.name = 'remember';
        rememberInput.value = true;
        form.appendChild(rememberInput);
    }

    document.body.appendChild(form);
    form.submit();
}

function loginEnter() {
    if (event.key === 'Enter')
        login();
}

    const urlObj = getPrevObj();

    if (urlObj.error != null) {
        warning(base64Decode(urlObj.error));
        delete urlObj.error;
        replaceParamToUrl(urlObj)
    } else if (urlObj.success != null) {
        ok(base64Decode(urlObj.success));
        delete urlObj.success;
        replaceParamToUrl(urlObj);
    }

