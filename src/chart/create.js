import * as PIXI from "pixi.js";
import preBuildEmitter from '../utils/build_emitter';
import { Emitter } from "@pixi/particle-emitter";
import buildEmitter from "../utils/build_emitter";

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
		if (fw.type === 'Fountain') {

		}
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

}

function onAssetsLoaded(app, fireworks) {
	const fwSprites = createSprites(fireworks);
	app.stage.addChild(...fwSprites);
	const explosionTextures = [...Array(25).keys()].map((v) => PIXI.Texture.from(`Explosion_Sequence_A ${v + 1}.png`))
	const maxDuration = fireworks.reduce((p, n) => (n.stop > p ? n.stop : p), fireworks[0].stop);
	const emitterContainer = new PIXI.ParticleContainer();

	app.stage.addChild(emitterContainer);
	const emitter = buildEmitter(emitterContainer)
	emitter.emit = true;

	const nowDate = Date.now();
	const executeAnimation = {
		Rocket: (elapsed, sprite) => rocketAnimation(elapsed, sprite, app, explosionTextures),
		Fountain: (elapsed, sprite) => fountainAnimation(emitter, elapsed, sprite, app)
	}

	let elapsed = 0;
	const startDate = Date.now()

	app.ticker.add((dt) => {
		elapsed += parseInt((dt / 60.0) * 1000);
		for (const sprite of fwSprites) {
			executeAnimation[sprite.spriteType](elapsed, sprite);
			if (sprite.spriteType == 'Fountain') {
				if (sprite.begin < elapsed && !sprite.isDone) {
					const nowDate = Date.now()
					const { x, y, tint } = sprite;
					const emitterContainer = new PIXI.ParticleContainer();
					app.stage.addChild(emitterContainer);
					console.log(tint.replace('0x', ''))
					const emitter = buildEmitter(emitterContainer, tint.replace('0x', '').toLowerCase())
					emitter.updateOwnerPos(x, y);
					emitter.update((nowDate - startDate) * 0.001)
					emitter.playOnceAndDestroy(() => {
						app.stage.removeChild(emitterContainer)
					})
					sprite.isDone = true;
				}
			}
		}
	});
}



function createPixiApplication(fireworks, width, height, backgroundColor) {
	const app = buildPixiApplication(width, height, backgroundColor);
	document.body.appendChild(app.view);
	app.loader
		.add('spritesheet', 'assets/mc.json')
		.add("fountain", "assets/fountain.png")
		.add("fountain2", "assets/fountain_2.png")
		.add("particle", "assets/particle.png")
		.add("rocket", "assets/rocket.png")
		.load(() => onAssetsLoaded(app, fireworks))
}



window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
	window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
export default createPixiApplication;
