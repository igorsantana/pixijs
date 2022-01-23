import fetchFireworksFromXML from "./app/utils/read_xml";
import createPixiApplication from "./app/create_app";

let app;
function bootstrap(file) {
	fetchFireworksFromXML(`./data/${file}`)
		.then((fireworks) => {
			app = createPixiApplication(fireworks, 1024, 768, 0x000);
		})
		.catch((e) => {
			const errorElement = document.createElement("h1");
			errorElement.innerText = e;
			document.body.appendChild(errorElement);
		});
}

bootstrap("fireworks.xml");
