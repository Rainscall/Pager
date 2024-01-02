"use strict"
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
const searchEngineDisplay = document.querySelector('#searchInputArea > div.searchEngine > span');

let currentSearchEngine = '';
let lastTimeUsedEngine = localStorage.getItem('lastTimeUsedEngine');
if (lastTimeUsedEngine) {
    searchEngineDisplay.innerText = lastTimeUsedEngine;
    currentSearchEngine = lastTimeUsedEngine;
}

searchEngineDisplay.addEventListener('click', (e) => {
    openSearchEngineSelector();
})

function changeSearchEngine(engine) {
    if (!searchEngine[engine]) {
        throw new Error('No such search engine');
    }
    currentSearchEngine = engine;
    searchEngineDisplay.innerText = engine;
    localStorage.setItem('lastTimeUsedEngine', engine);
    if (hasSearchEngineSelector === true) {
        openSearchEngineSelector();
    }
}

let hasSearchEngineSelector = false;
function openSearchEngineSelector() {
    if (hasSearchEngineSelector === true) {
        closeOverlay('searchEngineSelector');
        hasSearchEngineSelector = false;
        return;
    }
    const selectSearchEngineArea = document.getElementsByClassName('searchEngine')[0];
    let base = document.createElement('div');
    let item = document.createElement('div');
    base.className = 'searchEngineSelector';
    base.id = 'searchEngineSelector';

    for (let i = 0; i < Object.keys(searchEngine).length; i++) {
        let child = document.createElement('div');
        child.innerText = Object.keys(searchEngine)[i];
        child.dataset.engine = Object.keys(searchEngine)[i];
        child.addEventListener('click', (e) => {
            changeSearchEngine(Object.keys(searchEngine)[i]);
        });
        item.appendChild(child);
    }

    base.appendChild(item);
    selectSearchEngineArea.appendChild(base);
    hasSearchEngineSelector = true;
}

fetch('https://api.ipdata.co/?api-key=fb9dfde35d54ee96cbb2abfa8a573182071cf91c14bc89dc7248a6c5')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(response => {
        sessionStorage.setItem('userArea', response.country_code);
        if (response.country_code == 'CN' && !localStorage.getItem('lastTimeUsedEngine')) {
            changeSearchEngine('bing');
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

function search() {
    const historyEnabled = localStorage.getItem('historyEnabled');
    const selectedEngine = currentSearchEngine;
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
    let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    let a = t.length;
    let n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
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
        let target = e.target;
        //判断点击的是父元素而不是下面的子元素
        if (!(searchInputArea.contains(target) && target != searchInputArea)) {
            focusToID('searchInput');
        }
    })
})();

(() => {
    let sugPosition = -1;
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey) {
            switch (event.key) {
                case 's': case 'S':
                    event.preventDefault();
                    if (hasMenuPage === true) {
                        closeOverlay(menuPageId);
                        hasMenuPage = false;
                    } else {
                        openMenuPage();
                    }
                    break;
                case 'm': case 'M':
                    if (hasNotePage === false) {
                        event.preventDefault();
                        openNotePage();
                    } else {
                        closeNotePage();
                    }
                    break;
            }
        };

        //使用上下方向键选择搜索建议的项
        if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && hasSuggestionPage === true) {
            event.preventDefault();
            const suggestionArea = document.getElementById('suggestionArea');
            let item = suggestionArea.childNodes[0].childNodes;
            let keyword = {};

            for (let i = 0; i < item.length; i++) {
                item[i].style.removeProperty("background-color");
                keyword[i] = item[i].dataset.keyword;
            }

            if (sugPosition > Object.keys(keyword).length - 1) {
                sugPosition = Object.keys(keyword).length - 1;
            }

            switch (event.key) {
                case 'ArrowUp':
                    if (sugPosition === -1) {
                        sugPosition = 0;
                        break;
                    }
                    if (sugPosition > 0) {
                        sugPosition -= 1;
                    } else {
                        sugPosition = Object.keys(keyword).length - 1;
                    }
                    break;
                case "ArrowDown":
                    if (sugPosition < Object.keys(keyword).length - 1) {
                        sugPosition += 1;
                    } else {
                        sugPosition = 0;
                    }
                    break;
            }

            item[sugPosition].style.backgroundColor = "#84848440";
            fillInto('searchInput', keyword[sugPosition]);
            searchInput.selectionStart = searchInput.value.length;
        }

        if (event.code === 'Escape') {
            if (hasMenuPage === true) {
                closeOverlay(menuPageId);
                hasMenuPage = false;
            }
            if (hasMenuPage === false) {
                searchInput.blur();
                if (document.getElementById('historyArea')) {
                    closeOverlay('historyArea');
                    hasHistoryArea = false;
                }
                if (document.getElementById('translateArea')) {
                    closeOverlay('translateArea');
                    hasTranslateArea = false;
                }
                if (document.getElementById('suggestionArea')) {
                    closeOverlay('suggestionArea');
                    hasSuggestionPage = false;
                }
            }
            if (hasNotePage === true) {
                closeNotePage();
            }
        };

        switch (event.key) {
            case '/':
                if (searchInput != document.activeElement && hasNotePage === false && hasModPage === false) {
                    event.preventDefault();
                    focusToID('searchInput');
                }
                break;
        }
    });

    searchInput.addEventListener('focus', () => {
        openTranslatePage();
        openHistoryPage();
    });

    document.addEventListener('click', (e) => {
        const searchArea = document.getElementById('searchArea');
        let target = e.target;
        if (!(searchArea.contains(target) && target != searchArea)) {
            if (document.getElementById('historyArea')) {
                closeOverlay('historyArea');
                hasHistoryArea = false;
            }
            if (document.getElementById('translateArea')) {
                closeOverlay('translateArea');
                hasTranslateArea = false;
            }
            if (document.getElementById('suggestionArea')) {
                closeOverlay('suggestionArea');
                hasSuggestionPage = false;
            }
            if (document.getElementById('searchEngineSelector')) {
                closeOverlay('searchEngineSelector');
                hasSearchEngineSelector = false;
            }
        }
    });

    searchInput.addEventListener('input', () => {
        if (document.getElementById('translateArea')) {
            closeOverlay('translateArea');
            hasTranslateArea = false;
        }
        openTranslatePage();
        getSuggestions();
    });

    basePart.oncontextmenu = (e) => {
        e.preventDefault();
    }

    basePart.addEventListener('mousedown', (e) => {
        if (e.isTrusted == false) {
            return;
        }

        const iconArea = document.getElementById('iconArea');
        if (iconArea != null && iconArea.contains(e.target)) {
            return;
        }

        if (e.button === 2 && e.target != clock && e.target != searchInput && !(footer.contains(e.target)) && hasNotePage === false) {
            changeToIconMode();
        }
    })

    let startPointX;
    let stopPointX;
    let startPointY;
    let stopPointY;
    let startTime;
    let stopTime;
    basePart.addEventListener("touchstart", (event) => {
        startPointX = event.changedTouches[0].clientX;
        startPointY = event.changedTouches[0].clientY;
        startTime = event.timeStamp;
    });

    basePart.addEventListener("touchend", (event) => {
        if (event.target == clock || searchInputArea.contains(event.target)) {
            return;
        }
        if (hasNotePage === true || hasSetUpPage === true) {
            return;
        }
        stopTime = event.timeStamp;
        stopPointX = event.changedTouches[0].clientX;
        stopPointY = event.changedTouches[0].clientY;
        if (Math.abs(startPointX - stopPointX) > Math.abs(startPointY - stopPointY)) {
            if (Math.abs(startPointX - stopPointX) > 100 && stopTime - startTime < 850) {
                changeToIconMode();
            }
        } else {
            if (startPointY - stopPointY > 100 && stopTime - startTime < 850) {
                openMenuPage();
            }
        }
    });
})();

let setUpInfo = {};
let hasSetUpPage = false;
function openStartUpPage() {
    if (hasSetUpPage === true) {
        return;
    }
    let base = document.createElement('div');
    let child = document.createElement('div');
    let heading = document.createElement('h2');
    let infoArea = document.createElement('div');
    let closeButtom = document.createElement('div');

    setUpInfo = {
        'realTimeClock': ['Real-time clock', 'enableClock', true],
        'bingBackground': ['Background from Bing', 'setBingImage', false]
    }

    for (let i = 0; i < Object.keys(setUpInfo).length; i++) {
        let base = document.createElement('div');
        let child = document.createElement('div');
        let item = document.createElement('div');
        let title = document.createElement('div');
        let status = document.createElement('div');

        base.className = 'setUpButtomBase';

        title.innerText = setUpInfo[Object.keys(setUpInfo)[i]][0];
        status.innerText = 'Disabled';

        item.dataset.enabled = 'false';
        item.dataset.function = [Object.keys(setUpInfo)[i]];

        if (setUpInfo[Object.keys(setUpInfo)[i]][2] === true) {
            item.dataset.enabled = 'true';
            status.innerText = 'Enabled';
            status.style.color = '#147114';
            setUpInfo[item.dataset.function][2] = true;
        }

        base.addEventListener('click', () => {
            if (item.dataset.enabled == 'true') {
                item.dataset.enabled = 'false';
                status.innerText = 'Disabled';
                status.style.removeProperty("color");
                setUpInfo[item.dataset.function][2] = false;
            } else {
                item.dataset.enabled = 'true';
                status.innerText = 'Enabled';
                status.style.color = '#147114';
                setUpInfo[item.dataset.function][2] = true;
            }
        })

        item.appendChild(title);
        item.appendChild(status);
        child.appendChild(item);
        base.appendChild(child);
        infoArea.appendChild(base);
    }

    heading.innerText = 'Set up your Pager';
    heading.style.display = 'block';
    heading.style.color = '#000';
    heading.style.marginTop = '1.5rem';
    heading.style.fontSize = '1.6rem';
    heading.style.userSelect = 'none';
    heading.style.textShadow = '0 0 2px #4b4b4b4c';

    closeButtom.setAttribute("onclick", `closeOverlay("setUpBase");hasStartUpPage=false;applySetUp();`);
    closeButtom.className = 'closeButtom';
    closeButtom.innerText = 'Confirm';
    closeButtom.style.backdropFilter = 'blur(30px);';
    closeButtom.style.backgroundColor = '#ffffff6b';
    closeButtom.style.paddingRight = '0';
    closeButtom.style.paddingLeft = '0';
    closeButtom.style.marginBottom = '1.5rem';

    child.appendChild(heading);
    child.appendChild(document.createElement('hr'));
    child.appendChild(infoArea);
    child.appendChild(document.createElement('hr'));
    child.appendChild(closeButtom);
    child.className = 'modIconChild';

    base.id = 'setUpBase';
    base.className = 'basePart setUpBase';

    base.appendChild(child);
    document.body.prepend(base);
    hasSetUpPage = true;
}

function applySetUp() {
    for (let i = 0; i < Object.keys(setUpInfo).length; i++) {
        if (setUpInfo[Object.keys(setUpInfo)[i]][2] == false) {
            continue;
        }
        eval(setUpInfo[Object.keys(setUpInfo)[i]][1] + '()');
    }
    localStorage.setItem('isNewUser', 'false');
}

const footer = document.getElementsByClassName('footer')[0];
const searchInputArea = document.getElementById('searchInputArea');
let isIconMode = false;
function changeToIconMode() {
    if (isIconMode === false) {
        let siteList = JSON.parse(localStorage.getItem('siteList'));
        if (!siteList) {
            siteList = {
                'Github': 'https://github.com',
                'Gmail': 'https://mail.google.com',
                'YouTube': 'https://www.youtube.com',
                'Map': "https://www.bing.com/maps",
                'noIcon.Localnote': 'https://localnote--labs.cyberrain.dev'
            }

            if (sessionStorage.getItem('userArea') === 'CN') {
                siteList = {
                    'Bilibili': 'https://www.bilibili.com',
                    'QQ Mail': 'https://mail.qq.com',
                    'QQ Music': 'https://y.qq.com',
                    'Map': 'https://map.baidu.com',
                    'noIcon.Localnote': 'https://localnote--labs.cyberrain.dev'
                }
            }
            localStorage.setItem('siteList', JSON.stringify(siteList));
        }

        searchInputArea.style.display = 'none';
        footer.style.display = 'none';

        let base = document.createElement('div');
        let child = document.createElement('div');
        base.id = 'iconArea';

        for (let i = 0; i < Object.keys(siteList).length; i++) {
            let item = document.createElement('div');
            let title = document.createElement('div');
            let ico = document.createElement('div');
            let img = document.createElement('img');
            let noIcon = false;

            if (Object.keys(siteList)[i].startsWith('noIcon.')) {
                noIcon = true;
            }

            let displayName = '';
            if (noIcon === true) {
                displayName = Object.keys(siteList)[i].split('.')[1];
            } else {
                displayName = Object.keys(siteList)[i];
            }

            item.dataset.key = Object.keys(siteList)[i];
            item.className = 'iconAreaItem';
            title.innerText = displayName;
            item.setAttribute("onclick", `javascript:window.open('${Object.values(siteList)[i]}')`);
            title.className = 'iconAreaTitle';

            if (noIcon === false) {
                img.src = `https://api--labs.cyberrain.dev/ico-picker?host=${Object.values(siteList)[i].split('/')[2]}&fallbackIcon=true`;
                ico.appendChild(img);
                ico.className = 'iconAreaIcon';
                item.appendChild(ico);
            }

            item.addEventListener('mousedown', (e) => {
                if (e.button === 2) {
                    let siteList = JSON.parse(localStorage.getItem('siteList'));
                    delete siteList[item.dataset.key];
                    localStorage.setItem('siteList', JSON.stringify(siteList));
                    changeToIconMode();
                }
            });

            let longPressTimer;
            item.addEventListener('touchstart', () => {
                longPressTimer = setTimeout(() => {
                    let siteList = JSON.parse(localStorage.getItem('siteList'));
                    delete siteList[item.dataset.key];
                    localStorage.setItem('siteList', JSON.stringify(siteList));
                    changeToIconMode();
                    changeToIconMode();
                }, 650);
            });

            item.addEventListener('touchend', () => {
                clearTimeout(longPressTimer);
            });

            item.appendChild(title);
            child.appendChild(item);
        }

        //加入一个新增书签的按钮
        let item = document.createElement('div');
        let title = document.createElement('div');

        item.className = 'iconAreaItem';
        title.innerText = '+';
        title.style.fontWeight = 'bold';
        title.className = 'iconAreaTitle';

        item.style.borderRadius = '50%';
        item.style.width = '1em';
        item.style.justifyContent = 'center';
        item.setAttribute('onclick', "modIcon()");

        item.appendChild(title);
        child.appendChild(item);
        //止

        base.className = 'iconArea';
        base.style.background = 'none';
        base.appendChild(child);
        insertAfter(base, searchInputArea);

        isIconMode = true;
    } else {
        closeOverlay('iconArea');
        searchInputArea.style.display = 'flex';
        footer.style.display = 'unset';

        isIconMode = false;
    }
}

let hasModPage = false;
function modIcon() {
    if (isIconMode === false) {
        changeToIconMode();
    }
    if (hasModPage === true) {
        return;
    }
    let base = document.createElement('div');
    let child = document.createElement('div');
    let heading = document.createElement('h2');
    let infoArea = document.createElement('div');
    let siteNameForm = document.createElement('form');
    let form = document.createElement('form');
    let siteName = document.createElement('input');
    let siteUrl = document.createElement('input');
    let closeButtom = document.createElement('div');

    heading.innerText = 'Add or edit site';
    heading.style.display = 'block';
    heading.style.color = '#fff';
    heading.style.marginTop = '1.5rem';
    heading.style.fontSize = '1.6rem';
    heading.style.userSelect = 'none';
    heading.style.textShadow = '0 0 2px #4b4b4b4c';

    siteName.type = 'text';
    siteName.required = 'true';
    siteName.placeholder = 'Site name';
    siteUrl.type = 'text';
    siteUrl.required = 'true';
    siteUrl.placeholder = 'URL with https://';

    siteNameForm.appendChild(siteName);
    siteNameForm.setAttribute('action', `javascript:void;`);

    form.setAttribute('action', 'javascript:addNewSite();');
    form.appendChild(siteUrl);

    infoArea.className = 'newSiteInfoArea';
    infoArea.appendChild(siteNameForm);
    infoArea.appendChild(form);

    closeButtom.setAttribute("onclick", "closeOverlay(\"modIconBase\");hasModPage=false;");
    closeButtom.className = 'closeButtom';
    closeButtom.innerText = 'close';
    closeButtom.style.backdropFilter = 'blur(30px);';
    closeButtom.style.backgroundColor = '#ffffffd0';
    closeButtom.style.paddingRight = '0';
    closeButtom.style.paddingLeft = '0';
    closeButtom.style.marginBottom = '1.5rem';

    child.appendChild(heading);
    child.appendChild(document.createElement('hr'));
    child.appendChild(infoArea);
    child.appendChild(document.createElement('hr'));
    child.appendChild(closeButtom);
    child.className = 'modIconChild';

    base.id = 'modIconBase';
    base.className = 'modIconBase basePart';

    base.appendChild(child);
    document.body.prepend(base);
    hasModPage = true;
}

function addNewSite() {
    const name = document.getElementsByClassName('newSiteInfoArea')[0].childNodes[0].childNodes[0].value;
    const url = document.getElementsByClassName('newSiteInfoArea')[0].childNodes[1].childNodes[0].value;

    let siteList = JSON.parse(localStorage.getItem('siteList'));
    siteList[name] = url;
    localStorage.setItem('siteList', JSON.stringify(siteList));
    closeOverlay("modIconBase");
    hasModPage = false;
    changeToIconMode();
    changeToIconMode();
}

let menuPageId = '';
let hasMenuPage = false;
function openMenuPage() {
    if (hasMenuPage) {
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
    let openNotePage = document.createElement('div');
    let openNotePageBar = document.createElement('div');
    let resetBackground = document.createElement('div');
    let fileInput = document.createElement('input');
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
    heading.innerText = 'Menu';
    if (hasBackground === true) {
        heading.style.color = '#fff';
    }

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
    enableHistory.setAttribute('onclick', 'enableFeature(\'history\');');
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
    enableTranslate.setAttribute('onclick', 'enableFeature(\'translate\');');
    enableTranslate.id = 'enableTranslate';

    enableTranslateBar.className = 'backgroundBar';
    enableTranslateBar.appendChild(enableTranslate);

    openNotePage.className = 'enableSwitch';
    openNotePage.innerText = 'notebook';
    openNotePage.style.width = '100%';
    openNotePage.setAttribute('onclick', "openNotePage();closeOverlay(\"" + baseID + "\");hasMenuPage=false;");

    openNotePageBar.className = 'backgroundBar';
    openNotePageBar.appendChild(openNotePage);

    child.className = 'childPart';
    child.prepend(heading);
    child.appendChild(document.createElement('hr'));
    child.appendChild(backgroundBar);
    child.appendChild(setBackgroundFromBingBar);
    child.appendChild(document.createElement('hr'));
    child.appendChild(enableHistoryBar);
    child.appendChild(enableTranslateBar);
    child.appendChild(document.createElement('hr'));
    child.appendChild(openNotePageBar);

    closeButtom.setAttribute("onclick", "closeOverlay(\"" + baseID + "\");hasMenuPage=false;");
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
    hasMenuPage = true;
    menuPageId = baseID;
}

function resetBackground() {
    localStorage.removeItem('background.image');
    localStorage.removeItem('background.bing');
    localStorage.removeItem('background.lastBing');
    clock.style.color = "#000";
    document.body.style.backgroundImage = '';
    basePart.style.backgroundImage = '';
    hasBackground = false;
}

function fakeSelectFile(fileInputId) {
    document.getElementById(fileInputId).click();
}

let hasBackground = false;
(() => {
    const backgroundImage = localStorage.getItem('background.image');
    if (backgroundImage) {
        clock.style.color = "#FFF";
        basePart.style.backgroundImage = 'radial-gradient(circle, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.34) 100%)';
        document.body.style.backgroundImage = 'url(\'' + backgroundImage + '\')';
        hasBackground = true;
    }
})();
function changeBackground(fileInputId) {
    const reader = new FileReader();
    const fileInput = document.getElementById(fileInputId);
    const file = fileInput.files[0];
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
    resetBackground();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const backgroundImage = reader.result;
        document.body.style.backgroundImage = 'url(\'' + backgroundImage + '\')';
        clock.style.color = "#FFF";
        basePart.style.backgroundImage = 'radial-gradient(circle, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.34) 100%)';
        localStorage.setItem('background.image', backgroundImage);
    }
    fileInput.files = void 0;
    hasBackground = true;
}

function focusToID(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.focus();
    } else {
        console.error("Element with ID '" + elementId + "' not found.");
    }
}

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
        clock.innerText = 'Pager';
    }
}

let ClockInterval;
function clockCycle(action) {
    if (action == 'remove') {
        clearInterval(ClockInterval);
        document.title = 'Pager';
        return;
    }
    ClockInterval = setInterval(writeToClock, 1000);
}

function getRealTime() {
    let time = new Date();
    let hour = String(time.getHours());
    let minute = String(time.getMinutes())
    if (minute.length != 2) {
        minute = '0' + minute;
    }
    return (hour + ':' + minute);
}

function writeToClock() {
    const clock = document.getElementById('clock');
    clock.innerText = getRealTime();
    document.title = getRealTime() + ' - Pager';
}

let clockEnabled = localStorage.getItem('clockEnabled');
if (clockEnabled == 'true') {
    localStorage.setItem('clockEnabled', true);
    writeToClock();
    clockCycle('start');
}

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
        Toastify({
            text: bingData.copyright.split("(", 2)[0],
            duration: 4300,
            className: "info",
            position: "center",
            gravity: "top",
            style: {
                color: "#FFF",
                background: "#414141",
                borderRadius: "8px",
                wordWrap: "break-word",
                width: "fit-content",
                maxWidth: "80vw",
                boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.217), 0 10px 36px -4px rgba(98, 98, 98, 0.171)"
            }
        }).showToast();
        hasBackground = true;
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

function getSuggestions() {
    const content = document.getElementById('searchInput').value;
    if (!content) {
        if (document.getElementById('suggestionArea') && hasSuggestionPage === true) {
            closeOverlay('suggestionArea');
        }
        return;
    }
    const searchEngine = currentSearchEngine;
    const suggestAPIs = {
        "google": "https://suggestqueries.google.com/complete/search?client=youtube&jsonp=window.google.sug&q=",
        "bing": "https://api.bing.com/qsonhs.aspx?type=cb&cb=window.bing.sug&q=",
        "baidu": "https://suggestion.baidu.com/su?p=3&cb=window.baidu.sug&wd="
    };
    let suggestAPI;
    let processMethod;
    switch (searchEngine) {
        case 'google':
        case 'bing':
        case 'baidu':
            processMethod = searchEngine;
            suggestAPI = suggestAPIs[searchEngine];
            break;
        default:
            processMethod = 'bing';
            suggestAPI = suggestAPIs['bing'];
    }
    const url = suggestAPI + encodeURIComponent(content);
    window.baidu = {
        sug: function (json) {
            const result = json.s;
            if (result[0] == null) {
                if (document.getElementById('suggestionArea') && hasSuggestionPage === true) {
                    closeOverlay('suggestionArea');
                }
                return;
            }
            openSuggestionPage(result, processMethod);
        }
    };

    window.bing = {
        sug: function (json) {
            try {
                const result = json.AS.Results[0].Suggests;
                if (result == null) {
                    if (document.getElementById('suggestionArea') && hasSuggestionPage === true) {
                        closeOverlay('suggestionArea');
                    }
                    return;
                }
                openSuggestionPage(result, processMethod);
            } catch (error) {
                return;
            }
        }
    };

    window.google = {
        sug: function (json) {
            const result = json[1];
            if (result[0] == null) {
                if (document.getElementById('suggestionArea') && hasSuggestionPage === true) {
                    closeOverlay('suggestionArea');
                }
                return;
            }
            openSuggestionPage(result, processMethod);
        }
    };

    let script = document.createElement("script");
    script.src = url;
    script.className = 'temp-getSearchSuggestions';
    document.getElementsByTagName("head")[0].appendChild(script);
}

let hasSuggestionPage = false;
function openSuggestionPage(keywords, processMethod) {
    if (!searchInput.value) {
        return;
    }
    if (document.getElementById('suggestionArea') && hasSuggestionPage === true) {
        closeOverlay('suggestionArea');
    }

    let base = document.createElement('div');
    let child = document.createElement('div');
    const baseID = 'suggestionArea';


    for (let i = 0; i < keywords.length && i < 5; i++) {
        let displayKey;
        if (processMethod === 'bing') {
            displayKey = keywords;
        } else {
            displayKey = keywords[i];
        }
        switch (processMethod) {
            case 'google':
                displayKey = String(displayKey).split(',')[0];
                break;
            case 'bing':
                displayKey = displayKey[i].Txt;
                break;
        }

        let historyData = document.createElement('div');

        historyData.innerHTML = displayKey;
        historyData.dataset.keyword = displayKey;
        historyData.setAttribute("onclick", "fillInto(\"searchInput\",\"" + displayKey + "\");focusToID(\'searchInput\');");
        child.appendChild(historyData);
    }

    base.appendChild(child);
    base.id = baseID;
    base.className = 'suggestionArea greyBackground';
    searchArea.appendChild(base);
    let tempElement = document.getElementsByClassName('temp-getSearchSuggestions');
    for (let i = 0; i < tempElement.length; i++) {
        tempElement[i].parentNode.removeChild(tempElement[i]);
    }
    hasSuggestionPage = true;
}

let hasNotePage = false;
function openNotePage() {
    if (hasHistoryArea === true) {
        return;
    }
    if (navigator.userAgent.includes('Firefox')) {
        Toastify({
            text: 'Sorry, this feature is not available for FireFox. Please use Chrome or browsers that use Chromium.',
            duration: 6450,
            className: "info",
            position: "center",
            gravity: "top",
            style: {
                color: "#FFF",
                background: "#414141",
                borderRadius: "8px",
                wordWrap: "break-word",
                width: "fit-content",
                maxWidth: "80vw",
                boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.217), 0 10px 36px -4px rgba(98, 98, 98, 0.171)"
            }
        }).showToast();
        return;
    }
    const searchArea = document.getElementById('searchArea');
    const footer = document.querySelector('.footer');
    footer.style.display = 'none';
    searchArea.style.display = 'none';
    let base = document.createElement('div');
    let area = document.createElement('div');
    let child = document.createElement('textarea');
    let closeButtom = document.createElement('div');

    base.id = 'noteBase';
    base.style.width = '90vw';
    base.style.maxWidth = 'calc(640px)';

    closeButtom.setAttribute("onclick", "closeNotePage()");
    closeButtom.className = 'closeButtom';
    closeButtom.innerText = 'close';
    closeButtom.style.backdropFilter = 'blur(30px);';
    closeButtom.style.backgroundColor = '#ffffff8a';
    closeButtom.style.paddingRight = '0';
    closeButtom.style.paddingLeft = '0';
    closeButtom.style.maxWidth = 'calc(640px - 16px)'

    area.id = 'noteArea';

    child.contentEditable = 'plaintext-only';
    child.placeholder = 'Your text right here...';
    child.id = 'noteInput';

    area.appendChild(child);
    base.appendChild(area);
    insertAfter(base, searchArea);
    insertAfter(closeButtom, area);
    loadNoteFromLS();
    document.getElementById('noteInput').addEventListener('input', () => {
        saveNoteToLS();
    });
    hasNotePage = true;
}

function closeNotePage() {
    const searchArea = document.getElementById('searchArea');
    const footer = document.querySelector('.footer');
    closeOverlay('noteBase');
    footer.style.display = 'block';
    searchArea.style.display = 'block';
    hasNotePage = false;
}

function loadNoteFromLS() {
    const noteInput = document.getElementById('noteInput');
    const note = localStorage.getItem('note');
    if (!note) {
        noteInput.value = '';
    } else {
        noteInput.value = note;
    }
}

function saveNoteToLS() {
    const note = document.getElementById('noteInput').value;
    localStorage.setItem('note', note);
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

if (!localStorage.getItem('translateEnabled')) {
    localStorage.setItem('translateEnabled', 'false');
}

function enableFeature(feature) {
    if (!feature) {
        return;
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

    switch (feature) {
        case 'translate':
            enableTranslate();
            break;
        case 'history':
            enableHistory();
            break;
        default:
            throw new Error('This feature is not available');
    }
}

basePart.style.display = 'flex';

const userLanguage = navigator.language;
switch (userLanguage) {
    case 'zh-CN':
    case 'zh-TW':
    case 'zh':
        console.log('%c请不要在此运行任何你不能理解的代码，否则将使你的信息陷入危险之中', 'color: red; font-size: xx-large; font-family: Arial, Helvetica, sans-serif; background-color: yellow;');
        break;
    default:
        console.log("%c Please don't run any code here that you don't understand, or you'll put your information at risk", 'color: red; font-size: xx-large; font-family: Arial, Helvetica, sans-serif; background-color: yellow;');
}

if (!(localStorage.getItem('lastTimeUsedEngine')) && localStorage.getItem('isNewUser') != 'false') {
    openStartUpPage();
}