import { recipes } from "../data/recipes.js";
import { createRecipeCard } from "../scripts/components/recipe_card.js";
import { extractRecipeElements } from "./init_drop-down_lists.js";
import { myData } from "./index.js";

const resultsContainer = document.getElementById("recipe-container");

function displayResults(recipes, searchQuery = "") {
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

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", () => {
        const searchQuery = searchInput.value.toLowerCase();
        let filteredData = [];

        if (searchQuery.length >= 3 || searchQuery.length === 0) {
            filteredData = recipes.filter(
                (recipe) =>
                    recipe.name.toLowerCase().includes(searchQuery) ||
                    recipe.description.toLowerCase().includes(searchQuery) ||
                    recipe.ingredients.some((ingredient) =>
                        ingredient.ingredient
                            .toLowerCase()
                            .includes(searchQuery)
                    )
            );

            myData.length = 0;
            filteredData.forEach((filteredItem) => myData.push(filteredItem));

            displayResults(filteredData, searchQuery);
            extractRecipeElements(myData);
            console.log(myData);
        }
    });
});

// ------------------------------ testing ------------------------------
let ingredients = [];
let appareils = [];
let ustensiles = [];

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
    }
});

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

function updateFilteredRecipes(filteredRecipes) {
    myData.length = 0;
    filteredRecipes.forEach((filteredItem) => myData.push(filteredItem));
}

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
