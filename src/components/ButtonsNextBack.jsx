import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ButtonsNextBack = ({ questionId, questions }) => {
    const [selectedQuestion, setSelectedQuestion] = useState(
        questions.find((question) => question.id === questionId));

    const handleNext = () => {
        let nextQuestionId;
        if (selectedQuestion.id < questions.length) {
            nextQuestionId = selectedQuestion.id + 1;
        } else {
            nextQuestionId = 1;
        }
        const nextQuestion = questions.find(
            (question) => question.id === nextQuestionId
        );
        if (nextQuestion) {
            setSelectedQuestion(nextQuestion);
        }
    };

    const handleBack = () => {
        let previousQuestionId;
        if (selectedQuestion.id > 1) {
            previousQuestionId = selectedQuestion.id - 1;
        } else {
            previousQuestionId = questions.length;
        }
        const previousQuestion = questions.find(
            (question) => question.id === previousQuestionId
        );
        if (previousQuestion) {
            setSelectedQuestion(previousQuestion);
        }
    };

    if (!selectedQuestion) {
        return <p>question not found</p>;
    }

    return (

        <div className="d-flex pt-2">
            <div className="pe-5">
                {selectedQuestion.id > 1 ? (
                    <Link to={`/vod/${selectedQuestion.id - 1}`} onClick={handleBack}>
                        <Button variant="contained" startIcon={<ArrowBack />}>
                            Back
                        </Button>
                    </Link>
                ) : (
                    <Link to={`/vod/${questions.length}`} onClick={handleBack}>
                        <Button variant="contained" startIcon={<ArrowBack />}>
                            Back
                        </Button>
                    </Link>
                )}
            </div>
            <div className="ps-5">
                {selectedQuestion.id < questions.length ? (
                    <Link to={`/vod/${selectedQuestion.id + 1}`} onClick={handleNext}>
                        <Button variant="contained" endIcon={<ArrowForward />}>
                            Next
                        </Button>
                    </Link>
                ) : (
                    <Link to={`/vod/1`} onClick={handleNext}>
                        <Button variant="contained" endIcon={<ArrowForward />}>
                            Next
                        </Button>
                    </Link>
                )}
            </div>
        </div>

    )
}

export default ButtonsNextBack