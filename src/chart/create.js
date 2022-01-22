import * as PIXI from "pixi.js";
import preBuildEmitter from '../utils/build_emitter';

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
	let i;
	for (i = 0; i < 26; i++) {
		explosion.x = x;
		explosion.y = y;
		explosion.tint = tint;
		explosion.anchor.set(0.5);
		explosion.rotation = Math.random() * Math.PI;
		explosion.scale.set(0.75 + Math.random() * 0.5);
		explosion.gotoAndPlay(Math.random() * 27);
		app.stage.addChild(explosion);
	}
	return explosion
}

function onAssetsLoaded(app, fireworks) {
	const fwSprites = createSprites(fireworks);
	app.stage.addChild(...fwSprites);

	const explosionTextures = [];
	let i;
	for (i = 0; i < 26; i++) {
		const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
		explosionTextures.push(texture);
	}

	const maxDuration = fireworks.reduce(
		(p, n) => (n.stop > p ? n.stop : p),
		fireworks[0].stop
	);
	let elapsed = 0;
	app.ticker.add((dt) => {
		elapsed += parseInt((dt / 60.0) * 1000);

		for (const sprite of fwSprites) {
			if (sprite.spriteType === "Rocket") {
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
