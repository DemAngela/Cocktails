const row = document.querySelector('.row')
const all = document.querySelector('#all');
const search = document.querySelector('#search')
const searchBox = document.querySelector('.search-wrapper');
const searchInput = document.querySelector('#searchInput');
const submit = document.querySelector('.submit');
const result = document.querySelector('.result')
all.addEventListener('change', () => {
    if (all.checked) {
        row.classList.remove('hidden')
        searchBox.classList.add('hidden')
        result.innerHTML = ''
    }
})

search.addEventListener('change', () => {
    if (search.checked) {
        searchBox.classList.remove('hidden')
        row.classList.add('hidden')
    }
})


const handleGetCocktails = () => {

    // основная карточка

    fetch('https://www.thecocktaildb.com/api/json/v2/1/popular.php')
        .then(res => res.json())
        .then(data => {
            data.drinks.forEach(drink => {
                const {idDrink, strDrink, strDrinkThumb, strInstructions, strAlcoholic} = drink;

                const alcoholicStatus = strAlcoholic === 'Alcoholic' ? 'Alcoholic' : 'Non-alcoholic';

                const card = document.createElement('div')
                card.classList.add('col-3');
                card.innerHTML += `
                        <div class="card">
                            <div class="title">
                                <h2>${strDrink}</h2>
                                <img src="${strDrinkThumb}" width="200px" alt="${strDrink}">
                                <p>${strInstructions}</p>
                            </div>
                                <h4 class="mainText">${alcoholicStatus}</h4>
                        </div>`;

                // привязка к родителю

                row.appendChild(card);

                // изменение колонки и добавление ингридиентов

                card.addEventListener('click', () => {

                    const deleteIngredientsList = card.querySelector('ul');

                    // при клике колонка меняется с col-3 на col-6
                    if (card.classList.contains('col-3')) {
                        card.classList.remove('col-3')
                        card.classList.add('col-6')

                        // поиск не обходимых ингридиентов по API

                        fetch(`https://www.thecocktaildb.com/api/json/v2/1/lookup.php?i=${idDrink}`)
                            .then(res => res.json())
                            .then(data=> {
                                const ingredients = [];
                                for (let i =1; i <= 15; i++) {
                                    const ingredient =data.drinks[0][`strIngredient${i}`]
                                    if (ingredient) {
                                        ingredients.push(ingredient)
                                    }
                                }

                                // создание HTML элемента куда после добавляется ингридиент

                                const ingredientsList = document.createElement('ul')
                                ingredients.forEach(ingredient => {
                                    const list = document.createElement('li')
                                    list.textContent = ingredient
                                    ingredientsList.appendChild(list)

                                    // картинка
                                    const ingredientImg = document.createElement('img')
                                    ingredientImg.src = `https://www.thecocktaildb.com/images/ingredients/${ingredient}-Medium.png`
                                    ingredientImg.alt = ingredient
                                    ingredientImg.width = 100
                                    ingredientImg.height = 100

                                    list.appendChild(ingredientImg);

                                    ingredientsList.appendChild(list);
                                })

                                // добавление созданного элемента к родителю

                                card.querySelector('.card').appendChild(ingredientsList)
                            })

                    // колонка возвращается из col-6 в col-3
                    } else if (card.classList.contains('col-6')) {
                        card.classList.remove('col-6')
                        card.classList.add('col-3')
                    }

                    // удаление листа с ингридиентами при нажатии, так как была проблема, что при нажатии появлялся второй лист с ингридиентами

                    if (deleteIngredientsList) {
                        deleteIngredientsList.remove();
                    }

                })
            })
        })
}

// вызов функции
handleGetCocktails()

//  поисковик

const handleSearch = () => {
    let value = searchInput.value
    result.innerHTML = ''
    fetch(`https://www.thecocktaildb.com/api/json/v2/1/Search.php?s=${value}`)
        .then(res => res.json())
        .then(json => {
            json.drinks.forEach(drink => {
                const {idDrink, strDrink, strDrinkThumb, strInstructions, strAlcoholic} = drink;

                const alcoholicStatus = strAlcoholic === 'Alcoholic' ? 'Alcoholic' : 'Non-alcoholic';

                result.innerHTML += `
                <div class="result">
                    <div class="resultWrap">
                    <h2>${strDrink}</h2>
                        <div class="Benefits">
                            <div class="mainOne">
                                <img src="${strDrinkThumb}" width="300px" alt="${strDrink}">
                                <p>${strInstructions}</p>
                            </div>
                            <div class="mainTwo">
                                <h3>Ingredients:</h3>
                                    <ul class="ingredientList-${idDrink}"></ul>
                            </div>
                        </div>
                    <h4 class="mainText">${alcoholicStatus}</h4>
                    </div>
                </div>`

                fetch(`https://www.thecocktaildb.com/api/json/v2/1/lookup.php?i=${idDrink}`)
                    .then(res => res.json())
                    .then(data => {
                        const ingredients = [];
                        for (let i = 1; i <= 15; i++) {
                            const ingredient = data.drinks[0][`strIngredient${i}`]
                            const measure = data.drinks[0][`strMeasure${i}`]
                            if (ingredient && measure) {
                                ingredients.push({ ingredient, measure })
                            }
                        }
                        const ingredientList = document.querySelector(`.ingredientList-${idDrink}`)
                        ingredients.forEach(({ ingredient, measure }) => {
                            ingredientList.innerHTML += `
                                <li>
                                    <img src="https://www.thecocktaildb.com/images/ingredients/${ingredient}-Medium.png" alt="${ingredient}">
                                    ${measure} ${ingredient}
                                </li>`
                        })
                    })
            })
            searchInput.value = ''
        })
    result.classList.remove('hidden')
}



searchInput.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        handleSearch()
        submit.click()
    }
})

