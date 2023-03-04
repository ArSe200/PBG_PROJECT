let tree_amount_h = Math.ceil(game_background.clientWidth / 50) + 1
let tree_amount_v = Math.ceil(game_background.clientHeight / 50) + 1

function tree_generator(tree_amount, shift, direction = 0) {
    let last_tree_number;
    let tree_number;
    for (let t = 0; t < tree_amount; t++) {
        tree_number = Math.floor(Math.random() * 10) + 1;
        if (tree_number == last_tree_number) tree_number += 1;
        if (tree_number > 10) tree_number = 1;
        last_tree_number = tree_number;

        const tree_img = document.createElement("img");
        tree_img.src = `images/trees/tree_${tree_number}.png`
        switch (direction) {
            case 1:
                tree_img.style.top = t * 50 + "px";
                tree_img.style.left = Math.random() * 20 + shift + "px";
                break;

            default:
                tree_img.style.left = t * 50 + "px";
                tree_img.style.top = Math.random() * 20 + shift + "px";
                break;
        }
        tree_img.style.width = 50 + Math.random() * 100 + "px"
        tree_img.classList.add("tree");
        game_background.appendChild(tree_img);
    }
}

tree_generator(tree_amount_h, 0);
tree_generator(tree_amount_h, game_background.clientHeight);
tree_generator(tree_amount_v, 0, 1);
tree_generator(tree_amount_v, game_background.clientWidth, 1);