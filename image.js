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
            silverNote.style.fontSize = "0.8em";
            silverNote.innerHTML = "<b>Note:</b> Silver Pied is a combination of Pied and Silver White Eye."
            container.parentElement.appendChild(silverNote);
        }
    } else if (piedResult === "Pied" && eyeResult === "Silver White Eye") {
        piedResult = "Silver Pied";
        if (!isChild) {
            const silverNote = container.parentElement.querySelector('#silver');
            if (!silverNote) {
                const silverNote = document.createElement('div');
                silverNote.id = "silver";
                silverNote.style.position = "absolute";
                silverNote.style.bottom = "-1em";
                silverNote.style.fontSize = "0.8em";
                silverNote.innerHTML = "<b>Note:</b> Pied and Silver White Eye may also be called Silver Pied."
                container.parentElement.appendChild(silverNote);
            }
        }
    } else if (color === "Ultramarine" && !isChild) {
        const silverNote = container.parentElement.querySelector('#silver');
        if (!silverNote) {
            const silverNote = document.createElement('div');
            silverNote.id = "silver";
            silverNote.style.position = "absolute";
            silverNote.style.bottom = "-1em";
            silverNote.style.fontSize = "0.8em";
            silverNote.innerHTML = "<b>Note:</b> Ultramarine is assumed to be autosomal recessive, but breeding has produced odd results."
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
    } else if (color === 'Champagne/Royal Purple') {
        let secondBird = container.parentElement.querySelector('.second-bird');
        if (!secondBird) secondBird = document.createElement('div');
        secondBird.className = 'second-bird imageWrapper';
        generateImg(sex, 'Champagne', pattern, piedResult, eyeResult, container);
        generateImg(sex, 'Royal Purple', pattern, piedResult, eyeResult, secondBird);
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

function addNextLayer(ctx, img, src, sex, nextLayer, lineartLayer) {
    return () => {
        img.src = src;
        img.onload = function() {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, 0, 0);
            nextLayer();
        }
        img.onerror = function() {
            console.log("Error loading " + src);
            ctx.clearRect(0, 0, 700, 700);
            const unknown = new Image();
            unknown.src = `content/Images/${sex}/Color/Unknown.png`;
            unknown.onload = () => {
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(unknown, 0, 0);
                lineartLayer();
            }
        }
    }
}

function combineLayersIntoSingle(sex, color, pattern, pied, eye, afterDraw = undefined) {
    var downloader = document.getElementById(sex + "-downloader");

    var c = document.getElementById(sex + "-canvas");
    var ctx = c.getContext("2d");

    let prevLayer = addNextLayer(ctx, new Image(), `content/Images/${sex}/lineart.png`, sex, () => {
        const href = c.toDataURL("image/png");
        downloader.href = href;
        downloader.download = `${sex}-${color}-${pattern}-${pied}-${eye}.png`
        if (afterDraw) {
            console.log("Calling afterDraw")
            afterDraw(ctx);
        }
    });

    const lineartLayer = prevLayer;

    if (!eye.includes("WT") && !eye.includes("Wild Type")) {
        prevLayer = addNextLayer(ctx, new Image(), `content/Images/${sex}/LeucisticEye/${eye}.png`, sex, prevLayer, lineartLayer);
    }

    if (!pied.includes("WT") && !pied.includes("Wild Type")) {
        prevLayer = addNextLayer(ctx, new Image(), `content/Images/${sex}/Pied/${pied}.png`, sex, prevLayer, lineartLayer);
    }

    if (!pattern.includes("WT") && !pattern.includes("Wild Type")) {
        prevLayer = addNextLayer(ctx, new Image(), `content/Images/${sex}/Pattern/${color} ${pattern}.png`, sex, prevLayer, lineartLayer);
    }

    const colorFunct = addNextLayer(ctx, new Image(), `content/Images/${sex}/Color/${color}.png`, sex, prevLayer, lineartLayer);

    colorFunct();
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

    combineLayersIntoSingle(sex, color, pattern, pied, eye);
}
