// AquariumView.jsx
import React, { useRef } from "react";
import { Card, Image } from "react-bootstrap";
import waterGif from "../../data/misc/water_effect.gif";
import plants0 from "../../data/misc/plants0.png";
import plants1 from "../../data/misc/plants1.png";
import plants2 from "../../data/misc/plants2.png";
import plants3 from "../../data/misc/plants3.png";
import "./AquariumView.css";


// modify scale of certain species
function modifyScale(commonName) {
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

export default function AquariumView({ speciesList = [], plantLife, pressure }) {
	// plant background
	let plantImg = plants0;
	if (plantLife >= 75) plantImg = plants3;
	else if (plantLife >= 50) plantImg = plants2;
	else if (plantLife >= 25) plantImg = plants1;

	// pressure (depth) tint
	const p = Math.max(0, Math.min(100, pressure));
	const r = 30 * (1 - p / 100);
	const g = 110 * (1 - p / 100);
	const b = 180 * (1 - p / 100);

	const waterOpacity = 0.35 * (1 - p / 100);
	const plantOpacity = 1 - p / 130;

	// stabilize random species placements across re-renders
	const placementRef = useRef(new Map());

	function getPlacement(sp) {
		const map = placementRef.current;

		// random species placement
		if (!map.has(sp.id)) {
			map.set(sp.id, {
				leftPct: 8 + Math.random() * 84,
				topPct: 10 + Math.random() * 80,
				bobSpeed: 2.2 + Math.random() * 0.9,
				bobPhase: Math.random()
			});
		}

		return map.get(sp.id);
  	}

	return (
		<Card
			className="shadow-sm"
			style={{
				backgroundColor: `rgb(${r}, ${g}, ${b})`, borderRadius: 24, overflow: "hidden",
				height: 400, position: "relative"
			}}
		>

			{/* water overlay */}
			<div
				style={{
					position: "absolute", inset: 0, backgroundImage: `url(${waterGif})`, backgroundSize: "cover",
					backgroundRepeat: "no-repeat", backgroundPosition: "center", opacity: waterOpacity,
					pointerEvents: "none", zIndex: 3, mixBlendMode: "screen"
				}}
			/>

			{/* plants overlay */}
			<div
				style={{
					position: "absolute", inset: 0, backgroundImage: `url(${plantImg})`,backgroundSize: "cover",
					backgroundRepeat: "no-repeat", backgroundPosition: "center", opacity: plantOpacity,
					pointerEvents: "none", zIndex: 0
				}}
			/>

			{/* frame */}
			<div
				style={{
					position: "absolute", inset: 0, padding: 16, display: "flex", alignItems: "center",
					justifyContent: "center", zIndex: 2
				}}
			>
				<div
					style={{
						width: "100%", height: "100%", borderRadius: 18, boxShadow: "inset 0 0 40px rgba(0,0,0,0.7)",
						border: "3px solid rgba(65,255,223,0.4)", position: "relative", overflow: "hidden"
					}}
				>
					{speciesList.map(sp => {
						const place = getPlacement(sp);

						const imgFile = sp.commonName.split(" ").map(w => w.toLowerCase()).join("_");
						const imgURL = new URL(`../../data/animals/${imgFile}.png`, import.meta.url).href;

						return (
							//layers for positioning and bobbing animation
							<div
								key={sp.id} className="aq-sprite-layer"
								style={{
									left: `${place.leftPct}%`, top: `${place.topPct}%`,
									transform: `translate(-50%, -50%)`
								}}
							>
								<div
									className="aq-bobber"
									style={{
										animationDuration: `${place.bobSpeed}s`,
										animationDelay: `-${place.bobPhase * place.bobSpeed}s`
									}}
								>
									{ /* species image */ }
									<Image
										src={imgURL} alt={sp.commonName} className="aq-sprite"
										style={{ 
											width: modifyScale(sp.commonName), height: "auto", 
											filter: `brightness(${plantOpacity})`
										}}
										draggable={false}
									/>
								</div>
							</div>
						);
					})}
        		</div>
      		</div>
    	</Card>
  	);
}
