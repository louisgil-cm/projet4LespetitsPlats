
// Fonction générique pour créer un dropdown
function displayDropdown({ title, placeholder, data, id, containerClass, inputClass, buttonClass, color, dropdownHeaderId }) {
    const dropdownContainer = document.createElement("div");
    dropdownContainer.className = `dropdownContainer ${containerClass} col-2`
    dropdownContainer.innerHTML = `
        <div class="dropdown ${id}">
            <div class="dropdownHeader" style="background-color: ${color};" id="${dropdownHeaderId}">
                <button class="${buttonClass}" style="background-color: ${color};">${title}</button>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <div class="dropdownBody" style="background-color: ${color}; display: none;">
                <div class="dropdownSearch">
                    <input style="background-color: ${color};" type="text" class="${inputClass} w-100" placeholder="${placeholder}">
                    <i class="fa-solid fa-chevron-up"></i>
                </div>
                <div class="dropdownList">
                    <ul>
                        ${data.map(item => `<li style="background-color: ${color};">${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `
    const rowDropdown = document.getElementById("rowDropdown")
    if (rowDropdown) {
        rowDropdown.appendChild(dropdownContainer)
    }
    dropdownInteractions(id, dropdownHeaderId, color)
}

// Fonction pour créer les dropdowns de façon unique
function displayDropdowns(recipes) {
    const ingredients = Array.from(new Set(recipes.flatMap(r => r.ingredients.map(i => i.ingredient))))
    const appareils = Array.from(new Set(recipes.map(r => r.appliance)))
    const ustensiles = Array.from(new Set(recipes.flatMap(r => r.ustensils)))

    // Dropdown des ingrédients
    displayDropdown({
        title: 'Ingrédients',
        placeholder: 'Rechercher un ingrédient',
        data: ingredients,
        id: 'ingredientsDropdown',
        containerClass: 'ingredientsContainer',
        inputClass: 'inputIngredients',
        buttonClass: 'buttonIngredients',
        color: "#3282f7",
        dropdownHeaderId: 'ingredientsDropdownHeader'
    })

    // Dropdown des appareils
    displayDropdown({
        title: 'Appareils',
        placeholder: 'Rechercher un appareil',
        data: appareils,
        id: 'appareilsDropdown',
        containerClass: 'appareilsContainer',
        inputClass: 'inputAppareils',
        buttonClass: 'buttonAppareils',
        color: "#68d9a4",
        dropdownHeaderId: 'appareilsDropdownHeader'
    })

    // Dropdown des ustensiles
    displayDropdown({
        title: 'Ustensiles',
        placeholder: 'Rechercher un ustensile',
        data: ustensiles,
        id: 'ustensilesDropdown',
        containerClass: 'ustensilesContainer',
        inputClass: 'inputUstensiles',
        buttonClass: 'buttonUstensiles',
        color: "#ed6454",
        dropdownHeaderId: 'ustensilesDropdownHeader'
    })
}

let selectedTags = []
// Fonction pour configurer les interactions sur un dropdown
function dropdownInteractions(id, dropdownHeaderId, color) {
    const dropdown = document.querySelector(`.dropdown.${id}`)
    const dropdownHeader = document.getElementById(dropdownHeaderId)
    const chevronDown = dropdown.querySelector('.fa-chevron-down')
    const chevronUp = dropdown.querySelector('.fa-chevron-up')
    const dropdownBody = dropdown.querySelector('.dropdownBody')
    const inputSearch = dropdown.querySelector('input')
    const listItems = dropdown.querySelectorAll('li')

    // Ouvrir/fermer le dropdown
    chevronDown.addEventListener('click', () => {
        dropdownBody.style.display = 'block'
        chevronDown.style.display = 'none'
        chevronUp.style.display = 'inline'
    })

    chevronUp.addEventListener('click', () => {
        dropdownBody.style.display = 'none'
        chevronDown.style.display = 'inline'
        chevronUp.style.display = 'none'
    })

    // Fermer le dropdown en cliquant ailleurs
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdownBody.style.display = 'none'
            chevronDown.style.display = 'inline'
            chevronUp.style.display = 'none'
        }
    })

    // Recherche dans le dropdown
    inputSearch.addEventListener('input', () => {
        const filter = inputSearch.value.toLowerCase()
        listItems.forEach(item => {
            item.style.display = item.textContent.toLowerCase().includes(filter) ? 'block' : 'none'
        })
    })
    // Gestion des tags sélectionnés
    const rowTags = document.getElementById("rowTags")
    const colTags = document.createElement("div")
    colTags.className = "col-4 colTags"
    // Ajout d'un tag
    listItems.forEach(item => {
        // console.log(item)
        item.addEventListener("click", function () {
            const itemSelect = this.textContent
            if (!tagSelected(itemSelect)) {
                addTag(itemSelect, color)
            }
        })
    })
    // Fonction pour vérifier si un tag est déjà sélectionné
    function tagSelected(itemSelect) {
        return selectedTags.includes(itemSelect)
    }
    // Fonction pour ajouter un tag avec couleur
    function addTag(itemSelect, color) {
        if (selectedTags.length > 0) {
            console.log(selectedTags);
            const indexFind = selectedTags.find(i => i === itemSelect);
            console.log(indexFind);
            if (!indexFind) {
                selectedTags.push(itemSelect);
            }
            console.log(selectedTags);
        } else if (selectedTags.length === 0) {
            selectedTags.push(itemSelect);
        }
        // Création de l'élément tag
        const tag = document.createElement("div")
        tag.classList.add("tag")
        tag.style.backgroundColor = color
        tag.innerHTML = `${itemSelect} <span class="closeBtn"><i class="fa-regular fa-circle-xmark"></i></span>`
        // Ajout du tag au conteneur
        colTags.appendChild(tag)
        // Ajout d'un écouteur pour la suppression du tag
        tag.querySelector(".closeBtn").addEventListener("click", function () {
            colTags.removeChild(tag)
            console.log(selectedTags);
            selectedTags = selectedTags.filter(t => t !== itemSelect)
            updateRecetteByTag()
        })
        updateRecetteByTag()
    }

    // Fonction pour mettre à jour les recettes filtrées selon les tags
    function updateRecetteByTag() {
        const filteredRecipes = filterRecipes(recettes, selectedTags)
        updateDropdowns(filteredRecipes)
        displayRecipes(filteredRecipes)
    }

    // Fonction pour filtrer les recettes en fonction des tags sélectionnés
    function filterRecipes(recettes, selectedTags) {
        // Si aucun tag n'est sélectionné, retourner toutes les recettes
        if (selectedTags.length === 0) {
            return recettes;
        }

        // Filtrer les recettes en fonction des tags sélectionnés
        const ResponseFilterRecipes = recettes.filter(recette => {
            // Verification pour les ingredients
            const hasSelectedIngredient = recette.ingredients.some(ingredient =>
                selectedTags.includes(ingredient.ingredient)
            );
            // Vérification pour les ustensils
            const hasSelectedUstensil = recette.ustensils.some(ustensil =>
                selectedTags.includes(ustensil)
            );

            // Vérification pour l'appliance
            const hasSelectedAppliance = selectedTags.includes(recette.appliance);
            return hasSelectedIngredient || hasSelectedUstensil || hasSelectedAppliance
        });
        return ResponseFilterRecipes;
    }
    rowTags.appendChild(colTags)
}


