import React from "react";
import AquariumSpeciesTab from "./AquariumSpeciesTab";

// species tab group component
export default function AquariumSpeciesTabs({
    speciesList, onRemove, pressure, temperature, plantLife
}) {
    return (
        <div
            className="mt-3 p-3 rounded"
            style={{
                backgroundColor: "rgba(3, 10, 40, 0.95)", maxHeight: 200, overflowY: "auto"
            }}
        >
            {speciesList.map((sp) => (
                <AquariumSpeciesTab
                    key={sp.id} species={sp} onRemove={onRemove} pressure={pressure}
                    temperature={temperature} plantLife={plantLife}
                />
            ))}
        </div>
    );
}
