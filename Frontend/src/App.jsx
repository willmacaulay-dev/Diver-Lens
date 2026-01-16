import { HashRouter, Route, Routes } from 'react-router'
import './App.css'
import Home from './components/Home'
import PublishProfile from './components/Publish/PublishProfile'
import Explore from './components/Explore/Explore'
import AquariumBuilder from './components/AquariumBuilder/AquariumBuilder'
import ViewProfiles from './components/Publish/ViewProfiles'

function App() {

	return <HashRouter>
		<Routes>
			<Route path="/" element={ <Home/> }/>
			<Route path="/view-profiles" element={ <ViewProfiles/> }/>
			<Route path="/publish-profile" element={ <PublishProfile/> }/>
			<Route path="/explore" element={ <Explore/> }/>
			<Route path="/aquarium-builder" element={ <AquariumBuilder/> }/>
		</Routes>
	</HashRouter>
}

export default App
