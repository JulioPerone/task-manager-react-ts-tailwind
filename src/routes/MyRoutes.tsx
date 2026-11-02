import { BrowserRouter, Route, Routes } from "react-router-dom"
import Homepage from "../views/Homepage"
import TutorialView from "../views/TutorialView"

const MyRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage/>}/>
                <Route path="/tutorial" element={<TutorialView/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default MyRoutes