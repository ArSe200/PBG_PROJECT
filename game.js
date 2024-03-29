/* Підключення DOM об'єктів до скрипту*/
const field = document.querySelector("#main_field");
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
const pointer = document.querySelector("#Touch_point");
const touch_field = document.querySelector("#Touch_field")

/* Додавання звуків */
const score_sound = new Audio("audio/score.mp3");
const lose_sound = new Audio("audio/lose.mp3");

/* Оголошення змінних */
let emigrants = [];
let score = 0;
let isStop = false;
let generator;
let speed_up = false;
let price_list = {
    1: 1000,
    2: 2000
}
let player_Xpos = 0;

/* Оголошення класу Emigrant */
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
        /* Зрушення на 0.1% вниз */
        this.y += 0.1;
        this.emigrant.style.top = this.y + "%";
    }
}

/* Завантаження кращого результату зі сховища браузера */
let high_score = Number(localStorage.getItem("score"));
if (high_score == null) {
    high_score = 0;
    localStorage.setItem("score", 0);
}
highScoreDisplay.textContent = "High Score: " + high_score;

/* Завантаження кількох монет */
let money = Number(localStorage.getItem("money"));
if (money == null) {
    money = 0;
    localStorage.setItem("money", 0);
}
moneyDisplay.textContent = "Money: " + money;

/* Завантаження куплених скінів */
let skins = localStorage.getItem("skins");
if (skins == null) {
    skins = "0";
    localStorage.setItem("skins", "0");
}
skins = skins.split(",");
document.querySelectorAll('.skin').forEach((but, i) => {
    if (i > 1 && jQuery.inArray(String(i - 1), skins) != -1) document.querySelector("#price_" + (i - 1)).remove();
});

/* Генератор емігрантів */
function generateEmigrant() {
    if (!document.hidden) {
        /* Визначення типу емігранта
        (Шанс на зеленого – 10%) */

        let is_green = Math.random() > 0.9 ? true : false;

        /* Створення нового емігранта */
        emigrants.push(new Emigrant(Math.random() * 95 + "%", -10, is_green));
    }
}

/* Додавання обробника руху емігранта */
function moveEmigrants() {
    if (!document.hidden) {
        for (let en = 0; en < emigrants.length; en++) {
            let emigrant = emigrants[en];
            /* Якщо гра завершена, то емігрант видаляється */
            if (isStop) {
                game.removeChild(emigrant.emigrant);
            }
            else {
                emigrant.MoveEmigrant();

                /* Перевірка влучення спецназу з емігранту */
                if (checkCollision(emigrant.emigrant, player)) {
                    if (!emigrant.type) {
                        /* Збільшення рахунку */
                        add_score(1);
                        clearInterval(mover);
                        mover = setInterval(moveEmigrants, 15 - 15 * score / (score + 100));

                        /* Вилучення емігранта */
                        game.removeChild(emigrant.emigrant);
                        emigrants.shift();
                    }
                    else {
                        stop_game();
                    }
                }

                /* Перевірка торкання емігрантом нижнього кордону */
                if (emigrant.y >= 100) {
                    if (!emigrant.type) {
                        stop_game();
                    }
                    else {
                        /* Збільшення рахунку */
                        add_score(1);
                        clearInterval(mover);
                        mover = setInterval(moveEmigrants, 15 - 15 * score / (score + 100));

                        /* Вилучення емігранта */
                        game.removeChild(emigrant.emigrant);
                        emigrants.shift();
                    }
                }
            }
        }
    }
}

/* Нарахування балів */
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

    /* Нарахування монет */
    money += 1;

    localStorage.setItem("money", money);

    moneyDisplay.textContent = "Money: " + money;
}

/* Обробка поразки */
function stop_game() {
    /* Зупинка гри */
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

/* Перевірка торкання емігрантом сітки */
function checkCollision(a, b) {
    /* Отримання хітбоксів */
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    /* Порівняння хітбоксів та повернення результату */
    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

/* Обробка рухів миші */
field.addEventListener("mousemove", (event) => {
    if (!isStop && !event.sourceCapabilities.firesTouchEvents) {
        let filed_width = field.clientWidth;
        let realX = event.clientX - (document.documentElement.clientWidth - filed_width) / 2;
        if (realX < filed_width * 0.05) player_Xpos = 5;
        else if (realX > filed_width * 0.95) player_Xpos = 95;
        else player_Xpos = realX / filed_width * 100;
        player.style.left = player_Xpos + "%";
    }
});

/* Обробка тачскріну */
let start_pos_x;
let shift_x = 0;
let shift_y = 0;
let t_mover = 0;
let t_mover_speed = 0;

/* Обробка тачскрину при русі пальцем */
document.addEventListener("touchmove", (event) => {
    if (!isStop) {
        let xPos = event.changedTouches[0].clientX;
        let realPos = xPos - start_pos_x;
        let pPos = 50 + (realPos / (touch_field.clientWidth)) * 100;
        if (pPos < 10) {
            pointer.style.left = "10%";
            t_mover_speed = -1;
        }
        else if (pPos > 90) {
            pointer.style.left = "90%";
            t_mover_speed = 1;
        }
        else {
            pointer.style.left = pPos + "%";
            if (realPos>0) t_mover_speed = Math.pow(realPos / (touch_field.clientWidth * 0.4), 2);
            if (realPos<0) t_mover_speed = -Math.pow(realPos / (touch_field.clientWidth * 0.4), 2);
        }
    }
});

/* Обробка тачскрину при торканні */
document.addEventListener("touchstart", (event) => {
    if (!isStop) {
        touch_field.style.display = "block";

        shift_x = (document.documentElement.clientWidth - field.clientWidth) / 2;
        shift_y = (document.documentElement.clientHeight - field.clientHeight) / 2;

        start_pos_x = event.changedTouches[0].clientX;
        touch_field.style.left = start_pos_x - shift_x + "px";
        pointer.style.left = "50%";
        touch_field.style.top = event.changedTouches[0].clientY - shift_y + "px";

        t_mover = setInterval(touch_mover, 1);
    }
});

/* Обробка тачскрину при відпусканні */
document.addEventListener("touchend", (event) => {
    if (!isStop) {
        clearInterval(t_mover);
        touch_field.style.display = "none";
    }
});

/* Функція відображення повзунка тачскріна */
function touch_mover() {
    if ((player_Xpos < 5 && t_mover_speed > 0) || (t_mover_speed < 0 && 95 < player_Xpos) || (player_Xpos > 5 && player_Xpos < 95)) {
        player_Xpos += t_mover_speed / 3;
        player.style.left = player_Xpos + "%";
    }
}


/* Обробка кнопки рестарту */
retryButton.addEventListener("click", (event) => {
    isStop = false;
    score = 0;
    click_sound.play()

    /* Згортання екрана "Game Over" */
    scoreDisplay.textContent = "Score: " + score;
    gameOver.style.display = "none";
    retryButton.style.display = "none";
    player.style.display = "block";
    skinShop.style.display = "none";
    borderLine.style.display = "block";

    /* Перезапуск генератора емігрантів */
    generator = setInterval(generateEmigrant, 2000);
    mover = setInterval(moveEmigrants, 15)
});

/* Обробка кнопки магазину */
skinShop.addEventListener("click", (event) => {
    click_sound.play()

    /* Згортання гри */
    gameOver.style.display = "none";
    retryButton.style.display = "none";
    skinShop.style.display = "none";
    scoreDisplay.style.display = "none";
    highScoreDisplay.style.display = "none";
    moneyDisplay.style.display = "none";

    /* Відкриття магазину */
    $('.skin').css('display', 'flex');
    moneyDisplay2.textContent = money;

});

/* Обробка кнопок у магазині */
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

        /* Закриття магазину */
        $('.skin').css('display', 'none');

        click_sound.play()

        /* Розгортання гри */
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