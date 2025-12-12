// ----------------- ГЛАВНЫЕ ПЕРЕМЕННЫЕ -----------------

let meals = []; // данные будут загружены с API

const selects = {
    soup: document.getElementById("soup-select"),
    main: document.getElementById("main-select"),
    salad: document.getElementById("salad-select"),
    drink: document.getElementById("drink-select"),
    dessert: document.getElementById("dessert-select")
};

let totalPrice = 0;

const form = document.getElementById("order-form");
const totalBlock = document.createElement("p");
totalBlock.id = "total-price-block";
totalBlock.style.fontSize = "20px";
totalBlock.style.fontWeight = "700";
totalBlock.style.marginTop = "15px";
form.appendChild(totalBlock);


// ----------------- СОЗДАНИЕ КАРТОЧКИ БЛЮДА -----------------

function createMealCard(meal, container) {
    const card = document.createElement("div");
    card.classList.add("meal-card");
    card.dataset.kind = meal.kind;

    card.innerHTML = `
        <img src="${meal.image}" alt="${meal.name}">
        <p class="meal-price">${meal.price} ₽</p>
        <p class="meal-name">${meal.name}</p>
        <p class="meal-weight">${meal.weight}</p>
        <button>Добавить</button>
    `;

    card.querySelector("button").addEventListener("click", () => {
        const select = selects[meal.category];
        if (!select.querySelector(`option[value="${meal.id}"]`)) {
            const option = document.createElement("option");
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


// ----------------- ПОДСЧЁТ ИТОГА -----------------

function updateTotal() {
    totalPrice = 0;
    Object.values(selects).forEach(sel => {
        const opt = sel.selectedOptions[0];
        if (opt && opt.dataset.price) totalPrice += Number(opt.dataset.price);
    });
    totalBlock.textContent = `Итого: ${totalPrice} ₽`;
}


// ----------------- УВЕДОМЛЕНИЕ -----------------

function showNotification(message) {
    const notif = document.createElement("div");
    notif.className = "order-notification";
    notif.innerHTML = `
        <div class="notif-content">
            <p>${message}</p>
            <button class="notif-ok">Окей</button>
        </div>
    `;
    document.body.appendChild(notif);

    notif.querySelector(".notif-ok").addEventListener("click", () => {
        notif.remove();
    });
}


// добавление css для уведомления
const styleNotif = document.createElement("style");
styleNotif.textContent = `
.order-notification {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
.notif-content {
    background: white;
    padding: 20px 30px;
    border-radius: 10px;
    font-size: 18px;
    text-align: center;
}
.notif-ok {
    margin-top: 15px;
    padding: 8px 15px;
    font-size: 16px;
}
`;
document.head.appendChild(styleNotif);


// ----------------- ЗАГРУЗКА БЛЮД С API -----------------

async function loadDishes() {
    const url = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Ошибка загрузки данных");

        const data = await response.json();

        // очищаем массив с блюдами
        meals.length = 0;

        // преобразуем формат
        data.forEach(item => {
            meals.push({
                id: item.keyword,
                name: item.name,
                price: Number(item.price),
                weight: item.count,
                image: item.image,
                category: item.category,
                kind: item.kind
            });
        });

        // очистка карточек
        document.querySelectorAll(".meal-grid").forEach(grid => grid.innerHTML = "");

        // создаём новые карточки
        document.querySelectorAll(".meal-section").forEach(section => {
            const category = section.dataset.category;
            const container = section.querySelector(".meal-grid");

            meals
                .filter(m => m.category === category)
                .forEach(meal => createMealCard(meal, container));

            // фильтры
            const buttons = section.querySelectorAll(".filter-btn");
            buttons.forEach(btn => {
                btn.addEventListener("click", () => {
                    const kind = btn.dataset.kind;
                    const allCards = container.querySelectorAll(".meal-card");

                    if (btn.classList.contains("active")) {
                        btn.classList.remove("active");
                        allCards.forEach(c => c.style.display = "");
                    } else {
                        buttons.forEach(b => b.classList.remove("active"));
                        btn.classList.add("active");
                        allCards.forEach(c => {
                            c.style.display = c.dataset.kind === kind ? "" : "none";
                        });
                    }
                });
            });
        });

        updateTotal();

    } catch (err) {
        console.error("Ошибка:", err);
        showNotification("Ошибка загрузки блюд. Попробуйте позже.");
    }
}


// ----------------- ВАЛИДАЦИЯ ФОРМЫ -----------------

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const selected = {
        soup: selects.soup.value,
        main: selects.main.value,
        salad: selects.salad.value,
        drink: selects.drink.value,
        dessert: selects.dessert.value
    };

    let message = "";

    const nothingSelected = Object.values(selected).every(v => !v);
    if (nothingSelected) message = "Ничего не выбрано. Выберите блюда для заказа";
    else if (!selected.drink && (selected.soup || selected.main || selected.salad))
        message = "Выберите напиток";
    else if (!selected.main && !selected.salad && selected.soup)
        message = "Выберите главное блюдо/салат/стартер";
    else if (!selected.soup && !selected.main && selected.salad)
        message = "Выберите суп или главное блюдо";
    else if (!selected.main && (selected.drink || selected.dessert))
        message = "Выберите главное блюдо";

    if (message) {
        showNotification(message);
        return;
    }

    form.submit();
});


// ----------------- ПРОЧЕЕ -----------------

Object.values(selects).forEach(sel => sel.addEventListener("change", updateTotal));

form.addEventListener("reset", () => {
    setTimeout(updateTotal, 0);
});


// ----------------- СТАРТ -----------------

loadDishes();   // загружаем блюда
updateTotal();  // обновляем сумму
