function isEmpty(obj) {
    return obj == null || obj.length < 1;
}
function isNotEmpty(obj) {
    return obj != null && obj.length > 0;
}
function isEmptyHtml(html) {
    const replaceHtml = htmlToOnlyText(html);
    return isEmpty(replaceHtml);
}
// html의 태그 전부 없애고 반환 (img같은 하나짜리 태그는 그대로 둠)
function htmlToOnlyText(
    html
) {
    if (!html) return '';

    return html
        .replaceAll('<br>', '').replaceAll('&nbsp;', '')
        // 1. 열고 닫는 태그 제거하되, 내부 내용은 유지
        .replace(/<([a-z][a-z0-9]*)\b[^>]*>(.*?)<\/\1>/gi, '$2')
        // 2. 여러 번 중첩된 경우도 전부 제거되도록 재귀 반복
        .replace(/<([a-z][a-z0-9]*)\b[^>]*>(.*?)<\/\1>/gi, '$2')
        // 3. trim 정리
        .trim();
}




function pwdEqualsValidation(originPwd, checkPwd) {
    if (originPwd !== checkPwd)
        return '입력한 비밀번호와 일치하지 않습니다.';

    return null;
}

function onlyNumberText(e) {
    let value = $(e).val();
    $(e).val(value.replace(/[^0-9]/g, ''));
    if($(e).val().length > 0){
        $(e).removeClass("no");
    }
}
function onlyNumberMax(
    thisElement,
    max = 100
) {
    if (typeof max === 'string')
        max = parseInt(max);

    let value = thisElement.value;
    value = value.replace(/[^0-9]/g, '');
    if (value.length > 0) {
        value = value * 1;
        if (value > max)
            value = max;
    }

    thisElement.value = value;
}
function onlyNumberMaxMulti(
    thisElement,
    ...max
) {
    // 제일 낮은 max 값
    let intArr = max.map(it => {
        if (typeof it === 'string')
            return parseInt(it);
        else
            return it;
    });
    let minMax = Math.min(...intArr);

    onlyNumberMax(thisElement, minMax);
}
// input에 값 절삭하기
function onlyNumberTruncate(
    thisElement,
    truncationUnit = 0, //절삭할 단위 ex) 1(1의자리),2(10의자리),3(100의자리)
) {
    if (truncationUnit > 0) {
        let unit = Math.pow(10, truncationUnit);
        let value = thisElement.value;

        if (!isNaN(Number(value)) && value.length > truncationUnit) {
            value = Number(value);
            value = Math.floor(value / unit) * unit;
            thisElement.value = value;
        }
    }
}


// 유효성검사 폼막기
function joinValidation() {
    let userId = document.querySelector('.userId').value;
    let userPwd = document.querySelector('.userPwd').value;
    let userPwd2 = document.querySelector('.userPwd2').value;
    let userName = document.querySelector('.userName').value;
    let optionList = document.querySelector('.optionList').value;

    let termsCheck1 = document.querySelector('#ck_1').checked;
    let termsCheck2 = document.querySelector('#ck_2').checked;

    if (!window.isPhoneVerified) {
        breakAlert("휴대폰 인증이 완료되지 않았습니다.");
    }

    if (isEmpty(userId)) {
        breakAlert('아이디(휴대폰번호)를 입력해주세요.');
        return;
    }


    let error = pwdEqualsValidation(userPwd, userPwd2);
    if (error != null) {
        breakAlert(error);
        return;
    }

    if (isEmpty(userPwd2)) {
        focusAlert('비밀번호를 입력해주세요.', '.userPwd');
        return;
    }

    if (isEmpty(userName)) {
        focusAlert('이름을 입력해주세요.', '.userName');
        return
    }


    if (!termsCheck1) {
        focusAlert('이용약관을 체크해주세요.', '#ck_1');
    }

    if (!termsCheck2) {
        focusAlert('개인정보처리방침을 체크해주세요.', '#ck_2');
    }
}


function managerPhoneValidation(
    phone
) {
    if (phone == null || phone.length < 1)
        return '담당자 전화번호를 입력해 주세요.';

    if (!phone.startsWith('0'))
        return '전화번호의 앞자리는 0으로 시작돼야 합니다.';
    if (phone.length !== 11)
        return '전화번호는 11자리(010XXXXXXXX) 형식으로 입력해 주세요.';

    return null;
}