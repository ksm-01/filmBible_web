function getPrevObj() {
    return Object
        .fromEntries(new URL(location.href).searchParams);
}



// hide, show
async function hideElement(element) {
    return new Promise((resolve) => {
        function onAnimationEnd() {
            element.removeEventListener('animationend', onAnimationEnd);
            resolve();
        }
        element.addEventListener('animationend', onAnimationEnd);
        element.classList.remove('show');
        element.classList.add('hide');
    });
}
async function showElement(element) {
    return new Promise((resolve) => {
        function onAnimationEnd() {
            element.removeEventListener('animationend', onAnimationEnd);
            resolve();
        }
        element.addEventListener('animationend', onAnimationEnd);
        element.classList.remove('hide');
        element.classList.add('show');
    });
}

// url 생성기
function urlBuilder(url, params) {
    Object.keys(params).forEach((key, index) => {
        if (index === 0)
            url += `?${key}=${params[key]}`;
        else
            url += `&${key}=${params[key]}`;
    });

    return url;
}


// 함수 중복으로 실행될 때 이전 함수는 중지하고 신규 함수만 적용
// delay <- ms
function debounce(func, delay = 200) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay)
    }
}

// 세션 살아있는지 체크하기
function isSessionAlive() {
    return new Promise((resolve, reject) => {
        $.get({
            url: `${contextPath}/api/session_alive`,
            cache: false,
            success: (res) => {
                let isAlive = res.success;
                resolve(isAlive);
            },
            error: (e) => {
                errorAlert();
                reject(e);
            }
        });
    });
}


// 페이지 이동
function movePage(
    url
) {
    location.href = `${contextPath}${url}`;
}

function movePageEnter(url) {

}
function movePageTab(url) {
    if (isEmpty(url))
        return;

    if (url.includes('http'))
        window.open("about:blank").location.href = url;
    else
        window.open("about:blank").location.href = contextPath + url;
}

function movePageTabUrl(url) {
    if (isEmpty(url))
        return;

    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }
    window.open(url, "_blank");
}

function movePageUrl(url) {
    if (!url) return;

    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }
    window.location.href = url;
}


function movePageReplace(url) {
    location.replace(`${contextPath}${url}`);
}
function movePagePost(url, dataObj) {
    let form = `<form id="post_form" action="${contextPath}/${url}" method="post">`
    if (dataObj != null && Object.keys(dataObj).length > 0) {
        Object.keys(dataObj).forEach((key) => {
            let data = dataObj[key];
            if (data != null)
                form += `<input type="hidden" name='${key}' value='${data}'>`;
        });
    }
    form += `</form>`;
    $('body').append(form);

    $('#post_form').submit().remove();
}


function newTab(url) {
    if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1)
        window.open("about:blank").location.href = url;
    else
        window.open("about:blank").location.href = 'http://' + url;
}

function movePageMaintain(parameters) {
    let url = new URL(location.href);

    Object.keys(parameters).forEach(function (key) {
        let value = parameters[key];
        if (value == null || value === 'null' || value.length < 1)
            url.searchParams.delete(key);
        else
            url.searchParams.set(key, value);
    });

    location.href = url.href;
}
function movePageMaintainEnter(parameters) {
    if (event.key === 'Enter')
        movePageMaintain(parameters);
}

/**
 * url의 파라미터  params에 들어있는 값으로 교체
 *
 * @param params
 */
function replaceParamToUrl(params) {
    const currentUrl = new URL(location.href);
    currentUrl.search = ''; // 기존 url 파라미터 초기화

    Object.keys(params).forEach(key => {
        if (!isEmpty(params[key]) && params[key] !== undefined)
            currentUrl.searchParams.set(key, params[key]);
    });
    history.replaceState(null, '', currentUrl.href);
}
function getParamBySearch(key) {
    const currentUrl = new URL(location.href);
    return currentUrl.searchParams.get(key);
}


function base64Encode(text) {
    try {
        let textEncoder = new TextEncoder();
        let encodedText = textEncoder.encode(text);
        let base64String = btoa(String.fromCharCode(...encodedText));

        // URL-safe 변환: '+'를 '-', '/'를 '_', '='를 제거
        return base64String
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, ''); // '=' 패딩 제거
    } catch (e) {
        console.error('=========== base64Encode error ===========');
        console.error(e);
        return text;
    }
}

function base64Decode(text) {
    try {
        console.log(`base64Decode start  : ${text}`);

        // Convert URL-safe Base64 to standard Base64
        text = text.replace(/-/g, '+').replace(/_/g, '/');

        // Add padding if needed
        while (text.length % 4 !== 0) {
            text += '=';
        }

        // Base64 decode
        let binaryString = atob(text);
        let textDecoder = new TextDecoder('utf-8');

        let decodedText = textDecoder.decode(new Uint8Array([...binaryString].map(char => char.charCodeAt(0))));
        return decodedText;
    } catch (e) {
        console.error('=========== base64Decode error ===========');
        console.error(e);
        return text;
    }
}
function textToHtml(
    text
) {
    return text
        .replaceAll(' ', '&nbsp;')
        .replaceAll('\n', '<br>');
}


/**
 * background:url 세팅
 */
function backgroundUrlSetter(
    targetElement,
    url,
    size = 'cover'
) {
    targetElement.style.background = `url('${url}') no-repeat center`;
    targetElement.style.backgroundSize = size;
}
function backgroundUrlSetterByFile(targetElement, file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        targetElement.style.background = `url('${e.target.result}') no-repeat center`;
        targetElement.style.backgroundSize = 'cover';
    };
    reader.readAsDataURL(file);
}
function imgSrcSetter(targetElement, url) {
    targetElement.setAttribute('src', url);
}

/**
 * @param thisElement <- this
 * @param name_target <- 이름 바뀔 곳
 * @param default_message <- 원래 텍스트
 */
function fileUploadShowName(
    thisElement, name_target, default_message
) {
    let file = thisElement.files[0];
    let nameElement = $(name_target);
    if (file) {
        console.log(`existFile:${file.name}`);
        nameElement.text(file.name);
    } else
        nameElement.text(default_message);
}
function fileUploadShowNameValue(origin, name_target, default_message) {
    let file = $(origin)[0].files[0];
    let nameElement = $(name_target);
    if (file) {
        nameElement.val(file.name);
    } else {
        if (default_message != null)
            nameElement.val(default_message);
        else
            nameElement.val('');
    }
}


/**
 * input file type 변경 되었을 때 지정한 요소에 해당 파일 이름 보여주기
 *
 * @param realFileElement <- this
 * @param imgElement
 * @param tempFileElement <- 이전 파일이 임시로 저장될 곳
 * @param func <- 함수가 끝났을 때,
 * @param nameElement <- 파일 이름 표시할 곳
 * @param defaultFile <- 원래 파일 (없으면 null)
 *
 * @param imgElement2 <- 이미지 따로 표시해줘야할 곳이 있을 때
 */
function imageUpload(
    realFileElement,
    imgElement,
    tempFileElement = null,
    func = null,
    nameElement = null,
    defaultFile = null,
    imgElement2 = null,
) {
    if (typeof realFileElement === 'string')
        realFileElement = document.querySelector(realFileElement);
    let tempTargetElement = null;
    if (tempFileElement != null) {
        if (typeof tempFileElement === 'string')
            tempTargetElement = document.querySelector(tempFileElement);
        else
            tempTargetElement = tempFileElement;
    }
    imgElement = $(imgElement);
    nameElement = $(nameElement);


    let file = realFileElement.files[0];
    if (file) {
        if (file.size > (1024*1024*25)) {
            warning('파일 사이즈는 25MB 이하로 올려주세요.');
            return;
        }
        if (tempTargetElement != null) {
            console.log('fileMove');
            fileMove(realFileElement, tempTargetElement);
        }

        let reader = new FileReader();
        reader.onload = function (e) {
            imgElement.css({
                'background':`url(${e.target.result})no-repeat center`,
                'background-size':'cover'
            });
            imgElement.removeClass('no');
            if (imgElement2 != null) {
                $(imgElement2).css({
                    'background':`url(${e.target.result})no-repeat center`,
                    'background-size':'cover'
                });
            }

            if (func != null)
                func();
        }
        reader.readAsDataURL(file);
        if (nameElement != null)
            nameElement.val(file.name);
    } else {
        if (defaultFile != null) {
            imgElement.css({
                'background':`url(${defaultFile})no-repeat center`,
                'background-size':'cover'
            });
        } else {
            // 임시 저장소가 있을 경우
            if (tempTargetElement != null
                && tempTargetElement.files.length > 0) {
                console.log('임시 저장소 있음');
                fileMove(tempTargetElement, realFileElement);
                trigger(realFileElement, 'change');
            } else {
                console.log('임시 저장소 없음');
                imgElement[0].style.removeProperty('background');
                imgElement.addClass('no');
                if (func != null)
                    func();
            }
        }

        nameElement.val('');
    }
}

function imageUploadSrc(
    fileElement,
    imgElement,
    nameElement,
    defaultFile
) {
    let file = fileElement.files[0];
    imgElement = $(imgElement);
    let noElement = $(imgElement.parent());
    nameElement = $(nameElement);
    if (file) {
        if (file.size > (1024*1024*25)) {
            warning('파일 사이즈는 25MB 이하로 올려주세요.');
            return;
        }

        let reader = new FileReader();
        reader.onload = function (e) {
            // imgElement.attr('src', e.target.result);
            imgElement.attr('src', e.target.result);
            noElement.removeClass('no');
        }
        reader.readAsDataURL(file);

        nameElement.val(file.name);
    } else {
        if (defaultFile != null) {
            imgElement.attr('src', `${defaultFile}`);
        } else {
            imgElement.attr('src', '');
            noElement.addClass('no');
        }

        nameElement.val('');
    }
}

function imageUploadFileName(
    fileElement,
    nameTarget,
    defaultName,
    fileTempTarget,
    onClassTarget
) {
    if (fileTempTarget != null) {
        if (typeof fileTempTarget === 'string')
            fileTempTarget = document.querySelector(fileTempTarget);
    }
    if (onClassTarget != null) {
        if (typeof onClassTarget === 'string')
            onClassTarget = document.querySelector(onClassTarget);
    }
    if (typeof nameTarget === 'string')
        nameTarget = document.querySelector(nameTarget);

    let file = fileElement.files[0];
    if (file) {
        if (file.size > (1024*1024*25)) {
            warning('파일 사이즈는 25MB 이하로 올려주세요.');
            return;
        }
        if (fileTempTarget != null) {
            console.log('fileMove');
            fileMove(fileElement, fileTempTarget);
        }

        nameTarget.textContent = file.name;
        if (onClassTarget != null)
            onClassTarget.classList.add('on');
    } else {
        // 임시 저장소 있을 경우
        if (fileTempTarget != null && fileTempTarget.files.length > 0) {
            console.log('임시 저장소 있음');
            fileMove(fileTempTarget, fileElement);
            trigger(fileElement, 'change');
        } else {
            console.log('임시 저장소 없음');
            nameTarget.textContent = defaultName;
            if (onClassTarget != null)
                onClassTarget.classList.remove('on');
        }
    }
}

// input[type=file]에 들어있는 파일 지우기
function fileRemover(fileInputs) {
    if (typeof fileInputs !== 'object')
        fileInputs = [fileInputs];

    fileInputs.forEach(fileInput => {
        fileInput = $(fileInput);
        let prevFileInput = fileInput.prev();
        if (prevFileInput.hasClass('temp_file'))
            prevFileInput.val('');
        fileInput.val('').trigger('change');

        fileInput = fileInput[0];
        delete fileInput.dataset.prev_file;
        delete fileInput.dataset.prev_idx;
    });
}

async function getBlobOrUrlByS3Image(
    imgUrl,
    toBlob = false, // true 일경우 blob, false일 경우 임시 url
) {
    const res = await fetch(imgUrl, { mode: 'cors' });
    const blob = await res.blob();

    if (toBlob) {
        return await new Promise(r => {
            const reader = new FileReader();
            reader.onloadend = () => r(reader.result);
            reader.readAsDataURL(blob);
        });
    } else
        return URL.createObjectURL(blob);
}

/**
 * blob 객체 file로 변환하기
 */
function blobToFile(blob, fileName, type) {
    if (type == null)
        type = blob.type;
    if (fileName == null || fileName.length < 1)
        fileName = buildUuid().replace('-', '').substring(0, 10);

    const fileType = type.includes('/') ? type.split('/')[1] : type;

    return new File([blob], `${fileName}.${fileType}`, { type: type });
}

/**
 * base64String을 File 객체로 변경
 */
function base64ToFile(base64Data, fileName) {
    const arr = base64Data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while(n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    // Blob 객체 생성
    const blob = new Blob([u8arr], { type: mime });

    // Blob 객체를 File 객체로 변환
    return new File([blob], fileName, { type: mime });
}
function base64ToFileNoSplit(base64Data, fileName, type) {
    // let arr = base64Data.split(','),
    //     mime = arr[0].match(/:(.*?);/)[1],
    //     bstr = atob(arr[1]),
    //     n = bstr.length,
    //     u8arr = new Uint8Array(n);
    //
    // while(n--){
    //     u8arr[n] = bstr.charCodeAt(n);
    // }
    //
    // return new File([u8arr], fileName, {type:mime});


    // Base64 문자열에서 실제 바이너리 데이터 부분을 분리합니다.
    let byteString = atob(base64Data);

    // Base64 문자열에서 MIME 타입을 추출합니다.
    let mimeString = type;

    // 바이너리 데이터를 저장할 ArrayBuffer를 생성합니다.
    let ab = new ArrayBuffer(byteString.length);

    // ArrayBuffer를 기반으로 Uint8Array를 생성합니다.
    let ia = new Uint8Array(ab);

    // byteString의 각 문자를 해당하는 바이트 값으로 변환하여 Uint8Array에 저장합니다.
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // Uint8Array를 사용하여 Blob 객체를 생성합니다.
    let blob = new Blob([ab], { type: mimeString });

    // Blob 객체를 사용하여 File 객체를 생성합니다.
    return new File([blob], `filename.${type}`, {type: mimeString});
}

function getObjectUrlByFileElement(fileElement) {
    return URL.createObjectURL(fileElement.files[0]);
}

/**
 * 파일 복사하기
 *
 * @param originFiles  <- 원본 파일
 */
function fileCopy(originFiles) {
    let dataTransfer = new DataTransfer();

    for (let i=0; i<originFiles.length; i++) {
        dataTransfer.items.add(originFiles[i]);
    }

    return dataTransfer.files;
}

function fileMove(originTargetElement, newTargetElement) {
    newTargetElement.files = fileCopy(originTargetElement.files);
}

/**
 * 특정  요소의  텍스트  복사해서   ctrl+v  할 수 있게
 * @param targetDocument <- 복사할 요소 dom
 */
function textCopy(targetDocument) {
    let text = targetDocument.innerText;
    let textArea = document.createElement('textarea');
    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');

    document.body.removeChild(textArea);
    ok('복사가 완료되었습니다.');
}
function textCopyText(text, mobile) {
    let textArea = document.createElement('textarea');
    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');

    document.body.removeChild(textArea);
    ok('복사가 완료되었습니다.');
}
function textCopyValue(targetSelector) {
    let text = $(targetSelector).val();
    let textArea = document.createElement('textarea');
    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');

    document.body.removeChild(textArea);
    ok('복사가 완료되었습니다.');
}

function copyInputValue(baseElement, targetElement) {
    targetElement.value = baseElement.value;
}


/**
 * 지정 요소 위치로 이동
 */
function moveTargetElement(targetSelector, minusTop) {
    let $target = $(targetSelector);
    let top = $target.offset().top;
    if (minusTop != null)
        top = top - minusTop;

    window.scrollTo(0, top);
}
function moveTargetElementFocus(targetSelector, minusTop) {
    let $target = $(targetSelector);
    let top = $target.offset().top;
    if (minusTop != null)
        top = top - minusTop;

    window.scrollTo(0, top);
    $target.focus();
}

/**
 *  date객체
 *    2023-03-03 형식으로 바꾸기
 */
function formatDate(date) {
    // 년, 월, 일을 가져오기
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);

    // 날짜를 지정된 형식으로 반환
    return year + '-' + month + '-' + day;
}
function dateToNumber(date) {
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);

    return (`${year}${month}${day}`) * 1;
}
function numDateToDate(numDate) {
    numDate = `${numDate}`;

    return new Date(numDate.slice(0,4)*1, (numDate.slice(4,6)*1)-1, numDate.slice(6,8)*1);
}

/**
 * 2023-04-04 이런 텍스트를 2023년 4월 4일 (일)  로 바꿔줌
 */
function dateTextToKrText(dateText) {
    let text = ``;
    dateText.split('-').forEach((item, index) => {
        if (index === 0)
            text += `${item}년 `;
        else if (index === 1)
            text += `${item}월 `;
        else
            text += `${item}일 `;
    });
    text += `(${getDayOfWeekText(dateText, 'kr')})`;

    return text;
}

/**
 *  날짜에서 요일 정보 얻기
 *
 */
function getDayOfWeekText(dateText, region) {
    let dayOfWeek = null;
    if (region == null || region === 'kr') {
        dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    } else
        dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let date = new Date(dateText);

    return dayOfWeek[date.getDay()];
}

/**
 * 입력한 날짜가 타겟 date보다 크면 true 아니면 false
 *
 *  targetDate가 null인 경우 now()로 설정
 * 입력형식 2023-01-01
 */
function dateIsAfter(targetDate, inputDate) {
    let $targetDate = stringToInteger(formatDate(new Date()));
    if (targetDate != null)
        $targetDate = stringToInteger(formatDate(new Date(targetDate)));

    let $inputDate = stringToInteger(formatDate(new Date(inputDate)));
    return $inputDate > $targetDate;
}
/**
 * 입력한 날짜가 타겟 date 보다 작으면 true 아니면 false
 *
 *  targetDate가 null인 경우 now()로 설정
 * 입력형식 2023-01-01
 */
function dateIsBefore(targetDate, inputDate) {
    let $targetDate = stringToInteger(formatDate(new Date()));
    if (targetDate != null)
        $targetDate = stringToInteger(targetDate);

    let $inputDate = stringToInteger(inputDate);
    return $inputDate < $targetDate;
}

function timeAgo(dateString) {
    const now = new Date();
    const then = new Date(dateString);
    const diff = (now - then) / 1000;

    if (isNaN(then.getTime())) return "유효하지 않은 날짜";
    if (diff < 60) return "방금 전";
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
}


/**
 * 텍스트 Integer로 변경
 */
function stringToInteger(text) {
    if (typeof text === 'number')
        text = `${text}`;
    return text.replace(/\D/g, '') * 1;
}
function stringToIntegerWithMinus(text) {
    if (typeof text === 'number')
        text = `${text}`;
    let isMinus = text.includes('-');
    if (isMinus)
        return text.replace(/\D/g, '') * -1;
    else
        return text.replace(/\D/g, '') * 1;
}
function stringToIntegerText(text) {
    return text.replace(/\D/g, '');
}
function offAutoComplete(inputElements) {
    if (inputElements == null)
        inputElements = document.querySelectorAll('input');

    inputElements.forEach(inputElement => inputElement.setAttribute('autocomplete', 'false'));
}

/**
 * 콤마 세자리마다 찍어주기
 */
function addComma(text) {
    try{
        return text.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    }catch (e){
        return text.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    }

}


/**
 * target에 base의 값을 전부 합쳐서 더해줌
 */
function changeSum(targetSelector, baseSelector) {
    let $target = $(targetSelector);
    let sum = 0;
    $(baseSelector).each((index, item) => {
        let value = $(item).val() * 1
        if (value != null)
            sum += value;
    });
    $target.val(sum);
    $target.trigger('input');
}

/**
 * radio 체크된 것 값 가져오기
 */
function getRadioCheckedValue(selector) {
    let checkedElement = $(`${selector}:checked`);
    if (checkedElement.length > 0)
        return checkedElement.val();

    return null;
}

function dateToWeekday(date_string){
    let date = new Date(date_string);
    const days = ["일","월","화","수","목","금","토"];
    return days[date.getDay()];
}

function maskString(str) {
    if (str.length === 2) {
        // 문자열이 2글자이면 마지막 글자를 *로 변환
        return str[0] + '*';
    } else if (str.length === 3) {
        // 문자열이 3글자이면 가운데 글자를 *로 변환
        return str[0] + '*' + str[2];
    } else if (str.length >= 4) {
        // 문자열이 4글자 이상이면 첫 글자와 마지막 글자를 제외하고 *로 변환
        let middleMasked = '*'.repeat(str.length - 2);
        return str[0] + middleMasked + str[str.length - 1];
    } else {
        // 1글자 이하는 그대로 반환
        return str;
    }
}

/**
 * 윈도우 기본 scroll
 */
function windowScroll(
    element,
    plusMinus = 0
) {
    if (typeof element === 'string')
        element = document.querySelector(element);

    const targetOffset = element.getBoundingClientRect().top
        + window.pageYOffset
        + plusMinus;

    scrollTo(0, targetOffset);
}

function elementScroll(
    baseElement,
    targetElement,
    offset = 0
) {
    if (typeof baseElement === 'string')
        baseElement = document.querySelector(baseElement);
    if (typeof targetElement === 'string')
        targetElement = document.querySelector(targetElement);

    const baseRect = baseElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    /*console.log('baseRect:');
    console.log(baseRect);
    console.log('targetRect:');
    console.log(targetRect);*/

    const scrollTop = baseElement.scrollTop;
    const relativeY = targetRect.top - baseRect.top;

    baseElement.scrollTo({
        top: scrollTop + relativeY - offset,
        behavior: 'smooth'
    });
}



function scrollFunc(
    scrollWrapperElement,
    height = 0,
    func
) {
    if (scrollWrapperElement.scrollTop + scrollWrapperElement.clientHeight >= scrollWrapperElement.scrollHeight + height)
        func();
}
/**
 * window를 기준으로 특정 요소까지 이동
 */
function scrollToElement(element, plusMinus = 0) {
    element = $(element)[0];

    let targetPosition = element.getBoundingClientRect().top + window.scrollY; // 요소의 위치
    targetPosition += plusMinus;
    const start = window.scrollY;
    const distance = targetPosition - start; // 스크롤할 거리
    const duration = 500; // 스크롤이 완료되는 데 걸리는 시간 (밀리초)
    const startTime = performance.now();

    function animateScroll(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const ease = easeInOutQuad(progress);

        window.scrollTo(0, start + distance * ease);

        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }

    requestAnimationFrame(animateScroll);
}

function scrollToTopByTarget(target_selector, now=false) {
    let element = $(target_selector)[0];
    if (now) {
        element.scrollTop = 0;
        return;
    }

    const duration = 500; // 스크롤이 완료되는 데 걸리는 시간 (밀리초)
    const start = element.scrollTop;
    const startTime = performance.now();

    return new Promise((resolve) => {
        function animateScroll(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const ease = easeInOutQuad(progress);

            element.scrollTop = start * (1 - ease);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                resolve();
            }
        }

        requestAnimationFrame(animateScroll);
    });
}
function scrollToTopByTargetNow(target_selector) {
    let element = $(target_selector)[0];
    element.scrollTop = 0;
}

function scrollToBottomByTarget(target_selector, mills) {
    let element = $(target_selector)[0];
    if (element == null && target_selector === '.scroll') {
        element = $('.device_scroll')[0];
    }
    if (element == null) {
        console.warn('scorll element is null');
        return;
    }

    let duration = 500; // 스크롤이 완료되는 데 걸리는 시간 (밀리초)
    if (mills != null)
        duration = mills;
    const start = element.scrollTop;
    const end = element.scrollHeight - element.clientHeight;
    const startTime = performance.now();

    return new Promise((resolve) => {
        function animateScroll(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const ease = easeInOutQuad(progress);

            element.scrollTop = start + (end - start) * ease;

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                resolve();
            }
        }

        requestAnimationFrame(animateScroll);
    });
}

/**
 * baseElement를 기준으로 targetElement까지 이동
 */
function scrollToTarget(baseElement, targetElement, plusMinusPx) {
    // jQuery를 사용하는 경우
    baseElement = $(baseElement)[0];
    let element = $(targetElement)[0];

    // 필요한 경우 jQuery를 사용하지 않으려면 다음과 같이 직접 DOM을 사용할 수도 있습니다.
    // let baseElement = document.querySelector(baseElement);
    // let element = document.querySelector(targetElement);

    const duration = 500; // 스크롤이 완료되는 데 걸리는 시간 (밀리초)
    const startScrollTop = baseElement.scrollTop;
    const scrollHeight = baseElement.scrollHeight;
    const clientHeight = baseElement.clientHeight;

    // targetElement의 위치와 상대적으로 스크롤할 위치를 계산합니다.
    const targetRect = element.getBoundingClientRect();
    const baseRect = baseElement.getBoundingClientRect();
    const targetPosition = targetRect.top - baseRect.top + startScrollTop; // targetElement의 위치
    const scrollToPosition = targetPosition - plusMinusPx; // 스크롤 위치를 조정합니다

    // 목표 스크롤 위치가 유효한 범위 내에 있는지 확인합니다.
    const maxScrollTop = scrollHeight - clientHeight;
    const startPos = Math.max(0, Math.min(startScrollTop, maxScrollTop));
    const endPos = Math.max(0, Math.min(scrollToPosition, maxScrollTop));

    const startTime = performance.now();

    return new Promise((resolve) => {
        function animateScroll(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const ease = easeInOutQuad(progress);

            baseElement.scrollTop = startPos + (endPos - startPos) * ease;

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                resolve();
            }
        }

        requestAnimationFrame(animateScroll);
    });
}

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeOutQuad(t) {
    return t * (2 - t);
}
function easeOutBounce(t) {
    if (t < 1 / 2.75) {
        return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
        t -= 1.5 / 2.75;
        return 7.5625 * t * t + 0.75;
    } else if (t < 2.5 / 2.75) {
        t -= 2.25 / 2.75;
        return 7.5625 * t * t + 0.9375;
    } else {
        t -= 2.625 / 2.75;
        return 7.5625 * t * t + 0.984375;
    }
}

function scrollHeightCheck(target_j_element, minus_height = 0) {
    let scrollHeight = target_j_element[0].scrollHeight;
    let scrollTop = target_j_element.scrollTop();
    let outerHeight = target_j_element.outerHeight();

    let max = outerHeight + scrollTop;
    let current = scrollHeight - minus_height;

    return {
        max: max,
        current: current,
        over: max >= current
    };
}







// ===================================================================================
// =============== [lay select],   [label select],  [swiper],  [datepicker] ==========
// ===================================================================================

/**
 * lay_select
 */


function laySetter(base_selector) {
    // lay_select 세팅
    // document.body.onclick = function (e) {
    //     if (!($(e.target).closest("div").hasClass("lay_select"))) {
    //         $('.lay_select ul').removeClass('on');
    //         $('.lay_select p').removeClass('pad');
    //     }
    // }

    $(`${base_selector} .lay_select p`).on('click',function(){
        if (this.classList.contains('no_select'))
            return;
        let nextUl = this.nextElementSibling; // ul
        if (!nextUl.classList.contains('on')) {
            $('.lay_select ul').removeClass('on');
            $('.lay_select p').removeClass('pad');
        }

        nextUl.classList.toggle('on');
        this.classList.toggle('pad');
    });

    $(`${base_selector} .lay_select label`).on('click',function(e){
        let target = e.target;
        let tempBase = target.closest('div');
        tempBase.querySelector("p").classList.add('on');
        tempBase.querySelector("ul").classList.remove('on');
        tempBase.querySelector("p").classList.remove('pad');

        let tempLi = target.closest('li');
        tempBase.querySelector('span').textContent = tempLi.querySelector('label').textContent;
        tempLi.querySelector('input').checked = true;
    });

    Array.from($(`${base_selector} .lay_select input:checked`)).forEach((item) => {
        let checkedInput = $(item);
        if (checkedInput.length > 0 && (checkedInput.val() > 0 || checkedInput.val().length > 0)) {
            let base_lay_select = checkedInput.closest('.lay_select');
            base_lay_select.find('p').addClass('on');
            base_lay_select.find('span').text(checkedInput.parent().find('label').text());
        }
    });
}
function layOpenCheck(targetElement) {
    if (targetElement.closest('.lay_select') == null) {
        document.querySelectorAll('.lay_select .pad').forEach((item) => {
            try { item.classList.remove('pad'); } catch {}
            try { item.nextElementSibling.classList.remove('on'); } catch (e) {}
        })
    }
}
function listMoreCheck(targetElement) {
    if (targetElement.closest('.list_more') == null && targetElement.closest('.list_more_bt') == null) {
        document.querySelectorAll('.list_more').forEach(it => it.classList.remove('on'));
    }
}


/**
 * @param targetElement <- 하단의 .label에 적용
 */
function labelSetter(
    targetElement,
    initialColor, // #222 (색상코드 string)
){
    if (targetElement == null)
        targetElement = 'body';

    const label = $(targetElement).find('.label').get();
    label.forEach((lb) => {
        // 열렸다 닫혔다 하는것
        let parentNode = lb.parentNode;
        lb.addEventListener('click', (e) => {
            if (parentNode.classList.contains('active')) {
                parentNode.classList.remove('active');
            } else {
                parentNode.classList.add('active');
                $('.label').parent().not($(lb.parentNode)).removeClass('active');
            }
        });


        let optionList = lb.nextElementSibling;
        if (isEmpty(optionList))
            return;
        let optionItems = optionList.querySelectorAll('.optionItem');
        optionItems.forEach((opt) => {
            // optionItem이 active 클래스를 처음부터 가지고 있을 경우
            if (opt.classList.contains('active')) {
                lb.innerHTML = opt.textContent;
                if (initialColor != null)
                    lb.style.color = initialColor;
            }


            // 아이템 선택될 때 작동
            opt.addEventListener('click', () => {
                if (!parentNode.classList.contains('active'))
                    return;

                parentNode.classList.remove('active');
                lb.innerHTML = opt.textContent; // text 옮기기
                lb.dataset.value = opt.dataset.value; // data-value 있으면 넣기
                if (initialColor != null)
                    lb.style.color = initialColor;

                Array.from(opt.parentNode.children).forEach((tempOpt) => {
                    tempOpt.classList.remove('active');
                });
                opt.classList.add('active');
            });
        });
    });
}

/**
 * label check
 *   단일 아이템 선택할 때 사용
 */
function labelCheck(
    targetLabel,
    activeCheck = true // false일 경우 .select가 active 상태 아니어도 적용
) {
    if (targetLabel == null)
        return false;
    if (activeCheck)
        event.stopImmediatePropagation();

    let select = targetLabel.closest(".select");
    if (!select.classList.contains('active') && activeCheck)
        return false;
    select.classList.remove('active');

    let labels = select.querySelectorAll('li');
    let button = select.querySelector('button');

    labels.forEach((item) => { item.classList.remove('active'); });
    targetLabel.classList.add('active');
    button.textContent = targetLabel.textContent;

    return true;
}

/**
 * label off
 *
 * @param label_selector <- ex) optionItem_mode_type
 */
function labelUncheck(label_selector) {
    let labels = $(label_selector);
    let select = labels.closest('.select');
    let button = select.find('button');

    select.removeClass('active');
    button.text(button.data('default'));
    labels.removeClass('active');
}
function labelFirstCheck(targetElement) {
    if (typeof targetElement === 'string')
        targetElement = document.querySelector(targetElement);
    if (targetElement == null)
        return;


    let base = targetElement.closest('.select');
    base.classList.remove('active');
    base.querySelectorAll('.optionItem').forEach((item, index) => {
        if (index === 0) {
            item.classList.add('active');
            base.querySelector('.label').textContent = item.textContent;
        } else
            item.classList.remove('active');
    });
}
function labelIndexCheck(targetElement, targetIndex) { // targetElement <- label
    if (typeof targetElement === 'string')
        targetElement = document.querySelector(targetElement);

    let base = targetElement.closest('.select');
    base.classList.remove('active');
    base.querySelectorAll('.optionItem').forEach((item, index) => {
        if (index === targetIndex) {
            item.classList.add('active');
            base.querySelector('.label').textContent = item.textContent;
        } else
            item.classList.remove('active');
    });
}
function labelOpenCheck(targetElement) {
    if (targetElement.closest('.select') == null) {
        document.querySelectorAll('.select.active').forEach(it => {
            it.classList.remove('active');
        });
    }
}

// label, laySelect 바깥클릭 시 닫히게
function setOpenCheckTotal() {
    document.addEventListener('click', (event) => {
        let target = event.target;
        labelOpenCheck(target);
        layOpenCheck(target);
        listMoreCheck(target);
    });
}



/**
 * trigger
 */
function trigger(targetElement, eventType) {
    if (typeof eventType === 'string' && typeof targetElement[eventType] === 'function') {
        targetElement[eventType]();
    } else {
        const event =
            typeof eventType === 'string'
                ? new Event(eventType, {bubbles: true})
                : eventType;
        targetElement.dispatchEvent(event);
    }
}

/**
 * 요소 복사해서 반환
 */
function elementCopy(targetElement) {
    let copyFormHtml = targetElement.outerHTML;

    let parser = new DOMParser();
    let doc = parser.parseFromString(copyFormHtml, 'text/html');
    let newForm = doc.body.firstChild;

    newForm.removeAttribute('id');
    newForm.style.removeProperty('display');

    return newForm;
}

/**
 * 비슷한 클래스 이름 가져오기
 */
function getContainsClassName(element, target_selector) {
    if (element == null) {
        console.warn('getContainsClassName - element is null');
        return null;
    }

    let filterList = Array.from(element.classList).filter(item => item.indexOf(target_selector) > -1);
    if (filterList.length > 0)
        return filterList[0];
    else
        return null;
}


function getIndexByElements(
    targetElement,
    listElements
) {
    if (typeof targetElement === 'string')
        targetElement = document.querySelector(targetElement);
    if (typeof listElements === 'string')
        listElements = document.querySelectorAll(listElements);

    return Array.from(listElements).indexOf(targetElement);
}



function telHref(phoneNumber) {
    try {
        channel.postMessage(JSON.stringify({
            'method': 'sendTel',
            'phone': phoneNumber,
        }));
    } catch (e) {
        location.href = `tel:${phoneNumber}`;
    }
}
function smsHref(phoneNumber) {
    try {
        channel.postMessage(JSON.stringify({
            'method': 'sendSms',
            'phone': phoneNumber,
        }));
    } catch (e) {
        location.href = `sms:${phoneNumber}`;
    }
}



function setDatePicker(
    targetSelector,
    separator = '-',
    maxYear = '0',
) {
    let currentYear = new Date().getFullYear();
    // datepicker 년도 역순 정렬하기
    /*$.datepicker._generateMonthYearHeader_original = $.datepicker._generateMonthYearHeader;

    $.datepicker._generateMonthYearHeader = function(inst, dm, dy, mnd, mxd, s, mn, mns) {
        var header = $($.datepicker._generateMonthYearHeader_original(inst, dm, dy, mnd, mxd, s, mn, mns)),
            years = header.find('.ui-datepicker-year');

        // reverse the years
        years.html(Array.prototype.reverse.apply(years.children()));

        // return our new html
        return $('<div />').append(header).html();
    }*/
    let targets = document.querySelectorAll(targetSelector);
    targets.forEach((target, index) => {
        let $target = $(target);
        $target.datepicker({
            dateFormat: `yy${separator}mm${separator}dd` //달력 날짜 형태
            ,showOtherMonths: false //빈 공간에 현재월의 앞뒤월의 날짜를 표시
            ,showMonthAfterYear:true // 월- 년 순서가아닌 년도 - 월 순서
            ,showButtonPanel: true
            ,changeYear: true //option값 년 선택 가능
            ,changeMonth: true //option값  월 선택 가능
            ,buttonImage: "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif" //버튼 이미지 경로
            ,buttonImageOnly: true //버튼 이미지만 깔끔하게 보이게함
            ,buttonText: "선택" //버튼 호버 텍스트
            ,yearSuffix: "년" //달력의 년도 부분 뒤 텍스트
            ,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 텍스트
            ,monthNames: ['1','2','3','4','5','6','7','8','9','10','11','12'] //달력의 월 부분 Tooltip
            ,dayNamesMin: ['SUN','MON','TUE','WED','THU','FRI','SAT'] //달력의 요일 텍스트
            ,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 Tooltip
            ,yearRange: `${currentYear - 50}:${currentYear + maxYear*1}`
            ,minDate: "-50y" //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
            ,maxDate: `${maxYear}y` //최대 선택일자(+1D:하루후, -1M:한달후, -1Y:일년후)
            ,closeText: 'clear'
            ,onClose: function(dateText, inst) {
                if ($(window.event.srcElement).hasClass('ui-datepicker-close')){
                    $target.datepicker();
                    $target.val('');
                }
            }
        });
    });
}

function isMonthDifference(date1, date2, type) {
    //type == true -> start,end
    //type == false -> end,start
    // 두 날짜를 비교하여 큰 날짜와 작은 날짜를 결정

    if((type == true && date1.getTime() > date2.getTime()) || (type == false && date1.getTime() < date2.getTime())){
        return true;
    }

    const largerDate = date1.getTime() > date2.getTime() ? date1 : date2;
    const smallerDate = date1.getTime() < date2.getTime() ? date1 : date2;

    // 두 날짜의 연도, 월, 일을 가져옵니다.
    const largerYear = largerDate.getFullYear();
    const largerMonth = largerDate.getMonth();
    const largerDay = largerDate.getDate();

    const smallerYear = smallerDate.getFullYear();
    const smallerMonth = smallerDate.getMonth();
    const smallerDay = smallerDate.getDate();

    // 윤년을 확인하여 2월의 일 수를 결정합니다.
    const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const daysInFebruary = isLeapYear(largerYear) ? 29 : 28;

    // 각 월의 일 수를 정의합니다.
    const daysInMonth = [31, daysInFebruary, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // 큰 날짜와 작은 날짜 간의 연도 차이를 계산합니다.
    const yearDiff = largerYear - smallerYear;

    // 큰 날짜와 작은 날짜의 총 일 수를 계산합니다.
    const largerTotalDays = largerDay + (largerMonth * 30) + (largerYear * 365);
    const smallerTotalDays = smallerDay + (smallerMonth * 30) + (smallerYear * 365);

    // 두 날짜의 차이를 계산합니다.
    const totalDifference = largerTotalDays - smallerTotalDays;

    // 한 달보다 큰 차이인지 확인합니다.
    return totalDifference >= daysInMonth[smallerMonth];
}

/**
 * 3분 카운트 다운
 */
let count3Interval = null;
function startCountdown3Minute(target_element, end_func) {
    if (count3Interval != null)
        clearInterval(count3Interval)

    let countdownElement = $(target_element)[0];
    let remainingTime = 180; // 3분을 초로 변환 (60초 * 3분)

    count3Interval = setInterval(function() {
        remainingTime--;

        let minutes = Math.floor(remainingTime / 60);
        let seconds = remainingTime % 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        countdownElement.textContent = minutes + ":" + seconds;

        if (remainingTime <= 0) {
            clearInterval(count3Interval);
            countdownElement.textContent = "00:00";
            if (end_func != null) {
                end_func();
            }
        }
    }, 1000); // 1초마다 실행
}
function clearCount3Interval() {
    if (count3Interval != null) {
        clearInterval(count3Interval);
        count3Interval = null;
    }
}


// 날짜 텍스트 날짜 객체로 변경
function dateTextToDateObj(dateText, dayOfWeekLong = true) {
    let date = null;
    if (dateText != null && dateText.length > 0)
        date = new Date(dateText);
    if (date == null)
        return null;

    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    return {
        'year': date.getFullYear(),
        'month': date.getMonth() + 1,
        'day': date.getDate(),
        'dayOfWeek': dayOfWeekLong ? `${dayOfWeek[date.getDay()]}요일` : dayOfWeek[date.getDay()],
    };
}

// 날짜 차이를 (일 시 분 초) 형태로
function dateDifference(date1, date2) {
    let diff = null;
    let date1Time = date1.getTime();
    let date2Time = date2.getTime();

    if (date1Time > date2Time)
        diff = Math.abs(date1Time - date2Time);
    else
        diff = Math.abs(date2Time - date1Time);
    let amountSeconds = Math.floor(diff/1000); // 초로 얼마남았는지 반환

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    let hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    let minute = Math.floor(diff / (1000 * 60));
    diff -= minute * (1000 * 60);

    let seconds = Math.floor(diff / 1000);

    return {
        'day': days,
        'hour': hours,
        'minute': minute,
        'seconds': seconds,
        'diff': amountSeconds,
    };
}
// 초를 (일 시 분 초) 형태로
function secondsToTime(seconds) {
    if (seconds === 0)
        return {
            'day': 0,
            'hour': 0,
            'minute': 0,
            'seconds': 0,
            'end': true,
        };

    let days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * 24 * 60 * 60;

    let hours = Math.floor(seconds / (60*60));
    seconds -= hours * 60 * 60;

    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    return {
        'day': days,
        'hour': hours,
        'minute': minutes,
        'seconds': seconds,
        'end': false,
    };
}

function groupingBy(array, key) {
    return array.reduce((result, currentValue) => {
        const groupKey = currentValue[key];

        if (!result[groupKey])
            result[groupKey] = [];

        result[groupKey].push(currentValue);

        return result;
    }, {});
}

function displayShow(target) {
    if (target == null)
        return;

    if (typeof target === 'string')
        target = document.querySelectorAll(target);

    if (target.length == null)
        target.style.removeProperty('display');
    else
        target.forEach(it => it.style.removeProperty('display'));
}
function displayBlock(target) {
    if (target == null)
        return;

    if (typeof target === 'string')
        target = document.querySelectorAll(target);

    if (target.length == null)
        target.style.display = 'block';
    else
        target.forEach(it => it.style.display = 'block');
}


function displayNone(target) {
    if (target == null)
        return;

    if (typeof target === 'string')
        target = document.querySelectorAll(target);

    if (target.length == null)
        target.style.display = 'none';
    else
        target.forEach(it => it.style.display = 'none');
}



// formData안에 object 값 넣기
function objectToFormData(
    obj,
    formData = new FormData(), parentKey = ''
) {
    if (obj === null || obj === undefined) return formData;

    const isPrimitive = v =>
        v === null ||
        typeof v === 'string' ||
        typeof v === 'number' ||
        typeof v === 'boolean';

    if (obj instanceof Date) {
        formData.append(parentKey, obj.toISOString());
        return formData;
    }

    if (obj instanceof File || obj instanceof Blob) {
        formData.append(parentKey, obj);
        return formData;
    }

    if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
            // 배열은 대괄호 인덱싱 유지
            const pk = parentKey ? `${parentKey}[${index}]` : `[${index}]`;
            objectToFormData(item, formData, pk);
        });
        return formData;
    }

    if (typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
            // 객체 필드는 점 표기
            const pk = parentKey ? `${parentKey}.${key}` : key;
            const value = obj[key];

            if (value instanceof Date) {
                formData.append(pk, value.toISOString());
            } else if (value instanceof File || value instanceof Blob) {
                formData.append(pk, value);
            } else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                objectToFormData(value, formData, pk);
            } else if (value !== undefined) {
                formData.append(pk, value);
            }
        });
        return formData;
    }

    if (isPrimitive(obj) && parentKey) {
        formData.append(parentKey, obj);
    }
    return formData;
}
/*function objectToFormData(
    obj,
    formData = new FormData(),
    parentKey = ''
) {
    if (obj === null || obj === undefined) return formData;

    Object.keys(obj).forEach(key => {
        let fullKey = isNotEmpty(parentKey) ? `${parentKey}[${key}]` : key;
        let value = obj[key];

        if (value instanceof Date) {
            // 날짜 타입 처리 (ISO 형식으로 변환)
            formData.append(fullKey, value.toISOString());
        } else if (value instanceof File || value instanceof Blob) {
            // 파일 객체 직접 추가
            formData.append(fullKey, value);
        } else if (Array.isArray(value)) {
            // 배열 처리 (key[] 형식 사용)
            value.forEach((item, index) => {
                objectToFormData({ [`${key}[${index}]`]: item }, formData, parentKey);
            });
        } else if (typeof value === 'object' && value !== null) {
            // 중첩된 객체 처리 (재귀 호출)
            objectToFormData(value, formData, fullKey);
        } else {
            // 기본 타입 (string, number, boolean 등)
            formData.append(fullKey, value);
        }
    });

    return formData;
}*/

// 폼데이터 안에 데이터 뭐 들어가있는지 보기
function checkFormData(
    formData
) {
    for (let pair of formData.entries()) {
        console.log(pair[0], ":", pair[1]);
    }
}


function buildUuid() {
    if (crypto.randomUUID)
        return crypto.randomUUID()
            .replace(/-/g, '');

    // fallback (UUID v4)
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
    return uuid.replace(/-/g, '');
}

async function forceDownload(url, filename) {
    const res = await fetch(url); // 공개 파일 → credentials 불필요
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename || guessNameFromUrl(url) || 'download';
    a.rel = 'noopener'; // 보안 강화
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

function guessNameFromUrl(url) {
    try {
        const u = new URL(url, location.href);
        return (u.pathname.split('/').pop() || '').split('?')[0];
    } catch {
        return (url.split('/').pop() || '').split('?')[0];
    }
}

// 웹뷰에 채널통신 걸기
function channelFunc(
    methodName,
    funcObj,
) {
    if (funcObj == null)
        funcObj = {};
    funcObj.method = methodName;

    try {
        channel.postMessage(JSON.stringify(funcObj));
        return true;
    } catch (ignore) {
        console.warn(`channel method [${funcObj?.method}] - error`);
        console.warn(ignore);
        return false;
    }
}
function channelNewTab(
    url
) {
    if (isEmpty(url)) {
        console.warn('channelNewTab - url 비어있음');
        return;
    }


    try {
        channel.postMessage(JSON.stringify({
            method: 'newTab',
            url: url
        }));
        console.log('channelNewTab - 폰에서 newTab됬음');
    } catch (e) {
        console.log('channelNewTab - 웹에서 newTab됬음');
        newTab(url);
    }
}
function channelTel(
    tel
) {
    try {
        channel.postMessage(JSON.stringify({
            method: 'callTel',
            tel: tel
        }));
    } catch (e) {
        const a = document.createElement('a');
        a.setAttribute('href', `tel:${tel}`);
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
}


function buildErrorText(
    e
) {
    let json = '';
    try {
        if (e.responseJSON != null)
            json = JSON.stringify(e.responseJSON);
    } catch (ignore) {}

    let msg = `status=[${e.status}]\n`;
    msg += `statusText=[${e.statusText}]\n`;
    msg += `responseText=[${e.responseText}]\n`;
    msg += `responseJSON=[${json}]\n\n`;

    msg += `name:[${e.name}]\n`;
    msg += `message:[${e.message}]\n`;
    msg += `stack:[${e.stack}]`;
    return msg;
}