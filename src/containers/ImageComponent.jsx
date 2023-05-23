import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const UploadPage = ({ questions, setQuestions }) => {
    const { questionId } = useParams();
    const selectedQuestion = questions.find(
        (question) => question.id === parseInt(questionId)
    );
    const [image, setImage] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const imageData = reader.result;
            setImage(imageData);
            updateQuestionImage(selectedQuestion.id, imageData);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const updateQuestionImage = (questionId, imageData) => {
        const updatedQuestions = questions.map((question) => {
            if (question.id === questionId) {
                return { ...question, vod: imageData };
            }
            return question;
        });

        setQuestions(updatedQuestions);
    };

    return (
        <div>
            <h1>Upload Page</h1>
            <p>Selected Question: {selectedQuestion.question}</p>
            {selectedQuestion.vod ? (
                <img src={selectedQuestion.vod} alt="Selected Question" />
            ) : (
                <p>No image available</p>
            )}
            <input type="file" onChange={handleImageUpload} />
            <Link to="/">Back</Link>
        </div>
    );
};

export default UploadPage;

