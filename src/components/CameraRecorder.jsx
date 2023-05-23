import { Link, useParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import ButtonsNextBack from './ButtonsNextBack';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import HomeIcon from '@mui/icons-material/Home';

const CameraRecorder = ({ questions, setQuestions }) => {
    const { questionId } = useParams();
    const selectedQuestion = questions.find(
        (question) => question.id === parseInt(questionId)
    );
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);

    const handleStartRecording = async () => {
        resetRecording();
        updateQuestionVideo(selectedQuestion.id, null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            videoRef.current.srcObject = stream;
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = handleDataAvailable;
            mediaRecorderRef.current.start();
            setRecording(true);
            streamRef.current = stream;
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const handleDataAvailable = (event) => {
        if (event.data && event.data.size > 0) {
            setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setRecording(false);
        if (streamRef.current) {
            const tracks = streamRef.current.getTracks();
            tracks.forEach((track) => track.stop());
            streamRef.current = null;
        }
    };

    const handleSaveVideo = () => {
        const superBuffer = new Blob(recordedChunks, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(superBuffer);
        videoRef.current.srcObject = null;
        videoRef.current.src = videoURL;

        updateQuestionVideo(selectedQuestion.id, videoURL);
    }

    const handlePlayRecording = () => {
        if (selectedQuestion.vod) {
            videoRef.current.src = selectedQuestion.vod;
        } else {
            handleSaveVideo();
        }
        videoRef.current.play();
    };

    const resetRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.ondataavailable = null;
            mediaRecorderRef.current = null;
        }
        setRecordedChunks([]);
    };

    const updateQuestionVideo = (questionId, videoRef) => {
        const updatedQuestions = questions.map((question) => {
            if (question.id === questionId) {
                return { ...question, vod: videoRef };
            }
            return question;
        });

        setQuestions(updatedQuestions);
    };

    return (
        <div className='container d-flex flex-column align-items-center'>
            <div className='me-auto ps-5 pt-3'>
                {streamRef != null ? (
                    <Link to='/'>
                        <Button variant='contained' startIcon={<HomeIcon />}>
                            Home
                        </Button>
                    </Link>
                ) : (
                    <Link to='/' onClick={handleSaveVideo}>
                        <Button variant='contained' startIcon={<HomeIcon />}>
                            Home
                        </Button>
                    </Link>
                )}
            </div>
            <div>
                <div>
                    <video
                        ref={videoRef}
                        src={selectedQuestion.vod}
                        width="500"
                        height="500"
                        poster="https://t4.ftcdn.net/jpg/05/16/03/47/360_F_516034760_kWdE15pKthwDLjXBZwYUjBZpydCihUjO.jpg"
                        autoPlay
                    />
                </div>
                <div>
                    {recording ? (
                        <IconButton onClick={handleStopRecording} sx={{ color: 'black' }}>
                            <StopCircleIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                    ) : (
                        <IconButton onClick={handleStartRecording} sx={{ color: 'black' }}>
                            <PlayCircleIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                    )}
                    {recordedChunks.length > 0 || selectedQuestion.vod ? (
                        <IconButton onClick={handlePlayRecording} sx={{ color: 'black' }}>
                            <ReplayCircleFilledIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                    ) : null}
                </div>
                <h5>Question: {selectedQuestion.question}</h5>
            </div>

            {questions.every((e) => e.vod != null) ? (
                <Link to='/' >
                    <Button variant="contained">
                        Finalizar
                    </Button>
                </Link>
            ) : (
                <ButtonsNextBack questionId={selectedQuestion.id} questions={questions} />
            )}
        </div>
    );
};

export default CameraRecorder;


