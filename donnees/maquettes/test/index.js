// Récupération de la ligne qui affichera les tags
const rowTags = document.getElementById("rowTags")
// Création de la colonne pour les tags des ingrédients
const tagsIngredients = document.createElement("div")
tagsIngredients.className = "col-4 tagsIngredient"
// Sélection de tous les éléments de la liste des ingrédients
const tagsListIngredients = document.querySelectorAll(".classListIngredients")
tagsListIngredients.forEach(item => {
    item.addEventListener("click", function () {
        const itemSelect = this.textContent.trim()
        alert(`${itemSelect}`)
        // Vérification si l'élément est déjà sélectionné
        if (!tagSelected(itemSelect)) {
            addTag(itemSelect)
        }
    })
})
// Fonction pour vérifier si un tag est déjà sélectionné
function tagSelected(itemSelect) {
    const tags = tagsIngredients.querySelectorAll(".tag")
    return Array.from(tags).some(tag => tag.textContent.replace("×", "").trim() === itemSelect)
}
// Fonction pour ajouter un tag
function addTag(itemSelect) {
    // Création de l'élément tag
    const tag = document.createElement("div")
    tag.classList.add("tag");
    tag.innerHTML = `${itemSelect} <span class="closeBtn">&times;</span>`
    // Ajout  tag au conteneur
    tagsIngredients.appendChild(tag)
    // Ajout d'un écouteur pour la suppression du tag
    tag.querySelector(".closeBtn").addEventListener("click", function () {
        tagsIngredients.removeChild(tag)
    })
}
// Ajout de la colonne contenant les tags à la ligne principale
rowTags.appendChild(tagsIngredients)