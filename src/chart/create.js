import { Application, Sprite, AnimatedSprite, Texture, Container } from "pixi.js";
import * as PIXI from 'pixi.js'
import buildEmitter from "../utils/build_emitter";

function buildPixiApplication(width, height, backgroundColor) {
	return new Application({
		width,
		height,
		backgroundColor,
		resolution: window.devicePixelRatio || 1,
	});
}

function createSprites(fireworks) {
	const sprites = {
		Fountain: () => Sprite.from("assets/fountain.png"),
		Particle: () => Sprite.from("assets/particle.png"),
		Rocket: () => Sprite.from("assets/rocket.png"),
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
	const explosion = new AnimatedSprite(textures);
	const nArray = [...Array(25).keys()]
	nArray.forEach(() => {
		explosion.x = x;
		explosion.y = y;
		explosion.tint = tint;
		explosion.anchor.set(0.5);
		explosion.rotation = Math.random() * Math.PI;
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

function fountainAnimation(elapsed, sprite, app, startDate) {
	const { x, y, tint, begin, duration } = sprite;
	if (begin < elapsed && !sprite.isDone) {
		sprite.isDone = true;
		const nowDate = Date.now()
		const emitterContainer = new Container();
		const emitter = buildEmitter(emitterContainer, tint.replace('0x', '').toLowerCase())
		app.stage.addChild(emitterContainer);
		emitter.updateOwnerPos(x, y);
		emitter.update((nowDate - startDate) * 0.001)
		emitter.playOnceAndDestroy()
		setTimeout(() => {
			app.stage.removeChild(emitterContainer)
		}, duration)
	}

}



function onAssetsLoaded(app, fireworks) {
	let fwSprites = createSprites(fireworks);
	app.stage.addChild(...fwSprites);

	const explosionTextures = [...Array(25).keys()].map((v) => Texture.from(`Explosion_Sequence_A ${v + 1}.png`))
	const maxDuration = fwSprites.reduce((p, n) => (n.stop > p ? n.stop : p), fwSprites[0].stop);
	let startDate = Date.now()
	const executeAnimation = {
		Rocket: (elapsed, sprite) => rocketAnimation(elapsed, sprite, app, explosionTextures),
		Fountain: (elapsed, sprite) => fountainAnimation(elapsed, sprite, app, startDate)
	}

	let elapsed = 0;
	const tickerRunner = (dt) => {
		elapsed += parseInt((dt / 60.0) * 1000);
		for (const sprite of fwSprites) {
			executeAnimation[sprite.spriteType](elapsed, sprite);
		}
	}

	let ticker = app.ticker.add(tickerRunner);
	
	setInterval(() => {
		ticker.remove();
		app.stage.removeChild(...fwSprites)
		fwSprites = createSprites(fireworks);
		app.stage.addChild(...fwSprites);
		elapsed = 0;
		startDate = Date.now();
		ticker = app.ticker.add(tickerRunner);
		console.log('reinicia')
	}, maxDuration)

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
	window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI });
export default createPixiApplication;
