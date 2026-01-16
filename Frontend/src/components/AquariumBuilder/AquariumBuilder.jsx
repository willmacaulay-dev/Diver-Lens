import { useNavigate } from "react-router";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useMemo } from "react";
import AquariumView from "./AquariumView";
import AquariumSidebar from "./AquariumSidebar";
import AquariumSpeciesTabs from "./AquariumSpeciesTabs";
import useAquariumStorage from "../../hooks/useAquariumStorage";
import useAquariumSettings from "../../hooks/useAquariumSettings";


// arbitrary calculation for survival score
function computeSurvival(species, pressure, temperature, plantLife) {

    // target temperature values based on preferences
    const tempTargets = {
        "polar": 10,
        "cold-temperate": 25,
        "temperate": 50,
        "warm-temperate": 75,
        "tropical": 90
    };
    const tempTarget = tempTargets[species.temperature] ?? 50;
    const tempScore = 100 - Math.min(100, Math.abs(temperature - tempTarget));


    const maxDepth = 2000;
    const pressureDiff = pressure - (species.avgDepthM/maxDepth)*100

    let pressureMult = 0

    // pressure thresholds
    if (pressureDiff < -50) {
        pressureMult = 0.7;
    } else if (pressureDiff < -25) {
        pressureMult = 0.8;
    } else if (pressureDiff < -10) {
        pressureMult = 0.9;
    } else if (pressureDiff < 10) {
        pressureMult = 1.0;
    } else if (pressureDiff < 25) {
        pressureMult = 0.7;
    } else if (pressureDiff < 50) {
        pressureMult = 0.2
    } else {
        pressureMult = 0;
    }

    const pressureScoreMult = (1.0 - Math.abs(pressureDiff/100.0)) * pressureMult;

    // target plant life targets based on environment and temperature
    let plantTarget = 50;
    const envStr = (species.environment ?? "").toLowerCase();

    if (envStr.includes("reef") || envStr.includes("seagrass")) {
        plantTarget = 80;
    } else if (envStr.includes("pelagic")) {
        plantTarget = 40;
    }
    if (tempTarget <= 25) {
        plantTarget -= 20;
    } else if (tempTarget >= 90) {
        plantTarget += 20;
    }

    const plantScore = 100 - Math.min(100, Math.abs(plantLife - plantTarget));

    // survival score calculation
    const raw = pressureScoreMult * ((0.6 * tempScore) + (0.4 * plantScore));

    return Math.round(Math.max(0, Math.min(100, raw)));
}

export default function AquariumBuilder() {
    const navigate = useNavigate();

    // aquarium settings hook
    const { pressure, setPressure, temperature, setTemperature, plantLife, setPlantLife }
        = useAquariumSettings();

    const { aquariumSpecies, removeSpecies } = useAquariumStorage();

    // longevity score calculation (aggregate survival score)
    const longevity = useMemo(() => {
        if (!aquariumSpecies.length) return 0;

        const totalSurvival = aquariumSpecies.reduce(
            (sum, sp) => sum + computeSurvival(sp, pressure, temperature, plantLife), 0
        );

        const avg = totalSurvival / aquariumSpecies.length;

        return Math.round(avg);
    }, [aquariumSpecies, pressure, temperature, plantLife]);

    return (
        <Container className="my-4" style={{ maxWidth: "75rem", width: "100%", paddingLeft: "12px", paddingRight: "12px" }}>
            <div className="position-relative mb-3">
                <Button variant="secondary" onClick={() => navigate("/")} className="position-absolute" style={{ left: "9vw", top: 0 }}>
                    Home
                </Button>

                <h3 className="text-center m-0 fw-bold" style={{color: "white"}}>
                    Aquarium Builder
                </h3>
            </div>
            <Container className="my-4" style={{ width: "75vw", maxWidth: "75vw" }}>
                <Card className="h-100 shadow-sm p-4" style={{ backgroundColor: "rgba(0, 6, 30, 0.98)", color: "white" }}>
                    <Row className="g-4">   
                        <Col xs={12} lg={8} className="d-flex flex-column gap-3">

                            { /* aquarium view */ }
                            <AquariumView plantLife={plantLife} pressure={pressure} speciesList={aquariumSpecies}/>

                            { /* species tabs */ }
                            <AquariumSpeciesTabs speciesList={aquariumSpecies} onRemove={removeSpecies} pressure={pressure}
                                temperature={temperature} plantLife={plantLife}/>
                        </Col>

                        <Col xs={12} lg={4}>

                            { /* sidebar */ }
                            <AquariumSidebar longevity={longevity} pressure={pressure} temperature={temperature}
                                plantLife={plantLife} onPressureChange={setPressure} onTemperatureChange={setTemperature}
                                onPlantLifeChange={setPlantLife}/>
                        </Col>
                    </Row>
                </Card>
            </Container>
        </Container>
    );
}