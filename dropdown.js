// Fonction générique pour créer un dropdown
function displayDropdown({ title, placeholder, data, id, containerClass, inputClass, buttonClass, color, dropdownHeaderId }) {
    const dropdownContainer = document.createElement("div");
    dropdownContainer.className = `dropdownContainer ${containerClass} col-2`;
    dropdownContainer.innerHTML = `
        <div class="dropdown ${id}">
            <div class="dropdownHeader" style="background-color: ${color};" id="${dropdownHeaderId}">
                <button class="${buttonClass}" style="background-color: ${color};">${title}</button>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <div class="dropdownBody" style="background-color: ${color};">
                <div class="dropdownSearch">
                    <input style="background-color: ${color};" type="text" class="${inputClass} w-100" placeholder="${placeholder}">
                    <i class="fa-solid fa-chevron-up"></i>
                </div>
                <div class="dropdownList">
                    <ul>
                        ${data.map(item => `<li style="background-color: ${color};" class="classList">${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `
    // Ajout du dropdown dans le DOM
    const rowDropdown = document.getElementById("rowDropdown")
    rowDropdown.appendChild(dropdownContainer)
    // Une fois le dropdown ajouté, on attache les événements
    dropdownInteractions(id, dropdownHeaderId, color)
}
// Fonction pour configurer les interactions sur un dropdown
function dropdownInteractions(id, dropdownHeaderId, color) {
    const dropdown = document.querySelector(`.dropdown.${id}`)
    const dropdownHeader = document.getElementById(dropdownHeaderId)
    const chevronDown = dropdown.querySelector('.fa-chevron-down')
    const chevronUp = dropdown.querySelector('.fa-chevron-up')
    const dropdownBody = dropdown.querySelector('.dropdownBody')
    const inputSearch = dropdown.querySelector('input')
    const listItems = dropdown.querySelectorAll('li')
    // Ouvrir le dropdown
    chevronDown.addEventListener('click', () => {
        dropdownBody.style.display = 'block'
        chevronUp.style.display = 'inline'
    })
    // Fermer le dropdown
    chevronUp.addEventListener('click', () => {
        dropdownBody.style.display = 'none'
        chevronDown.style.display = 'inline'
        chevronUp.style.display = 'none'
    })
    // Fermeture si on clique ailleurs
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
            if (item.textContent.toLowerCase().includes(filter)) {
                item.style.display = 'block'
            } else {
                item.style.display = 'none'
            }
        })
    })
    // Récupération de la ligne qui affichera les tags
    const rowTags = document.getElementById("rowTags")
    // Création de la colonne pour les tags des ingrédients
    const colTags = document.createElement("div")
    colTags.className = "col-4 colTags"
    // Ajout d'un ecouteur d'evenement pour sur les li
    listItems.forEach(item => {
        item.addEventListener("click", function () {
            const itemSelect = this.textContent.trim()
            // Vérification si l'élément est déjà sélectionné
            if (!tagSelected(itemSelect)) {
                addTag(itemSelect, color)
            }
        })
    })
    // Fonction pour vérifier si un tag est déjà sélectionné
    function tagSelected(itemSelect) {
        const tags = colTags.querySelectorAll(".tag")
        return Array.from(tags).some(tag => tag.textContent.replace("×", "").trim() === itemSelect)
    }
    // Fonction pour ajouter un tag avec couleur
    function addTag(itemSelect, color) {
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
        })
    }
    // Ajout de la colonne contenant les tags à la ligne principale
    rowTags.appendChild(colTags)
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
        dropdownHeaderId: 'appareils'
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



