// mealrush.js
// Управление списком блюд на странице "Собрать ланч"
// Сохраняет выбор в localStorage и показывает панель перехода к оформлению

const STORAGE_KEY = "mealrush_selected"; // сохраняем объект { soup: keyword, main: keyword, ... }
const API_BASE = "https://edu.std-900.ist.mospolytech.ru";

let meals = []; // данные с API

// Панель перехода к оформлению (sticky)
const checkoutPanel = document.createElement("div");
checkoutPanel.id = "checkout-panel";
checkoutPanel.style.position = "sticky";
checkoutPanel.style.bottom = "20px";
checkoutPanel.style.right = "20px";
checkoutPanel.style.padding = "12px 16px";
checkoutPanel.style.background = "#fff";
checkoutPanel.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
checkoutPanel.style.borderRadius = "10px";
checkoutPanel.style.display = "none";
checkoutPanel.style.zIndex = "999";
checkoutPanel.innerHTML = `
  <div style="display:flex;gap:12px;align-items:center;">
    <div id="checkout-total" style="font-weight:700">Итого: 0 ₽</div>
    <a id="checkout-link" href="Order.html" style="pointer-events:none;opacity:0.5;padding:8px 12px;border-radius:6px;background:#ccc;color:#fff;text-decoration:none;">Перейти к оформлению</a>
  </div>
`;
document.body.appendChild(checkoutPanel);

// helper: безопасно получить URL изображения
function getImageUrl(path) {
    if (!path) return "images/noimage.jpg";
    // если уже абсолютный
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    // если начинается с '/' — добавляем домен
    if (path.startsWith("/")) return API_BASE + path;
    // иначе считаем относительным к /uploads или к images — сначала попробуем API_BASE + '/' + path
    return API_BASE + "/" + path;
}

// localStorage helpers
function readStoredSelection() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { soup: "", main: "", salad: "", drink: "", dessert: "" };
        const parsed = JSON.parse(raw);
        return Object.assign({ soup: "", main: "", salad: "", drink: "", dessert: "" }, parsed);
    } catch (e) {
        console.error("Ошибка чтения localStorage:", e);
        return { soup: "", main: "", salad: "", drink: "", dessert: "" };
    }
}
function writeStoredSelection(obj) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch (e) {
        console.error("Ошибка записи localStorage:", e);
    }
}

// комбо (на основании ТЗ / ЛР6) — можно корректировать
const COMBOS = [
    { soup: true, main: true, salad: true, drink: true, dessert: false },
    { soup: true, main: true, salad: false, drink: true, dessert: false },
    { soup: false, main: true, salad: true, drink: true, dessert: false },
    { soup: false, main: true, salad: false, drink: true, dessert: false },
    { soup: true, main: false, salad: true, drink: true, dessert: false }
];

function selectionMatchesAnyCombo(selection) {
    return COMBOS.some(combo => {
        for (const field of ["soup","main","salad","drink","dessert"]) {
            if (combo[field] && !selection[field]) return false;
        }
        return true;
    });
}

// Создание карточки блюда (используется на странице MakeLunch)
function createMealCard(meal, container) {
    const card = document.createElement("div");
    card.classList.add("meal-card");
    card.dataset.kind = meal.kind;
    card.dataset.keyword = meal.id;

    const imgUrl = getImageUrl(meal.image);

    card.innerHTML = `
        <img src="${imgUrl}" alt="${escapeHtml(meal.name)}">
        <p class="meal-price">${meal.price} ₽</p>
        <p class="meal-name">${escapeHtml(meal.name)}</p>
        <p class="meal-weight">${escapeHtml(meal.weight)}</p>
        <button class="add-btn">Добавить</button>
    `;

    const addBtn = card.querySelector(".add-btn");

    // визуальная отметка если карточка выбрана
    const stored = readStoredSelection();
    if (stored[meal.category] === meal.id) {
        card.classList.add("selected");
        addBtn.textContent = "Добавлен";
        addBtn.style.background = "#6aa84f";
    }

    addBtn.addEventListener("click", () => {
        // Сохраняем выбор: на каждую категорию — только одно блюдо (keyword)
        const sel = readStoredSelection();
        sel[meal.category] = meal.id;
        writeStoredSelection(sel);
        // визуально пометим все карточки этой категории, снимем у остальных
        const containerAll = container.querySelectorAll(".meal-card");
        containerAll.forEach(c => {
            c.classList.remove("selected");
            const btn = c.querySelector(".add-btn");
            if (btn) {
                btn.textContent = "Добавить";
                btn.style.background = "orange";
            }
        });
        // пометим текущую
        card.classList.add("selected");
        addBtn.textContent = "Добавлен";
        addBtn.style.background = "#6aa84f";
        updateTotal();
        refreshCheckoutPanel();
    });

    container.appendChild(card);
}

// Экранирование текста для alt/title
function escapeHtml(s) {
    if (!s) return "";
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// Загрузка блюд с API и рендер
async function loadDishes() {
    const url = API_BASE + "/labs/api/dishes";
    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Ошибка загрузки данных");
        const data = await resp.json();
        meals = data.map(item => ({
            id: item.keyword || (item.name && item.name.toLowerCase().replace(/\s+/g,"_")) || String(Math.random()),
            name: item.name,
            price: Number(item.price),
            weight: item.count || item.weight || "",
            image: item.image,
            category: item.category,
            kind: item.kind,
            numericId: item.id !== undefined ? Number(item.id) : (item.dish_id !== undefined ? Number(item.dish_id) : null)
        }));

        // очистка контейнеров
        document.querySelectorAll(".meal-grid").forEach(g => g.innerHTML = "");

        // заполнение
        document.querySelectorAll(".meal-section").forEach(section => {
            const category = section.dataset.category;
            const container = section.querySelector(".meal-grid");
            meals.filter(m => m.category === category).forEach(m => createMealCard(m, container));

            // привязка фильтров (кнопки в секции)
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
                        allCards.forEach(c => c.style.display = c.dataset.kind === kind ? "" : "none");
                    }
                });
            });
        });

        // восстановим выделения из localStorage
        restoreSelectionsFromStorage();

        updateTotal();
        refreshCheckoutPanel();

    } catch (err) {
        console.error(err);
        showNotification("Ошибка загрузки блюд. Попробуйте позже.");
    }
}

// Восстановление выделений (при загрузке страницы)
function restoreSelectionsFromStorage() {
    const stored = readStoredSelection();
    // пройдем по всем карточкам и отметим нужные
    document.querySelectorAll(".meal-card").forEach(card => {
        const kw = card.dataset.keyword;
        const category = card.closest(".meal-section")?.dataset?.category;
        const btn = card.querySelector(".add-btn");
        card.classList.remove("selected");
        if (stored[category] && stored[category] === kw) {
            card.classList.add("selected");
            if (btn) { btn.textContent = "Добавлен"; btn.style.background = "#6aa84f"; }
        } else {
            if (btn) { btn.textContent = "Добавить"; btn.style.background = "orange"; }
        }
    });
}

// Подсчёт итоговой суммы по выбранным блюдам
function updateTotal() {
    const stored = readStoredSelection();
    let total = 0;
    for (const cat of ["soup","main","salad","drink","dessert"]) {
        const kw = stored[cat];
        if (!kw) continue;
        const meal = meals.find(m => m.id === kw);
        if (meal && meal.price) total += Number(meal.price);
    }
    const checkoutTotal = document.getElementById("checkout-total");
    if (checkoutTotal) checkoutTotal.textContent = `Итого: ${total} ₽`;
}

// Обновление панели перехода к оформлению
function refreshCheckoutPanel() {
    const stored = readStoredSelection();
    const anySelected = Object.values(stored).some(v => !!v);
    const checkoutLink = document.getElementById("checkout-link");
    if (!anySelected) {
        checkoutPanel.style.display = "none";
        return;
    }
    checkoutPanel.style.display = "block";
    if (selectionMatchesAnyCombo(stored)) {
        checkoutLink.style.pointerEvents = "";
        checkoutLink.style.opacity = "1";
        checkoutLink.style.background = "orange";
        checkoutLink.style.color = "#fff";
    } else {
        checkoutLink.style.pointerEvents = "none";
        checkoutLink.style.opacity = "0.5";
        checkoutLink.style.background = "#ccc";
        checkoutLink.style.color = "#fff";
    }
}

// Уведомление (модальное)
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
    notif.querySelector(".notif-ok").addEventListener("click", () => notif.remove());
}

// Инициализация: загрузка блюд
loadDishes();
