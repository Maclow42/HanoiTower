//constantes
const PILLAR_MAX_WIDTH = 200;
const PILLAR_MIN_WIDTH = 50;
const COLOR_LIST = ["red", "blue", "green", "orange",
                    "purple", "pink",
                    "magenta", "lime", "olive",
                    "aqua", "gold", "indigo", "violet", "tan", "turquoise"];

//variables
var used_colors = [];

//get pillars from page
var pillars = document.querySelectorAll(".pillar");
var pillar_stack = [[], [], []];

//at start
let i = 1;
while(i <= 5){
    //get a random color
    var random_color = COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)];
    if(add_disk(0, random_color, PILLAR_MAX_WIDTH - 30*i))
        i++;
}

//functions
function getLast(list){
    if(list.length == 0)
        return null;
    return list[list.length - 1];
}

function add_disk(pillar_id, color, size){
    if(!(pillar_id in [0, 1, 2]))
        return false;
    
    else if(size >= pillar_stack[pillar_id].size)
        return false;

    for(let i = 0; i < used_colors.length; i++){
        if(used_colors[i] == color)
            return false;
    }
    
    used_colors.unshift(color);
    
    const disk = document.createElement("div");
    disk.classList.add("disk");
    disk.style.position = "relative";
    disk.style.backgroundColor = color;
    disk.style.width = size + "px";
    disk.style.left = "50%";
    disk.style.transform = "translateX(-50%)";
    disk.style.bottom = 45 * (pillar_stack[pillar_id].length) + 25 + "px";

    pillar_stack[pillar_id].unshift({size:size, color:color, div:disk});
    pillars[pillar_id].appendChild(disk);

    return true;
}

function move_disk(from_pillar_id, to_pillar_id){
    const pillar_stack_from = pillars[from_pillar_id].children;
    const pillar_stack_to = pillars[to_pillar_id].children;

    if(from_pillar_id === to_pillar_id){
        console.log("same pillar");
        return false;
    }
    
    if(!(from_pillar_id in [0, 1, 2] || to_pillar_id in [0, 1, 2])){
        console.log("invalid pillar id");
        return false;
    }

    if(pillar_stack_from.length == 0){
        console.log("no disk to move");
        return false;
    }

    if(pillar_stack_to.length > 0 && getLast(pillar_stack_from).offsetWidth >= getLast(pillar_stack_to).offsetWidth){
        console.log("disk too big");
        return false;
    }

    const to_move = getLast(pillars[from_pillar_id].children);
    pillars[from_pillar_id].removeChild(to_move);
    to_move.style.bottom = 45 * (pillars[to_pillar_id].children.length) + 25 + "px";
    pillars[to_pillar_id].appendChild(to_move);
    return true;
}

//hanoi tower solver
function hanoi_tower_solver(n, from_pillar_id, to_pillar_id, aux_pillar_id){
    if(n == 1){
        move_disk(from_pillar_id, to_pillar_id);
        return;
    }

    hanoi_tower_solver(n - 1, from_pillar_id, aux_pillar_id, to_pillar_id);
    move_disk(from_pillar_id, to_pillar_id);
    hanoi_tower_solver(n - 1, aux_pillar_id, to_pillar_id, from_pillar_id);
}

// Fonction pour déplacer le disque avec une animation
function moveDiskWithAnimation(fromPillarId, toPillarId) {
    return new Promise(resolve => {
        const disk = getLast(pillars[fromPillarId].children);
        const fromPillar = pillars[fromPillarId];
        const toPillar = pillars[toPillarId];

        const initialBottom = parseFloat(disk.style.bottom);
        const targetBottom = 45 * toPillar.children.length + 25;

        const animationDuration = 1000; // Durée de l'animation en millisecondes

        let startTime;
        function animate(time) {
            if (!startTime) startTime = time;
            const progress = (time - startTime) / animationDuration;
            const newPosition = initialBottom - (targetBottom - initialBottom) * progress;
            disk.style.bottom = newPosition + "px";

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation terminée
                fromPillar.removeChild(disk);
                toPillar.appendChild(disk);
                disk.style.bottom = targetBottom + "px";
                resolve();
            }
        }

        requestAnimationFrame(animate);
    });
}

// Fonction pour déplacer les disques avec animation
async function moveDiskAsync(fromPillarId, toPillarId) {
    await moveDiskWithAnimation(fromPillarId, toPillarId);
}

// Fonction récursive pour résoudre la tour de Hanoï avec animations
async function hanoi_tower_solver_with_animation(n, fromPillarId, toPillarId, auxPillarId) {
    if (n === 1) {
        await moveDiskAsync(fromPillarId, toPillarId);
        return;
    }

    await hanoi_tower_solver_with_animation(n - 1, fromPillarId, auxPillarId, toPillarId);
    await moveDiskAsync(fromPillarId, toPillarId);
    await hanoi_tower_solver_with_animation(n - 1, auxPillarId, toPillarId, fromPillarId);
}

// Appelle la fonction résolvant la tour de Hanoï avec animations
hanoi_tower_solver_with_animation(5, 0, 2, 1);
