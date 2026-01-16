import React, { useState, useMemo } from "react";
import { Card, Button, ProgressBar } from "react-bootstrap";

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


    // plant life targets based on environment and temperature
    let plantTarget = 50;
    const envStr = (species.environment ?? "").toLowerCase();
    if (envStr.includes("reef") || envStr.includes("seagrass") || envStr.includes("kelp")) {
    plantTarget = 90;
    } else if (envStr.includes("pelagic")) {
    plantTarget = 30;
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

export default function AquariumSpeciesTab({
    species, onRemove, pressure, temperature, plantLife
}) {
    const [hovered, setHovered] = useState(false);

    const survival = useMemo(
        () => computeSurvival(species, pressure, temperature, plantLife),
        [species, pressure, temperature, plantLife]
    );

    return (
        <div
            className="mb-0"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ cursor: "pointer" }}
        >
            {!hovered && (
            <div
                className="d-flex align-items-center justify-content-between px-2 py-1 rounded"
                style={{
                    backgroundColor: "rgba(20,30,80,0.9)", color: "white", minWidth: 180
                }}
            >
                <span className="text-truncate">{species.commonName}</span>
            </div>
            )}

            {hovered && (
                <Card
                    className="shadow-sm"
                    style={{backgroundColor: "rgba(20,30,80,0.98)", color: "white"}}
                >
                    <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <Card.Title className="mb-1 fw-bold">
                                {species.commonName}
                            </Card.Title>
                            <Card.Subtitle className="mb-2">
                                <em>{species.scientificName}</em>
                            </Card.Subtitle>
                        </div>
                        <Button
                            variant="outline-light" size="sm" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove && onRemove(species);
                            }}
                        >
                            ×
                        </Button>
                    </div>
                    <div className="small mb-2">
                        <div>
                            { /* species depth */ }
                            <strong>Depth:</strong>{" "}
                            {species.minDepthM}–{species.maxDepthM} m (avg{" "}
                            {species.avgDepthM} m)
                        </div>
                        <div>
                            { /* species environment */ }
                            <strong>Environment:</strong> {species.environment}
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="small mb-1">
                            { /* species survival chance */ }
                            Survival chance:{" "}
                            <strong>{survival}%</strong>
                        </div>
                        <ProgressBar now={survival}
                            variant={survival > 70 ? "success" : survival > 40 ? "warning" : "danger"}
                            style={{ height: 8 }}
                        />
                    </div>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
}
