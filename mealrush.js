

const meals = [

    { id: "chicken_cream", name: "Куриный крем-суп", price: 250, weight: "300 мл", image: "images/soup1.jpeg", category: "soup", kind: "meat" },
    { id: "cheese_garlic", name: "Сырный суп с гренками", price: 270, weight: "320 мл", image: "images/soup2.jpeg", category: "soup", kind: "meat" },
    { id: "tomato_basil", name: "Томатный суп с базиликом", price: 300, weight: "300 мл", image: "images/soup3.jpeg", category: "soup", kind: "veg" },
    { id: "fish_soup", name: "Рыбный суп с лососем", price: 320, weight: "350 мл", image: "images/soup4.jpeg", category: "soup", kind: "fish" },
    { id: "beef_soup", name: "Говяжий суп", price: 280, weight: "300 мл", image: "images/soup5.jpeg", category: "soup", kind: "meat" },
    { id: "vege_soup", name: "Гаспачо", price: 260, weight: "300 мл", image: "images/soup6.jpeg", category: "soup", kind: "veg" },


    { id: "teriyaki_chicken", name: "Курица терияки с рисом", price: 420, weight: "350 г", image: "images/dish1.jpg", category: "main", kind: "meat" },
    { id: "pasta_alfredo", name: "Паста альфредо с грибами", price: 480, weight: "320 г", image: "images/dish2.jpg", category: "main", kind: "veg" },
    { id: "beef_steak", name: "Стейк из говядины", price: 510, weight: "280 г", image: "images/dish3.jpg", category: "main", kind: "meat" },
    { id: "fish_fillet", name: "Филе лосося с овощами", price: 500, weight: "300 г", image: "images/dish4.jpeg", category: "main", kind: "fish" },
    { id: "vege_burger", name: "Вегетарианский бургер", price: 430, weight: "250 г", image: "images/dish5.jpeg", category: "main", kind: "veg" },
    { id: "tuna_steak", name: "Стейк из тунца", price: 520, weight: "300 г", image: "images/dish6.jpeg", category: "main", kind: "fish" },

   
    { id: "ceasar_salad", name: "Салат Цезарь", price: 350, weight: "250 г", image: "images/salad1.jpeg", category: "salad", kind: "veg" },
    { id: "caprese", name: "Салат Капрезе", price: 250, weight: "200 г", image: "images/salad2.jpeg", category: "salad", kind: "veg" },
    { id: "tuna_salad", name: "Салат с тунцом", price: 380, weight: "220 г", image: "images/salad3.jpeg", category: "salad", kind: "fish" },
    { id: "chicken_salad", name: "Салат с курицей", price: 400, weight: "250 г", image: "images/salad4.jpeg", category: "salad", kind: "meat" },
    { id: "shrimp_salad", name: "Салат с креветками", price: 420, weight: "230 г", image: "images/salad5.jpeg", category: "salad", kind: "fish" },
    { id: "beef_salad", name: "Салат с говядиной", price: 410, weight: "250 г", image: "images/salad6.jpeg", category: "salad", kind: "meat" },


    { id: "berry_mors", name: "Морс ягодный", price: 150, weight: "250 мл", image: "images/drink1.jpg", category: "drink", kind: "cold" },
    { id: "citrus_lemonade", name: "Лимонад цитрусовый", price: 180, weight: "300 мл", image: "images/drink2.jpg", category: "drink", kind: "cold" },
    { id: "iced_tea", name: "Холодный чай", price: 120, weight: "250 мл", image: "images/drink3.jpg", category: "drink", kind: "cold" },
    { id: "coffee", name: "Кофе американо", price: 200, weight: "200 мл", image: "images/drink4.jpeg", category: "drink", kind: "hot" },
    { id: "tea", name: "Чай зеленый", price: 150, weight: "250 мл", image: "images/drink5.jpeg", category: "drink", kind: "hot" },
    { id: "latte", name: "Латте", price: 250, weight: "250 мл", image: "images/drink6.jpeg", category: "drink", kind: "hot" },


    { id: "cake_small", name: "Пирожное", price: 120, weight: "50 г", image: "images/dessert1.jpeg", category: "dessert", kind: "small" },
    { id: "cookie_small", name: "Печенье", price: 100, weight: "30 г", image: "images/dessert2.jpeg", category: "dessert", kind: "small" },
    { id: "macaron_small", name: "Макарон", price: 130, weight: "40 г", image: "images/dessert3.jpeg", category: "dessert", kind: "small" },
    { id: "cheesecake_medium", name: "Чизкейк", price: 250, weight: "120 г", image: "images/dessert4.jpeg", category: "dessert", kind: "medium" },
    { id: "tiramisu_medium", name: "Тирамису", price: 270, weight: "120 г", image: "images/dessert5.jpeg", category: "dessert", kind: "medium" },
    { id: "cake_large", name: "Торт шоколадный", price: 400, weight: "300 г", image: "images/dessert6.jpeg", category: "dessert", kind: "large" }
];

const selects = {
    soup: document.getElementById("soup-select"),
    main: document.getElementById("main-select"),
    salad: document.getElementById("salad-select"),
    drink: document.getElementById("drink-select"),
    dessert: document.getElementById("dessert-select")
};


function createMealCard(meal, container) {
    const card = document.createElement('div');
    card.classList.add('meal-card');
    card.dataset.kind = meal.kind;

    card.innerHTML = `
        <img src="${meal.image}" alt="${meal.name}">
        <p class="meal-price">${meal.price} ₽</p>
        <p class="meal-name">${meal.name}</p>
        <p class="meal-weight">${meal.weight}</p>
        <button>Добавить</button>
    `;
    
    card.querySelector('button').addEventListener('click', () => {
        const select = selects[meal.category];
        if (!select.querySelector(`option[value="${meal.id}"]`)) {
            const option = document.createElement('option');
            option.value = meal.id;
            option.textContent = meal.name;
            option.dataset.price = meal.price;
            select.appendChild(option);
        }
        select.value = meal.id;
        updateTotal();
    });

    container.appendChild(card);
}

let totalPrice = 0;
const form = document.getElementById('order-form');
const totalBlock = document.createElement('p');
totalBlock.id = 'total-price-block';
totalBlock.style.fontSize = '20px';
totalBlock.style.fontWeight = '700';
totalBlock.style.marginTop = '15px';
form.appendChild(totalBlock);

function updateTotal() {
    totalPrice = 0;
    Object.values(selects).forEach(sel => {
        const opt = sel.selectedOptions[0];
        if (opt && opt.dataset.price) totalPrice += Number(opt.dataset.price);
    });
    totalBlock.textContent = `Итого: ${totalPrice} ₽`;
}

document.querySelectorAll('.meal-section').forEach(section => {
    const category = section.dataset.category;
    const container = section.querySelector('.meal-grid');

    meals.filter(m => m.category === category).forEach(meal => {
        createMealCard(meal, container);
    });

    const buttons = section.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const kind = btn.dataset.kind;
            const allCards = container.querySelectorAll('.meal-card');

            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                allCards.forEach(c => c.style.display = '');
            } else {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                allCards.forEach(c => c.style.display = c.dataset.kind === kind ? '' : 'none');
            }
        });
    });
});


Object.values(selects).forEach(sel => sel.addEventListener('change', updateTotal));
form.addEventListener('reset', () => {
    setTimeout(updateTotal, 0);
});
updateTotal();
