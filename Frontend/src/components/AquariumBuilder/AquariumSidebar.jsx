import { Card } from "react-bootstrap";
import AquariumLongevityMeter from "./AquariumLongevityMeter";
import AquariumSliders from "./AquariumSliders";

// sidebar component for aquarium settings and longevity meter
export default function AquariumSidebar({
    longevity, pressure, temperature, plantLife, onPressureChange,
    onTemperatureChange, onPlantLifeChange
}) {
    return (
        <Card 
            className="h-100 shadow-sm" 
            style={{ backgroundColor: "rgba(10, 20, 60, 0.95)", color: "white" }}
        >
            <Card.Body>
                <AquariumLongevityMeter longevity={longevity} />
                <AquariumSliders
                    pressure={pressure} temperature={temperature} plantLife={plantLife} onPressureChange={onPressureChange}
                    onTemperatureChange={onTemperatureChange} onPlantLifeChange={onPlantLifeChange}
                />
            </Card.Body>
        </Card>
    );
}