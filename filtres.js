
// Fonction pour afficher les recettes
function displayRecipes(recipes) {
    const afficheArticleRecette = document.getElementById("sectionArticle")
    afficheArticleRecette.innerHTML = ""
    recipes.forEach(recipe => {
        const article = document.createElement("div")
        article.className = "artileRecipes"

        article.innerHTML = `
            <div class="emptyRow"></div>
            <div class="fullRow">
                <div class="row nameTimeDiv">
                    <div class="col-9">${recipe.name}</div>
                    <div class="col-3"><i class="far fa-clock"></i> ${recipe.time} min</div>
                </div>
                <div class="row ingredientsDescription">
                  <ul class="col-8 colIngredientsClass">
                    ${recipe.ingredients.map(ingredient => {
                        let result = `<li style=" white-space: nowrap; overflow:hidden; text-overflow: ellipsis;"><span style="font-weight: 900;">${ingredient.ingredient}</span>`;
                        
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
                    <div class="col-4 colDescriptionClass">
                        <span>${recipe.description}</span>
                    </div>
                </div>
            </div>
        `
        afficheArticleRecette.appendChild(article)
    })
}

// Fonction de recherche principale
function recherchePrincipale(recipes) {
    const inputSearch = document.getElementById("inputSearch")
    inputSearch.addEventListener("input", () => {
        const inputUser = inputSearch.value.toLowerCase()
        const afficheArticleRecette = document.getElementById("sectionArticle")
        if (inputUser.length < 3) {
            displayRecipes(recipes)
            updateDropdowns(recipes)
            return
        }
        const filtreRecipes = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(inputUser) ||
            recipe.description.toLowerCase().includes(inputUser) ||
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(inputUser))
        )

        if (filtreRecipes.length) {
            displayRecipes(filtreRecipes)
        }
        else {
            afficheArticleRecette.innerHTML = '<p>Aucune recette ne correspond à votre recherche.</p>'
        }
        updateDropdowns(filtreRecipes)

    })
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