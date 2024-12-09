// Fonction pour récupérer les données des recettes
async function recipes() {
    const response = await fetch("recipes.json")
    const recipes = await response.json()
    // Afficher les recettes
    displayArticleRecipes(recipes)
    // Ajouter la recherche principale
    recherchePrincipale(recipes)
    // Créer les dropdowns
    displayDropdowns(recipes)
}
