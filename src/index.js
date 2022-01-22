import fetchFireworksFromXML from "./utils/read_xml";
import createPixiApplication from "./chart/create";

async function bootstrap() {
	const fireworks = await fetchFireworksFromXML("./assets/fireworks.xml");
	createPixiApplication(fireworks, 1024, 768, 0x000);
}

(async () => {
	bootstrap();
})();
