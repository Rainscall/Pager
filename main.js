const clock = document.getElementById('clock');
const searchInput = document.getElementById('searchInput');
const searchEngine = {
    "google": "https://www.google.com/search?q=",
    "bing": "https://www.bing.com/search?q=",
    "yandex": "https://yandex.com/search/?text=",
    "baidu": "https://www.baidu.com/s?ie=utf-8&wd=",
    "sogou": "https://www.sogou.com/web?query=",
    "yahoo": "https://search.yahoo.com/search?p=",
    "magi": "https://magi.com/search?q=",
    "aol": "https://search.aol.com/aol/search?q=",
    "ask": "https://www.ask.com/web?q=",
    "ecosia": "https://www.ecosia.org/search?method=index&q=",
    "naver": "https://search.naver.com/search.naver?query=",
    "DDG": "https://duckduckgo.com/?t=h_&q=",
    "searx": "https://searx.thegpm.org/?q=",
    "page": "https://www.startpage.com/sp/search?query="
};
const basePart = document.getElementById('basePart');
const selectSearchEngine = document.getElementById('selectSearchEngine');

for (var i = 0; i < Object.keys(searchEngine).length; i++) {
    let optionElement = document.createElement('option');
    optionElement.innerText = Object.keys(searchEngine)[i];
    selectSearchEngine.appendChild(optionElement);
}

lastTimeUsedEngine = localStorage.getItem('lastTimeUsedEngine');
if (lastTimeUsedEngine) {
    selectSearchEngine.value = lastTimeUsedEngine;
}

(() => {
    const backgroundImage = localStorage.getItem('background.image');
    if (backgroundImage) {
        clock.style.color = "#FFF";
        basePart.style.backgroundImage = 'radial-gradient(circle, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.34) 100%)';
        document.body.style.backgroundImage = 'url(\'' + backgroundImage + '\')';
    }
})();

(() => {
    if (!localStorage.getItem('lastTimeUsedEngine')) {
        fetch('https://api.ipdata.co/?api-key=fb9dfde35d54ee96cbb2abfa8a573182071cf91c14bc89dc7248a6c5')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            }).then(response => {
                if (response.country_code == 'CN') {
                    selectSearchEngine.value = 'bing';
                    Toastify({
                        text: "In China, Bing is a better choice.",
                        duration: 2500,
                        className: "info",
                        position: "center",
                        gravity: "top",
                        style: {
                            color: "#FFF",
                            background: "#414141",
                            borderRadius: "8px",
                            boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.217), 0 10px 36px -4px rgba(98, 98, 98, 0.171)"
                        }
                    }).showToast();
                    localStorage.setItem('lastTimeUsedEngine', 'bing');
                }
            })
    }
})();

function search() {
    const historyEnabled = localStorage.getItem('historyEnabled');
    selectedEngine = selectSearchEngine.value;
    localStorage.setItem('lastTimeUsedEngine', selectedEngine);
    let history = JSON.parse(localStorage.getItem('history'));
    if (!history) {
        history = {};
    }
    if (!searchInput.value) {
        return;
    }
    if (searchInput.value.startsWith('https://') || searchInput.value.startsWith('http://')) {
        window.open(searchInput.value);
        searchInput.value = '';
    } else {
        if (historyEnabled == 'true') {
            let newHistory = searchInput.value.substring(0, 15);
            if (newHistory.length == 15) {
                newHistory += '...';
            }
            newHistory = getCurrentTimestamp() + '.' + newHistory;
            history[newHistory] = String(searchInput.value);
            localStorage.setItem('history', JSON.stringify(history));
            if (document.getElementById('historyArea')) {
                closeOverlay('historyArea');
                hasHistoryArea = false;
            }
            openHistoryPage();
        }

        window.open(searchEngine[selectedEngine] + encodeURIComponent(searchInput.value));
        searchInput.value = '';
    }
}

function closeOverlay(elementID) {
    const element = document.getElementById(elementID);
    element.parentNode.removeChild(element);
}

function randomString(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

function createWarningWindow(headingText, infoText, closeButtomText, bgColor, fColor, showCloseButtom) {
    let base = document.createElement('div');
    let child = document.createElement('div');
    let heading = document.createElement('h1');
    let info = document.createElement('p');
    let closeButtom = document.createElement('div');
    const baseID = 'warningInfo-' + randomString(8);

    if (!closeButtomText) {
        closeButtomText = 'close';
    }

    if (!bgColor) {
        bgColor = '#efe40c'
    }

    if (!fColor) {
        fColor = '#000'
    }

    if (showCloseButtom == null) {
        showCloseButtom = true;
    }

    base.id = baseID;
    base.className = 'basePart warningWindow';
    base.style.color = fColor;
    base.style.position = 'fixed';
    base.style.height = '100vh';
    base.style.zIndex = '9000';
    base.style.backgroundColor = bgColor;
    heading.innerText = headingText;
    info.innerHTML = infoText;

    child.className = 'childPart';
    child.prepend(heading);
    child.appendChild(info);

    if (showCloseButtom === true) {
        closeButtom.setAttribute("onclick", "closeOverlay(\"" + baseID + "\");");
        closeButtom.className = 'closeButtom';
        closeButtom.innerText = closeButtomText;
        child.appendChild(closeButtom);
    }

    base.appendChild(child);
    document.body.prepend(base);
}

(() => {
    const searchInputArea = document.getElementById('searchInputArea');
    searchInputArea.addEventListener('click', (e) => {
        var target = e.target;
        //判断点击的是父元素而不是下面的子元素
        if (!(searchInputArea.contains(target) && target != searchInputArea)) {
            focusToID('searchInput');
        }
    })
})();

(() => {
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey) {
            if (event.key === 's' || event.key === 'S') {
                event.preventDefault();
                if (hasSettingPage === true) {
                    closeOverlay(settingPageId);
                    hasSettingPage = false;
                } else {
                    openSettingPage();
                }
            }
        };
        if (event.code === 'Escape') {
            if (hasSettingPage === true) {
                closeOverlay(settingPageId);
                hasSettingPage = false;
            }
        };
        if (event.key === '/') {
            if (searchInput != document.activeElement) {
                event.preventDefault();
                focusToID('searchInput');
            }
        }
    });

    searchInput.addEventListener('focus', () => {
        openTranslatePage();
        openHistoryPage();
    });


    document.addEventListener('click', (e) => {
        const searchArea = document.getElementById('searchArea');
        var target = e.target;
        if (!(searchArea.contains(target) && target != searchArea)) {
            if (document.getElementById('historyArea')) {
                closeOverlay('historyArea');
                hasHistoryArea = false;
            }
            if (document.getElementById('translateArea')) {
                closeOverlay('translateArea');
                hasTranslateArea = false;
            }
        }
    });

    searchInput.addEventListener('input', function () {
        if (document.getElementById('translateArea')) {
            closeOverlay('translateArea');
            hasTranslateArea = false;
        }
        openTranslatePage();
    });
})();

let settingPageId = '';
let hasSettingPage = false;
function openSettingPage() {
    if (hasSettingPage) {
        return;
    }
    let historyEnabled = localStorage.getItem('historyEnabled');
    let translateEnabled = localStorage.getItem('translateEnabled');
    let base = document.createElement('div');
    let child = document.createElement('div');
    let heading = document.createElement('h1');
    let closeButtom = document.createElement('div');
    let backgroundBar = document.createElement('div');
    let setBackground = document.createElement('div');
    let setBackgroundFromBing = document.createElement('div');
    let setBackgroundFromBingBar = document.createElement('div');
    let enableHistory = document.createElement('div');
    let enableHistoryBar = document.createElement('div');
    let enableTranslate = document.createElement('div');
    let enableTranslateBar = document.createElement('div');
    let resetBackground = document.createElement('div');
    let fileInput = document.createElement('input')
    const baseID = 'settingPage-' + randomString(8);
    const fileInputId = 'settingPage-fileInput-' + randomString(8);

    base.id = baseID;
    base.className = 'basePart warningWindow';
    base.style.color = '#000';
    base.style.position = 'fixed';
    base.style.height = '100vh';
    base.style.zIndex = '9000';
    base.style.backgroundColor = 'rgb(161 161 161 / 17%)';
    base.style.backdropFilter = 'blur(8px)';
    heading.innerText = 'Settings';

    fileInput.type = 'file';
    fileInput.id = fileInputId;
    fileInput.accept = "image/*";
    fileInput.setAttribute('onchange', 'changeBackground(\'' + fileInputId + '\');');
    fileInput.style.display = 'none';

    backgroundBar.className = 'backgroundBar';
    setBackgroundFromBingBar.className = 'backgroundBar';

    resetBackground.innerText = 'reset';
    resetBackground.className = 'resetBackground';
    resetBackground.setAttribute('onclick', 'resetBackground();');

    setBackground.innerText = 'select background';
    setBackground.className = 'setBackground';
    setBackground.setAttribute('onclick', 'fakeSelectFile(\'' + fileInputId + '\');');

    backgroundBar.appendChild(resetBackground);
    backgroundBar.appendChild(setBackground);

    setBackgroundFromBing.innerText = 'get background from bing';
    setBackgroundFromBing.className = 'setBackground';
    setBackgroundFromBing.style.width = '100%';
    setBackgroundFromBing.setAttribute('onclick', 'setBingImage();');

    setBackgroundFromBingBar.appendChild(setBackgroundFromBing);

    if (historyEnabled == 'true') {
        enableHistory.innerText = 'disable history';
    } else {
        enableHistory.innerText = 'enable history';
    }
    enableHistory.className = 'enableSwitch';
    enableHistory.style.width = '100%';
    enableHistory.setAttribute('onclick', 'enableHistory();');
    enableHistory.id = 'enableHistory';

    enableHistoryBar.className = 'backgroundBar';
    enableHistoryBar.appendChild(enableHistory);


    if (translateEnabled == 'true') {
        enableTranslate.innerText = 'disable translate';
    } else {
        enableTranslate.innerText = 'enable translate';
    }
    enableTranslate.className = 'enableSwitch';
    enableTranslate.style.width = '100%';
    enableTranslate.setAttribute('onclick', 'enableTranslate();');
    enableTranslate.id = 'enableTranslate';

    enableTranslateBar.className = 'backgroundBar';
    enableTranslateBar.appendChild(enableTranslate);

    child.className = 'childPart';
    child.prepend(heading);
    child.appendChild(document.createElement('hr'));
    child.appendChild(backgroundBar);
    child.appendChild(setBackgroundFromBingBar);
    child.appendChild(document.createElement('hr'));
    child.appendChild(enableHistoryBar);
    child.appendChild(enableTranslateBar);

    closeButtom.setAttribute("onclick", "closeOverlay(\"" + baseID + "\");hasSettingPage=false;");
    closeButtom.className = 'closeButtom';
    closeButtom.innerText = 'close';
    closeButtom.style.backdropFilter = 'blur(30px);';
    closeButtom.style.backgroundColor = '#ffffff8a';
    closeButtom.style.paddingRight = '0';
    closeButtom.style.paddingLeft = '0';
    child.appendChild(fileInput);

    child.appendChild(document.createElement('hr'));
    child.appendChild(closeButtom);
    base.appendChild(child);
    document.body.prepend(base);
    hasSettingPage = true;
    settingPageId = baseID;
}

function resetBackground() {
    localStorage.removeItem('background.image');
    localStorage.removeItem('background.bing');
    localStorage.removeItem('background.lastBing');
    clock.style.color = "#000";
    document.body.style.backgroundImage = '';
    basePart.style.backgroundImage = '';
    Toastify({
        text: "Background reset",
        duration: 2000,
        className: "info",
        position: "center",
        gravity: "top",
        style: {
            background: "#414141",
            borderRadius: "8px",
            boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.217), 0 10px 36px -4px rgba(98, 98, 98, 0.171)",
            textAlign: "center"
        }
    }).showToast();
}

function fakeSelectFile(fileInputId) {
    document.getElementById(fileInputId).click();
}

function changeBackground(fileInputId) {
    const reader = new FileReader();
    const fileInput = document.getElementById(fileInputId);
    file = fileInput.files[0];
    if (file.size > 1024 * 1024 * 2.5) {
        Toastify({
            text: "Image is too big.\nMax:2.5m",
            duration: 2000,
            className: "info",
            position: "center",
            gravity: "bottom",
            style: {
                background: "#414141",
                borderRadius: "8px",
                boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.217), 0 10px 36px -4px rgba(98, 98, 98, 0.171)",
                textAlign: "center"
            }
        }).showToast();
        fileInput.files = void 0;
        return;
    }
    localStorage.removeItem('background.image');
    localStorage.removeItem('background.bing');
    localStorage.removeItem('background.lastBing');
    reader.readAsDataURL(file);
    reader.onload = () => {
        const backgroundImage = reader.result;
        document.body.style.backgroundImage = 'url(\'' + backgroundImage + '\')';
        clock.style.color = "#FFF";
        basePart.style.backgroundImage = 'radial-gradient(circle, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.34) 100%)';
        localStorage.setItem('background.image', backgroundImage);
    }
    fileInput.files = void 0;
}

function focusToID(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.focus();
    } else {
        console.error("Element with ID '" + elementId + "' not found.");
    }
}

(() => {
    const clock = document.getElementById('clock');
    clock.addEventListener('click', () => {
        enableClock()
    });

    function enableClock() {
        let clockEnabled = localStorage.getItem('clockEnabled');
        if (!clockEnabled || clockEnabled == 'false') {
            localStorage.setItem('clockEnabled', true);
            writeToClock();
            clockCycle('start');
        } else {
            localStorage.setItem('clockEnabled', false);
            clockCycle('remove');
            const clock = document.getElementById('clock');
            clock.innerText = 'Pager';
        }
    }

    let ClockInterval;
    function clockCycle(action) {
        if (action == 'remove') {
            clearInterval(ClockInterval);
            return;
        }
        ClockInterval = setInterval(writeToClock, 1000);
    }

    function getRealTime() {
        time = new Date();
        hour = String(time.getHours());
        minute = String(time.getMinutes())
        if (minute.length != 2) {
            minute = '0' + minute;
        }
        return (hour + ':' + minute);
    }

    function writeToClock() {
        const clock = document.getElementById('clock');
        clock.innerText = getRealTime();
    }

    let clockEnabled = localStorage.getItem('clockEnabled');
    if (clockEnabled == 'true') {
        localStorage.setItem('clockEnabled', true);
        writeToClock();
        clockCycle('start');
    }
})();

async function setBingImage() {
    try {
        Toastify({
            text: "Loading...",
            duration: 2500,
            className: "info",
            position: "center",
            gravity: "top",
            style: {
                color: "#FFF",
                background: "#414141",
                borderRadius: "8px",
                boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.217), 0 10px 36px -4px rgba(98, 98, 98, 0.171)"
            }
        }).showToast();
        const bingResponse = await fetch('https://bing.biturl.top/?resolution=3840&format=json&index=0&mkt=en-US');
        const bingData = await bingResponse.json();
        localStorage.setItem('background.lastBing', bingData.end_date);

        const imageResponse = await fetch(bingData.url);
        const blob = await imageResponse.blob();

        const base64data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => resolve(reader.result);
        });

        localStorage.setItem('background.image', base64data);
        localStorage.setItem('background.bing', true);
        basePart.style.backgroundImage = 'radial-gradient(circle, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.34) 100%)';
        document.body.style.backgroundImage = `url('${base64data}')`;
        clock.style.color = "#FFF";
    } catch (error) {
        Toastify({
            text: 'Error fetching or processing data:\n' + error,
            duration: 2500,
            className: "info",
            position: "center",
            gravity: "top",
            style: {
                color: "#FFF",
                background: "#840D23",
                borderRadius: "8px",
                boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.217), 0 10px 36px -4px rgba(98, 98, 98, 0.171)"
            }
        }).showToast();
        console.error('Error fetching or processing data:', error);
    }
}

function getCurrentTime() {
    let currentDate = new Date();
    function getStrMonth() {
        let Month = String(Number(currentDate.getMonth()) + 1);
        if (Month.length != 2) {
            Month = '0' + Month;
        }
        return Month;
    }
    function getStrDate() {
        let day = String(currentDate.getDate());
        if (day.length != 2) {
            day = '0' + day;
        }
        return day;
    }
    return currentDate.getFullYear() + getStrMonth() + getStrDate();
}

//启用必应图片后自动更新
let usingBing = localStorage.getItem('background.bing') != null;
let lastBing = localStorage.getItem('background.lastBing');
if (usingBing === true && (Number(getCurrentTime()) > Number(lastBing))) {
    setBingImage();
}

let hasHistoryArea = false;
function openHistoryPage() {
    if (localStorage.getItem('historyEnabled') != 'true') {
        return;
    }
    if (hasHistoryArea === true) {
        return;
    }
    const searchArea = document.getElementById('searchArea');
    let history = JSON.parse(localStorage.getItem('history'));
    if (!history) {
        return;
    }

    let base = document.createElement('div');
    let child = document.createElement('div');
    const baseID = 'historyArea';

    let key = Object.keys(history);

    if (key.length > 5) {
        let timesToDelete = key.length - 5;
        for (let i = 0; i < timesToDelete; i++) {
            delete history[key[i]];
            localStorage.setItem('history', JSON.stringify(history));
        }
        history = JSON.parse(localStorage.getItem('history'));
        key = Object.keys(history);
    }

    for (let i = key.length - 1; i >= 0; i--) {//使历史记录倒着输出，看起来就是后搜索的靠前
        let historyTime = document.createElement('span');
        let historyData = document.createElement('div');
        let displayKey = key[i].split('.', 2);
        if (displayKey[1].length == 15) {
            displayKey[1] += '...';
        }
        historyData.innerHTML = displayKey[1];
        historyData.dataset.historyData = history[key[i]];
        historyData.id = 'history-' + history[key[i]] + '-' + randomString(8);
        historyData.setAttribute("onclick", "fillInto(\"searchInput\",\"" + history[key[i]] + "\");focusToID(\'searchInput\');");
        historyTime.innerHTML = getRealTimeFromTimeStamp(displayKey[0]);
        historyData.appendChild(historyTime);
        child.appendChild(historyData);
    }

    base.appendChild(child);
    base.id = baseID;
    base.className = 'historyArea greyBackground';
    searchArea.appendChild(base);
    hasHistoryArea = true;
}

let hasTranslateArea = false;
function openTranslatePage() {
    const searchInput = document.getElementById('searchInput');

    if (!searchInput.value) {
        return;
    }
    if (localStorage.getItem('translateEnabled') != 'true') {
        return;
    }
    if (hasTranslateArea === true) {
        return;
    }

    const searchInputArea = document.getElementById('searchInputArea');
    let base = document.createElement('div');
    let child = document.createElement('div');
    let displayText = document.createElement('span');
    const baseID = 'translateArea';

    let infoText = document.createElement('span');
    let translateData = document.createElement('div');
    displayText.innerHTML = searchInput.value;
    displayText.className = 'translateText';
    translateData.setAttribute("onclick", `goToTranslate(\'${searchInput.value}\');`);
    infoText.innerHTML = 'Translate';
    translateData.appendChild(displayText);
    translateData.appendChild(infoText);
    child.appendChild(translateData);

    base.appendChild(child);
    base.id = baseID;
    base.className = 'historyArea greyBackground';
    insertAfter(base, searchInputArea);
    hasTranslateArea = true;
}

function goToTranslate(text) {
    const url = 'https://www.bing.com/translator?text=' + encodeURIComponent(text);
    window.open(url);
    searchInput.value = '';
    closeOverlay('translateArea');
    hasTranslateArea = false;
}

function insertAfter(newNode, curNode) {
    curNode.parentNode.insertBefore(newNode, curNode.nextElementSibling);
}

function getRealTimeFromTimeStamp(timestamp) {
    if (!timestamp) {
        return;
    }
    timestamp = Number(timestamp);
    // 创建一个 Date 对象，传入时间戳
    const date = new Date(timestamp);

    // 获取年、月、日、时、分的值
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // 拼接成"YYYY-MM-DD HH:MM"格式的字符串
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;

    return formattedTime;
}

function getCurrentTimestamp() {
    // 使用 Date 对象获取当前时间的毫秒数
    return new Date().getTime();
}

function fillInto(elementID, value) {
    const element = document.getElementById(elementID);
    element.value = value;
}

if (!localStorage.getItem('historyEnabled')) {
    localStorage.setItem('historyEnabled', 'false');
}
function enableHistory() {
    let enabled = localStorage.getItem('historyEnabled');
    const enableHistory = document.getElementById('enableHistory');
    if (enabled == 'false') {
        enableHistory.innerText = 'disable history';
        localStorage.setItem('historyEnabled', 'true');
    } else {
        enableHistory.innerText = 'enable history';
        localStorage.setItem('historyEnabled', 'false');
        localStorage.removeItem('history');
    }
}

if (!localStorage.getItem('translateEnabled')) {
    localStorage.setItem('translateEnabled', 'true');
}
function enableTranslate() {
    let enabled = localStorage.getItem('translateEnabled');
    const enableTranslate = document.getElementById('enableTranslate');
    if (enabled == 'false') {
        enableTranslate.innerText = 'disable translate';
        localStorage.setItem('translateEnabled', 'true');
    } else {
        enableTranslate.innerText = 'enable translate';
        localStorage.setItem('translateEnabled', 'false');
    }
}