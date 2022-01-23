import { AnimatedSprite, Container } from "pixi.js";
import buildEmitter from "../utils/build_emitter";

function runRocketExplosion(app, x, y, tint, textures) {
	const explosion = new AnimatedSprite(textures);
	for (let i = 0; i < 25; i++) {
		explosion.x = x;
		explosion.y = y;
		explosion.tint = tint;
		explosion.anchor.set(0.5);
		explosion.rotation = Math.random() * Math.PI;
		explosion.gotoAndPlay(Math.random() * 27);
		app.stage.addChild(explosion);
	}
	return explosion;
}

function rocketAnimation(elapsed, sprite, app, explosionTextures) {
	const { x, y, tint, begin, stop } = sprite;
	if (begin < elapsed && elapsed < stop) {
		sprite.x += sprite.velocity.x / 60;
		sprite.y += sprite.velocity.y / 60;
	}
	if (!sprite.isDone && elapsed >= stop) {
		sprite.isDone = true;
		const explosion = runRocketExplosion(app, x, y, tint, explosionTextures);
		app.stage.removeChild(sprite);
		setTimeout(() => app.stage.removeChild(explosion), 400);
	}
}

function fountainAnimation(elapsed, sprite, app, startDate) {
	const { x, y, tint, begin, duration } = sprite;
	if (begin < elapsed && !sprite.isDone) {
		const nowDate = Date.now();
		const emitterContainer = new Container();
    const color = tint.replace("0x", "").toLowerCase()
		const emitter = buildEmitter( emitterContainer, color);
		app.stage.addChild(emitterContainer);
		emitter.updateOwnerPos(x, y);
		emitter.update((nowDate - startDate) * 0.001);
		emitter.playOnceAndDestroy();
		setTimeout(() => {
			app.stage.removeChild(emitterContainer);
		}, duration);
		sprite.isDone = true;
	}
}

function animations() {
	return {
		fountainAnimation,
		rocketAnimation,
	};
}

export default animations;
