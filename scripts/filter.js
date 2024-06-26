import { recipes } from "../data/recipes.js";
import { createRecipeCard } from "../scripts/components/recipe_card.js";
import { extractRecipeElements } from "./init_drop-down_lists.js";
import { myData } from "./index.js";

/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */
/*                   Start Handling Search input               */
/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");

    // Adds event listener to handle input events on the search input
    searchInput.addEventListener("input", () => {
        const searchQuery = searchInput.value.toLowerCase();
        let filteredData = [];

        if (searchQuery.length >= 3 || searchQuery.length === 0) {
            let filteredData = [];
            for (let i = 0; i < recipes.length; i++) {
                let recipe = recipes[i];
                let recipeMatches =
                    recipe.name.toLowerCase().includes(searchQuery) ||
                    recipe.description.toLowerCase().includes(searchQuery);

                if (!recipeMatches) {
                    for (let j = 0; j < recipe.ingredients.length; j++) {
                        let ingredient = recipe.ingredients[j].ingredient;
                        if (ingredient.toLowerCase().includes(searchQuery)) {
                            recipeMatches = true;
                            break;
                        }
                    }
                }

                if (recipeMatches) {
                    filteredData.push(recipe);
                }
            }

            myData.length = 0;
            filteredData.forEach((filteredItem) => myData.push(filteredItem));

            displayResults(filteredData, searchQuery);
            extractRecipeElements(myData);
            updateNbrOfRecettes(myData.length);
        }
    });
});

/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */
/*               Start Handling Search By Tag Input            */
/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */

let ingredients = [];
let appareils = [];
let ustensiles = [];

// Event listeners and functions for managing added and removed elements in categories
document.addEventListener("elementAdded", function (event) {
    if (event.target.classList.contains("selected")) {
        const category = event.target.parentNode.className.split(" ")[0];

        Array.from(event.target.children).forEach((child) => {
            if (!getCategoryArray(category).includes(child.textContent)) {
                getCategoryArray(category).push(child.textContent);
            }
        });

        if (appareils.length !== 0 && category === "appareils") {
            filterRecipesByCategory(category);
            console.log(myData);
            displayResults(myData);
        }

        if (ustensiles.length !== 0 && category === "ustensiles") {
            filterRecipesByCategory(category);
            console.log(myData);
            displayResults(myData);
        }

        if (ingredients.length !== 0 && category === "ingredients") {
            filterRecipesByCategory(category);
            console.log(myData);
            displayResults(myData);
        }
        extractRecipeElements(myData);
        updateNbrOfRecettes(myData.length);
    }
});

document.addEventListener("elementRemoved", function (event) {
    if (event.target.classList.contains("selected")) {
        const category = event.target.parentNode.className.split(" ")[0];

        console.log(getCategoryArray(category));
        getCategoryArray(category).splice(0, getCategoryArray(category).length);

        Array.from(event.target.children).forEach((child) => {
            if (!getCategoryArray(category).includes(child.textContent)) {
                getCategoryArray(category).push(child.textContent);
            }
        });

        myData.length = 0;
        recipes.forEach((filteredItem) => myData.push(filteredItem));
        console.log(myData);

        if (appareils.length !== 0) {
            filterRecipesByCategory("appareils");
            console.log(myData);
            displayResults(myData);
        }

        if (ustensiles.length !== 0) {
            filterRecipesByCategory("ustensiles");
            console.log(myData);
            displayResults(myData);
        }

        if (ingredients.length !== 0) {
            filterRecipesByCategory("ingredients");
            console.log(myData);
            displayResults(myData);
        }

        displayResults(myData);
        extractRecipeElements(myData);
        updateNbrOfRecettes(myData.length);
    }
});

/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */
/*                      Utilities Functions                    */
/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */

/**
 * Returns the array corresponding to a specified category.
 *
 * @param {string} category - The category name ('ingredients', 'appareils', 'ustensiles').
 * @returns {Array} The array linked to the given category.
 */
function getCategoryArray(category) {
    switch (category) {
        case "ingredients":
            return ingredients;
        case "appareils":
            return appareils;
        case "ustensiles":
            return ustensiles;
    }
}
// ----------------------------------------------------------------------------------- //

/**
 * Filters `myData` based on the given category and updates it with the filtered recipes.
 *
 * @param {string} category - The category (e.g., 'ingredients', 'ustensiles', 'appareils') to filter the recipes by.
 */
function filterRecipesByCategory(category) {
    let filteredRecipes = [];
    for (let i = 0; i < myData.length; i++) {
        for (let j = 0; j < getCategoryArray(category).length; j++) {
            if (
                !extractItemsOfRecipe(myData[i], category).includes(
                    getCategoryArray(category)[j].toLowerCase()
                )
            ) {
                break;
            } else {
                if (j + 1 === getCategoryArray(category).length) {
                    filteredRecipes.push(myData[i]);
                }
            }
        }
    }

    updateFilteredRecipes(filteredRecipes);
}
// ----------------------------------------------------------------------------------- //

/**
 * Clears and updates the `myData` array with a new list of filtered recipes.
 *
 * @param {Array} filteredRecipes - The recipes to replace the existing data in `myData`.
 */
function updateFilteredRecipes(filteredRecipes) {
    myData.length = 0;
    filteredRecipes.forEach((filteredItem) => myData.push(filteredItem));
}
// ----------------------------------------------------------------------------------- //

/**
 * Extracts items from a recipe object based on the specified category. The categories
 * can include 'ustensiles', 'ingredients', or other properties like 'appliance'.
 *
 * @param {Object} recipe - The recipe to extract data from.
 * @param {string} category - The data category ('ustensiles', 'ingredients', 'appliance').
 * @returns {Array|string} returns either an array of items (for 'ustensiles' and 'ingredients') or string (for 'appliance').
 */
function extractItemsOfRecipe(recipe, category) {
    if (category === "ustensiles") {
        return recipe.ustensils.map((element) => element.toLowerCase());
    } else if (category === "ingredients") {
        return recipe.ingredients.map((element) =>
            element.ingredient.toLowerCase()
        );
    } else {
        return recipe.appliance.toLowerCase();
    }
}
// ----------------------------------------------------------------------------------- //

/**
 * Displays search results or a no-results message in a dedicated container.
 * Each matching recipe is shown using a card layout.
 *
 * @param {Array} recipes - Array of recipe objects to be displayed.
 * @param {string} [searchQuery=""] - The search term used to filter recipes. Defaults to an empty string if not provided.
 */
function displayResults(recipes, searchQuery = "") {
    const resultsContainer = document.getElementById("recipe-container");
    resultsContainer.innerHTML = "";

    if (recipes.length === 0) {
        resultsContainer.innerHTML = `
			<h3>
				Aucune recette ne contient ‘${searchQuery}’ vous pouvez chercher
				«tarte aux pommes», «poisson», etc.
			</h3>
		`;
        resultsContainer.style = `
			display: flex;
			justify-content: center;
			margin: 60px auto;
			width: 500px;
			text-align: center;
			letter-spacing: 1.5px;
		`;

        return;
    }

    resultsContainer.removeAttribute("style");

    recipes.forEach((recipe) => {
        const recipeCard = createRecipeCard({
            imageUrl: `./assets/imgs/${recipe.image}`,
            prepTime: recipe.time,
            title: recipe.name,
            description: recipe.description,
            ingredients: recipe.ingredients,
        });
        resultsContainer.appendChild(recipeCard);
        resultsContainer.className = "found";
    });
}
// ----------------------------------------------------------------------------------- //

function updateNbrOfRecettes(nbrRecettes) {
    document.querySelector(
        ".recettes-nbr p"
    ).innerHTML = `${nbrRecettes} Recettes`;
}
