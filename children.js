// Offspring generation
function generateOffspring() {
    const results = document.getElementById('offspring-results');
    results.innerHTML = '<p>Generating offspring...</p>';

    const result = getPhenotypeFromBird(
        femaleBird,
        'Female',
        'Wild Type',
        colorGenes,
        [{ name: 'Sex-Linked Color', allotypes: sexLinkedColorAllotypes, sexLinked: true }],
        hetSexColors,
        multiGeneColors
    );

    const femaleColor = result.finalBirdPhenotype;
    if (femaleColor === "Charcoal") {
        results.innerHTML = "<b>Charcoal hens are infertile and cannot produce offspring</b>";
        return;
    }

    const femalePied = getPhenotypeFromBird(
        femaleBird,
        'Female',
        'Wild Type',
        piedGenes,
        [{ name: 'Pied', allotypes: piedAllotypes, sexLinked: false }],
        [],
        []
    ).finalBirdPhenotype;

    const malePied = getPhenotypeFromBird(
        maleBird,
        'Male',
        'Wild Type',
        piedGenes,
        [{ name: 'Pied', allotypes: piedAllotypes, sexLinked: false }],
        [],
        []
    ).finalBirdPhenotype;

    if (femalePied === "Progressive Pied" || malePied === "Progressive Pied") {
        results.innerHTML = "<b>Progressive pied is not a color, pattern, or leucistic mutation. The spread of white on the bird is the result of an genetic autoimmune disorder which causes health problems, including blindness and early death. These birds should not be bred.</b>";
        return;
    }

    // Generate all possible offspring genotypes
    const childrenGenotypes = generateChildGenotypes(maleBird, femaleBird);
    const children = generateChildrenPhenotypes(childrenGenotypes);

    // Display results
    results.innerHTML = '';
    children.forEach((child, index) => {
        const card = document.createElement('div');
        card.className = 'offspring-card';

        const probability = document.createElement('div');
        probability.className = 'probability';
        probability.textContent = `${(child.probability * 100).toFixed(2)}%`;
        card.appendChild(probability);

        // Add image
        // Wrapper to hold transparent images
        const wrapper = document.createElement('div');
        wrapper.className = "childImageWrapper";
        card.appendChild(wrapper);

        updateImage(child.phenotype.Sex, child.genotype, wrapper, true);

        // Add phenotype traits
        Object.keys(child.phenotype).forEach(trait => {
            const traitDiv = document.createElement('div');
            traitDiv.className = 'trait';
            traitDiv.textContent = `${trait}: ${child.phenotype[trait]}`;
            card.appendChild(traitDiv);
        });

        // Add genotype toggle
        const toggle = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = 'Show Genotype';
        toggle.appendChild(summary);
        toggle.className = 'genotype-toggle';
        card.appendChild(toggle);

        // Add genotype details
        const details = document.createElement('div');
        details.className = 'genotype-details';
        Object.keys(child.genotype).forEach(gene => {
            const geneDiv = document.createElement('div');
            geneDiv.textContent = `${gene}: ${child.genotype[gene]}`;
            details.appendChild(geneDiv);
        });
        toggle.appendChild(details);

        results.appendChild(card);
    });
}

function generateChildGenotypes(male, female) {
    const punnettCombo = [[0, 0], [0, 1], [1, 0], [1, 1]];
    const childrenGenotypes = {};

    // Handle sex-linked genes (sex and sex-linked color)
    childrenGenotypes['sex-linked'] = [];

    for (let combo of punnettCombo) {
        const partialChild = {};

        // Sex determination and sex-linked color inheritance
        const maleSexAlleles = male['Sex-Linked Color'] ? male['Sex-Linked Color'].split('/') : ['Z(WT)', 'Z(WT)'];
        const femaleSexAlleles = female['Sex-Linked Color'] ? female['Sex-Linked Color'].split('/') : ['Z(WT)', 'w'];

        const childAlleles = [maleSexAlleles[combo[0]], femaleSexAlleles[combo[1]]].sort();
        partialChild['Sex-Linked Color'] = childAlleles.join('/');

        // Check if exists
        let found = childrenGenotypes['sex-linked'].find(c => c.genotype['Sex-Linked Color'] === partialChild['Sex-Linked Color']);
        if (found) {
            found.probability += 0.25;
        } else {
            childrenGenotypes['sex-linked'].push({ genotype: partialChild, probability: 0.25 });
        }
    }

    // Handle autosomal genes
    colorGenes.forEach(gene => {
        const geneId = gene.name;
        childrenGenotypes[geneId] = [];

        const maleAlleles = male[geneId] ? male[geneId].split('/') : ['WT', 'WT'];
        const femaleAlleles = female[geneId] ? female[geneId].split('/') : ['WT', 'WT'];

        for (let combo of punnettCombo) {
            const childAlleles = [maleAlleles[combo[0]], femaleAlleles[combo[1]]].sort();
            const genotypeStr = childAlleles.join('/');

            let found = childrenGenotypes[geneId].find(c => c.genotype === genotypeStr);
            if (found) {
                found.probability += 0.25;
            } else {
                childrenGenotypes[geneId].push({ genotype: genotypeStr, probability: 0.25 });
            }
        }
    });

    // Handle Pied
    childrenGenotypes['Pied'] = [];
    const malePied = male['Pied'] ? male['Pied'].split('/') : ['WT', 'WT'];
    const femalePied = female['Pied'] ? female['Pied'].split('/') : ['WT', 'WT'];

    for (let combo of punnettCombo) {
        const childAlleles = [malePied[combo[0]], femalePied[combo[1]]].sort();
        const genotypeStr = childAlleles.join('/');

        let found = childrenGenotypes['Pied'].find(c => c.genotype === genotypeStr);
        if (found) {
            found.probability += 0.25;
        } else {
            childrenGenotypes['Pied'].push({ genotype: genotypeStr, probability: 0.25 });
        }
    }

    // Handle Leucistic Eye
    childrenGenotypes['Leucistic Eye'] = [];
    const maleEye = male['Leucistic Eye'] ? male['Leucistic Eye'].split('/') : ['WT', 'WT'];
    const femaleEye = female['Leucistic Eye'] ? female['Leucistic Eye'].split('/') : ['WT', 'WT'];

    for (let combo of punnettCombo) {
        const childAlleles = [maleEye[combo[0]], femaleEye[combo[1]]].sort();
        const genotypeStr = childAlleles.join('/');

        let found = childrenGenotypes['Leucistic Eye'].find(c => c.genotype === genotypeStr);
        if (found) {
            found.probability += 0.25;
        } else {
            childrenGenotypes['Leucistic Eye'].push({ genotype: genotypeStr, probability: 0.25 });
        }
    }

    // Handle pattern genes
    patternGenes.forEach(gene => {
        childrenGenotypes[gene.name] = [];
        const malePattern = male[gene.name] ? male[gene.name].split('/') : ['WT', 'WT'];
        const femalePattern = female[gene.name] ? female[gene.name].split('/') : ['WT', 'WT'];

        for (let combo of punnettCombo) {
            const childAlleles = [malePattern[combo[0]], femalePattern[combo[1]]].sort();
            const genotypeStr = childAlleles.join('/');

            let found = childrenGenotypes[gene.name].find(c => c.genotype === genotypeStr);
            if (found) {
                found.probability += 0.25;
            } else {
                childrenGenotypes[gene.name].push({ genotype: genotypeStr, probability: 0.25 });
            }
        }
    });

    return childrenGenotypes;
}

function generateChildrenPhenotypes(childGenotypes) {
    let children = [{ genotype: {}, probability: 1 }];

    // Combine sex-linked genes
    let newChildren = [];
    for (let child of children) {
        for (let possibility of childGenotypes['sex-linked']) {
            const newChild = {
                genotype: { ...child.genotype, ...possibility.genotype },
                probability: child.probability * possibility.probability
            };
            newChildren.push(newChild);
        }
    }
    children = newChildren;

    // Combine autosomal color genes
    for (let gene of colorGenes) {
        newChildren = [];
        for (let child of children) {
            for (let possibility of childGenotypes[gene.name]) {
                const newChild = {
                    genotype: { ...child.genotype, [gene.name]: possibility.genotype },
                    probability: child.probability * possibility.probability
                };
                newChildren.push(newChild);
            }
        }
        children = newChildren;
    }

    // Combine Pied
    newChildren = [];
    for (let child of children) {
        for (let possibility of childGenotypes['Pied']) {
            const newChild = {
                genotype: { ...child.genotype, 'Pied': possibility.genotype },
                probability: child.probability * possibility.probability
            };
            newChildren.push(newChild);
        }
    }
    children = newChildren;

    // Combine Leucistic Eye
    newChildren = [];
    for (let child of children) {
        for (let possibility of childGenotypes['Leucistic Eye']) {
            const newChild = {
                genotype: { ...child.genotype, 'Leucistic Eye': possibility.genotype },
                probability: child.probability * possibility.probability
            };
            newChildren.push(newChild);
        }
    }
    children = newChildren;

    // Combine pattern genes
    for (let gene of patternGenes) {
        newChildren = [];
        for (let child of children) {
            for (let possibility of childGenotypes[gene.name]) {
                const newChild = {
                    genotype: { ...child.genotype, [gene.name]: possibility.genotype },
                    probability: child.probability * possibility.probability
                };
                newChildren.push(newChild);
            }
        }
        children = newChildren;
    }

    // Calculate phenotypes
    return children.map(child => {
        const sex = child.genotype['Sex-Linked Color'].includes('w') ? 'Female' : 'Male';
        const colorResult = getPhenotypeFromBird(
            child.genotype,
            sex,
            'Wild Type',
            colorGenes,
            [{ name: 'Sex-Linked Color', allotypes: sexLinkedColorAllotypes, sexLinked: true }],
            hetSexColors,
            multiGeneColors
        );

        // Get pattern phenotype
        let pattern = 'Barred Wing Wild Type';
        for (let gene of patternGenes) {
            if (child.genotype[gene.name] && child.genotype[gene.name].includes(gene.notation)) {
                pattern = gene.name;
                break;
            }
        }

        // Get pied phenotype
        const piedResult = getPhenotypeFromBird(
            child.genotype,
            sex,
            'Non-Leucistic Wild Type',
            [],
            [{ name: 'Pied', allotypes: piedAllotypes, sexLinked: false }],
            hetPied,
            []
        );

        // Get eye phenotype
        const eyeResult = getPhenotypeFromBird(
            child.genotype,
            sex,
            'Non-Leucistic Wild Type',
            [],
            [{ name: 'Leucistic Eye', allotypes: whiteEyeAllotypes, sexLinked: false }],
            hetWhite,
            []
        );

        return {
            genotype: child.genotype,
            probability: child.probability,
            phenotype: {
                'Sex': sex,
                'Color': colorResult.finalBirdPhenotype,
                'Pattern': pattern,
                'Pied': piedResult.finalBirdPhenotype,
                'Leucistic Eye': eyeResult.finalBirdPhenotype
            }
        };
    });
}
