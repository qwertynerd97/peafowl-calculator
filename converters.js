function saveGenotypeToBird(bird, geneName, genotype) {
    if (genotype === 'WT/WT' || genotype === 'Z(WT)/Z(WT)' || genotype === 'Z(WT)/w') {
        if (bird.hasOwnProperty(geneName)) {
            delete bird[geneName];
        }
    } else {
        bird[geneName] = genotype;
    }
}

function updateSimpleGenesWithPhenotype(bird, phenotype, simpleGenes, clearExisting = true) {
    let foundPhenotype = false;

    // Check simple genes
    for (let gene of simpleGenes) {
        // If the current gene we are checking matches the selected
        // phenotype, set the genotype in the bird equal to homozygous
        // for the trait
        if (phenotype === gene.name) {
            bird[gene.name] = gene.notation + '/' + gene.notation;
            foundPhenotype = true;
        }
        // If the current gene we are checking does not match the phenotype
        // we should clear the genotype for that gene
        else if (clearExisting && bird.hasOwnProperty(gene.name)) {
            delete bird[gene.name];
        }
    }

    return foundPhenotype;
}

function updateGeneWithPhenotype(bird, phenotype, sex, geneName, allotypes, geneIsSexLinked = false, clearExisting = true) {
    let foundPhenotype = false;

    // Reset the gene to the default wild type
    if (clearExisting && bird.hasOwnProperty(geneName)) {
        delete bird[geneName];
    }

    // Check all allotypes to see if they match the phenotype
    for (let allotype of allotypes) {
        if (phenotype === allotype.name) {
            if (geneIsSexLinked && sex === 'Female') {
                bird[geneName] = allotype.notation + '/w';
            } else {
                bird[geneName] = allotype.notation + '/' + allotype.notation;
            }
            foundPhenotype = true;
        }
    }

    return foundPhenotype;
}

function updateGenesWithHetAllelePhenotype(bird, phenotype, hetPhenotypes) {
    let foundPhenotype = false;

    // Check all named het phenotypes to see if they match the phenotype
    for (let hetPhenotype of hetPhenotypes) {
        if (phenotype === hetPhenotype.name) {
            bird[hetPhenotype.geneName] = hetPhenotype.alleles[0] + '/' + hetPhenotype.alleles[1];
            foundPhenotype = true;
        }
    }

    return foundPhenotype;
}

function savePhenotypeToBird(bird, phenotype, sex, simpleGenes, multiAllotypeGenes,
    sexLinkedAllotypes, multiGeneTraits,
    sexAndAutosomalCombos, hetTraits) {

    // Update the simple genes
    let foundPhenotype = updateSimpleGenesWithPhenotype(bird, phenotype, simpleGenes);

    // Update the sex-linked color genes
    for (let gene of multiAllotypeGenes) {
        if (updateGeneWithPhenotype(bird, phenotype, sex, gene.name, gene.allotypes, gene.sexLinked)) {
            foundPhenotype = true;
        }
    }

    // At this point, all genes have been cleared except for a matched phenotype
    // If we have found the matching phenotype already, we can stop here
    if (foundPhenotype) {
        return;
    }

    // Save phenotype for het sex traits, and return if we find a phenotype
    if (updateGenesWithHetAllelePhenotype(bird, phenotype, hetTraits)) {
        return;
    }

    // Save the phenotype data for genotypes that match multiple genes
    for (let trait of multiGeneTraits) {
        if (phenotype === trait.name) {
            // for each gene that makes up the multi-gene trait
            for (let geneName of trait.genesNeeded) {
                // check for that phenotype in the simple gene list and save it to the bird
                if (updateSimpleGenesWithPhenotype(bird, geneName, simpleGenes, false)) {
                    // if we updated the genotype, that means we found a match for this phenotype
                    // and should stop looking
                    continue;
                }

                // check for that phenotype in the multiAllotypeGenes and save it to the bird
                let foundPhenotype = false;
                for (let gene of multiAllotypeGenes) {
                    if (updateGeneWithPhenotype(bird, geneName, sex, gene.name, gene.allotypes, gene.sexLinked, false)) {
                        foundPhenotype = true;
                        continue;
                    }
                }

                // if we updated the genotype, that means we found a match for this phenotype
                // and should stop looking
                if (foundPhenotype) {
                    continue;
                }

                updateGenesWithHetAllelePhenotype(bird, geneName, hetTraits);
            }

            break;
        }
    }
}

function getSimplePhenotypesFromBird(bird, phenotypes, simpleGenes) {
    for (let gene of simpleGenes) {
        if (bird.hasOwnProperty(gene.name)) {
            if (bird[gene.name] === gene.notation + '/' + gene.notation) {
                // Add the previous bird phenotype to the list, and change the current phenotype
                phenotypes.push(gene.name);
            }
        }
    }

    return phenotypes;
}

function getPhenotypesForGeneFromBird(bird, phenotypes, sex, geneName, allotypes, geneIsSexLinked = false) {
    for (let allotype of allotypes) {
        if (bird.hasOwnProperty(geneName) && (
            // If the gene is not sex-linked, or the bird is male, check for homozygous genes
            ((!geneIsSexLinked || sex === 'Male') && bird[geneName] === allotype.notation + '/' + allotype.notation) ||
            // If the gene is sex linked and the bird is female, check for the female-specific variant
            (geneIsSexLinked && sex === 'Female' && bird[geneName] === allotype.notation + '/w')
        )) {
            phenotypes.push(allotype.name);
        }
    }

    return phenotypes;
}

function getHetPhenotypesFromBird(bird, phenotypes, hetPhenotypes) {
    for (let hetPhenotype of hetPhenotypes) {
        if (
            bird.hasOwnProperty(hetPhenotype.geneName) &&
            (bird[hetPhenotype.geneName] === hetPhenotype.alleles[0] + '/' + hetPhenotype.alleles[1] ||
                bird[hetPhenotype.geneName] === hetPhenotype.alleles[1] + '/' + hetPhenotype.alleles[0])
        ) {
            // Add the previous bird phenotype to the list, and change the current phenotype
            phenotypes.push(hetPhenotype.name);
        }
    }

    return phenotypes;
}

function getPhenotypeFromBird(bird, sex, wildType, simpleGenes, multiAllotypeGenes, hetAllotypeGenes, multiGeneTraits) {
    // Because phenotypes are not mutually exclusive, we want to track
    // all possible phenotypes
    let birdPhenotypes = [];

    // We need to check all the simple genes to see if we can find a phenotype name
    birdPhenotypes = getSimplePhenotypesFromBird(bird, birdPhenotypes, simpleGenes);

    // All multi-allotype genes
    for (let gene of multiAllotypeGenes) {
        birdPhenotypes = getPhenotypesForGeneFromBird(bird, birdPhenotypes, sex,
            gene.name, gene.allotypes, gene.sexLinked);
    }

    // And all het genes
    birdPhenotypes = getHetPhenotypesFromBird(bird, birdPhenotypes, hetAllotypeGenes);

    // Once we have all possible phenotypes, we need to check if they combine
    let multiGeneTraitExactMatch = false;
    for (let phenotype of multiGeneTraits) {
        let matchesPhenotype = true;
        // We want to make sure that all phenotypes in the genes needed list have been identified
        for (let gene of phenotype.genesNeeded) {
            if (!birdPhenotypes.includes(gene)) {
                matchesPhenotype = false;
                break;
            }
        }

        if (matchesPhenotype) {
            // We also want to check that the number of found phenotypes EXACTLY
            multiGeneTraitExactMatch = multiGeneTraitExactMatch || phenotype.genesNeeded.length === birdPhenotypes.length;
            birdPhenotypes.push(phenotype.name);
        }
    }

    // Birds are wild type by default, or else are the last item in the phenotypes array
    let finalBirdPhenotype = birdPhenotypes.length > 0 ? birdPhenotypes[birdPhenotypes.length - 1] : wildType;
    // We also want to track whether or not this phenotype has ever been
    // observed before (ie if we have a record of it)
    let isUnknownPhenotype = false;
    if (birdPhenotypes.length <= 1) {
        isUnknownPhenotype = false;
    } else {
        isUnknownPhenotype = !multiGeneTraitExactMatch;
    }
    return { finalBirdPhenotype, birdPhenotypes, isUnknownPhenotype };
}
