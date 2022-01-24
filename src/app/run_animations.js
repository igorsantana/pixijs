import { AnimatedSprite, Container } from "pixi.js";
import buildEmitter from "./utils/build_emitter";

function runRocketExplosion(app, x, y, tint, textures) {
	const explosion = new AnimatedSprite(textures);
	explosion.x = x;
	explosion.y = y;
	explosion.tint = tint;
	explosion.anchor.set(0.5);
	explosion.rotation = Math.random() * Math.PI;
	explosion.gotoAndPlay(Math.random() * 27);
	return explosion;
}

function rocketAnimation(elapsed, sprite, dt, app, explosionTextures) {
	const { x, y, tint, begin, stop } = sprite;
	if (!sprite.isAdded && begin < elapsed) {
		app.stage.addChild(sprite);
		sprite.isAdded = true;
	}
	if (begin < elapsed && elapsed < stop) {
		sprite.x += Math.round((-sprite.velocity.x / 60) * dt);
		sprite.y += Math.round((-sprite.velocity.y / 60) * dt);
	}
	if (!sprite.isDone && elapsed >= stop) {
		sprite.isDone = true;
		const explosion = runRocketExplosion(app, x, y, tint, explosionTextures);
		app.stage.removeChild(sprite);
		app.stage.addChild(explosion);
		setTimeout(() => {
			app.stage.removeChild(explosion);
		}, 400);
	}
}

function fountainAnimation(elapsed, sprite, dt, app, startDate) {
	const { x, y, tint, begin, duration } = sprite;
	if (!sprite.isAdded && begin < elapsed) {
		app.stage.addChild(sprite);
		sprite.isAdded = true;
	}
	if (begin < elapsed && !sprite.isDone) {
		const nowDate = Date.now();
		const emitterContainer = new Container();
		const color = tint.replace("0x", "").toLowerCase();
		app.stage.addChild(emitterContainer);
		const emitter = buildEmitter(emitterContainer, color);
		emitter.updateOwnerPos(x, y);
		emitter.update((nowDate - startDate) * 0.001);
		emitter.playOnceAndDestroy();
		setTimeout(() => {
			app.stage.removeChild(emitterContainer);
			app.stage.removeChild(sprite);
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
