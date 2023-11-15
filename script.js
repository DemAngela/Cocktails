const row = document.querySelector('.row')


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
                                    ingredientImg.src = `https://www.thecocktaildb.com/images/ingredients/${ingredient}-Small.png`
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

                    // удаление листа с ингридиентами при нажатии, так как была проблема что при нажалии появлялся второй лист с ингридиентами

                    if (deleteIngredientsList) {
                        deleteIngredientsList.remove();
                    }

                })
            })
        })
}
handleGetCocktails()



