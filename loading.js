const click_sound = new Audio("audio/click.mp3");
const loadingBar = document.querySelector("#loading_bar");
const skin_object = document.querySelector("#player");
isStop = true;

/* Зміна відповідно до пристрою */
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    const style = document.createElement('style');

    style.innerHTML = `
        @media (min-aspect-ratio:16/7){
            #main_field  {
                width: auto;
                height: 100%;
            }
        
            .scoreboard_text {
                font-size: 6.86vh;
                -webkit-text-stroke: 0.114vh #000;
                text-stroke: 0.114vh #000;
            }
        
            #scoreboard_main {
                font-size: 13.71vh;
                margin-bottom: 6.857vh;
                -webkit-text-stroke: 0.229vh #000;
                text-stroke: 0.229vh #000;
            }
        
            /* Магазин */
            .skin {
                font-size: 7vh;
                -webkit-text-stroke: 0.15vh #000;
                text-stroke: 0.15vh #000;
                box-shadow: 0 0 3.429vh 0.457vh black;
            }
        
            #shop_buttons {
                gap: 2.29vh;
            }
        
            /* Экран загрузки */
            #loading_screen {
                z-index: 9999;
                width: auto;
                height: 100%;
                aspect-ratio: 16/7;
            }
        
            #loading_bar_container > p {
                font-size: 18.29vh;
                -webkit-text-stroke: 0.457vh #000;
                text-stroke: 0.457vh #000; 
            }
      }
    `;

    document.head.appendChild(style);
}
else {
    const style = document.createElement('style');

    style.innerHTML = `
        @media (min-aspect-ratio:16/7){
            #main_field  {
                width: auto;
                height: 100%;
            }
        
            .scoreboard_text {
                font-size: 6.86vh;
                -webkit-text-stroke: 0.114vh #000;
                text-stroke: 0.114vh #000;
            }
        
            #scoreboard_main {
                font-size: 13.71vh;
                margin-bottom: 6.857vh;
                -webkit-text-stroke: 0.229vh #000;
                text-stroke: 0.229vh #000;
            }
        
            /* Магазин */
            .skin {
                font-size: 9.143vh;
                -webkit-text-stroke: 0.229vh #000;
                text-stroke: 0.229vh #000;
                box-shadow: 0 0 3.429vh 0.457vh black;
            }
        
            #shop_buttons {
                gap: 2.29vh;
            }
        
            /* Экран загрузки */
            #loading_screen {
                z-index: 9999;
                width: auto;
                height: 100vh;
                aspect-ratio: 16/7;
            }
        
            #loading_bar_container > p {
                font-size: 18.29vh;
                -webkit-text-stroke: 0.457vh #000;
                text-stroke: 0.457vh #000; 
            }
      }
    `;

    document.head.appendChild(style);
}

/* Завантаження скіна */
let selected_skin = localStorage.getItem("skin");
if (selected_skin == null || selected_skin<0 || selected_skin>2) {
    selected_skin = 0;
    localStorage.setItem("skin", 0);
}
document.querySelector("#player").setAttribute("src", `skins/skin_${selected_skin}.png`)
document.querySelector("#skin_n_"+selected_skin).classList.add("choosedSkin");


/* Функція обробки екрану завантаження */
function loading() {
    load_progress++;

    if (load_progress <= 100) {
        loadingBar.style.width = 100-load_progress + "%";
    }

    /* Відображення кнопки */
    if (load_progress > 100) {
        clearInterval(load_timer);
        document.querySelector("#loading_bar_container").addEventListener("click", (event) => {
            click_sound.play()

            /* Вимкнути екран завантаження */
            document.querySelector("#loading_screen").style.display = "none";
            document.querySelector("#loading_background").style.display = "none";

            /* Запуск генератора емігрантів */
            isStop = false;
            generator = setInterval(generateEmigrant, 2000);
            mover = setInterval(moveEmigrants, 15);
            
        });
    } 
}

let load_progress = 0;
let load_timer = setInterval(loading, 30);