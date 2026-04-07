// Update image based on phenotype
function updateImage(sex, bird, container, isChild = false) {
    let color = isChild ? bird.Color : document.querySelector('#' + sex.toLowerCase() + '-color').value;
    const patternResult = isChild ? bird.Pattern : document.querySelector('#' + sex.toLowerCase() + '-pattern').value;
    const pattern = patternResult === "Blackshoulder" ? "BS" : patternResult;
    let piedResult = isChild ? bird.Pied : document.querySelector('#' + sex.toLowerCase() + '-pied').value;
    const eyeResult = isChild ? bird['Leucistic Eye'] : document.querySelector('#' + sex.toLowerCase() + '-eye').value;

    if (piedResult === "Silver Pied" && !isChild) {
        const silverNote = container.parentElement.querySelector('#silver');
        if (!silverNote) {
            const silverNote = document.createElement('div');
            silverNote.id = "silver";
            silverNote.style.position = "absolute";
            silverNote.style.bottom = "-1em";
            silverNote.innerHTML = "<b>Note:</b> Silver Pied is a combination of Pied and Silver White Eye."
            container.parentElement.appendChild(silverNote);
        }
    } else if (piedResult === "Pied" && eyeResult === "Silver White Eye" && !isChild) {
        piedResult = "Silver Pied";
        const silverNote = container.parentElement.querySelector('#silver');
        if (!silverNote) {
            const silverNote = document.createElement('div');
            silverNote.id = "silver";
            silverNote.style.position = "absolute";
            silverNote.style.bottom = "-1em";
            silverNote.innerHTML = "<b>Note:</b> Pied and Silver White Eye may also be called Silver Pied."
            container.parentElement.appendChild(silverNote);
        }
    } else {
        const silverNote = container.parentElement.querySelector('#silver');
        if (silverNote) container.parentElement.removeChild(silverNote);
    }

    // Pied + Silver White Eye results in a unique coloration that is stored in the Pied folder
    if (piedResult === "Pied" && eyeResult === "Silver White Eye") {
    }

    if (color === 'Indigo/Hazel') {
        let secondBird = container.parentElement.querySelector('.second-bird');
        if (!secondBird) secondBird = document.createElement('div');
        secondBird.className = 'second-bird imageWrapper';
        generateImg(sex, 'Indigo', pattern, piedResult, eyeResult, container);
        generateImg(sex, 'Hazel', pattern, piedResult, eyeResult, secondBird);
        container.parentElement.appendChild(secondBird);
    } else {
        const secondBird = container.parentElement.querySelector('.second-bird');
        if (secondBird) container.parentElement.removeChild(secondBird);

        generateImg(sex, color, pattern, piedResult, eyeResult, container);
    }
}

function onError(images) {
    images.forEach(image => {
        image.onerror = null;
        image.src = ``;
        image.style.display = 'none';
    })
}

function generateImg(sex, color, pattern, pied, eye, container) {
    // Get all non-lineart images first - they will all have to be updated if there is a loading error
    const prevColor = container.querySelector('#' + sex + '-color-img');
    const colorImg = prevColor ? prevColor : document.createElement('img');

    const prevPattern = container.querySelector('#' + sex + '-pattern-img');
    const patternImg = prevPattern ? prevPattern : document.createElement('img');

    const prevPied = container.querySelector('#' + sex + '-pied-img');
    const piedImg = prevPied ? prevPied : document.createElement('img');

    const prevEye = container.querySelector('#' + sex + '-eye-img');
    const eyeImg = prevEye ? prevEye : document.createElement('img');


    // Color
    if (!prevColor) {
        colorImg.className = "overlayImage"
        colorImg.id = sex + '-color-img';
        container.appendChild(colorImg);
    }

    const imagePath = `content/Images/${sex}/Color/${color}.png`;
    colorImg.src = imagePath;
    colorImg.onerror = () => {
        colorImg.onerror = null;
        onError([patternImg, piedImg, eyeImg]);
        colorImg.src = `content/Images/${sex}/Color/Unknown.png`;
    };

    // Pattern
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
            onError([patternImg, piedImg, eyeImg]);
            colorImg.src = `content/Images/${sex}/Color/Unknown.png`;
        }
    };

    // Pied
    if (!prevPied) {
        piedImg.className = "overlayImage"
        piedImg.id = sex + '-pied-img';
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
            onError([patternImg, piedImg, eyeImg]);
            colorImg.src = `content/Images/${sex}/Color/Unknown.png`;
        }
    };

    // Eye
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
            onError([patternImg, piedImg, eyeImg]);
            colorImg.src = `content/Images/${sex}/Color/Unknown.png`;
        }
    };

    // Lineart
    const prevLine = container.querySelector('#' + sex + '-lineart');
    const lineart = prevLine ? prevLine : document.createElement('img');
    if (!prevLine) {
        lineart.className = "overlayImage";
        lineart.id = sex + '-lineart';
        container.appendChild(lineart);
    }
    lineart.className = "overlayImage"
    const lineartPath = `content/Images/${sex}/lineart.png`;
    lineart.src = lineartPath;

    if (color === "Unknown") {
        onError([patternImg, piedImg, eyeImg]);
    }
}
