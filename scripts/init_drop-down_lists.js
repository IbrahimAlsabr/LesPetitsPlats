import { recipes } from "../data/recipes.js";

// ----------------------------------------------------------------------------------- //

/**
 * Attaches a click event listener to a list item (li) that triggers an update on the selection display.
 * @param {HTMLElement} li - The list item element to which the click event is attached.
 * @param {string} category - The category of the dropdown to which the list item belongs.
 */
function attachSelectionHandler(li, category) {
    li.addEventListener("click", function () {
        updateSelectionDisplay(li, category);

        if (li.parentNode) {
            li.parentNode.removeChild(li);
        }
    });
}

// ----------------------------------------------------------------------------------- //

/**
 * Updates the display to show the selected item and adds functionality to remove it.
 * The function modifies the DOM to reflect the selected state and manages visibility.
 * @param {HTMLElement} li - The list item element that was clicked.
 * @param {string} category - The category of the dropdown for which the display needs updating.
 */

function updateSelectionDisplay(li, category) {
    let div = document.querySelector(`.${category} .selected`);
    div.style.display = "flex";

    let span = document.createElement("span");

    // Clear the span and hide the list
    document.querySelector(`.${category} ul`).style.visibility = "hidden";

    // Create and append paragraph element
    let p = document.createElement("p");
    p.textContent = li.textContent;
    span.appendChild(p);

    // Create and configure the close icon
    let i = document.createElement("i");
    i.setAttribute("class", "fas fa-times");
    i.onclick = function () {
        getBack(
            createListItem(category, this.parentNode.firstChild.textContent),
            category
        );
        div.removeChild(span);

        const eventRemove = new CustomEvent("elementRemoved", {
            bubbles: true,
        });
        div.dispatchEvent(eventRemove);
    };
    span.appendChild(i);

    // Show the span element
    span.style.display = "flex";

    div.appendChild(span);

    const eventAdd = new CustomEvent("elementAdded", { bubbles: true });
    div.dispatchEvent(eventAdd);
}

// ----------------------------------------------------------------------------------- //

/**
 * Attaches an input event listener to a search input field to filter list items based on the user's input.
 * This function dynamically adjusts the display of list items to match the search query.
 * @param {HTMLElement} searchInput - The input element where the user types the search query.
 * @param {string} category - The category of the items being searched.
 */
function handleSearchInput(searchInput, category) {
    searchInput.addEventListener("input", () => {
        let searchQuery = searchInput.value.toLowerCase();
        document.querySelectorAll(`.${category}-item`).forEach((li) => {
            if (li.textContent.toLowerCase().includes(searchQuery)) {
                li.style.display = "";
            } else {
                li.style.display = "none";
            }
        });
    });
}

// ----------------------------------------------------------------------------------- //

/**
 * Creates and returns a new list item (li) element with specified text and class for a given category.
 * @param {string} category - The category of the item, used to set the class name.
 * @param {string} textContent - The text content to be displayed in the list item.
 * @returns {HTMLElement} The newly created list item (li) element.
 */
function createListItem(category, textContent) {
    const li = document.createElement("li");
    li.textContent = textContent;
    li.classList = `${category}-item`;
    return li;
}

// ----------------------------------------------------------------------------------- //

// * List all ingredients in ingredients drop-down list * //
export function extractIngredientsItems(recipes) {
    let ingredients = document.querySelector(".ingredients ul");

    keepFirstChildOnly(ingredients);

    const ingredientsList = [];

    recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
            let ingredientName = ingredient.ingredient.toLowerCase();
            if (!ingredientsList.includes(ingredientName)) {
                ingredientsList.push(ingredientName);

                let li = createListItem("ingredients", ingredient.ingredient);
                attachSelectionHandler(li, "ingredients");
                ingredients.appendChild(li);
            }
        });
    });
}

const ingredientsSearchInput = document.getElementById("ingredients-search");
handleSearchInput(ingredientsSearchInput, "ingredients");

// ----------------------------------------------------------------------------------- //

// * List all appareils in appareils drop-down list * //
export function extractAppareilsItems(recipes) {
    let appareilsDOM = document.querySelector(".appareils ul");

    keepFirstChildOnly(appareilsDOM);

    const appareilsList = [];
    recipes.forEach((recipe) => {
        if (!appareilsList.includes(recipe.appliance.toLowerCase())) {
            appareilsList.push(recipe.appliance.toLowerCase());

            let li = createListItem("appareils", recipe.appliance);
            attachSelectionHandler(li, "appareils");
            appareilsDOM.appendChild(li);
        }
    });
}

const appareilsSearchInput = document.getElementById("appareils-search");
handleSearchInput(appareilsSearchInput, "appareils");

// ----------------------------------------------------------------------------------- //

// * List all ustensiles in ustensiles drop-down list * //
export function extractUstensilesItems(recipes) {
    let ustensilesDOM = document.querySelector(".ustensiles ul");

    keepFirstChildOnly(ustensilesDOM);

    const ustensilesList = [];
    recipes.forEach((recipe) => {
        recipe.ustensils.forEach((ustensil) => {
            if (!ustensilesList.includes(ustensil.toLowerCase())) {
                ustensilesList.push(ustensil.toLowerCase());

                let li = createListItem("ustensiles", ustensil);
                attachSelectionHandler(li, "ustensiles");
                ustensilesDOM.appendChild(li);
            }
        });
    });
}

const ustensilesSearchInput = document.getElementById("ustensiles-search");
handleSearchInput(ustensilesSearchInput, "ustensiles");

extractRecipeElements(recipes);
// ----------------------------------------------------------------------------------- //

export function extractRecipeElements(recipes) {
    extractAppareilsItems(recipes);
    extractIngredientsItems(recipes);
    extractUstensilesItems(recipes);
}

function getBack(element, category) {
    attachSelectionHandler(element, category);
    document.querySelector(`.${category} ul`).appendChild(element);
}

function keepFirstChildOnly(parentElement) {
    while (parentElement.children.length > 1) {
        parentElement.removeChild(parentElement.lastChild);
    }
}
