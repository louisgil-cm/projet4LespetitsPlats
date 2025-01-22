// Fonction générique pour créer un dropdown
function displayDropdown({ title, placeholder, data, id, containerClass, inputClass, buttonClass, color, dropdownHeaderId, classHeaderBtn }) {
    const dropdownContainer = document.createElement("div");
    dropdownContainer.className = `dropdownContainer ${containerClass}`
    dropdownContainer.innerHTML = `
        <div class="dropdown ${id}">
            <div class="dropdownHeader ${classHeaderBtn}" style="background-color: ${color};" id="${dropdownHeaderId}">
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
        dropdownHeaderId: 'ingredientsDropdownHeader',
        classHeaderBtn: "ingredients"
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
        dropdownHeaderId: 'appareilsDropdownHeader',
        classHeaderBtn: "appareils"
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
        dropdownHeaderId: 'ustensilesDropdownHeader',
        classHeaderBtn: "ustensiles"
    })
}

let selectedTags = []

// Fonction pour configurer les interactions sur un dropdown
function dropdownInteractions(id, dropdownHeaderId, color) {
    const dropdown = document.querySelector(`.dropdown.${id}`)
    const inputSearch = dropdown.querySelector('input')
    const listItems = dropdown.querySelectorAll('li')
    const dropdownHeader = document.querySelectorAll(".dropdownHeader")
    console.log(dropdownHeader)
    const dropdowns = document.querySelectorAll('.dropdown');
    console.log(dropdownHeaderId);

    // Variable globale pour suivre le dropdown actif
    let activeDropdown = null;

    dropdowns.forEach((dropdown) => {
        const chevronDown = dropdown.querySelector('.fa-chevron-down');
        const chevronUp = dropdown.querySelector('.fa-chevron-up');
        const dropdownBody = dropdown.querySelector('.dropdownBody');
        const dropdownHeader = dropdown.querySelector('.dropdownHeader');

        // Ouvrir le dropdown
        chevronDown.addEventListener('click', (e) => {
            // Empêche la propagation du clic
            e.stopPropagation();

            // Fermeture du dropdown actif s'il est différent du nouveau
            if (activeDropdown && activeDropdown !== dropdown) {
                closeDropdown(activeDropdown);
            }

            // Ouverture du dropdown actuel
            dropdownBody.style.display = 'block';
            chevronDown.style.display = 'none';
            chevronUp.style.display = 'inline';

            if (dropdownHeader) {
                dropdownHeader.style.width = '700px';
            }

            activeDropdown = dropdown;
        });

        // Fermeture du dropdown avec le bouton de fermeture
        chevronUp.addEventListener('click', () => {
            closeDropdown(dropdown);
        });
    });

    // Fermeture de tous les dropdowns si on clique ailleurs
    document.addEventListener('click', (e) => {
        if (activeDropdown && !activeDropdown.contains(e.target)) {
            closeDropdown(activeDropdown);
        }
    });

    // Fonction pour fermer un dropdown
    function closeDropdown(dropdown) {
        const chevronDown = dropdown.querySelector('.fa-chevron-down');
        const chevronUp = dropdown.querySelector('.fa-chevron-up');
        const dropdownBody = dropdown.querySelector('.dropdownBody');
        const dropdownHeader = dropdown.querySelector('.dropdownHeader');

        dropdownBody.style.display = 'none';
        chevronDown.style.display = 'inline';
        chevronUp.style.display = 'none';

        if (dropdownHeader) {
            dropdownHeader.style.width = 'initial';
        }

        if (activeDropdown === dropdown) {
            activeDropdown = null;
        }
    }

    // Recherche dans le dropdown
    inputSearch.addEventListener('input', () => {
        const filter = inputSearch.value.toLowerCase()
        listItems.forEach(item => {
            if (item.textContent.toLowerCase().includes(filter)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }

        })
    })

    // Gestion des tags sélectionnés
    const rowTags = document.getElementById("rowTags")
    const tagsDropdown = document.getElementById("tagsDropdown")
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
    // Fonction pour ajouter un tag avec couleur et trier les tags en fonction de la couleur

    function addTag(itemSelect, color) {
        // Vérifie si l'élément est déjà dans la liste
        if (!selectedTags.some(tag => tag.item === itemSelect)) {
            // Ajout de l'élément avec sa couleur dans un objet
            selectedTags.push({ item: itemSelect, color });
            // Trie des tags par leur couleur
            selectedTags.sort((a, b) => a.color.localeCompare(b.color));
        }

        // Met à jour de l'affichage des tags dans le DOM
        updateTagDisplay();
    }

    // Fonction pour mettre à jour les tags affichés dans le DOM
    function updateTagDisplay() {
        // Vide le conteneur des tags
        rowTags.innerHTML = '';

        // Recrée et ajoute chaque tag trié
        selectedTags.forEach(t => {
            const tag = document.createElement("div");
            tag.classList.add("tag");
            tag.style.backgroundColor = t.color; 
            tag.innerHTML = `${t.item} <span class="closeBtn"><i class="fa-regular fa-circle-xmark"></i></span>`;

            // Ajoute un écouteur pour supprimer un tag
            tag.querySelector(".closeBtn").addEventListener("click", function () {
                rowTags.removeChild(tag);
                selectedTags = selectedTags.filter(t => t.item !== t.item);
                updateRecetteByTag();
            });

            // Ajoute le tag au conteneur
            rowTags.appendChild(tag);
        });

        // Mets à jour les recettes filtrées
        updateRecetteByTag();
    }

    function updateRecetteByTag() {
        // Récupère uniquement les noms des tags sélectionnés
        const selectedTagNames = selectedTags.map(tag => tag.item.toLowerCase());
        // Si aucun tag n'est sélectionné, afficher toutes les recettes
        if (selectedTagNames.length === 0) {
            displayRecipes(recettes); 
            updateDropdowns(recettes); 
            return;
        }
        // Filtrer les recettes en fonction des tags sélectionnés
        const filteredRecipes = recettes.filter(recette => {
            return selectedTagNames.every(tag =>
                // Vérification dans les ingrédients
                recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase() === tag) ||
                // Vérification dans les ustensiles
                recette.ustensils.some(ustensil => ustensil.toLowerCase() === tag) ||
                // Vérification dans l'appareil
                recette.appliance.toLowerCase() === tag
            );
        });

        // Affiche les recettes filtrées
        displayRecipes(filteredRecipes);
        updateDropdowns(filteredRecipes);
    }

    tagsDropdown.appendChild(rowTags);
}






