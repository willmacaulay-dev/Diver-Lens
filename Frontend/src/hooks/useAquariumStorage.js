import { useEffect, useState } from "react";

export default function useAquariumStorage() {
  	const [aquariumSpecies, setAquariumSpecies] = useState(() => {
    	const saved = localStorage.getItem("aquariumSpecies");
    	return saved ? JSON.parse(saved) : [];
  	});

  	useEffect(() => {
    	localStorage.setItem("aquariumSpecies", JSON.stringify(aquariumSpecies));
  	}, [aquariumSpecies]);

  	const addSpecies = (species) => {
    	setAquariumSpecies((prev) => {
			if (prev.some((sp) => sp.id === species.id)) return prev;
			return [...prev, species];
		});
  	};

	const removeSpecies = (species) => {
		setAquariumSpecies((prev) => prev.filter((sp) => sp.id !== species.id));
	};

	const isInAquarium = (id) => {
		return aquariumSpecies.some((sp) => sp.id === id);
	};

	const setSpecies = (speciesList) => {
		setAquariumSpecies(Array.isArray(speciesList) ? speciesList : []);
	};

	return {
		aquariumSpecies, addSpecies, removeSpecies, isInAquarium, setSpecies
	};
}
