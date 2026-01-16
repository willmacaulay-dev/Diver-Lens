import { useEffect, useState } from "react";

const KEY = "aquariumSettings";

function clamp(n) {
	const x = Number(n);
	if (!Number.isFinite(x)) return 50;
	return Math.max(0, Math.min(100, x));
}

export default function useAquariumSettings() {
	const [pressure, setPressure] = useState(() => {
		try {
		const saved = JSON.parse(localStorage.getItem(KEY));
		return clamp(saved?.pressure ?? 50);
		} catch {
		return 50;
		}
	});

	const [temperature, setTemperature] = useState(() => {
		try {
			const saved = JSON.parse(localStorage.getItem(KEY));
			return clamp(saved?.temperature ?? 50);
		} catch {
			return 50;
		}
	});

	const [plantLife, setPlantLife] = useState(() => {
		try {
			const saved = JSON.parse(localStorage.getItem(KEY));
			return clamp(saved?.plantLife ?? 50);
		} catch {
			return 50;
		}
	});

	useEffect(() => {
		localStorage.setItem(
			KEY, JSON.stringify({ pressure, temperature, plantLife })
		);
	}, [pressure, temperature, plantLife]);

  return {
    pressure, setPressure, temperature, setTemperature, plantLife, setPlantLife
  };
}
