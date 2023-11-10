const searchInput = document.getElementById('searchInput');
const searchEngine = {
    "google": "https://www.google.com/search?q=",
    "bing": "https://www.bing.com/search?q=",
    "yandex": "https://yandex.com/search/?text=",
    "baidu": "https://www.baidu.com/s?ie=utf-8&wd=",
    "sogou": "https://www.sogou.com/web?query="
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

function search() {
    selectedEngine = selectSearchEngine.value;
    localStorage.setItem('lastTimeUsedEngine', selectedEngine);
    if (!searchInput.value) {
        return;
    }
    window.open(searchEngine[selectedEngine] + encodeURIComponent(searchInput.value));
    searchInput.value = '';
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
                createWarningWindow('Working on progress...', 'This page is developing.', 'close', '#777', '#FFF', true);
            }
        }
    });
})();

function focusToID(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.focus();
    } else {
        console.error("Element with ID '" + elementId + "' not found.");
    }
}