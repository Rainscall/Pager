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
    "DDG": "https://duckduckgo.com/?t=h_&q="
};

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
                        duration: 5500,
                        className: "info",
                        position: "center",
                        gravity: "bottom",
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
    selectedEngine = selectSearchEngine.value;
    localStorage.setItem('lastTimeUsedEngine', selectedEngine);
    if (!searchInput.value) {
        return;
    }
    if (searchInput.value.startsWith('https://') || searchInput.value.startsWith('http://')) {
        window.open(searchInput.value);
        searchInput.value = '';
    } else {
        window.open(searchEngine[selectedEngine] + encodeURIComponent(searchInput.value));
        searchInput.value = '';
    }
}

function closeOverlay(elementID) {
    document.getElementById(elementID).parentNode.removeChild(document.getElementById(elementID));
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
                openSettingPage();
            }
        }
    });
})();

hasSettingPage = false;
function openSettingPage() {
    if (hasSettingPage) {
        return;
    }
    let base = document.createElement('div');
    let child = document.createElement('div');
    let heading = document.createElement('h1');
    let closeButtom = document.createElement('div');
    let backgroundBar = document.createElement('div');
    let setBackground = document.createElement('div');
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

    resetBackground.innerText = 'reset';
    resetBackground.className = 'resetBackground';
    resetBackground.setAttribute('onclick', 'resetBackground();');

    setBackground.innerText = 'select background';
    setBackground.className = 'setBackground';
    setBackground.setAttribute('onclick', 'fakeSelectFile(\'' + fileInputId + '\');');

    backgroundBar.appendChild(resetBackground);
    backgroundBar.appendChild(setBackground);

    child.className = 'childPart';
    child.prepend(heading);
    child.appendChild(backgroundBar);

    closeButtom.setAttribute("onclick", "closeOverlay(\"" + baseID + "\");hasSettingPage=false;");
    closeButtom.className = 'closeButtom';
    closeButtom.innerText = 'close';
    closeButtom.style.backdropFilter = 'blur(30px);';
    closeButtom.style.backgroundColor = '#ffffff8a';
    closeButtom.style.paddingRight = '0';
    closeButtom.style.paddingLeft = '0';
    child.appendChild(fileInput);

    child.appendChild(closeButtom);
    base.appendChild(child);
    document.body.prepend(base);
    hasSettingPage = true;
}

function resetBackground() {
    localStorage.removeItem('background.image');
    document.body.style.backgroundImage = '';
    Toastify({
        text: "Background reset",
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
    reader.readAsDataURL(file);
    reader.onload = () => {
        const backgroundImage = reader.result;
        document.body.style.backgroundImage = 'url(\'' + backgroundImage + '\')';
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
        hour = time.getHours()
        minute = time.getMinutes()
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