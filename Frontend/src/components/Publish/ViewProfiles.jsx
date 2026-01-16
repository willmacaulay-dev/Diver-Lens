import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Container, Card, Button, Row, Col, Spinner, Collapse, ListGroup, Badge } from "react-bootstrap";
import useAquariumStorage from "../../hooks/useAquariumStorage";
import useAquariumSettings from "../../hooks/useAquariumSettings";
import { API_BASE } from "../../api";


export default function ViewProfiles() {
	const navigate = useNavigate();

	const [profiles, setProfiles] = useState([]);
	const [openId, setOpenId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [applyStatus, setApplyStatus] = useState(null);

	const { setSpecies } = useAquariumStorage();
	const { setPressure, setTemperature, setPlantLife } = useAquariumSettings();


	// load public profiles
  	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				setLoading(true);
				const res = await fetch(`${API_BASE}/api/profiles`);
				const data = await res.json();
				if (!cancelled) setProfiles(Array.isArray(data) ? data : []);
			} catch (e) {
				if (!cancelled) setProfiles([]);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, []);


	// toggle opening profile details
  	const toggle = (id) => {
    	setOpenId((prev) => (prev === id ? null : id));
  	};

	// apply selected profile to aquarium
	const applyProfile = (profile) => {
		try {
			setApplyStatus({ type: "loading", id: profile.id });

			setSpecies(profile.animals ?? []);

			const s = profile.settings ?? {};
			if (s.pressure != null) setPressure(s.pressure);
			if (s.temperature != null) setTemperature(s.temperature);
			if (s.plantLife != null) setPlantLife(s.plantLife);

			setApplyStatus({ type: "success", id: profile.id });
			setTimeout(() => setApplyStatus(null), 1200);
		} catch {
			setApplyStatus({ type: "error", id: profile.id });
			setTimeout(() => setApplyStatus(null), 1500);
		}
	};


  	return (
		<Container className="my-4" style={{ maxWidth: "50rem", width: "100%", paddingLeft: "12px", paddingRight: "12px" }}>

			<div className="position-relative mb-3">
				<Button variant="secondary" onClick={() => navigate("/")} className="position-absolute start-0">
					Home
				</Button>

				<h3 className="text-center fw-bold" style={{color: "white"}}>
					Public Profiles
				</h3>
			</div>
			<Card style={{backgroundColor: "rgba(0, 6, 30, 0.98)"}} className="my-4">
				{loading ? (
					<div className="d-flex justify-content-center py-5">
						<Spinner/>
					</div>
				) : profiles.length === 0 ? (
					<Card className="p-4">
						<div className="text-muted">No public profiles yet.</div>
					</Card>
				) : (
					<div className="d-flex flex-column gap-3">
						{profiles.map((p) => {
							const isOpen = openId === p.id;
							const animals = p.animals ?? [];
							const settings = p.settings ?? {};
							const isApplying = applyStatus?.type === "loading" && applyStatus?.id === p.id;

							return (
								<Card key={p.id} className="shadow-sm py-0">
									<Card.Body>
										<div className="d-flex align-items-center justify-content-between">
											{ /* number of animals and author */ }
											<div>
												<div className="fw-bold" style={{ fontSize: "1.05rem" }}>
													{p.profileName ?? p.name ?? "Untitled Profile"}{" "}
													{typeof animals.length === "number" && (
														<Badge bg="secondary" className="ms-2">
															{animals.length} animals
														</Badge>
													)}
												</div>
												<div className="text-muted" style={{ fontSize: "0.9rem" }}>
													By {p.authorName ?? p.author ?? "Unknown"}
												</div>
											</div>

											<div className="d-flex gap-2">
												<Button variant={isOpen ? "outline-secondary" : "secondary"} onClick={() => toggle(p.id)}>
													{isOpen ? "Hide" : "View"}
												</Button>
											</div>
										</div>

										<Collapse in={isOpen}>
											<div>
												<hr />

												<Row className="g-4">
													<Col md={6}>
														<div className="fw-bold mb-2">Animals</div>
														{animals.length === 0 ? (
															<div className="text-muted">No animals in this profile.</div>
														) : (
															<ListGroup>
																{ /* profile animals */ }
																{animals.map((a, idx) => (
																	<ListGroup.Item key={a.id ?? `${p.id}-a-${idx}`}>
																		<div className="d-flex justify-content-between">
																			<div className="fw-semibold">{a.commonName ?? "Unknown"}</div>
																			<div className="text-muted">
																				{a.quantity != null ? `x${a.quantity}` : ""}
																			</div>
																		</div>
																		<div className="text-muted" style={{ fontSize: "0.85rem" }}>
																			{a.type ?? a.category ?? ""}
																		</div>
																	</ListGroup.Item>
																))}
															</ListGroup>
														)}
													</Col>

													{ /* profile settings */ }
													<Col md={6}>
														<div className="fw-bold mb-2">Settings</div>
														<ListGroup>
															<ListGroup.Item>
																<div className="d-flex justify-content-between">
																	<span>Pressure</span>
																	<span className="text-muted">{settings.pressure ?? "—"}</span>
																</div>
															</ListGroup.Item>
															<ListGroup.Item>
																<div className="d-flex justify-content-between">
																	<span>Temperature</span>
																	<span className="text-muted">{settings.temperature ?? "—"}</span>
																</div>
															</ListGroup.Item>
															<ListGroup.Item>
																<div className="d-flex justify-content-between">
																	<span>Plant Life</span>
																	<span className="text-muted">{settings.plantLife ?? "—"}</span>
																</div>
															</ListGroup.Item>
														</ListGroup>

													</Col>
												</Row>
												<div className="d-flex justify-content-end mt-3">
													<Button
														variant="success" disabled={isApplying}
														onClick={() => applyProfile(p)}
													>
														{isApplying ? "Applying..." : "Use This Profile"}
													</Button>
												</div>

												{applyStatus?.id === p.id && applyStatus.type === "success" && (
													<div className="text-success mt-2">Applied!</div>
												)}
												{applyStatus?.id === p.id && applyStatus.type === "error" && (
													<div className="text-danger mt-2">Failed to apply.</div>
												)}
											</div>
										</Collapse>
									</Card.Body>
								</Card>
							);
						})}
					</div>
				)}
			</Card>
			<div className="d-flex justify-content-center mt-5">
				<Button variant="primary" size="lg" onClick={() => navigate("/publish-profile")}>
					Publish Your Profile
				</Button>
			</div>
		</Container>
	);
}
