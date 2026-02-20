// Update image based on phenotype
function updateImage(sex, bird, container, isChild = false) {
    // Get bird color
    const colorResult = getPhenotypeFromBird(
        bird,
        sex,
        'Wild Type',
        colorGenes,
        [{ name: 'Sex-Linked Color', allotypes: sexLinkedColorAllotypes, sexLinked: true }],
        hetSexColors,
        multiGeneColors
    );

    let color = colorResult.isUnknownPhenotype ? "Unknown" : colorResult.finalBirdPhenotype;

    const patternResult = getPhenotypeFromBird(
        bird,
        sex,
        'Wild Type',
        patternGenes,
        [],
        [],
        []
    );

    const pattern = patternResult.finalBirdPhenotype === "Blackshoulder" ? "BS" : "WT";

    const piedResult = getPhenotypeFromBird(
        bird,
        sex,
        'Non-Leucistic Wild Type',
        [],
        [{ name: 'Pied', allotypes: piedAllotypes, sexLinked: false }],
        hetPied,
        []
    );

    // Indigo and Hazel are different random presentations of the same genes
    // We should display parents based on the value in the selector
    if (!isChild && ['Indigo', 'Hazel', 'Indigo/Hazel'].includes(color.finalBirdPhenotype)) {
        const prefix = sex === 'Female' ? 'female' : 'male';
        const selectId = `${prefix}-color`;
        const select = document.getElementById(selectId);
        color = select.value;
    }

    if (color === 'Indigo/Hazel') {
        const secondBird = document.createElement('div');
        secondBird.style.left = isChild ? '150px' : '300px';
        secondBird.className = container.className;
        generateImg(sex, 'Indigo', pattern, piedResult.finalBirdPhenotype, container);
        generateImg(sex, 'Hazel', pattern, piedResult.finalBirdPhenotype, secondBird);
        container.appendChild(secondBird);
        container.style.width = isChild ? '300px' : '600px';
    } else {
        const secondBird = container.querySelector('.' + container.className);
        if (secondBird) container.removeChild(secondBird);
        container.style.width = isChild ? '150px' : '300px';

        generateImg(sex, color, pattern, piedResult.finalBirdPhenotype, container);
    }
}

function generateImg(sex, color, pattern, pied, container) {
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
        patternImg.src = ``;
        patternImg.style.display = 'none';
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
        piedImg.src = ``;
        piedImg.style.display = 'none';
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
