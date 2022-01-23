class Firework {
	constructor(begin, type, colour, duration, position, velocity = undefined) {
		this.begin = begin;
		this.type = type;
		this.colour = colour;
		this.duration = duration;
		this.position = position;
		this.velocity = velocity;
	}
}

export default Firework;
