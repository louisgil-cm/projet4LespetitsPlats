// Fonction pour récupérer les données des recette
async function loadRecipes() {
    const response = await fetch("recipes.json")
    const recipes = await response.json()
    // Afficher les recettes
    displayRecipes(recipes)
    // Ajouter la recherche principale
    recherchePrincipaleBoucles(recipes) 
    // Créer les dropdowns
    displayDropdowns(recipes)
   
}


