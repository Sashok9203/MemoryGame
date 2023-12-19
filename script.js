class Tile
{
    twinId;
    #closed;
    #defaultImage = "image/brick.jpg";
    #imageSrc;
    constructor(image,id)
    {
        this.image = image;
        this.#closed = false;
        this.#imageSrc = this.image.src;
        this.id = id;
    }

    enableEvent(enable)
    {
        if(enable && this.#closed)
             this.image.onclick = userClick;
        else if(!enable && this.#closed)
              this.image.onclick = null;
    }

    set closed(value){
        if(value !== this.#closed)
        {
           this.#closed = value;
           if(this.#closed)
           {
              this.image.src = this.#defaultImage;
              this.image.onclick = userClick;
           }
        else{
              this.image.src =  this.#imageSrc;
              this.image.onclick = null;
           }
          
        }
    }
    get closed(){return this.#closed;}

}

const grid = document.getElementById(`grid`);
const time = document.getElementById(`time`);
const moves = document.getElementById(`moves`);
const misses = document.getElementById(`misses`);
const restart_button = document.getElementById(`rbutton`);
const images = ["image/bird.jpg","image/hippo.jpg","image/horse.jpg","image/lama.jpg","image/monky.jpg","image/mouse.jpg","image/qua.jpg","image/yak.jpg"];
let idCounter = 0;
let openCount = 0;
let movesCount = 0;
let missesCount = 0;
let timer = 0;
let tTime = null;
const tileList = [];
let first  = null;

function clearStat()
{
    missesSet(0);
    timer = 120;
    setTime(timer);
}

function missesSet(value)
{
    value!=null ? missesCount = value: missesCount++;
    misses.innerText = missesCount;
    movesSet(value);
}

function movesSet(value)
{
    value != null ?  movesCount = value:  movesCount++;
    moves.innerText = movesCount;
}

function userClick(event)
{
    event.preventDefault();
     let eventTile = tileList.find(n=>n.id === Number(event.currentTarget.id));
     eventTile.closed = false;
     if(first == null)
     {
        first = eventTile;
        return;
     }
     else 
     {
        if(first.twinId !== eventTile.id)
        {
            enableEvents(false);
            setTimeout(()=>{
                first.closed = true;
                eventTile.closed = true;
                enableEvents(true);
                first = null;
                missesSet();
            },1500);
        }
        else
        {
            first = null;
            openCount+=2;
            movesSet();
            if(openCount==images.length*2)
               gameStop();
        } 
    }
}

function gameStop()
{
    restart_button.innerHTML = ' <button onclick="gameStart();" class="center_position">Restart</button>';
    enableEvents(false);
    clearInterval(tTime);
}

function getTile(imageSrc)
{
    let image = document.createElement("img");
    image.setAttribute('id',idCounter);
    image.src = imageSrc;
    return  new Tile(image,idCounter++);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function hideAll(value)
{
    tileList.forEach((item)=>{
        item.closed = value;
    });
}

function enableEvents(value)
{
    tileList.forEach((item)=>{
        item.enableEvent(value);
    });
}

function  setTime(value)
{
    let sec = parseInt(value % 60);
    if(sec < 10) sec = `0${sec}`;
    time.innerText = `${parseInt(value/60)}:${sec}`;
}

function gameStart()
{
    restart_button.innerHTML = '';
    openCount = 0;
    clearStat();
    grid.innerHTML = '';
    shuffleArray(tileList);
    tileList.forEach((item)=>{grid.appendChild(item.image);});
    hideAll(false);
    setTimeout(()=>{ 
        hideAll(true);
        tTime = setInterval(()=>{
        timer--;
        setTime(timer);
        if(timer === 0)
              gameStop();
        },1000);
    },2000);
}

function gameInit()
{
    for (let index = 0; index < images.length; index++) {
        let tile = getTile(images[index]);
        let twinTile  = getTile(images[index]);
        tile.twinId =twinTile.id;
        twinTile.twinId = tile.id;
        tileList.push(tile);
        tileList.push(twinTile);
    }
}

gameInit();

gameStart();



