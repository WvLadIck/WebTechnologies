
const mealCards = document.querySelectorAll('.meal-card');

const soupSelect = document.getElementById('soup-select');
const mainSelect = document.getElementById('main-select');
const drinkSelect = document.getElementById('drink-select');

let totalPrice = 0;

let totalBlock = document.createElement('p');
totalBlock.id = 'total-price-block';
totalBlock.style.fontSize = '20px';
totalBlock.style.fontWeight = '700';
totalBlock.style.marginTop = '15px';

const form = document.getElementById('order-form');
form.appendChild(totalBlock);

const categories = {
    'суп': soupSelect,
    'супы': soupSelect,
    'главные блюда': mainSelect,
    'главное блюдо': mainSelect,
    'напитки': drinkSelect,
    'напиток': drinkSelect
};

function updateTotal() {
    totalPrice = 0;

    const soupOption = soupSelect.selectedOptions[0];
    const mainOption = mainSelect.selectedOptions[0];
    const drinkOption = drinkSelect.selectedOptions[0];

    [soupOption, mainOption, drinkOption].forEach(opt => {
        if (opt && opt.dataset.price) totalPrice += Number(opt.dataset.price);
    });

    totalBlock.textContent = `Итого: ${totalPrice} ₽`;
}

mealCards.forEach(card => {
    const name = card.querySelector('.meal-name').textContent.trim();
    const price = Number(card.querySelector('.meal-price').textContent.replace(' ₽', '').trim());

    const section = card.closest('.meal-section');
    const categoryTitle = section ? section.querySelector('h2').textContent.toLowerCase() : '';

    const select = Object.keys(categories).find(key => categoryTitle.includes(key)) ? categories[Object.keys(categories).find(key => categoryTitle.includes(key))] : null;

    const btn = card.querySelector('button');

    if (select) {
        btn.addEventListener('click', () => {
            const option = Array.from(select.options).find(o => o.textContent.trim() === name);

            if (option) {
                option.selected = true;
                option.dataset.price = price;
            }

            updateTotal();
        });
    }
});

[soupSelect, mainSelect, drinkSelect].forEach(s => s.addEventListener('change', updateTotal));

updateTotal();
