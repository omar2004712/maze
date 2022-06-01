const { Engine, Render, World, Runner, Bodies } = Matter;

const canvasWidth = window.innerWidth - 20;
const canvasHeight = window.innerHeight - 20;

const engine = Engine.create()
const { world } = engine;
const render = Render.create({
    element: document.body,
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
    Bodies.rectangle( 1/2*canvasWidth, 0, canvasWidth, 4, {
        isStatic: true,
        render: {
            fillStyle: "black"
        }
    }),
    Bodies.rectangle( 0, 1/2*canvasHeight, 4, canvasHeight, {
        isStatic: true,
        render: {
            fillStyle: "black"
        }
    }),
    Bodies.rectangle( 1/2*canvasWidth, canvasHeight, canvasWidth, 4, {
        isStatic: true,
        render: {
            fillStyle: "black"
        }
    }),
    Bodies.rectangle( canvasWidth, 1/2*canvasHeight, 4, canvasHeight, {
        isStatic: true,
        render: {
            fillStyle: "black"
        }
    })
]

World.add(world, walls)

const columns = 25;
const rows = Math.floor(columns * canvasHeight / canvasWidth);

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

const unitColumn = canvasWidth / columns;
const unitRow = canvasHeight / rows;

verticals.forEach((row, idxRow)=>{
    let y = unitRow/2 + idxRow*unitRow;
    row.forEach((vertical, idx)=>{
        if(!vertical){
            let x = unitColumn * (idx + 1);
            const verticalWall = Bodies.rectangle(x, y, 2, unitRow, {
                isStatic: true,
                render: {
                    fillStyle: "black"
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
            const horizontalWall = Bodies.rectangle(x, y, unitColumn, 2, {
                isStatic: true,
                render: {
                    fillStyle: "black"
                }
            })
            World.add(world, horizontalWall);
        }
        return horizontal;
    })
    return row;
})


document.querySelector('canvas').style.background = "white"
