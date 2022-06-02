const { Engine, Render, World, Runner, Bodies, Body } = Matter;

const canvasWidth = window.innerWidth - 20;
const canvasHeight = window.innerHeight - 20;
const borderWidth = 5;
const columns = 10;
const rows = Math.floor(columns * canvasHeight / canvasWidth);
const unitColumn = canvasWidth / columns;
const unitRow = canvasHeight / rows;
const container = document.querySelector(".container");


const engine = Engine.create()
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
    element: container,
    engine,
    options: {
        wireframes: false,
        width: canvasWidth,
        height: canvasHeight
    }
})
Render.run(render);
Runner.run(Runner.create(), engine);

//walls
const walls = [
    Bodies.rectangle( 1/2*canvasWidth, 0, canvasWidth, borderWidth + 4, {
        isStatic: true,
        render: {
            fillStyle: "white"
        }
    }),
    Bodies.rectangle( 0, 1/2*canvasHeight, borderWidth + 4, canvasHeight, {
        isStatic: true,
        render: {
            fillStyle: "white"
        }
    }),
    Bodies.rectangle( 1/2*canvasWidth, canvasHeight, canvasWidth, borderWidth + 4, {
        isStatic: true,
        render: {
            fillStyle: "white"
        }
    }),
    Bodies.rectangle( canvasWidth, 1/2*canvasHeight, borderWidth + 4, canvasHeight, {
        isStatic: true,
        render: {
            fillStyle: "white"
        }
    })
]

World.add(world, walls)


const goal = Bodies.rectangle(canvasWidth - unitColumn/2, canvasHeight - unitRow/2, unitColumn - borderWidth, unitRow - borderWidth, {
    render:{
        isStatic: true,
        fillStyle: "green"
    }
})

World.add(world, goal)

const shuffle = arr =>{
    let counter = arr.length;
    while(counter > 0){
        const index = Math.floor(Math.random()*counter) //to get an index smaller than counter
        counter--;
        //swap
        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }

    return arr;
}

const grid = Array(rows)
    .fill(null)
    .map(()=>Array(columns).fill(false));

//walls
const verticals = Array(rows)
    .fill(null)
    .map(()=>Array(columns - 1).fill(false))

const horizontals = Array(rows - 1)
    .fill(null)
    .map(()=>Array(columns).fill(false))

const startRow = Math.floor(Math.random()*rows);
const startColumn = Math.floor(Math.random()*columns);

//maze generation
const stepThroughCell = (row, column)=>{
    grid[row][column] = true;

    const neighbors = shuffle([
        [row - 1, column, 'vertical'], //up
        [row, column + 1, 'horizontal'], //left
        [row + 1, column, 'vertical'], //bottom
        [row, column - 1, 'horizontal'] //right
    ]);
    
    for(let neighbor of neighbors){
        const [nextRow, nextColumn, direction] = neighbor;
        //check if cell is out of bounds
        if ( nextRow < 0 || nextRow >= rows || nextColumn < 0 || nextColumn >= columns){
            continue;
        }        
        //check if cell has been visited
        if(grid[nextRow][nextColumn]){
            continue;
        }
        //remove walls between current cell and next cell
        switch(direction){
            case 'horizontal':
                verticals[row][Math.min(column, nextColumn)] = true;
                break;
            case 'vertical':
                horizontals[Math.min(row, nextRow)][column] = true;
                break;
        }
        stepThroughCell(nextRow, nextColumn)
    }
}


stepThroughCell(startRow, startColumn)


verticals.forEach((row, idxRow)=>{
    let y = unitRow/2 + idxRow*unitRow;
    row.forEach((vertical, idx)=>{
        if(!vertical){
            let x = unitColumn * (idx + 1);
            const verticalWall = Bodies.rectangle(x, y, borderWidth, unitRow, {
                isStatic: true,
                render: {
                    fillStyle: "white"
                }
            })
            World.add(world, verticalWall);
        }
        return vertical;
    })
    return row;
})

horizontals.forEach((row, idxRow)=>{
    let y = unitRow * (idxRow + 1);
    row.forEach((horizontal, idx)=>{
        if(!horizontal){
            let x = unitColumn/2 + unitColumn*(idx);
            const horizontalWall = Bodies.rectangle(x, y, unitColumn, borderWidth, {
                isStatic: true,
                render: {
                    fillStyle: "white"
                }
            })
            World.add(world, horizontalWall);
        }
        return horizontal;
    })
    return row;
})

container.querySelector('canvas').style.background = "black"


const ball = Bodies.circle( unitRow/2, unitColumn/2, 0.25 * Math.min(unitRow, unitColumn), {
    isStatic: false,
    render: {
        fillStyle: "blue"
    }
})

World.add(world, ball)

const stop = (body, delay = 100) =>{
    setTimeout(()=>{
        Body.setVelocity(body, {x: 0, y: 0})
    }, delay)
}

document.addEventListener('keydown', event =>{
    const {x, y} = ball.velocity;
    const velocity = 5;
    console.log(x, y)
    const {keyCode} = event;
    if (keyCode === 87){
        Body.setVelocity(ball, {x, y: -velocity});
    } else if (keyCode === 65){
        Body.setVelocity(ball, {x: -velocity, y});
    } else if (keyCode === 83){
        Body.setVelocity(ball, {x, y: velocity});
    } else if (keyCode === 68) {
        Body.setVelocity(ball, {x: velocity, y});
    }
    stop(ball);
})