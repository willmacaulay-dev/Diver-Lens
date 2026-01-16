import {useState, useMemo} from "react";
import { Card, Badge, Button, ProgressBar, Image } from "react-bootstrap";
import './SpeciesCard.css';

// different bg colors for different temperatures
const temperatureVariant = (temp) => {
	switch (temp) {
		case "polar":
			return "rgba(102, 0, 255, 1)";
		case "cold-temperate":
			return "rgba(82, 79, 255, 1)";
		case "temperate":
			return "rgba(49, 152, 255, 1)";
		case "warm-temperate":
			return "rgba(97, 197, 255, 1)";
		case "tropical":
			return "rgba(65, 255, 223, 1)";
		default:
			return "white";
  	}
};

const modifyScale = (commonName) => {
    if (["Spotted Seahorse", "Sea Pen"].includes(commonName))
    	return "35%";

    if (["Sea Otter", "Magnificent Sea Anemone", "Spanish Dancer Nudibranch",
		"Sea Pen", "Red King Crab", "Snow Crab", "Portuguese Man o' War", "Atlantic Puffin",
		"Crown-of-Thorns Starfish", "Gentoo Penguin", "Orange Roughy",
		"Giant Isopod", "Fangtooth", "Pink Sea Cucumber", "Scarlet Cleaner Shrimp", 
		"Clown Anemonefish", "Blue Sea Dragon"].includes(commonName))
		return "45%";
    
    if (["Hawksbill Sea Turtle", "Atlantic Sea Nettle",
		"Kemp's Ridley Sea Turtle", "Olive Ridley Sea Turtle", "Lion's Mane Jellyfish",
		"Leatherback Sea Turtle", "Bottlenose Dolphin", "Basking Shark",
		"Swordfish", "Giant Squid", "California Sea Hare"].includes(commonName))
		return "80%";

    if (["Dugong", "Hawaiian Monk Seal", "Loggerhead Sea Turtle", 
		"Whale Shark", "Harbor Porpoise", "Tiger Shark", "Giant Pacific Octopus",
		"Humpback Whale", "Oceanic Whitetip Shark", "Short-beaked Common Dolphin",
		"Leopard Seal", "Orca", "Scalloped Hammerhead Shark", "Blue Whale", "Beluga Whale",
		"Manta Ray", "Sperm Whale", "Goblin Shark", "Green Sea Turtle", 
		"Great White Shark", "Common Thresher Shark"].includes(commonName))
		return "105%";
    
    if (["Narwhal", "Humboldt Squid"].includes(commonName))
      	return "135%";

    else
      	return "65%";
}

export default function SpeciesCard({species, isInAquarium = false, onToggleInAquarium, brightness}) {
  	const handleToggle = (e) => {
    	e.stopPropagation();
		if (onToggleInAquarium) {
			onToggleInAquarium(species);
		}
  	};

	const imgFileName = species.commonName.split(" ").map((e) => e.toLowerCase()).join("_");
	const imgURL = new URL(`../../data/animals/${imgFileName}.png`, import.meta.url).href;

	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = () => setIsHovered(true);
	const handleMouseLeave = () => setIsHovered(false)

	const randomBobSpeed = useMemo(() => 2.2 + Math.random() * 0.8, []);

	return (
		<div 
			style={{
				transform: `translate(${species.offsetX}px, ${species.offsetY}px) rotate(${species.rotate}deg)`
			}}
			className={`species-wrap ${isHovered ? "species-wrap-top" : ""}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>

			<div className={`bobber ${isHovered ? "bobber-paused" : ""}`}
				style={{
					animationDelay: `-${Math.random() * randomBobSpeed}s`,
					animationDuration: `${randomBobSpeed}s`
				}}>
				<Image 
					src={imgURL} alt={species.commonName}
					style={{
						width: modifyScale(species.commonName), height: 'auto', 
						filter: `brightness(${brightness})`
					}}
					className={`species-img ${isHovered ? "species-img-zoomed" : "species-img-not-zoomed"}`}
				/>
			</div>

    		{isHovered &&
				<Card
					className="shadow-lg"
					style={{
						width: "300px", backgroundColor: "rgba(29, 39, 121, 0.3)", padding: 7,
						//transform: `translate(${species.offsetX}px, ${species.offsetY}px) rotate(${species.rotate}deg)`
					}}
				>
					<Card.Body style={{ backgroundColor: temperatureVariant(species.temperature)}}>
						<div className="d-flex justify-content-between align-items-start">
							{ /* name and scientific name */ }
							<div>
								<Card.Title className="mb-1 fw-bold">
									{species.commonName}
								</Card.Title>
								<Card.Subtitle className="mb-2">
									<em>{species.scientificName}</em>
								</Card.Subtitle>
							</div>

							{ /* temperature and add button */ }
							<div className="d-flex flex-column align-items-end gap-2">
								<Badge pill bg="info">
									{species.temperature}
								</Badge>

								{onToggleInAquarium && (
									<Button
										variant={isInAquarium ? "danger" : "success"}
										size="sm" onClick={handleToggle}
									>
										{isInAquarium ? "Remove" : "Add"}
									</Button>
								)}
              				</div>
            			</div>

            			<hr/>

						{ /* other info */ }
						<div className="small">
							<div>
								<strong>Group:</strong> {species.group}
							</div>
							<div>
								<strong>Environment:</strong> {species.environment}
							</div>
							<div className="mt-1">
								<strong>Depth:</strong>{" "}
								{species.minDepthM}–{species.maxDepthM} m{" "}
								<span>(avg {species.avgDepthM} m)</span>
							</div>
						</div>
					</Card.Body>
        		</Card>
      		}
    	</div>
  	);
}