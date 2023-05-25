import { BrowserRouter, Routes, Route } from "react-router-dom";
import { questions } from './components/constants';
import Question from './components/Question';
import { useState } from "react";
import CameraRecorder from "./components/CameraRecorder";

function App() {
    const [data, setData] = useState(questions);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Question questions={data} />} />
                <Route path="/vod/:questionId" element={<CameraRecorder questions={data}
                    setQuestions={setData} />} />
            </Routes>
        </BrowserRouter>

    )
}

export default App
