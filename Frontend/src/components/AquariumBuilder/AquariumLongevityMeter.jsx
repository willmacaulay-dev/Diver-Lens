import { ProgressBar } from "react-bootstrap";

// circular meter showing longevity percentage
export default function AquariumLongevityMeter({ longevity = 50 }) {
    const clamped = Math.max(0, Math.min(100, longevity));

    return (
        <div className="d-flex flex-column align-items-center mb-4">
            <div
                style={{
                    width: 140, height: 140, borderRadius: "50%", border: "6px solid rgba(65, 255, 223, 0.8)",
                    display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(17, 42, 169, 1)",
                    color: "white"
                }}
            >
                { /* percentage text inside circle */ }
                <div className="text-center">
                <div style={{ fontSize: "1.0rem"}}>
                    Aquarium Longevity
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>
                    {clamped}%
                </div>
                </div>
            </div>
            
            { /* horizontal progress bar below circle */ }
            <div className="w-100 mt-3">
                <ProgressBar
                    now={clamped} variant={clamped > 70 ? "success" : clamped > 40 ? "warning" : "danger"}
                    style={{ height: 10 }}
                />
            </div>
        </div>
    );
}