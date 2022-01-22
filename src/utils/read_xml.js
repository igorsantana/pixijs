import Firework from "../model/firework";

function convertTagToFirework(tag) {
	const begin = parseInt(tag.getAttribute("begin"));
	const type = tag.getAttribute("type");
	const colour = tag.getAttribute("colour");
	const duration = parseInt(tag.getAttribute("duration"));
	const { position, velocity } = Array.from(tag.children).reduce(
		(previous, current) => {
			const name = current.tagName.toLowerCase();
			const x = parseInt(current.getAttribute("x"));
			const y = parseInt(current.getAttribute("y"));
			return { ...previous, [name]: { x, y } };
		},
		{}
	);
	if (typeof begin == 'undefined' || !type || !colour || !duration || !position) {
		return undefined;
	}
	return new Firework(begin, type, colour, duration, position, velocity);
}

async function convertXmlToClasses(xmlFile) {
	const xml = await xmlFile.text();
	if (!window.DOMParser) {
		return Promise.reject("Browser not compatible");
	}
	try {
		const dom = new DOMParser().parseFromString(xml, "text/xml");
		const [fireworkDisplay] = dom.getElementsByTagName("FireworkDisplay");
		const fireworks = Array.from(fireworkDisplay.children).map((tag) =>
			convertTagToFirework(tag)
		);
		const parsedFrameworks = fireworks.filter((result) => !!result);
		const hasErrorInConversion = fireworks.length !== parsedFrameworks.length;
		console.log(hasErrorInConversion)
		if (!!hasErrorInConversion) {
			throw Error;
		}
		return fireworks;
	} catch (e) {
		return Promise.reject("XML file could not be parsed.");
	}
}

async function fetchFireworksFromXML(url) {
	const response = await fetch(url);
	return await convertXmlToClasses(response);
}

export default fetchFireworksFromXML;
