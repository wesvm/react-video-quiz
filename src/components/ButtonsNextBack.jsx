import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ButtonsNextBack = ({ questionId, questions }) => {
    const [selectedQuestionId, setSelectedQuestionId] = useState(questionId);
    const navigate = useNavigate();

    useEffect(() => {
        setSelectedQuestionId(questionId);
    }, [questionId]);

    const handleNext = () => {
        setSelectedQuestionId((prevId) => {
            let nextId = prevId === questions.length ? 1 : prevId + 1;
            while (nextId !== prevId) {
                const nextQuestion = questions.find((question) => question.id === nextId);
                if (!nextQuestion.vod) {
                    navigate(`/vod/${nextId}`);
                    return nextId;
                }
                nextId = nextId === questions.length ? 1 : nextId + 1;
            }
            return prevId;
        });
    };

    const handleBack = () => {
        setSelectedQuestionId((prevId) => {
            let previousId = prevId === 1 ? questions.length : prevId - 1;
            while (previousId !== prevId) {
                const previousQuestion = questions.find((question) => question.id === previousId);
                if (!previousQuestion.vod) {
                    navigate(`/vod/${previousId}`);
                    return previousId;
                }
                previousId = previousId === 1 ? questions.length : previousId - 1;
            }
            return prevId;
        });
    };

    return (
        <div className="d-flex justify-content-center">
            <div className="pe-5">
                <Button variant="contained" startIcon={<ArrowBack />} onClick={handleBack}>
                    Back
                </Button>
            </div>
            <div className="ps-5">
                <Button variant="contained" endIcon={<ArrowForward />} onClick={handleNext}>
                    Next
                </Button>
            </div>
        </div>
    )
}

export default ButtonsNextBack