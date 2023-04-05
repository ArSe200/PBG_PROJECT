const tree_box = document.querySelector("#tree_box");
let tree_r_n;


function resize_handler() {
    let box_raw_height = parseFloat($("#main_field").css("margin-top"));
    let new_r_n = Math.ceil(10 * box_raw_height / window.innerWidth);
    tree_box.style.bottom = (window.innerHeight - box_raw_height)+"px";
    if (new_r_n != tree_r_n) {
        tree_r_n = new_r_n;
        tree_box.innerHTML = "";
        tree_box.style.gridTemplateRows = `repeat(${tree_r_n}, 1fr)`;
        tree_box.style.aspectRatio = `10/${tree_r_n}`;
        tree_generator(tree_r_n, 10);
    }
}

function tree_generator(r, c) {
    let big_tee_arr = [];
    let tree_number;
    for (let r_n = 0; r_n < r; r_n+=1) {
        let small_tree_arr = [];
        for (let c_n = 0; c_n < c; c_n++) {
            tree_number = Math.floor(Math.random() * 8);
            if (tree_number == small_tree_arr[c_n-1]) tree_number += 1;
            if (tree_number > 8) tree_number = 0;
            if (r_n>0) if (tree_number == big_tee_arr[r_n-1][c_n]) tree_number += 1;
            if (tree_number > 8) tree_number = 0;
            if (tree_number == small_tree_arr[c_n-1]) tree_number += 1;
            if (tree_number > 8) tree_number = 0;

            small_tree_arr.push(tree_number);

            let new_tree = document.createElement("img");
            new_tree.src = `images/trees/tree_${tree_number+1}.png`
            new_tree.style.zIndex = 3+Math.floor(Math.random() * 4);
            let size = 30+Math.floor(Math.random() * 41)
            new_tree.style.width = 100+size+"%";
            new_tree.classList.add("tree");
            tree_box.appendChild(new_tree);
        }
        big_tee_arr.push(small_tree_arr);
    }
}

addEventListener('resize', resize_handler);

resize_handler();