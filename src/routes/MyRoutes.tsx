import { BrowserRouter, Route, Routes } from "react-router-dom"
import Homepage from "../views/Homepage"
import ToDoListV1 from "../views/ToDoListV1"
import ToDoListV2 from "../views/ToDoListV2"

const MyRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage/>}/>
                <Route path="/v1.0" element={<ToDoListV1 />}/>
                <Route path="/v1.2" element={<ToDoListV2 />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default MyRoutes