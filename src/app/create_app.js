import { Application, Texture } from "pixi.js";
import animations from "./run_animations";
import createSprites from "./sprites";

function buildPixiApplication(width, height, backgroundColor) {
	return new Application({
		width,
		height,
		backgroundColor,
		sharedTicker: true,
		resolution: window.devicePixelRatio || 1,
	});
}

function onAssetsLoaded(app, fireworks) {
	let fwSprites = createSprites(fireworks);
	const explosionTextures =[...Array(26).keys()].map((_, i) =>Texture.from(`Explosion_Sequence_A ${i + 1}.png`));
	// Added 1s to the duration in case a rocket is the last firework, because the explosion takes time.
	const fireworksDuration =
		fwSprites.reduce((p, n) => (n.stop > p ? n.stop : p), fwSprites[0].stop) +
		1000;

	const { rocketAnimation, fountainAnimation } = animations();
	const startDate = Date.now();
	const executeAnimation = {
		Rocket: (elapsed, sprite, dt) =>
			rocketAnimation(elapsed, sprite, dt, app, explosionTextures),
		Fountain: (elapsed, sprite, dt) =>
			fountainAnimation(elapsed, sprite, dt, app, startDate),
	};

	let elapsed = 0;
	const tickerRunner = (dt) => {
		elapsed += (1 / 60) * dt * 1000;
		fwSprites.forEach((sprite) =>
			executeAnimation[sprite.spriteType](elapsed, sprite, dt)
		);
	};

	let ticker = app.ticker.add(tickerRunner);

	setInterval(() => {
		ticker.stop();
		elapsed = 0;
		fwSprites = createSprites(fireworks);
		console.log("--------");
		ticker.start();
	}, fireworksDuration);
}

function createPixiApplication(fireworks, width, height, backgroundColor) {
	const app = buildPixiApplication(width, height, backgroundColor);
	document.body.appendChild(app.view);
	app.loader
		.add("spritesheet", "assets/mc.json")
		.add("explosion", "assets/mc.png")
		.add("fountain2", "assets/fountain_2.png")
		.add("rocket", "assets/rocket_2.png")
		.load(() => onAssetsLoaded(app, fireworks));
	return app;
}

export default createPixiApplication;
