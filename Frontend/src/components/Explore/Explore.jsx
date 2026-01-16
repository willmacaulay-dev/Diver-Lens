import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import SpeciesList from "./SpeciesList.jsx";
import "./Explore.css";

export default function Explore() {
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [searchedName, setSearchedName] = useState('');
    const [searchedMajor, setSearchedMajor] = useState('');
    const [searchedInterest, setSearchedInterest] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [page, setPage] = useState(1);
    const [spBrightness, setSpBrightness] = useState(1.0);

    // handle scroll effects/background color change
    useEffect(() => {
        const updating = {current: false};

        const handleScroll = () => {
            if (!updating.current) {

                updating.current = true;

                const doc = document.documentElement;
                const scrollHeight = doc.scrollHeight - doc.clientHeight;
                const progress = 1-Math.min(window.scrollY/35000.0, 1);

                document.body.style.backgroundColor = `rgb(${30*progress}, ${110*progress}, ${180*progress})`;
                document.querySelector(".water-overlay").style.opacity = progress * 0.3;
                setSpBrightness(Math.min(progress+0.3, 1.0));

                updating.current = false;
            }
        }

        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            document.body.style.backgroundColor = 'rgb(0, 20, 50)';
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);

    return <div style={{position: 'relative', overflow: 'visible', minHeight: '100vh'}}>
        <div className="water-overlay"/>
        <Button variant="secondary" onClick={() => navigate("/")} style={{ position: "fixed", top: "25px", left: "25px", zIndex: 999 }} >
            Home
        </Button>
        <div className="position-relative mb-3 mt-5">
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", width: "30%", gap: "12px" }}>
                    {/*<div style={{ flex: 1, borderTop: "3px solid rgb(0, 15, 48)", zIndex: 10 }} />*/}
                    <span style={{ fontSize: "2rem", fontWeight: 750, whiteSpace: "nowrap", color: "rgb(0, 15, 48)", zIndex: 10, marginLeft: "8vw" }}>The Ocean</span>
                    {/*<div style={{ flex: 1, borderTop: "3px solid rgb(0, 15, 48)", zIndex: 10 }} />*/}
                </div>
            </div>
        </div>
        <Container className="d-flex justify-content-center align-items-center">
            <SpeciesList spBrightness={spBrightness}/>
        </Container>
    </div>
}