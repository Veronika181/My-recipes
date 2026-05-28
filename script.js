// Po načtení stránky
document.addEventListener("DOMContentLoaded", () => {
    nactiVychoziRecepty();
    nactiRecepty();
    document.getElementById("addBtn").addEventListener("click", pridatRecept);
});

// 1) Načtení výchozích receptů z JSON souboru
async function nactiVychoziRecepty() {
    const ulozene = JSON.parse(localStorage.getItem("recepty") || "[]");

    // Pokud už jsou recepty uložené, nic nenačítej
    if (ulozene.length > 0) return;

    const response = await fetch("recipes.json");
    const vychoziRecepty = await response.json();

    localStorage.setItem("recepty", JSON.stringify(vychoziRecepty));
}

// 2) Načtení všech receptů z localStorage
function nactiRecepty() {
    const ulozene = JSON.parse(localStorage.getItem("recepty") || "[]");
    ulozene.forEach(r => vykresliRecept(r));
}

// 3) Přidání nového receptu
function pridatRecept() {
    const nazev = document.getElementById("title").value.trim();
    const kategorie = document.getElementById("category").value;
    const ingredienceText = document.getElementById("ingredients").value.trim();
    const postup = document.getElementById("instructions").value.trim();

    if (!nazev || !ingredienceText || !postup) {
        alert("Vyplň prosím všechny položky.");
        return;
    }

    const recept = {
        title: nazev,
        category: kategorie,
        ingredients: ingredienceText.split("\n"),
        instructions: postup
    };

    vykresliRecept(recept);

    const ulozene = JSON.parse(localStorage.getItem("recepty") || "[]");
    ulozene.push(recept);
    localStorage.setItem("recepty", JSON.stringify(ulozene));

    document.getElementById("title").value = "";
    document.getElementById("ingredients").value = "";
    document.getElementById("instructions").value = "";
}

// 4) Vykreslení receptu do správné kategorie
function vykresliRecept(recept) {
    const container = document.getElementById(recept.category);

    const div = document.createElement("div");
    div.className = "recipe";

    div.innerHTML = `
        <h3>${recept.title}</h3>
        <small>${prelozKategorie(recept.category)}</small>
        <h4>Ingredience</h4>
        <ul>${recept.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
        <h4>Postup</h4>
        <p>${recept.instructions}</p>
    `;

    container.appendChild(div);
}

// Pomocná funkce pro zobrazení českého názvu kategorie
function prelozKategorie(cat) {
    switch (cat) {
        case "snidane": return "Snídaně";
        case "obed": return "Oběd";
        case "svacina": return "Svačina";
        case "vecere": return "Večeře";
        default: return cat;
    }
}
