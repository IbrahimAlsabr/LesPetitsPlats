export function createRecipeCard({
    imageUrl,
    prepTime,
    title,
    description,
    ingredients,
}) {
    const card = document.createElement("div");
    card.className = "recipe-card";

    // Correctly map ingredients to string format for HTML insertion
    const ingredientsList = ingredients
        .map((ingredient) => {
            let ingredientText = ingredient.ingredient; // Start with the ingredient name
            if (ingredient.quantity) {
                ingredientText += `: ${ingredient.quantity}`; // Add quantity if available
            }
            if (ingredient.unit) {
                ingredientText += ` ${ingredient.unit}`; // Add unit if available
            }
            return `<li><span>${ingredient.ingredient}</span><span>${
                ingredient.quantity || ""
            } ${ingredient.unit || ""}</span></li>`;
        })
        .join("");

    card.innerHTML = `
        <div class="recipe-image">
            <img src="${imageUrl}" alt="${title}" />
            <span class="prep-time">${prepTime} min</span>
        </div>
        <div class="recipe-content">
            <h1>${title}</h1>
            <h2>Recette</h2>
            <p>${description}</p>
            <h2>Ingrédients</h2>
            <ul class="ingredients-list">
                ${ingredientsList}
            </ul>
        </div>
    `;

    return card;
}
