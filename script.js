let currentUser = null;

const events = [
    {id: 1, name: "Футбол: Україна vs Англія", odds: 1.5},
    {id: 2, name: "Теніс: Federer vs Nadal", odds: 2.0},
    {id: 3, name: "Баскетбол: Lakers vs Celtics", odds: 1.8}
];

function register() {
    const username = document.getElementById("username").value;
    if (!username) return alert("Введіть ім'я користувача!");
    if (localStorage.getItem(username)) return alert("Користувач вже існує!");
    
    const user = { balance: 100 };
    localStorage.setItem(username, JSON.stringify(user));
    alert("Користувач зареєстрований! Баланс $100");
}

function login() {
    const username = document.getElementById("username").value;
    const userData = localStorage.getItem(username);
    if (!userData) return alert("Користувача не знайдено!");
    
    currentUser = username;
    document.getElementById("user-name").textContent = currentUser;
    document.getElementById("balance").textContent = JSON.parse(userData).balance;
    document.getElementById("auth").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    renderEvents();
}

function logout() {
    currentUser = null;
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("auth").style.display = "block";
}

function renderEvents() {
    const container = document.getElementById("events");
    container.innerHTML = "";
    events.forEach(event => {
        const div = document.createElement("div");
        div.className = "event";
        div.innerHTML = `
            <strong>${event.name}</strong> | Коефіцієнт: ${event.odds}
            <br>
            <input type="number" id="bet-${event.id}" placeholder="Ставка">
            <button onclick="placeBet(${event.id})">Ставити</button>
        `;
        container.appendChild(div);
    });
}

function placeBet(eventId) {
    const betInput = document.getElementById(`bet-${eventId}`);
    const betAmount = parseFloat(betInput.value);
    if (!betAmount || betAmount <= 0) return alert("Введіть ставку!");
    
    const userData = JSON.parse(localStorage.getItem(currentUser));
    if (betAmount > userData.balance) return alert("Недостатньо балансу!");

    if (Math.random() < 0.5) {
        const odds = events.find(e => e.id === eventId).odds;
        userData.balance += betAmount * (odds - 1);
        alert(`Ви виграли $${(betAmount * (odds - 1)).toFixed(2)}!`);
    } else {
        userData.balance -= betAmount;
        alert("Ви програли!");
    }
    
    localStorage.setItem(currentUser, JSON.stringify(userData));
    document.getElementById("balance").textContent = userData.balance.toFixed(2);
    betInput.value = "";
}