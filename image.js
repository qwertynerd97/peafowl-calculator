// Update image based on phenotype
function updateImage(sex, bird, container, isChild = false) {
    let color = document.querySelector('#' + sex.toLowerCase() + '-color').value;
    const patternResult = document.querySelector('#' + sex.toLowerCase() + '-pattern').value;
    const pattern = patternResult === "Blackshoulder" ? "BS" : patternResult;
    const piedResult = document.querySelector('#' + sex.toLowerCase() + '-pied').value;
    const eyeResult = document.querySelector('#' + sex.toLowerCase() + '-eye').value;

    if (color === 'Indigo/Hazel') {
        const secondBird = document.createElement('div');
        secondBird.style.left = isChild ? '150px' : '300px';
        secondBird.className = container.className;
        generateImg(sex, 'Indigo', pattern, piedResult, eyeResult, container);
        generateImg(sex, 'Hazel', pattern, piedResult, eyeResult, secondBird);
        container.appendChild(secondBird);
        container.style.width = isChild ? '300px' : '600px';
    } else {
        const secondBird = container.querySelector('.' + container.className);
        if (secondBird) container.removeChild(secondBird);
        container.style.width = isChild ? '150px' : '300px';

        generateImg(sex, color, pattern, piedResult, eyeResult, container);
    }
}

function generateImg(sex, color, pattern, pied, eye, container) {
    // Color
    const prevColor = container.querySelector('#' + sex + '-color-img');
    const colorImg = prevColor ? prevColor : document.createElement('img');
    if (!prevColor) {
        colorImg.className = "overlayImage"
        colorImg.id = sex + '-color-img';
        container.appendChild(colorImg);
    }

    const imagePath = `content/Images/${sex}/Color/${color}.png`;
    colorImg.src = imagePath;
    colorImg.onerror = () => {
        colorImg.onerror = null;
        colorImg.src = `content/Images/${sex}/Color/Unknown.png`;
    };

    // Pattern
    const prevPattern = container.querySelector('#' + sex + '-pattern-img');
    const patternImg = prevPattern ? prevPattern : document.createElement('img');
    if (!prevPattern) {
        patternImg.className = "overlayImage"
        patternImg.id = sex + '-pattern-img';
        container.appendChild(patternImg);
    }

    const bsPath = `content/Images/${sex}/Pattern/${color} ${pattern}.png`;
    patternImg.style.display = 'revert';
    patternImg.src = bsPath;
    patternImg.onerror = () => {
        patternImg.onerror = null;
        patternImg.src = ``;
        patternImg.style.display = 'none';
        if (!pattern.includes("WT") && !pattern.includes("Wild Type")) {
            console.log('reverting image to unknown');
            colorImg.src = `content/Images/${sex}/Color/Unknown.png`;
        }
    };

    // Pied
    const prevPied = container.querySelector('#' + sex + '-pied-img');
    const piedImg = prevPied ? prevPied : document.createElement('img');
    if (!prevPied) {
        piedImg.className = "overlayImage"
        piedImg.id = sex + '-pattern-img';
        container.appendChild(piedImg);
    }

    const piedPath = `content/Images/${sex}/Pied/${pied}.png`;
    piedImg.style.display = 'revert';
    piedImg.src = piedPath;
    piedImg.onerror = () => {
        piedImg.onerror = null;
        piedImg.src = ``;
        piedImg.style.display = 'none';
        if (!pied.includes("WT") && !pied.includes("Wild Type")) {
            colorImg.src = `content/Images/${sex}/Color/Unknown.png`;
        }
    };

    // Eye
    const prevEye = container.querySelector('#' + sex + '-eye-img');
    const eyeImg = prevEye ? prevEye : document.createElement('img');
    if (!prevEye) {
        eyeImg.className = "overlayImage"
        eyeImg.id = sex + '-eye-img';
        container.appendChild(eyeImg);
    }

    const eyePath = `content/Images/${sex}/LeucisticEye/${eye}.png`;
    eyeImg.style.display = 'revert';
    eyeImg.src = eyePath;
    eyeImg.onerror = () => {
        eyeImg.onerror = null;
        eyeImg.src = ``;
        eyeImg.style.display = 'none';
        if (!eye.includes("WT") && !eye.includes("Wild Type")) {
            colorImg.src = `content/Images/${sex}/Color/Unknown.png`;
        }
    };

    // Lineart
    const prevLine = container.querySelector('#' + sex + '-lineart');
    const lineart = prevLine ? prevLine : document.createElement('img');
    if (!prevLine) {
        lineart.className = "overlayImage"
        lineart.id = sex + '-lineart';
        container.appendChild(lineart);
    }
    lineart.className = "overlayImage"
    const lineartPath = `content/Images/${sex}/lineart.png`;
    lineart.src = lineartPath;
}
