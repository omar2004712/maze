const { Engine, Render, World, Runner, Bodies } = Matter;

const canvasWidth = 600;
const canvasHeight = 600;

const engine = Engine.create()
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine,
    options: {
        width: canvasWidth,
        height: canvasHeight
    }
})
Render.run(render);
Runner.run(Runner.create(), engine);

//walls
const walls = [
    Bodies.rectangle( 1/2*canvasWidth, 0, canvasWidth, 40, {
        isStatic: true
    }),
    Bodies.rectangle( 0, 1/2*canvasHeight, 40, canvasHeight, {
        isStatic: true
    }),
    Bodies.rectangle( 1/2*canvasWidth, canvasHeight, canvasWidth, 40, {
        isStatic: true
    }),
    Bodies.rectangle( canvasWidth, 1/2*canvasHeight, 40, canvasHeight, {
        isStatic: true
    })
]

World.add(world, walls)

const columns = 4;
const rows = 4;

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
        console.log(nextRow, nextColumn)
        stepThroughCell(nextRow, nextColumn)
    }
    console.log('none')
}


stepThroughCell(1, 1)