import fetchFireworksFromXML from "./utils/read_xml";
import createPixiApplication from "./chart/create";

function bootstrap() {
	fetchFireworksFromXML("./data/fireworks.xml")
		.then((fireworks) => createPixiApplication(fireworks, 1024, 768, 0x000))
		.catch((e) => {
			const errorElement = document.createElement("h1");
			errorElement.innerText = e;
			document.body.appendChild(errorElement);
		});
}

bootstrap();
