
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
                        ${recipe.ingredients.map(ingredient => `
                            <li>${ingredient.ingredient}${ingredient.quantity ? `: ${ingredient.quantity}` : ''}${ingredient.unit ? ` ${ingredient.unit}` : ''}</li>
                        `).join('')}
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
// Fonction pour afficher le contenu d'une recette ou l'article recette 
function displayItemsRecipes(recipes) {
    const afficheArticleRecette = document.getElementById("sectionArticle")
    recipes.forEach(recipe => {
        const artileRecipes = document.createElement("div")
        artileRecipes.className = "artileRecipes"
        // creation de la premiere ligne(ligne vide)
        const emptyRow = document.createElement("div")
        emptyRow.className = "emptyRow"
        // creationde la deuxième ligne (ligne conenant les elements d'une recette)
        const fullRow = document.createElement("div")
        fullRow.className = "fullRow"
        // creation de la ligne nom et temps de cuisson
        const nameTimeDiv = document.createElement("div")
        nameTimeDiv.className = "row  nameTimeDiv"
        nameTimeDiv.innerHTML = `
    <div class="col-9">${recipe.name}</div>
    <div class="col-3"><i class="far fa-clock"></i> <span>${recipe.time} min</span></div>
    `
        fullRow.appendChild(nameTimeDiv)
        // CREATION DE LA LIGNE INGREDIENT ET DESCRIPTION
        // CREATION DE LA LIGNE INGREDIENT ET DESCRIPTION
        const rowIngredientsDescription = document.createElement("div")
        rowIngredientsDescription.className = "row ingredientsDescription"
        // Colonne des ingrédients
        const colIngredients = document.createElement("ul")
        colIngredients.className = "col-8 colIngredientsClass"

        // Parcours de chaque ingrédient et ajout à la page
        recipe.ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement('li')
            ingredientItem.className = "ingredientItem"
            // Création du texte de l'ingrédient
            let ingredientText = `${ingredient.ingredient}`
            if (ingredient.quantity) {
                ingredientText = ` ${ingredient.ingredient} ${ingredient.quantity} ${ingredient.unit ? ingredient.unit : ''}`
            }
            ingredientItem.textContent = ingredientText
            colIngredients.appendChild(ingredientItem)
            rowIngredientsDescription.appendChild(colIngredients)
            fullRow.appendChild(rowIngredientsDescription)
        })

        // Colonne de description
        const colDescription = document.createElement("div");
        colDescription.className = "col-4 colDescriptionClass"
        const description = document.createElement("span")
        description.textContent = recipe.description
        colDescription.appendChild(description)
        rowIngredientsDescription.appendChild(colDescription)
        fullRow.appendChild(rowIngredientsDescription)
        // ajout des lignes das la carte article
        artileRecipes.appendChild(emptyRow)
        artileRecipes.appendChild(fullRow)

        afficheArticleRecette.appendChild(artileRecipes)
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