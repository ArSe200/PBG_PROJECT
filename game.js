/* Подключение DOM обьектов к скрипту*/
const game = document.querySelector("#game");
const player = document.querySelector("#player");
const scoreDisplay = document.querySelector("#scoreboard_main");
const highScoreDisplay = document.querySelector("#scoreboard_high");
const gameOver = document.querySelector("#game_over");
const retryButton = document.querySelector("#retry_button_frame");
const skinShop = document.querySelector("#skin_shop");
const borderLine = document.querySelector("#border_line");
const moneyDisplay = document.querySelector("#moneyDisplay");
const moneyDisplay2 = document.querySelector("#moneyDisplay2");

/* Добавление звуков */
const score_sound = new Audio("audio/score.mp3");
const lose_sound = new Audio("audio/lose.mp3");

/* Объявление переменных */
let emigrants = [];
let score = 0;
let isStop = false;
let generator;
let mouse;
let speed_up = false;
let price_list = {
    1: 1000,
    2: 2000
}

/* Обьявление класса Emigrant */
class Emigrant {
    constructor(x, y, type) {
        this.x = x
        this.y = y
        this.type = type;
        this.emigrant = document.createElement("div");
        this.emigrant.style.left = x;
        this.emigrant.style.top = y + "%";
        if (type) this.emigrant.classList.add("emigrant_green");
        else this.emigrant.classList.add("emigrant");
        game.appendChild(this.emigrant);
    }

    MoveEmigrant() {
        /* Сдвиг на 0.1% вниз */
        this.y += 0.1;
        this.emigrant.style.top = this.y + "%";
    }
}

/* Загрузка лучшего результата из хранилищя браузера */
let high_score = Number(localStorage.getItem("score"));
if (high_score == null) {
    high_score = 0;
    localStorage.setItem("score", 0);
}
highScoreDisplay.textContent = "High Score: " + high_score;

/* Загрузка кол-ва монет */
let money = Number(localStorage.getItem("money"));
if (money == null) {
    money = 0;
    localStorage.setItem("money", 0);
}
moneyDisplay.textContent = "Money: " + money;

/* Загрузка купленных скинов */
let skins = localStorage.getItem("skins");
if (skins == null) {
    skins = "0";
    localStorage.setItem("skins", "0");
}
skins = skins.split(",");
document.querySelectorAll('.skin').forEach((but, i) => {
    if (i > 1 && jQuery.inArray(String(i - 1), skins) != -1) document.querySelector("#price_" + (i - 1)).remove();
});

/* Генератор эмигрантов */
function generateEmigrant() {
    if (!document.hidden) {
        /* Обределение типа эмигранта 
        (шанс на зеленого - 10%) */

        let is_green = Math.random() > 0.9 ? true : false;

        /* Создание нового эмигранта */
        emigrants.push(new Emigrant(Math.random() * 95 + "%", 0, is_green));
    }
}

/* Добавление обработчика движения эмигранта */
function moveEmigrants() {
    if (!document.hidden) {
        for (let en = 0; en < emigrants.length; en++) {
            let emigrant = emigrants[en];
            /* Если игра завершена, то эмигрант удаляется */
            if (isStop) {
                game.removeChild(emigrant.emigrant);
            }
            else {
                emigrant.MoveEmigrant();

                /* Проверка попадания спецназа по эмигранту */
                if (checkCollision(emigrant.emigrant, player)) {
                    if (!emigrant.type) {
                        /* Увеличение счета */
                        add_score(1);
                        clearInterval(mover);
                        mover = setInterval(moveEmigrants, 15 - 15 * score / (score + 100));
                        
                        /* Удаление эмигранта */
                        game.removeChild(emigrant.emigrant);
                        emigrants.shift();
                    }
                    else {
                        stop_game();
                    }
                }

                /* Проверка касания эмигрантом нижней границы */
                if (emigrant.y >= 100) {
                    if (!emigrant.type) {
                        stop_game();
                    }
                    else {
                        /* Увеличение счета */
                        add_score(1);
                        clearInterval(mover);
                        mover = setInterval(moveEmigrants, 15 - 15 * score / (score + 100));

                        /* Удаление эмигранта */
                        game.removeChild(emigrant.emigrant);
                        emigrants.shift();
                    }
                }
            }
        }
    }
}

/* Начисление очков */
function add_score(amount) {
    score += amount;

    if (score > 150 && speed_up == false) {
        speed_up = true;
        clearInterval(generator);
        generator = setInterval(generateEmigrant, 1000);
    }
    if (score > high_score) {
        high_score = score;
        localStorage.setItem("score", high_score);
    }
    scoreDisplay.textContent = "Score: " + score;
    highScoreDisplay.textContent = "High Score: " + high_score;

    score_sound.play()

    /* Начисление монет */
    money += 1;

    localStorage.setItem("money", money);

    moneyDisplay.textContent = "Money: " + money;
}

/* Обработка поражения */
function stop_game() {
    /* Остановка игры */
    isStop = true;
    clearInterval(generator);
    clearInterval(mover);
    moveEmigrants();
    emigrants = [];
    lose_sound.play()

    /* Отображение экрана "Game Over" */
    gameOver.style.display = "block";
    retryButton.style.display = "block";
    player.style.display = "none";
    skinShop.style.display = "block";
    borderLine.style.display = "none";
}

/* Проверка касания эмигрантом сетки */
function checkCollision(a, b) {
    /* Получение хитбоксов */
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    /* Сравнение хитбоксов и возврат результата */
    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

/* Обработка движений мыши и точскина*/
touch = document.addEventListener("touchmove", (event) => {
    if (!isStop) {
        /* Смещение игрока в зависимости от положения мыши с учетом краев экрана */
        xPos = event.changedTouches[0].clientX;
        var doc_width = document.documentElement.clientWidth;

        if (xPos > doc_width*0.05 && xPos < doc_width*0.95) player.style.left = xPos/doc_width*100 + "%";
    }  
});

mouse = document.addEventListener("mousemove", (event) => {
    if (!isStop) {
        /* Смещение игрока в зависимости от положения мыши с учетом краев экрана */
        var doc_width = document.documentElement.clientWidth;
        if (event.clientX > doc_width*0.05 && event.clientX < doc_width*0.95) player.style.left = event.clientX/doc_width*100 + "%";
    }
});

/* Обработка кнопки рестарта */
retryButton.addEventListener("click", (event) => {
    isStop = false;
    score = 0;
    click_sound.play()

    /* Сворачивание экрана "Game Over" */
    scoreDisplay.textContent = "Score: " + score;
    gameOver.style.display = "none";
    retryButton.style.display = "none";
    player.style.display = "block";
    skinShop.style.display = "none";
    borderLine.style.display = "block";

    /* Перезапуск генератора эмигрантов */
    generator = setInterval(generateEmigrant, 2000);
    mover = setInterval(moveEmigrants, 15)
});

/* Обработка кнопки магазина */
skinShop.addEventListener("click", (event) => {
    click_sound.play()

    /* Сворачивание игры */
    gameOver.style.display = "none";
    retryButton.style.display = "none";
    skinShop.style.display = "none";
    scoreDisplay.style.display = "none";
    highScoreDisplay.style.display = "none";
    moneyDisplay.style.display = "none";

    /* Открытие магазина */
    $('.skin').css('display', 'flex');
    moneyDisplay2.textContent = money;

});

/* Обработка кнопок в магазине */
function skin_buttons_handler(event) {
    let but_id = event.srcElement.id;
    but_id = but_id[but_id.length - 1]
    if (jQuery.inArray(but_id, skins) != -1) {
        let selected_skin_old = selected_skin;
        selected_skin = but_id;
        localStorage.setItem("skin", selected_skin);
        skin_object.setAttribute("src", `skins/skin_${selected_skin}.png`)
        document.querySelector("#skin_n_" + selected_skin_old).classList.remove("choosedSkin");
        document.querySelector("#skin_n_" + selected_skin).classList.add("choosedSkin");

        /* Закрытие магазина */
        $('.skin').css('display', 'none');

        click_sound.play()

        /* Разворачивание игры */
        gameOver.style.display = "block";
        retryButton.style.display = "block";
        skinShop.style.display = "block";
        scoreDisplay.style.display = "block";
        highScoreDisplay.style.display = "block";
        moneyDisplay.style.display = "block";
    }
    else {
        but_id = Number(but_id)
        if (money >= price_list[but_id]) {
            money -= price_list[but_id];
            localStorage.setItem("money", money);
            moneyDisplay.textContent = "Money: " + money
            moneyDisplay2.textContent = money
            document.querySelector("#price_" + but_id).remove()
            skins.push(String(but_id));
            localStorage.setItem("skins", localStorage.getItem("skins") + "," + but_id)
        }
        else lose_sound.play();
    }
}

document.querySelectorAll('.skin').forEach((but, i) => { if (i > 0) but.addEventListener("click", skin_buttons_handler) });