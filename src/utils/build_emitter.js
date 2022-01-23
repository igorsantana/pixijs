import { Emitter } from "@pixi/particle-emitter";

function buildEmitter(emitterContainer, color) {
	return new Emitter(emitterContainer, {
		lifetime: { min: 0.5, max: 0.5 },
		frequency: 0.005,
		emitterLifetime: 2500,
		maxParticles: 10000,
		addAtBack: false,
		behaviors: [
			{
				type: "alpha",
				config: {
					alpha: {
						list: [
							{ time: 0, value: 1 },
							{ time: 1, value: 0.2 },
						],
					},
				},
			},
			{
				type: "moveAcceleration",
				config: {
					accel: { x: 0, y: 750 },
					minStart: 600,
					maxStart: 600,
					rotate: true,
				},
			},
			{
				type: "scale",
				config: {
					scale: {
						list: [
							{ time: 0, value: 1 },
							{ time: 1, value: 0.5 },
						],
					},
					minMult: 1,
				},
			},
			{
				type: "color",
				config: {
					color: {
						list: [
							{ time: 0, value: "000000" },
							{ time: 1, value: color },
						],
					},
				},
			},
			{
				type: "rotationStatic",
				config: { min: 260, max: 280 },
			},
			{
				type: "textureRandom",
				config: {
					textures: ["assets/fountain.png"],
				},
			},
			{
				type: "spawnShape",
				config: {
					type: "torus",
					data: {
						x: 0,
						y: 0,
						radius: 0,
						innerRadius: 0,
						affectRotation: false,
					},
				},
			},
		],
	});
}

export default buildEmitter;
