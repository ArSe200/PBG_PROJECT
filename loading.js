let load_progress = 0;
let load_timer;

const click_sound = new Audio("audio/click.mp3");

/* Подключение DOM обьектов к скрипту*/
const loadingBar = document.querySelector("#loading_bar");
const loadingScreen = document.querySelector("#loading_screen");
const loadingIMG = document.querySelector("#loading_img");
const startBTN = document.querySelector("#start_button");
const skin_object = document.querySelector("#player");

/* Загрузка скина */
let selected_skin = localStorage.getItem("skin");
if (selected_skin == null || selected_skin<0 || selected_skin>2) {
    selected_skin = 0;
    localStorage.setItem("skin", 0);
}
skin_object.setAttribute("src", `skins/skin_${selected_skin}.png`)


/* Функция обработки экрана загрузки */
function loading() {
    load_progress++;

    if (load_progress < 80) {
        loadingBar.style.width = load_progress + "%";
        loadingIMG.style.left = load_progress + 10 + "%";
    }

    /* Отображение кнопки */
    if (load_progress > 80) {
        clearInterval(load_timer);
        startBTN.style.display = "block";
    } 
}

load_timer = setInterval(loading, 30);

start_button.addEventListener("click", (event) => {
    click_sound.play()

    /* Отключение экрана загрузки */
    loadingScreen.style.display = "none";

    /* Запуск генератора эмигрантов */
    generator = setInterval(generateEmigrant, 2000);
});