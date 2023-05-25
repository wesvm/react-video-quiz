import { Link, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
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
    const [recordingTime, setRecordingTime] = useState(0);
    const timerIdRef = useRef(null);

    useEffect(() => {
        if (recordedChunks.length > 0) {
            handleSaveVideo();
        }

    }, [recordedChunks])

    const handleStartRecording = async () => {
        resetRecording();
        updateQuestionVideo(selectedQuestion.id, null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            videoRef.current.srcObject = stream;
            videoRef.current.autoplay = true;
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = handleDataAvailable;
            mediaRecorderRef.current.start();

            setRecording(true);
            streamRef.current = stream;

            timerIdRef.current = setInterval(() => {
                setRecordingTime(prevTime => prevTime + 1);
            }, 1000);

            setTimeout(() => {
                handleStopRecording();
            }, 120000);

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
        clearInterval(timerIdRef.current);
        setRecordingTime(0);
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
        resetRecording();
    }

    const handlePlayRecording = () => {
        videoRef.current.src = selectedQuestion.vod;
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
                <Link to='/'>
                    <Button variant='contained' startIcon={<HomeIcon />}>
                        Home
                    </Button>
                </Link>
            </div>
            <div className='card-s pe-5 ps-5 pb-3'>
                <h4 className='pb-0 mb-0'>Pregunta: {selectedQuestion.question}</h4>
                <div>
                    <video
                        ref={videoRef}
                        src={selectedQuestion.vod}
                        width="500"
                        height="500"
                        poster="https://t4.ftcdn.net/jpg/05/16/03/47/360_F_516034760_kWdE15pKthwDLjXBZwYUjBZpydCihUjO.jpg"
                    />
                </div>
                <div className='d-flex justify-content-around'>
                    {recording ? (
                        <>
                            <Button variant="contained"
                                onClick={handleStopRecording}
                                endIcon={<StopCircleIcon />}
                            >
                                Stop
                            </Button>
                            <p>Tiempo de grabación: {recordingTime} seconds</p>
                        </>

                    ) : (
                        <Button variant="contained"
                            onClick={handleStartRecording}
                            endIcon={<PlayCircleIcon />}
                        >
                            Comenzar a grabar
                        </Button>
                    )}
                    {recordedChunks.length > 0 || selectedQuestion.vod && (
                        <Button variant="contained"
                            onClick={handlePlayRecording}
                            endIcon={<ReplayCircleFilledIcon />}
                        >
                            Ver grabacion
                        </Button>
                    )}
                </div>
            </div>

            <div className='pt-3'>
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
        </div>

    );
};

export default CameraRecorder;


