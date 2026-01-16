import { useState } from "react";
import { useNavigate } from "react-router";
import { Container, Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import useAquariumStorage from "../../hooks/useAquariumStorage";
import useAquariumSettings from "../../hooks/useAquariumSettings";
import { API_BASE } from "../../api";


export default function PublishProfile() {
	const navigate = useNavigate();

	const { aquariumSpecies } = useAquariumStorage();
	const { pressure, temperature, plantLife } = useAquariumSettings();

	const [profileName, setProfileName] = useState("");
	const [authorName, setAuthorName] = useState("");

	const [status, setStatus] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	// publish profile to db for public viewing
	const publish = async (e) => {
		e.preventDefault();
		setStatus(null);

		try {
			setSubmitting(true);

			console.log("POSTING TO:", `${API_BASE}/api/profiles`);

			const res = 
				await fetch(`${API_BASE}/api/profiles`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						profileName: profileName.trim() || "Untitled Profile",
						authorName: authorName.trim() || "Unknown",
						animals: aquariumSpecies,
						settings: { pressure, temperature, plantLife }
					})
				});

			if (!res.ok) throw new Error("bad response");

			setStatus({ type: "success", msg: "Published!" });
			setTimeout(() => navigate("/view-profiles"), 700);

		} catch {
			setStatus({ type: "danger", msg: "Failed to publish profile." });
		} finally {
			setSubmitting(false);
		}
	};

  	return (
		<Container
			className="my-4" 
			style={{ 
				maxWidth: "50rem", width: "100%", paddingLeft: "12px", paddingRight: "12px" 
			}}
		>
			<div className="position-relative mb-3">
				<Button 
					variant="secondary" onClick={() => navigate("/view-profiles")} 
					className="position-absolute start-0"
				>
					Back
				</Button>

				<h3 className="text-center m-0 fw-bold" style={{ color: "white" }}>
					Publish Profile
				</h3>
			</div>

			<div style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
				<Container className="my-4 d-flex justify-content-center">
					<Card
						className="h-100 shadow-sm mx-auto py-3"
						style={{
						width: "50rem",
						backgroundColor: "rgba(0, 6, 30, 0.98)",
						color: "white"
						}}
					>

						{ /* info text on what user is publishing */ }
						<div className="text-center mb-5" style={{ fontSize: "0.8rem", color: "gray" }}>
							Publishing {aquariumSpecies.length} animals<br/>Settings: temp {temperature}, pressure {pressure}, plant {plantLife}
						</div>

						{ /* publish form */ }
						<Form className="d-flex flex-column align-items-center" onSubmit={publish}>
							<Form.Group className="mb-3" style={{ width: "50%" }}>
								<Form.Label>Profile Name</Form.Label>
								<Form.Control
									value={profileName} onChange={(e) => setProfileName(e.target.value)}
									type="text" placeholder="My Profile"
								/>
							</Form.Group>

							<Form.Group className="mb-3" style={{ width: "50%" }}>
								<Form.Label>Author Name</Form.Label>
								<Form.Control 
									value={authorName} onChange={(e) => setAuthorName(e.target.value)}
									type="text" placeholder="John"
								/>
							</Form.Group>

							{status && (
								<Alert variant={status.type} style={{ width: "50%" }}>
									{status.msg}
								</Alert>
							)}

							<Button variant="success" className="mt-5 mb-3" type="submit" disabled={submitting}>
								{submitting ? (
									<>
										<Spinner size="sm" className="me-2" />
										Publishing...
									</>
									) : (
										"Publish Profile"
									)}
							</Button>
						</Form>
					</Card>
				</Container>
			</div>
		</Container>
  	);
}
