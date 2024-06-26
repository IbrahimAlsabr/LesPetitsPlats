import { recipes } from "../data/recipes.js";
import { createRecipeCard } from "../scripts/components/recipe_card.js";

let recipeCardDoic = document.querySelector("#recipe-container");
export let myData = [];
/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */
/*      Create and append each recipe card to the container    */
/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */
recipes.forEach((recipe) => {
    myData.push(recipe);
    const recipeCard = createRecipeCard({
        imageUrl: `./assets/imgs/${recipe.image}`,
        prepTime: recipe.time,
        title: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
    });
    recipeCardDoic.appendChild(recipeCard);
});


/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*---  */

/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */
/*                   Display the number of recipes             */
/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */
let nbr = document.querySelector(".recettes-nbr p");
nbr.textContent = myData.length + " Recettes";

/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*---  */

document.addEventListener("DOMContentLoaded", function () {
    const filterBoxes = document.querySelectorAll(".filter-box");

    filterBoxes.forEach((box) => {
        const titleDiv = box.querySelector(".dropdown-title");
        const ul = box.querySelector("ul");
        const icon = titleDiv.querySelector("i");
        titleDiv.addEventListener("click", function () {
            if (icon.style.transform === "rotate(180deg)") {
                icon.style.transform = "rotate(0deg)";
            } else {
                icon.style.transform = "rotate(180deg)";
            }

            ul.style.visibility =
                ul.style.visibility === "visible" ? "hidden" : "visible";
        });
    });
});
