import * as PIXI from "pixi.js";

function buildPixiApplication(width, height, backgroundColor) {
	return new PIXI.Application({
		width,
		height,
		backgroundColor,
		resolution: window.devicePixelRatio || 1,
	});
}

function createSprites(app, fireworks) {
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
		spriteFw.y = app.screen.width / 2;
		spriteFw.velocity = fw.velocity;
		spriteFw.tint = fw.colour;
		spriteFw.duration = fw.duration;
		spriteFw.begin = fw.begin;
		spriteFw.stop = fw.begin + fw.duration;
		return spriteFw;
	});
}
function createPixiApplication(fireworks, width, height, backgroundColor) {
	const app = buildPixiApplication(width, height, backgroundColor);
	document.body.appendChild(app.view);
	const fwSprites = createSprites(app, fireworks);
	app.stage.addChild(...fwSprites);
	// let counter = 0;
	let elapsed = 0.0;
	// const maxDuration = fireworks.reduce(
	// 	(p, n) => (n.duration > p ? n.duration : p),
	// 	fireworks[0].duration
	// );
	// número de frames da aplicação, 60FPS
	app.ticker.add((dt) => {
		elapsed += parseInt((dt / 60.0) * 1000);
		for (const sprite of fwSprites) {
			if (
				sprite.spriteType === "Rocket" &&
				sprite.begin < elapsed &&
				elapsed < sprite.stop
			) {
				sprite.x += sprite.velocity.x / 60;
				sprite.y += sprite.velocity.y / 60;
			}
		}
	});
	// app.loader
	// 	.add("fountain", "assets/fountain.png")
	// 	.add("particle", "assets/particle.png")
	// 	.add("rocket", "assets/rocket.png")
	// 	.load(() => onAssetsLoaded(app, fireworks))
}

window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
	window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
export default createPixiApplication;
