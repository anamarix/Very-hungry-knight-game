import * as PIXI from 'pixi.js';
import { Hero } from './Hero'

const KNIGHTSIZE = 84;
const TILESIZE = 16;
const BACKGROUNDTILESIZE = 16;


let map = {
    width: 16,
    height: 12,
    tiles: [
        70, 71, 70, 71, 70, 71, 70, 71, 70, 71, 70, 71, 70, 71, 70, 71,
        122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122,
        122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122,
        122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122,
        122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122,
        122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122,
        122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122,
        122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122,
        122, 122, 122, 10, 122, 122, 122, 122, 122, 122, 122, 122, 122, 60, 122, 74,
        122, 69, 122, 10, 58, 122, 122, 122, 122, 122, 122, 30, 31, 32, 122, 82,
        25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
        25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
    ]
}

interface IsFoodItem {
    sprite:PIXI.Sprite,
    hit:Boolean,
    lost:Boolean
}

export class Game {
    app: PIXI.Application;
    hero!: Hero;
    message!: PIXI.Text;
    world!: PIXI.Container;
    healthBar!: PIXI.Container;
    outerBar!: PIXI.Graphics;

    constructor() {

        this.app = new PIXI.Application({ width: 800, height: 600 });
        document.body.appendChild(this.app.view);
        const loader:PIXI.Loader = new PIXI.Loader()


        loader.add('knights', 'knight iso char.png')
            .add('food', 'Food.png')
            .add('background', 'castle-tileset.png')

        loader.load((loader, resources) => this.doneLoading(loader, resources))
    }

    


    doneLoading(loader:PIXI.Loader, resources:PIXI.utils.Dict<PIXI.LoaderResource >
        ) {
        this.app.view.focus();
        let heroFrames:PIXI.Texture[] = [];
        for (let i = 0; i < 8 * 5; i++) {
            let x = i % 8;
            let y = Math.floor(i / 8);
            let knights = (resources.knights.texture as unknown) as PIXI.BaseTexture
            heroFrames[i] = new PIXI.Texture(
                knights,
                new PIXI.Rectangle(x * KNIGHTSIZE, y * KNIGHTSIZE, KNIGHTSIZE, KNIGHTSIZE)
            );
        }

        let foodFrames:PIXI.Texture[] = [];
        for (let i = 0; i < 8 * 8; i++) {
            let x = i % 8;
            let y = Math.floor(i / 8);
            let food = (resources.food.texture as unknown) as PIXI.BaseTexture
            foodFrames[i] = new PIXI.Texture(
                food,
                new PIXI.Rectangle(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE)
            );
        }
        let backgroundTexture:PIXI.Texture[]= [];
        for (let i = 0; i < 8 * 16; i++) {
            let x = i % 8;
            let y = Math.floor(i / 8);
            let background = (resources.background.texture as unknown) as PIXI.BaseTexture
            backgroundTexture[i] = new PIXI.Texture(
                background,
                new PIXI.Rectangle(x * BACKGROUNDTILESIZE, y * BACKGROUNDTILESIZE, BACKGROUNDTILESIZE, BACKGROUNDTILESIZE)
            );
        }

        //create player
        this.hero = new Hero([heroFrames[0], heroFrames[1], heroFrames[2]], heroFrames[15], heroFrames[21]);

        //create background
        this.world = new PIXI.Container();
        for (let y = 0; y < map.width; y++) {
            for (let x = 0; x < map.width; x++) {
                let tile = map.tiles[y * map.width + x];
                let sprite = new PIXI.Sprite(backgroundTexture[tile]);
                sprite.x = x * BACKGROUNDTILESIZE;
                sprite.y = y * BACKGROUNDTILESIZE;
                this.world.addChild(sprite)
            }
        }
        this.world.scale.x = 3.1;
        this.world.scale.y = 3.1;

        //Create health bar
        this.healthBar = new PIXI.Container();
        this.healthBar.position.set(this.app.view.width - 170, 30);
        this.outerBar = new PIXI.Graphics();
        this.outerBar.beginFill(0xff3300);
        this.outerBar.drawRect(0, 0, 130, 15);
        this.outerBar.endFill();
        const hpStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 10,
            fill: "white",
        });
        const hp = new PIXI.Text("H P", hpStyle);




        this.app.stage.addChild(this.world);
        this.app.stage.addChild(this.hero);
        this.app.stage.addChild(this.healthBar);
        this.healthBar.addChild(this.outerBar);
        this.healthBar.addChild(hp)
        hp.position.set(-20, 0);

        this.hero.scale.x = 1.7;
        this.hero.scale.y = 1.7;
        this.hero.play();
        this.hero.animationSpeed = 0.1;
        this.hero.x = this.app.view.width / 2
        this.hero.y = 0;


        const style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 36,
            fill: "white",
            stroke: "#ff3300",
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: "#000000",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        });
        this.message = new PIXI.Text("YOU LOST!", style);
        this.message.alpha = 0.0
        this.app.stage.addChild(this.message);


        this.app.ticker.add(() => {
            this.showPlayer();

        });

        this.pushFood(foodFrames, this.app)

        loader.onError.add((err:Error)=>console.log(err))
    }


    //introduce the player on the screen
    showPlayer():void {
        if (this.hero.y < 360) {
            this.hero.y += 8
        }
    }



    pushFood(frames:PIXI.Texture<PIXI.Resource>[], app:PIXI.Application):void {
        const foodArray: IsFoodItem[] = [];
        const setIntervalHandler:NodeJS.Timer = setInterval(() => {
            let foodItemSprite = new PIXI.Sprite(frames[Math.floor(Math.random() * 63)]);
            let foodItem :IsFoodItem = {
                sprite: foodItemSprite,
                hit: false,
                lost: false
            };
            foodItem.sprite.scale.x = 2;
            foodItem.sprite.scale.y = 2;
            foodItem.sprite.x = Math.floor(Math.random() * 740);
            foodArray.push(foodItem);
            app.stage.addChild(foodItem.sprite);
            app.ticker.add(() => {
                this.startGame(foodArray, setIntervalHandler)
            })
        }, 2000)

  
    }



    startGame(items: IsFoodItem[], handler:NodeJS.Timer): void {

        items.forEach((el) => {
          
            if (el.hit) {
                el.sprite.alpha = 0.0;
            }
            //if the player missed the food shorten the health bar and check if the game has finished 
            if (el.sprite.y > 500 && !el.hit) {
                if (!el.lost && this.healthBar.width > 0) {
                    this.outerBar.width -= 13;
                }
                el.sprite.alpha = 0.2;
                el.lost = true;
                this.checkIfLost(items, handler);
            }

            el.sprite.y += 0.1;
            if(this.hitTestRectangle(this.hero, el.sprite)) {
                el.hit = true;
            }
        });

    }


    checkIfLost(items:IsFoodItem[], handler:NodeJS.Timer):void {
        const numberOfLost = items.filter(el => el.lost === true);
        const numberOfHits = items.filter(el => el.hit===true)
        if (numberOfLost.length > 9) {
            clearInterval(handler);
            this.app.ticker.stop();
            this.message.alpha = 1.0;
            this.healthBar.visible = false;
            items.forEach(el=> el.sprite.visible=false)
            this.world.visible = false;
            this.message.text=  `YOU LOST!      YOUR SCORE: ${numberOfHits.length}`

        }
    }



    hitTestRectangle(r1:any, r2:any): boolean {

        //Define the variables we'll need to calculate
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        //hit will determine whether there's a collision
        hit = false;

        //Find the center points of each sprite
        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;

        //Find the half-widths and half-heights of each sprite
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;

        //Calculate the distance vector between the sprites
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;

        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;

        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {

            //A collision might be occurring. Check for a collision on the y axis
            if (Math.abs(vy) < combinedHalfHeights) {

                //There's definitely a collision happening
                hit = true;
            } else {

                //There's no collision on the y axis
                hit = false;
            }
        } else {

            //There's no collision on the x axis
            hit = false;
        }

        //`hit` will be either `true` or `false`
        return hit;
    };




}