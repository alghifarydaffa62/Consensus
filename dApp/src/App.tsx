import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./page/Home"
import Login from "./page/Login"
import DashboardLayout from "./layout/DashboardLayout"
import Dashboard from "./page/Dashboard"
import CreatePage from "./page/CreatePage"
import MyCampaigns from "./page/MyCampaigns"
import ActiveVotes from "./page/ActiveVotes"
import History from "./page/History"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/dashboard" element={<DashboardLayout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path="create" element={<CreatePage/>}/>
            <Route path="MyCampaigns" element={<MyCampaigns/>}/>
            <Route path="active" element={<ActiveVotes/>}/>
            <Route path="result" element={<History/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
