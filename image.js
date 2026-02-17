// Update image based on phenotype
function updateImage(sex, bird, container, isChild = false) {
    // Get bird color
    const result = getPhenotypeFromBird(
        bird,
        sex,
        'Wild Type',
        colorGenes,
        [{ name: 'Sex-Linked Color', allotypes: sexLinkedColorAllotypes, sexLinked: true }],
        hetSexColors,
        multiGeneColors
    );

    let color = result.isUnknownPhenotype ? "Unknown" : result.finalBirdPhenotype;

    // Indigo and Hazel are different random presentations of the same genes
    // We should display parents based on the value in the selector
    if (!isChild && ['Indigo', 'Hazel', 'Indigo/Hazel'].includes(result.finalBirdPhenotype)) {
        const prefix = sex === 'Female' ? 'female' : 'male';
        const selectId = `${prefix}-color`;
        const select = document.getElementById(selectId);
        color = select.value;
    }

    if (color === 'Indigo/Hazel') {
        const secondBird = document.createElement('div');
        secondBird.style.left = isChild ? '150px' : '300px';
        secondBird.className = container.className;
        generateImg(sex, 'Indigo', container);
        generateImg(sex, 'Hazel', secondBird);
        container.appendChild(secondBird);
        container.style.width = isChild ? '300px' : '600px';
    } else {
        const secondBird = container.querySelector('.' + container.className);
        if (secondBird) container.removeChild(secondBird);
        container.style.width = isChild ? '150px' : '300px';

        generateImg(sex, color, container);
    }
}

function generateImg(sex, color, container) {
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
