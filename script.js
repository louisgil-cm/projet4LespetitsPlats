// Fonction pour récupérer les données des recettes
async function recipes() {
    const response = await fetch("recipes.json")
    const recipes = await response.json()

    displayIngredients(recipes)
    displayAppareils(recipes)
    displayUstensiles(recipes)
    displayArtcleRecipes(recipes)
    recherchePrincipale(recipes)
   
}
// variable des elements filtres
const sectionFiltering = document.getElementById("sectionFiltering")
const filteringDiv = document.getElementById("filtering")

// Fonction pour afficher le contenu d'une recette ou l'article recette 
function displayArtcleRecipes(recipes) {
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
            fullRow.appendChild( rowIngredientsDescription)
        });

        // Colonne de description
        const colDescription = document.createElement("div");
        colDescription.className = "col-4 colDescriptionClass"
        const description = document.createElement("span")
        description.textContent = recipe.description
        colDescription.appendChild(description)
        rowIngredientsDescription.appendChild(colDescription)
        fullRow.appendChild( rowIngredientsDescription)

    // ajout des lignes das la carte article
    artileRecipes.appendChild(emptyRow)
    artileRecipes.appendChild(fullRow)

    afficheArticleRecette.appendChild( artileRecipes)
    })
}

// FONCTION POUR FILTRER LES RECETTES SELON QUE L'UTILISATEUR ENTRE SUR LE CHAMPS DE RECHERCHE LES VALEURS DES PROPRIETES: "name, description, ingredients
function recherchePrincipale(recipes){
    // récupération de l'input de recherche
    const inputSearch = document.getElementById("inputSearch")
    // ajout d'un événement sur l'input de recherche pour observer le mot que l'utilisateur va saisir
    inputSearch.addEventListener("input", () => {
        // récupération de la section qui permet initialement d'afficher les articles recettes
        const afficheArticleRecette = document.getElementById("sectionArticle")
        // la zone d'affichage des recettes est à zéro avant le filtre fonction du titre, des ingrédients et de la description
        afficheArticleRecette.innerHTML = ""
        // récupération de la valeur saisie par l'utilisateur
        const inputUser = inputSearch.value.toLowerCase()
        // Filtrage des recettes en fonction de la saisie
        const filtreRecipes = recipes.filter(recipe => {
            // Vérification dans le nom
            const writeName = recipe.name.toLowerCase().includes(inputUser)
            // Vérification dans la description
            const writeDescription = recipe.description.toLowerCase().includes(inputUser)
            // Vérification dans les ingrédients
            const writeIngredients = recipe.ingredients.some(ingredient => 
                ingredient.ingredient.toLowerCase().includes(inputUser)
            );
            return writeName || writeDescription || writeIngredients
        });
        // Affichage des recettes filtrées
        displayArtcleRecipes(filtreRecipes)
    })
}



// INTEGRATION DES DROPDOWN
    // FONCTION POUR AFFICHER LA DROPDOWN INGREDIENTS
    function displayIngredients(recipes) {
        const ingredientsSet = new Set()
        recipes.forEach(recipe => {
            recipe.ingredients.forEach(item => {
                // Ajout de chaque ingrédient dans le Set
                ingredientsSet.add(item.ingredient)
            });
        });
        
        // Conversion du Set en tableau
        const ingredients = Array.from(ingredientsSet);
        const ingredientsListHTML = ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');
        
        filteringDiv.innerHTML += `
        <div class="col-2 dropdownIngredients dropdown">
            <div class="OnDropdownDivIngredients OnDropdownDiv">
                <button class="bouttonDropdownIngredients bouttonDropdown">Ingredients</button>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <div class="dropdownItem dropdownItemIngredients">
                <div class="inputOffDrapdown">
                    <input class="w-100 inputSearch" type="search" name="inputSearch" id="inputSearchIngredients" placeholder="Rechercher un ingredient">
                    <i class="fa-solid fa-chevron-up"></i>
                </div>
                <div class="dropdownList">
                    <ul>
                        ${ingredientsListHTML}
                    </ul>
                </div>
            </div>
        </div>
        `;
        
        sectionFiltering.appendChild(filteringDiv);
        
        // Gestion des interactions du dropdown
        document.addEventListener('click', function (event) {
            const dropdowns = document.querySelectorAll('.dropdownIngredients')
            const OnDropdownDivIngredients = document.querySelector(".OnDropdownDivIngredients")
        
            dropdowns.forEach(dropdown => {
                const chevronDown = dropdown.querySelector('.fa-chevron-down')
                const chevronUp = dropdown.querySelector('.fa-chevron-up')
                const dropdownItem = dropdown.querySelector('.dropdownItem')
                const inputSearch = dropdown.querySelector('#inputSearchIngredients')
                const dropdownList = dropdown.querySelector('.dropdownList ul')
        
                // Ouverture du dropdown
                if (chevronDown && chevronDown.contains(event.target)) {
                    dropdownItem.style.display = 'block'
                    chevronUp.style.display = 'inline'
                    dropdown.style.width = "60%"
                    OnDropdownDivIngredients.style.display = "none"
                }
        
                // Fermeture du dropdown
                if (chevronUp && chevronUp.contains(event.target)) {
                    dropdownItem.style.display = 'none'
                    chevronDown.style.display = 'inline'
                    chevronUp.style.display = 'none'
                    dropdown.style.width = "initial"
                    OnDropdownDivIngredients.style.display = "block"
                }
        
                // Fermeture si on clique ailleurs
                if (!dropdown.contains(event.target) && !chevronDown.contains(event.target) && !chevronUp.contains(event.target)) {
                    dropdownItem.style.display = 'none'
                    chevronDown.style.display = 'inline'
                    chevronUp.style.display = 'none'
                    dropdown.style.width = "initial"
                    OnDropdownDivIngredients.style.display = "block"
                }
        
                // Recherche dans la liste
                if (inputSearch) {
                    inputSearch.addEventListener('input', function () {
                        const filter = inputSearch.value.toLowerCase()
                        const listItems = dropdownList.querySelectorAll('li')
        
                        listItems.forEach(item => {
                            if (item.textContent.toLowerCase().includes(filter)) {
                                item.style.display = 'block'
                            } else {
                                item.style.display = 'none'
                            }
                        });
                    });
                }
            });
        });
    }
     // FONCTION POUR AFFICHER LA DROPDOWN APPAREILS
     function displayAppareils(recipes) {
        // Extraction des appareils uniques
        const appareilsSet = new Set();
        recipes.forEach(recipe => {
            appareilsSet.add(recipe.appliance);
        });
    
        // Conversion en tableau pour générer la liste HTML
        const appareils = Array.from(appareilsSet);
        const appareilsListHTML = appareils.map(appliance => `<li>${appliance}</li>`).join('')
    
        // Génération du contenu complet pour le dropdown des appareils
        filteringDiv.innerHTML += `
        <div class="col-2 dropdownAppareils dropdown">
            <div class="OnDropdownDivAppareils OnDropdownDiv">
                <button class="bouttonDropdownAppareils bouttonDropdown">Appareils</button>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <div class="dropdownItem dropdownItemAppareils">
                <div class="inputOffDrapdown">
                    <input class= "w-100 inputSearch" type="search" name="inputSearch" id="inputSearchAppareils" placeholder="Rechercher un appareil">
                    <i class="fa-solid fa-chevron-up"></i>
                </div>
                <div class="dropdownList">
                    <ul>
                        ${appareilsListHTML}
                    </ul>
                </div>
            </div>
        </div>
        `;
    
        // Ajout du contenu à la section des filtres
        sectionFiltering.appendChild(filteringDiv);
    
        // Gestion des interactions du dropdown
        document.addEventListener('click', function (event) {
            const dropdowns = document.querySelectorAll('.dropdownAppareils')
    
            dropdowns.forEach(dropdown => {
                const chevronDown = dropdown.querySelector('.fa-chevron-down')
                const chevronUp = dropdown.querySelector('.fa-chevron-up')
                const dropdownItem = dropdown.querySelector('.dropdownItem')
                const inputSearch = dropdown.querySelector('#inputSearchAppareils')
                const dropdownList = dropdown.querySelector('.dropdownList ul')
    
                // Ouverture du dropdown
                if (chevronDown && chevronDown.contains(event.target)) {
                    dropdownItem.style.display = 'block'
                    chevronUp.style.display = 'inline'
                     dropdown.style.width = "40%"
                }
    
                // Fermeture du dropdown
                if (chevronUp && chevronUp.contains(event.target)) {
                    dropdownItem.style.display = 'none'
                    chevronDown.style.display = 'inline'
                    chevronUp.style.display = 'none'
                    dropdown.style.width = "initial"
                }
    
                // Fermeture si on clique ailleurs
                if (!dropdown.contains(event.target) && !chevronDown.contains(event.target) && !chevronUp.contains(event.target)) {
                    dropdownItem.style.display = 'none';
                    chevronDown.style.display = 'inline';
                    chevronUp.style.display = 'none';
                    dropdown.style.width = "initial"
                }
    
                // Recherche dans la liste
                if (inputSearch) {
                    inputSearch.addEventListener('input', function () {
                        const filter = inputSearch.value.toLowerCase();
                        const listItems = dropdownList.querySelectorAll('li');
    
                        listItems.forEach(item => {
                            if (item.textContent.toLowerCase().includes(filter)) {
                                item.style.display = 'block';
                            } else {
                                item.style.display = 'none';
                            }
                        });
                    });
                }
            });
        });
    }
     // FONCTION POUR AFFICHER LA DROPDOWN USTENSILES
     function displayUstensiles(recipes) {
        // Extraction des ustensiles uniques
        const ustensilesSet = new Set();
        recipes.forEach(recipe => {
            recipe.ustensils.forEach(ustensil => ustensilesSet.add(ustensil));
        });
    
        // Conversion en tableau pour les utiliser dans la liste HTML
        const ustensiles = Array.from(ustensilesSet);
    
        // Création des éléments <li> pour chaque ustensile
        const ustensilesListHTML = ustensiles.map(ustensil => `<li>${ustensil}</li>`).join('');
    
        // Mise à jour du contenu HTML
        filteringDiv.innerHTML += `
        <div class="col-2 dropdownUstensiles dropdown">
            <div class="OnDropdownDivUstensiles OnDropdownDiv">
                <button class="bouttonDropdownUstensiles bouttonDropdown">Ustensiles</button>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <div class="dropdownItem dropdownItemUstensiles">
                <div class="inputOffDrapdown">
                    <input class="w-100 inputSearch" type="search" name="inputSearch" id="inputSearchUstensiles" placeholder="Rechercher un ustensile">
                    <i class="fa-solid fa-chevron-up"></i>
                </div>
                <div class="dropdownList">
                    <ul>
                        ${ustensilesListHTML}
                    </ul>
                </div>
            </div>
        </div>
        `;
    
        // Ajout de la structure à la section des filtres
        sectionFiltering.appendChild(filteringDiv);
    
        // Gestion des interactions du dropdown
        document.addEventListener('click', function (event) {
            const dropdowns = document.querySelectorAll('.dropdownUstensiles')
    
            dropdowns.forEach(dropdown => {
                const chevronDown = dropdown.querySelector('.fa-chevron-down')
                const chevronUp = dropdown.querySelector('.fa-chevron-up')
                const dropdownItem = dropdown.querySelector('.dropdownItem')
                const inputSearch = dropdown.querySelector('#inputSearchUstensiles')
                const dropdownList = dropdown.querySelector('.dropdownList ul')
    
                // Ouverture du dropdown
                if (chevronDown && chevronDown.contains(event.target)) {
                    dropdownItem.style.display = 'block'
                    chevronUp.style.display = 'inline'
                    dropdown.style.width = "40%"
                }
    
                // Fermeture du dropdown
                if (chevronUp && chevronUp.contains(event.target)) {
                    dropdownItem.style.display = 'none'
                    chevronDown.style.display = 'inline'
                    chevronUp.style.display = 'none'
                    dropdown.style.width = "initial"
                }
    
                // Fermeture si on clique ailleurs
                if (!dropdown.contains(event.target) && !chevronDown.contains(event.target) && !chevronUp.contains(event.target)) {
                    dropdownItem.style.display = 'none'
                    chevronDown.style.display = 'inline'
                    chevronUp.style.display = 'none'
                    dropdown.style.width = "initial"
                }
    
                // Recherche dans la liste
                if (inputSearch) {
                    inputSearch.addEventListener('input', function () {
                        const filter = inputSearch.value.toLowerCase()
                        const listItems = dropdownList.querySelectorAll('li')
    
                        listItems.forEach(item => {
                            if (item.textContent.toLowerCase().includes(filter)) {
                                item.style.display = 'block'
                            } else {
                                item.style.display = 'none'
                            }
                        })
                    })
                }
            })
        })
    }
recipes()

