/* Подключение DOM обьектов к скрипту*/
const game = document.querySelector("#game");
const player = document.querySelector("#player");
const scoreDisplay = document.querySelector("#scoreboard");
const highScoreDisplay = document.querySelector("#scoreboard_high");
const gameOver = document.querySelector("#game-over");
const retryButton = document.querySelector("#retry_button_frame");
const skinShop = document.querySelector("#skin_shop");
const borderLine = document.querySelector("#border_line");
const moneyDisplay = document.querySelector("#moneyDisplay");
const moneyDisplay2 = document.querySelector("#moneyDisplay2");

/* Добавление звуков */
const score_sound = new Audio("audio/score.mp3");
const lose_sound = new Audio("audio/lose.mp3");

/* Объявление переменных */
let score = 10000000;
let isStop = false;
let generator;
let mouse;
let speed_up = false;

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
console.log(money);

/* Загрузка купленных скинов */


/* Генератор эмигрантов */
function generateEmigrant() {
    if (!document.hidden) {
        /* Обределение типа эмигранта 
        (шанс на зеленого - 10%) */

        let is_green = Math.random()>0.9 ? true : false;

        /* Создание нового эмигранта */
        const emigrant = document.createElement("div");
        emigrant.style.left = Math.random() * (game.clientWidth - 50) + "px";
        emigrant.style.top = "0px";
        if (is_green) emigrant.classList.add("emigrant_green");
        else   emigrant.classList.add("emigrant");
        game.appendChild(emigrant);

        /* Добавление обработчика движения эмигранта */
        let emigrantTop = 0;
        const moveEmigrant = setInterval(() => {
            /* Если игра завершена, то эмигрант удаляется */
            if (isStop) {
                clearInterval(moveEmigrant);
                game.removeChild(emigrant);
            }
            else {
                /* Сдвиг на 1%, от высоты игрового поля, вниз */
                emigrantTop += 1;
                emigrant.style.top = emigrantTop + "px";

                /* Проверка попадания спецназа по эмигранту */
                if (checkCollision(emigrant, player)) {
                    if (!is_green){
                        /* Увеличение счета */
                        add_score(1);

                        /* Удаление эмигранта */
                        game.removeChild(emigrant);
                        clearInterval(moveEmigrant);
                    }
                    else {
                        stop_game();
                    }
                }

                /* Проверка касания эмигрантом нижней границы */
                if (emigrantTop >= game.clientHeight - 50) {
                    if (!is_green) {
                        stop_game();
                    }
                    else {
                        /* Увеличение счета */
                        add_score(1);

                        /* Удаление эмигранта */
                        game.removeChild(emigrant);
                        clearInterval(moveEmigrant);
                    }
                }
            }
        }, 15 - 15 * score / (score + 200));
    }
}

/* Начисление очков */
function add_score(amount) {
    score+=amount;
    
    if (score>150 && speed_up == false) {
        speed_up = true;
        clearInterval(generator);
        generator = setInterval(generateEmigrant, 1000);
        if (new Date().getTime() > 1678406400000) new Audio("audio/blick.mp3").play();
    }
    if (score > high_score) {
        high_score = score;
        localStorage.setItem("score", high_score);
    }
    scoreDisplay.textContent = "Score: " + score;
    highScoreDisplay.textContent = "High Score: " + high_score;

    score_sound.play()

    /* Начисление монет */
    money+=1;

    localStorage.setItem("money", money);

    moneyDisplay.textContent = "Money: " + money;
}

/* Обработка поражения */
function stop_game() {
    /* Остановка игры */
    isStop = true;
    clearInterval(generator)
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

/* Обработка движений мыши */
mouse = document.addEventListener("mousemove", (event) => {
    if (!isStop) {
        /* Смещение игрока в зависимости от положения мыши с учетом краев экрана */
        if (event.clientX > document.documentElement.clientWidth * 0.1 + 100 && event.clientX < document.documentElement.clientWidth * 0.9 - 100) player.style.left = (event.clientX - document.documentElement.clientWidth * 0.1 - 100) + "px";
        else if (event.clientX < document.documentElement.clientWidth * 0.1 + 100) player.style.left = 0 + "px";
        else player.style.left = document.documentElement.clientWidth * 0.8 - 200 + "px";
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
    $('.skin').css('display', 'block');
    moneyDisplay2.textContent = "Money: " + money;

});

