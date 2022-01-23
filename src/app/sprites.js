import { Sprite } from "pixi.js";

function createSprites(fireworks) {
	const sprites = {
		Fountain: () => Sprite.from("assets/fountain_2.png"),
		Rocket: () => Sprite.from("assets/rocket_2.png"),
	};

	const xCenter = 512;
	const yCenter = 384;

	return fireworks.map((firework) => {
		const spriteFirework = sprites[firework.type]();
		spriteFirework.cacheasBitmap = true;
		const { position, velocity, colour, duration, begin } = firework;
		const { x, y } = position;
		spriteFirework.anchor.set(0.5);
		spriteFirework.spriteType = firework.type;
		spriteFirework.x = xCenter + -x;
		spriteFirework.y = yCenter + -y;
		spriteFirework.velocity = velocity;
		spriteFirework.tint = colour;
		spriteFirework.duration = duration;
		spriteFirework.begin = begin;
		spriteFirework.stop = begin + duration;
		spriteFirework.isAdded = false;
		spriteFirework.isAnimationDone = false;
		return spriteFirework;
	});
}

export default createSprites;
