// Bird state
const femaleBird = {};
const maleBird = {};



// Populate dropdowns
function populateDropdown(id, options) {
    const select = document.getElementById(id);
    select.innerHTML = '';
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

// Update phenotype dropdown from bird genotype
function updatePhenotypeDropdown(sex, bird, type) {
    const prefix = sex === 'Female' ? 'female' : 'male';
    const selectId = `${prefix}-${type}`;
    const select = document.getElementById(selectId);

    if (type === 'color') {
        const result = getPhenotypeFromBird(
            bird,
            sex,
            'Wild Type',
            colorGenes,
            [{ name: 'Sex-Linked Color', allotypes: sexLinkedColorAllotypes, sexLinked: true }],
            hetSexColors,
            multiGeneColors
        );
        select.value = result.isUnknownPhenotype ? "Unknown" : result.finalBirdPhenotype;
    } else if (type === 'pied') {
        const result = getPhenotypeFromBird(
            bird,
            sex,
            'Non-Leucistic Wild Type',
            [],
            [{ name: 'Pied', allotypes: piedAllotypes, sexLinked: false }],
            hetPied,
            []
        );
        select.value = result.finalBirdPhenotype;
    } else if (type === 'eye') {
        const result = getPhenotypeFromBird(
            bird,
            sex,
            'Non-Leucistic Wild Type',
            [],
            [{ name: 'Leucistic Eye', allotypes: whiteEyeAllotypes, sexLinked: false }],
            hetWhite,
            []
        );
        select.value = result.finalBirdPhenotype;
    } else if (type === 'pattern') {
        let pattern = 'Barred Wing Wild Type';
        for (let gene of patternGenes) {
            if (bird[gene.name] && bird[gene.name].includes(gene.notation)) {
                pattern = gene.name;
                break;
            }
        }
        select.value = pattern;
    }
}

// Create genotype widgets
function createGenotypeWidgets(sex, bird) {
    const container = document.getElementById(sex === 'Female' ? 'female-genotypes' : 'male-genotypes');
    container.innerHTML = '';

    // Color genes
    colorGenes.forEach(gene => {
        const div = document.createElement('div');
        div.className = 'form-group';
        const label = document.createElement('label');
        label.textContent = gene.name + ':';
        const select = document.createElement('select');
        select.id = `${sex.toLowerCase()}-gene-${gene.notation}`;

        ['WT/WT', `WT/${gene.notation}`, `${gene.notation}/${gene.notation}`].forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            saveGenotypeToBird(bird, gene.name, e.target.value);
            updatePhenotypeDropdown(sex, bird, 'color');
            updateImage(sex, bird, document.getElementById(sex + '-img'));
            generateOffspring();
        });

        div.appendChild(label);
        div.appendChild(select);
        container.appendChild(div);
    });

    // Sex-linked color
    const sexDiv = document.createElement('div');
    sexDiv.className = 'form-group';
    const sexLabel = document.createElement('label');
    sexLabel.textContent = 'Sex-Linked Color:';
    const sexSelect = document.createElement('select');
    sexSelect.id = `${sex.toLowerCase()}-gene-sexlinked`;

    const wildType = { notation: 'Z(WT)', name: 'Wild Type' };
    const allotypes = [wildType, ...sexLinkedColorAllotypes];

    if (sex === 'Female') {
        allotypes.forEach(allotype => {
            const option = document.createElement('option');
            option.value = `${allotype.notation}/w`;
            option.textContent = `${allotype.notation}/w`;
            sexSelect.appendChild(option);
        });
    } else {
        for (let i = 0; i < allotypes.length; i++) {
            for (let j = i; j < allotypes.length; j++) {
                const option = document.createElement('option');
                option.value = `${allotypes[i].notation}/${allotypes[j].notation}`;
                option.textContent = `${allotypes[i].notation}/${allotypes[j].notation}`;
                sexSelect.appendChild(option);
            }
        }
    }

    sexSelect.addEventListener('change', (e) => {
        saveGenotypeToBird(bird, 'Sex-Linked Color', e.target.value);
        updatePhenotypeDropdown(sex, bird, 'color');
        updateImage(sex, bird, document.getElementById(sex + '-img'));
        generateOffspring();
    });

    sexDiv.appendChild(sexLabel);
    sexDiv.appendChild(sexSelect);
    container.appendChild(sexDiv);

    // Pied
    const piedDiv = document.createElement('div');
    piedDiv.className = 'form-group';
    const piedLabel = document.createElement('label');
    piedLabel.textContent = 'Pied:';
    const piedSelect = document.createElement('select');
    piedSelect.id = `${sex.toLowerCase()}-gene-pied`;

    const piedAlleles = [{ notation: 'WT', name: 'Wild Type' }, ...piedAllotypes];
    for (let i = 0; i < piedAlleles.length; i++) {
        for (let j = i; j < piedAlleles.length; j++) {
            const option = document.createElement('option');
            option.value = `${piedAlleles[i].notation}/${piedAlleles[j].notation}`;
            option.textContent = `${piedAlleles[i].notation}/${piedAlleles[j].notation}`;
            piedSelect.appendChild(option);
        }
    }

    piedSelect.addEventListener('change', (e) => {
        saveGenotypeToBird(bird, 'Pied', e.target.value);
        updatePhenotypeDropdown(sex, bird, 'pied');
        generateOffspring();
    });

    piedDiv.appendChild(piedLabel);
    piedDiv.appendChild(piedSelect);
    container.appendChild(piedDiv);

    // White Eye
    const eyeDiv = document.createElement('div');
    eyeDiv.className = 'form-group';
    const eyeLabel = document.createElement('label');
    eyeLabel.textContent = 'Leucistic Eye:';
    const eyeSelect = document.createElement('select');
    eyeSelect.id = `${sex.toLowerCase()}-gene-eye`;

    const eyeAlleles = [{ notation: 'WT', name: 'Wild Type' }, ...whiteEyeAllotypes];
    for (let i = 0; i < eyeAlleles.length; i++) {
        for (let j = i; j < eyeAlleles.length; j++) {
            const option = document.createElement('option');
            option.value = `${eyeAlleles[i].notation}/${eyeAlleles[j].notation}`;
            option.textContent = `${eyeAlleles[i].notation}/${eyeAlleles[j].notation}`;
            eyeSelect.appendChild(option);
        }
    }

    eyeSelect.addEventListener('change', (e) => {
        saveGenotypeToBird(bird, 'Leucistic Eye', e.target.value);
        updatePhenotypeDropdown(sex, bird, 'eye');
        generateOffspring();
    });

    eyeDiv.appendChild(eyeLabel);
    eyeDiv.appendChild(eyeSelect);
    container.appendChild(eyeDiv);

    // Pattern genes
    patternGenes.forEach(gene => {
        const div = document.createElement('div');
        div.className = 'form-group';
        const label = document.createElement('label');
        label.textContent = gene.name + ':';
        const select = document.createElement('select');
        select.id = `${sex.toLowerCase()}-gene-${gene.notation}`;

        ['WT/WT', `WT/${gene.notation}`, `${gene.notation}/${gene.notation}`].forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            saveGenotypeToBird(bird, gene.name, e.target.value);
            updatePhenotypeDropdown(sex, bird, 'pattern');
            generateOffspring();
        });

        div.appendChild(label);
        div.appendChild(select);
        container.appendChild(div);
    });
}

// Handle phenotype changes
function handlePhenotypeChange(sex, bird, phenotype, type) {
    if (type === 'color') {
        savePhenotypeToBird(
            bird,
            phenotype,
            sex,
            colorGenes,
            [{ name: 'Sex-Linked Color', allotypes: sexLinkedColorAllotypes, sexLinked: true }],
            sexLinkedColorAllotypes,
            multiGeneColors,
            sexAndAutosomalComboColors,
            hetSexColors
        );
    } else if (type === 'pied') {
        savePhenotypeToBird(
            bird,
            phenotype,
            sex,
            [],
            [{ name: 'Pied', allotypes: piedAllotypes, sexLinked: false }],
            [],
            [],
            [],
            hetPied
        );
    } else if (type === 'eye') {
        savePhenotypeToBird(
            bird,
            phenotype,
            sex,
            [],
            [{ name: 'Leucistic Eye', allotypes: whiteEyeAllotypes, sexLinked: false }],
            [],
            [],
            [],
            hetWhite
        );
    } else if (type === 'pattern') {
        // Clear all pattern genes first
        patternGenes.forEach(gene => {
            if (bird[gene.name]) delete bird[gene.name];
        });
        // Set the selected pattern
        for (let gene of patternGenes) {
            if (phenotype === gene.name) {
                bird[gene.name] = `${gene.notation}/${gene.notation}`;
                break;
            }
        }
    }

    updateGenotypeWidgets(sex, bird);
    updateImage(sex, bird, document.getElementById(sex + '-img'));
    generateOffspring();
}

// Update genotype widgets from bird state
function updateGenotypeWidgets(sex, bird) {
    const prefix = sex.toLowerCase();

    // Update color genes
    colorGenes.forEach(gene => {
        const select = document.getElementById(`${prefix}-gene-${gene.notation}`);
        if (select) {
            select.value = bird[gene.name] || 'WT/WT';
        }
    });

    // Update sex-linked color
    const sexSelect = document.getElementById(`${prefix}-gene-sexlinked`);
    if (sexSelect) {
        sexSelect.value = bird['Sex-Linked Color'] || (sex === 'Female' ? 'Z(WT)/w' : 'Z(WT)/Z(WT)');
    }

    // Update pied
    const piedSelect = document.getElementById(`${prefix}-gene-pied`);
    if (piedSelect) {
        piedSelect.value = bird['Pied'] || 'WT/WT';
    }

    // Update eye
    const eyeSelect = document.getElementById(`${prefix}-gene-eye`);
    if (eyeSelect) {
        eyeSelect.value = bird['Leucistic Eye'] || 'WT/WT';
    }

    // Update pattern genes
    patternGenes.forEach(gene => {
        const select = document.getElementById(`${prefix}-gene-${gene.notation}`);
        if (select) {
            select.value = bird[gene.name] || 'WT/WT';
        }
    });
}

// Initialize the application
function init() {
    // Populate female dropdowns
    populateDropdown('female-color', buildColorList('Female'));
    populateDropdown('female-pattern', buildPatternList());
    populateDropdown('female-pied', buildPiedList());
    populateDropdown('female-eye', buildEyeList());

    // Populate male dropdowns
    populateDropdown('male-color', buildColorList('Male'));
    populateDropdown('male-pattern', buildPatternList());
    populateDropdown('male-pied', buildPiedList());
    populateDropdown('male-eye', buildEyeList());

    // Create genotype widgets
    createGenotypeWidgets('Female', femaleBird);
    createGenotypeWidgets('Male', maleBird);

    updateImage('Female', femaleBird, document.getElementById('Female-img'));
    updateImage('Male', maleBird, document.getElementById('Male-img'));

    updatePhenotypeDropdown('Female', femaleBird, 'color');
    updatePhenotypeDropdown('Male', maleBird, 'color');

    // Initalize Children
    generateOffspring()

    // Add event listeners for female
    document.getElementById('female-color').addEventListener('change', (e) => {
        handlePhenotypeChange('Female', femaleBird, e.target.value, 'color');
    });
    document.getElementById('female-pattern').addEventListener('change', (e) => {
        handlePhenotypeChange('Female', femaleBird, e.target.value, 'pattern');
    });
    document.getElementById('female-pied').addEventListener('change', (e) => {
        handlePhenotypeChange('Female', femaleBird, e.target.value, 'pied');
    });
    document.getElementById('female-eye').addEventListener('change', (e) => {
        handlePhenotypeChange('Female', femaleBird, e.target.value, 'eye');
    });

    // Add event listeners for male
    document.getElementById('male-color').addEventListener('change', (e) => {
        handlePhenotypeChange('Male', maleBird, e.target.value, 'color');
    });
    document.getElementById('male-pattern').addEventListener('change', (e) => {
        handlePhenotypeChange('Male', maleBird, e.target.value, 'pattern');
    });
    document.getElementById('male-pied').addEventListener('change', (e) => {
        handlePhenotypeChange('Male', maleBird, e.target.value, 'pied');
    });
    document.getElementById('male-eye').addEventListener('change', (e) => {
        handlePhenotypeChange('Male', maleBird, e.target.value, 'eye');
    });
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', init);
