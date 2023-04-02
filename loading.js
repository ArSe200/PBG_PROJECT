const click_sound = new Audio("audio/click.mp3");
const loadingBar = document.querySelector("#loading_bar");
isStop = true;

/* Загрузка скина */
let selected_skin = localStorage.getItem("skin");
if (selected_skin == null || selected_skin<0 || selected_skin>2) {
    selected_skin = 0;
    localStorage.setItem("skin", 0);
}
document.querySelector("#player").setAttribute("src", `skins/skin_${selected_skin}.png`)
document.querySelector("#skin_n_"+selected_skin).classList.add("choosedSkin");


/* Функция обработки экрана загрузки */
function loading() {
    load_progress++;

    if (load_progress <= 100) {
        loadingBar.style.width = 100-load_progress + "%";
    }

    /* Отображение кнопки */
    if (load_progress > 100) {
        clearInterval(load_timer);
        document.querySelector("#loading_bar_container").addEventListener("click", (event) => {
            click_sound.play()

            /* Отключение экрана загрузки */
            document.querySelector("#loading_screen").style.display = "none";
            document.querySelector("#loading_background").style.display = "none";

            /* Запуск генератора эмигрантов */
            isStop = false;
            generator = setInterval(generateEmigrant, 2000);
            mover = setInterval(moveEmigrants, 15);
            
        });
    } 
}

let load_progress = 0;
let load_timer = setInterval(loading, 30);