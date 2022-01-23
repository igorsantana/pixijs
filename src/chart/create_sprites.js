import { Sprite } from "pixi.js";

function createSprites(fireworks) {
	const sprites = {
		Fountain: () => Sprite.from("assets/fountain.png"),
		Rocket: () => Sprite.from("assets/rocket.png"),
	};

	return fireworks.map((firework) => {
		const spriteFirework = sprites[firework.type]();
		const { position, type, velocity, colour, duration, begin } = firework;
		const { x, y } = position;
		spriteFirework.anchor.set(0.5);
		spriteFirework.spriteType = type;
		spriteFirework.x = x;
		spriteFirework.y = y;
		spriteFirework.velocity = velocity;
		spriteFirework.tint = colour;
		spriteFirework.duration = duration;
		spriteFirework.begin = begin;
		spriteFirework.stop = begin + duration;
		spriteFirework.isDone = false;
		return spriteFirework;
	});
}

export default createSprites;
