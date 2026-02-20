// Single gene colors
const colorGenes = [
    { notation: 'br', name: 'Buford Bronze' },
    { notation: 'o', name: 'Opal' },
    { notation: 'md', name: 'Midnight' },
    { notation: 'j', name: 'Jade' },
    { notation: 'mo', name: 'Montana' },
    { notation: 'ch', name: 'Charcoal' },
    { notation: 'st', name: 'Steel' },
    { notation: 'um', name: 'Ultramarine' },
    // { notation: 'bu', name: 'Burnt Umber' }
];

const sexLinkedColorAllotypes = [
    { notation: 'Z(c)', name: 'Cameo' },
    { notation: 'Z(pl)', name: 'US Purple' },
    { notation: 'Z(va)', name: "Sonja's Violeta" },
    { notation: 'Z(ve)', name: 'European Violet' },
    { notation: 'Z(pl:c)', name: 'Peach' }
];

const multiGeneColors = [
    { name: 'Platinum', genesNeeded: ['Buford Bronze', 'Opal'] },
    { name: 'Taupe', genesNeeded: ['US Purple', 'Opal'] },
    { name: 'Mocha', genesNeeded: ['US Purple', 'Midnight'] },
    { name: 'Ivory', genesNeeded: ['Cameo', 'Opal'] },
    { name: 'Indigo', genesNeeded: ['US Purple', 'Buford Bronze'] },
    { name: 'Hazel', genesNeeded: ['US Purple', 'Buford Bronze'] },
    { name: 'Indigo/Hazel', genesNeeded: ['US Purple', 'Buford Bronze'] },
    { name: 'Cinnamon', genesNeeded: ['Cameo', 'Buford Bronze'] },
    { name: 'US Ivory', genesNeeded: ['Cameo', 'Opal'] }
];

const sexAndAutosomalComboColors = [
    { name: 'Taupe', autosomalGene: 'o', sexGene: 'Z(pl)' },
    { name: 'Mocha', autosomalGene: 'md', sexGene: 'Z(pl)' },
    { name: 'Ivory', autosomalGene: 'o', sexGene: 'Z(c)' },
    { name: 'Indigo', autosomalGene: 'br', sexGene: 'Z(pl)' },
    { name: 'Hazel', autosomalGene: 'br', sexGene: 'Z(pl)' },
    { name: 'Indigo/Hazel', autosomalGene: 'br', sexGene: 'Z(pl)' }
];

const hetSexColors = [
    { name: 'Midway between Violet and Purple', geneName: 'Sex-Linked Color', alleles: ['Z(pl)', 'Z(ve)'] },
    { name: 'Cameo', geneName: 'Sex-Linked Color', alleles: ['Z(c)', 'Z(pl:c)'] },
    { name: 'US Purple', geneName: 'Sex-Linked Color', alleles: ['Z(pl)', 'Z(pl:c)'] }
];

const patternGenes = [
    { notation: 'bs', name: 'Blackshoulder' }
];

const piedAllotypes = [
    { notation: 'p', name: 'Dark Pied' },
    { notation: 'W', name: 'White' }
];
const hetPied = [
    { name: 'Pied', geneName: 'Pied', alleles: ['p', 'W'] },
    { name: 'Het White', geneName: 'Pied', alleles: ['WT', 'W'] },
    { name: 'Het Pied', geneName: 'Pied', alleles: ['WT', 'p'] }
];

const whiteEyeAllotypes = [
    { notation: 'WE', name: 'White Eye' },
    { notation: 'sWE', name: 'Silver White Eye' }
];

const hetWhite = [
    { name: 'Silver White Eye', geneName: 'White Eye', alleles: ['WE', 'sWE'] },
    // { name: 'Dark Pied', geneName: 'Pied', alleles: ['WT', 'W'] },
    // { name: 'Dark Pied', geneName: 'Pied', alleles: ['WT', 'p'] }
];

// Build color list for dropdowns
function buildColorList(sex) {
    const colors = new Set(['Wild Type', 'Unknown']);

    colorGenes.forEach(gene => colors.add(gene.name));
    sexLinkedColorAllotypes.forEach(allotype => colors.add(allotype.name));
    multiGeneColors.forEach(phenotype => colors.add(phenotype.name));
    sexAndAutosomalComboColors.forEach(phenotype => colors.add(phenotype.name));

    if (sex === 'Male') {
        hetSexColors.forEach(phenotype => colors.add(phenotype.name));
    }

    return Array.from(colors).sort();
}

function buildPatternList() {
    const patterns = ['Barred Wing Wild Type'];
    patternGenes.forEach(gene => patterns.push(gene.name));
    return patterns;
}

function buildPiedList() {
    const pied = new Set(['Non-Leucistic Wild Type']);
    piedAllotypes.forEach(allotype => pied.add(allotype.name));
    hetPied.forEach(phenotype => pied.add(phenotype.name));
    return Array.from(pied);
}

function buildEyeList() {
    const eyes = ['Non-Leucistic Wild Type'];
    whiteEyeAllotypes.forEach(allotype => eyes.push(allotype.name));
    return eyes;
}
