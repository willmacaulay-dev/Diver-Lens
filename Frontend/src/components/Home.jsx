import { Container, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import "./Home.css";
import exploreTab from "../data/ui/explore_tab.png";
import buildTab from "../data/ui/build_tab.png";
import profilesTab from "../data/ui/profiles_tab.png";
import tabsBackground from "../data/ui/tabs_background.png";

/*

Data sources:

-NOAA Fisheries (species profiles, depth and habitat)
-FishBase (general depth ranges and distribution)

*/

export default function Home() {
    const navigate = useNavigate();

    // prevent scrolling/html background on home page only, revert on unmount
    useEffect(() => {
        const prevB = document.body.style.overflow;
        const prevH = document.documentElement.style.overflowY;
        const prevB2 = document.body.style.height;
        const prevH2 = document.documentElement.style.height;

        document.body.style.overflowY = "hidden";
        document.documentElement.style.overflowY = "hidden";
        document.body.style.height = "100%";
        document.documentElement.style.height = "100%";

        return () => {
            document.body.style.overflowY = prevB;
            document.documentElement.style.overflowY = prevH;
            document.body.style.height = prevB2 || "auto";
            document.documentElement.style.height = prevH2 || "auto";
        };
    }, []);

    return <div className="hero">
        <img src={tabsBackground} className="hero-bg" />

        { /* main feature button/tabs */ }
        <div className="tabs">
            <div className="tab-wrap explore" onClick={() => navigate("/explore")}>
                <img src={exploreTab} className="tab-img" />
                <div className="tab-text tab-text-explore">
                    Explore
                </div>
            </div>

            <div className="tab-wrap build" onClick={() => navigate("/aquarium-builder")}>
                <img src={buildTab} className="tab-img" />
                <div className="tab-text tab-text-build">
                    Build
                </div>
            </div>

            <div className="tab-wrap profiles" onClick={() => navigate("/view-profiles")}>
                <img src={profilesTab} className="tab-img" />
                <div className="tab-text tab-text-profiles">
                    Profiles
                </div>
            </div>
        </div>


        <div className="hero-title">DiverLens</div>
    </div>
}