import { Application, Texture } from "pixi.js";
import * as PIXI from "pixi.js";
import animations from "./run_animations";
import createSprites from "./create_sprites";

function buildPixiApplication(width, height, backgroundColor) {
	return new Application({
		width,
		height,
		backgroundColor,
		resolution: window.devicePixelRatio || 1,
	});
}

function onAssetsLoaded(app, fireworks) {
	let fwSprites = createSprites(fireworks);
	app.stage.addChild(...fwSprites);

	const explosionTextures = [...Array(25).keys()].map((v) => Texture.from(`Explosion_Sequence_A ${v + 1}.png`));
	const maxDuration = fwSprites.reduce((p, n) => (n.stop > p ? n.stop : p), fwSprites[0].stop);

	const { rocketAnimation, fountainAnimation } = animations();

	const executeAnimation = {
		Rocket: (elapsed, sprite) => rocketAnimation(elapsed, sprite, app, explosionTextures),
		Fountain: (elapsed, sprite) => fountainAnimation(elapsed, sprite, app, Date.now()),
	};

	let elapsed = 0;
	
	const tickerRunner = (dt) => {
		elapsed += parseInt((dt / 60.0) * 1000);
		fwSprites.forEach((sprite) => executeAnimation[sprite.spriteType](elapsed, sprite))
	};

	let ticker = app.ticker.add(tickerRunner);

	setInterval(() => {
		elapsed = 0;
		ticker.remove();
		app.stage.removeChild(...fwSprites);
		app.stage.addChild(...createSprites(fireworks));
		ticker = app.ticker.add(tickerRunner);
	}, maxDuration);
}

function createPixiApplication(fireworks, width, height, backgroundColor) {
	const app = buildPixiApplication(width, height, backgroundColor);
	document.body.appendChild(app.view);
	app.loader
		.add("spritesheet", "assets/mc.json")
		.add("fountain2", "assets/fountain_2.png")
		.add("rocket", "assets/rocket.png")
		.load(() => onAssetsLoaded(app, fireworks));
}

window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
	window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI });
export default createPixiApplication;
