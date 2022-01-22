import * as PIXI from "pixi.js";
import preBuildEmitter from '../utils/build_emitter';
import { Emitter } from "@pixi/particle-emitter";

function buildPixiApplication(width, height, backgroundColor) {
	return new PIXI.Application({
		width,
		height,
		backgroundColor,
		resolution: window.devicePixelRatio || 1,
	});
}

function createSprites(fireworks) {
	const sprites = {
		Fountain: () => PIXI.Sprite.from("assets/fountain.png"),
		Particle: () => PIXI.Sprite.from("assets/particle.png"),
		Rocket: () => PIXI.Sprite.from("assets/rocket.png"),
	};

	return fireworks.map((fw) => {
		const spriteFw = sprites[fw.type]();
		spriteFw.anchor.set(0.5);
		spriteFw.spriteType = fw.type;
		spriteFw.x = fw.position.x;
		spriteFw.y = fw.position.y;
		spriteFw.velocity = fw.velocity;
		spriteFw.tint = fw.colour;
		spriteFw.duration = fw.duration;
		spriteFw.begin = fw.begin;
		spriteFw.stop = fw.begin + fw.duration;
		spriteFw.isDone = false;
		return spriteFw;
	});
}

const runRocketExplosion = (app, x, y, tint, textures) => {
	const explosion = new PIXI.AnimatedSprite(textures);
	const nArray = [...Array(25).keys()]
	nArray.forEach(() => {
		explosion.x = x;
		explosion.y = y;
		explosion.tint = tint;
		explosion.anchor.set(0.5);
		explosion.rotation = Math.random() * Math.PI;
		explosion.scale.set(0.75 + Math.random() * 0.5);
		explosion.gotoAndPlay(Math.random() * 27);
		app.stage.addChild(explosion);
	})
	return explosion
}

function rocketAnimation(elapsed, sprite, app, explosionTextures) {
	if (
		sprite.begin < elapsed &&
		elapsed < sprite.stop
	) {
		sprite.x += sprite.velocity.x / 60;
		sprite.y += sprite.velocity.y / 60;
	}
	if (!sprite.isDone && elapsed >= sprite.stop) {
		sprite.isDone = true;
		const { x, y, tint } = sprite;
		const explosion = runRocketExplosion(app, x, y, tint, explosionTextures)
		app.stage.removeChild(sprite)
		setTimeout(() => app.stage.removeChild(explosion), 400)
	}
}

function fountainAnimation(emitter, elapsed, sprite, app) {
	emitter.update(elapsed * 0.001)
	emitter.emit = true;
	emitter.resetPositionTracking()

	// Center on the stage
}

function onAssetsLoaded(app, fireworks) {
	const fwSprites = createSprites(fireworks);
	app.stage.addChild(...fwSprites);
	const explosionTextures = [...Array(25).keys()].map((v) => PIXI.Texture.from(`Explosion_Sequence_A ${v + 1}.png`))
	const maxDuration = fireworks.reduce((p, n) => (n.stop > p ? n.stop : p), fireworks[0].stop);

	const emitterContainer = new PIXI.Container();

	app.stage.addChild(emitterContainer);

	const emitter = new Emitter(
		emitterContainer,
		{
			"lifetime": {
				"min": 0.25,
				"max": 0.5
			},
			"frequency": 0.1,
			"emitterLifetime": 0,
			"maxParticles": 1000,
			"addAtBack": false,

			"behaviors": [
				{
					"type": "alpha",
					"config": {
						"alpha": {
							"list": [
								{
									"time": 0,
									"value": 1
								},
								{
									"time": 1,
									"value": 0.31
								}
							]
						}
					}
				},
				{
					"type": "moveAcceleration",
					"config": {
						"accel": {
							"x": 0,
							"y": 2000
						},
						"minStart": 600,
						"maxStart": 600,
						"rotate": true
					}
				},
				{
					"type": "scale",
					"config": {
						"scale": {
							"list": [
								{
									"time": 0,
									"value": 0.5
								},
								{
									"time": 1,
									"value": 1
								}
							]
						},
						"minMult": 1
					}
				},
				{
					"type": "color",
					"config": {
						"color": {
							"list": [
								{
									"time": 0,
									"value": "ffffff"
								},
								{
									"time": 1,
									"value": "9ff3ff"
								}
							]
						}
					}
				},
				{
					"type": "rotationStatic",
					"config": {
						"min": 260,
						"max": 280
					}
				},
				{
					"type": "textureRandom",
					"config": {
						"textures": [
							"assets/particle.png"
						]
					}
				},
				{
					"type": "spawnShape",
					"config": {
						"type": "torus",
						"data": {
							"x": 0,
							"y": 0,
							"radius": 0,
							"innerRadius": 0,
							"affectRotation": false
						}
					}
				}
			]
		}
	);
	emitter.updateOwnerPos(1024 / 2, 768 / 2);

	const executeAnimation = {
		Rocket: (elapsed, sprite) => rocketAnimation(elapsed, sprite, app, explosionTextures),
		Fountain: (elapsed, sprite) => fountainAnimation(emitter, elapsed, sprite, app)
	}

	let elapsed = 0;

	app.ticker.add((dt) => {
		elapsed += parseInt((dt / 60.0) * 1000);
		for (const sprite of fwSprites) {
			executeAnimation[sprite.spriteType](elapsed, sprite);
		}
	});
}


function createPixiApplication(fireworks, width, height, backgroundColor) {
	const app = buildPixiApplication(width, height, backgroundColor);
	document.body.appendChild(app.view);
	app.loader
		.add('spritesheet', 'assets/mc.json')
		.add("fountain", "assets/fountain.png")
		.add("particle", "assets/particle.png")
		.add("rocket", "assets/rocket.png")
		.load(() => onAssetsLoaded(app, fireworks))
}



window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
	window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
export default createPixiApplication;
