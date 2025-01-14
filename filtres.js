
// Fonction pour afficher les recettes
function displayRecipes(recipes) {
    const afficheArticleRecette = document.getElementById("sectionArticle");
    afficheArticleRecette.innerHTML = "";
    
    recipes.forEach(recipe => {
        const article = document.createElement("div");
        article.className = "artileRecipes";

        // Ajouter le contenu HTML de l'article
        article.innerHTML = `
            <div class="emptyRow"></div>
            <div class="fullRow">
                <div class="row nameTimeDiv">
                    <div class="col-8">${recipe.name}</div>
                    <div class="col-4"><i class="far fa-clock"></i> ${recipe.time} min</div>
                </div>
                <div class="row ingredientsDescription">
                    <ul class="col-5 colIngredientsClass">
                        ${recipe.ingredients.map(ingredient => {
                            let result = `<li style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span style="font-weight: 900;">${ingredient.ingredient}</span>`;
                            if (ingredient.quantity) {
                                result += `: ${ingredient.quantity}`;
                            } 
                            if (ingredient.unit) {
                                result += ` ${ingredient.unit}`;
                            }
                            result += `</li>`;
                            return result;
                        }).join('')}
                    </ul>
                    <div class="col-7 colDescriptionClass">
                        <span>${recipe.description}</span>
                    </div>
                </div>
            </div>
        `;

        // Ajouter l'article au DOM
        afficheArticleRecette.appendChild(article);

        // Sélectionner et styliser `.emptyRow`
        const imageElementDiv = article.querySelector(".emptyRow");
        imageElementDiv.style.backgroundColor = "red";

        // Ajouter une image
        const imageElement = document.createElement("img");
        imageElement.className = "w-100 imageH"
        imageElement.src = recipe.image;
        imageElement.alt = recipe.name;
        imageElementDiv.appendChild(imageElement);
    });
}

// Fonction de recherche principale
function recherchePrincipaleBoucles(recipes) {
    // Vérification de la validité de l'entrée
    if (!Array.isArray(recipes)) {
        console.error("Le paramètre recipes doit être un tableau.");
        return;
    }
    const inputSearch = document.getElementById("inputSearch");
    const afficheArticleRecette = document.getElementById("sectionArticle");
    if (!inputSearch || !afficheArticleRecette) {
        console.error("Les éléments HTML nécessaires sont introuvables.");
        return;
    }
    inputSearch.addEventListener("input", () => {
        const inputUser = inputSearch.value.trim().toLowerCase(); 
        // Si la saisie est inférieure à 3 caractères, réinitialiser l'affichage
        if (inputUser.length < 3) {
            displayRecipes(recipes);
            updateDropdowns(recipes);
            return;
        }
        // Filtre des recettes manuellement
        const filtreRecipes = [];
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            // Vérification du nom de la recette
            if (recipe.name.toLowerCase().includes(inputUser)) {
                filtreRecipes.push(recipe);
                continue;
            }
            // Vérification de la description
            if (recipe.description.toLowerCase().includes(inputUser)) {
                filtreRecipes.push(recipe);
                continue;
            }
            // Vérification des ingrédients
            let ingredientFound = false;
            for (let j = 0; j < recipe.ingredients.length; j++) {
                const ingredient = recipe.ingredients[j];
                if (ingredient.ingredient.toLowerCase().includes(inputUser)) {
                    ingredientFound = true;
                    break;
                }
            }
            if (ingredientFound) {
                filtreRecipes.push(recipe);
            }
        }
        // Affichage des recettes filtrées ou d'un message d'absence de résultats
        if (filtreRecipes.length > 0) {
            displayRecipes(filtreRecipes);
        } else {
            afficheArticleRecette.innerHTML = `
                <p>Aucune recette ne correspond à votre recherche.</p>
            `;
        }
        // Mise à jour des listes déroulantes
        updateDropdowns(filtreRecipes);
    });
}

function reinitializeDropdownInteractions() {
    dropdownInteractions('ingredientsDropdown', 'ingredientsDropdownHeader', '#3282f7')
    dropdownInteractions('appareilsDropdown', 'appareils', '#68d9a4')
    dropdownInteractions('ustensilesDropdown', 'ustensilesDropdownHeader', '#ed6454')
}
// fonction pour filtrer les dropdown en fonction du filtre général ou principale
function updateDropdowns(filtreRecipes) {
    // Si aucune recette n'est trouvée, on vide les dropdowns
    if (filtreRecipes.length === 0) {
        updateDropdownList('ingredientsDropdown', [])
        updateDropdownList('appareilsDropdown', [])
        updateDropdownList('ustensilesDropdown', [])
        return
    }
    const ingredientsSet = new Set()
    const appliancesSet = new Set()
    const utensilsSet = new Set()
    filtreRecipes.forEach(recipe => {
        recipe.ingredients.forEach(item => {
            ingredientsSet.add(item.ingredient)
        })
        appliancesSet.add(recipe.appliance)
        recipe.ustensils.forEach(ustensil => {
            utensilsSet.add(ustensil)
        })
    })
    // Mise à jour des dropdowns avec les éléments filtrés
    updateDropdownList('ingredientsDropdown', Array.from(ingredientsSet))
    updateDropdownList('appareilsDropdown', Array.from(appliancesSet))
    updateDropdownList('ustensilesDropdown', Array.from(utensilsSet))
    // Réinitialisation des nteractions
    reinitializeDropdownInteractions()
}
// fonction pour mettre à jour les listes des dropdowns
function updateDropdownList(id, items) {
    const dropdownList = document.querySelector(`.${id} .dropdownList ul`)
    dropdownList.innerHTML = items.map(item => `<li>${item}</li>`).join('')
}
loadRecipes()