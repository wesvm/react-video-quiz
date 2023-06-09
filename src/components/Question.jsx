import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { FiberManualRecord } from '@mui/icons-material';
import { Grid, Card, CardContent, IconButton, Button } from '@mui/material';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';

const Question = ({ questions }) => {

    const videoRefs = useRef([]);

    const handlePlay = (index) => {
        const video = videoRefs.current[index];
        video.play();
    };

    return (
        <div className='container'>
            <Grid container spacing={2} className='mt-3'>
                {questions?.map((question) => {
                    return (
                        <Grid item xs={12} md={3} key={question.id}>
                            <Card sx={{ maxWidth: 345 }} className='h-auto'>
                                <div className='d-flex align-items-center flex-column'>
                                    {question.vod ? (
                                        <>
                                            <video
                                                ref={(ref) => (videoRefs.current[question.id] = ref)}
                                                src={question.vod}
                                                width="300"
                                                height="300"
                                                poster="https://t4.ftcdn.net/jpg/05/16/03/47/360_F_516034760_kWdE15pKthwDLjXBZwYUjBZpydCihUjO.jpg"
                                            />
                                            <div>
                                                <IconButton onClick={() => handlePlay(question.id)}
                                                    sx={{ color: 'black' }}>
                                                    <ReplayCircleFilledIcon sx={{ fontSize: 40 }} />
                                                </IconButton>
                                            </div>

                                        </>
                                    ) : (
                                        <video
                                            width="300"
                                            height="300"
                                            poster="https://t4.ftcdn.net/jpg/05/16/03/47/360_F_516034760_kWdE15pKthwDLjXBZwYUjBZpydCihUjO.jpg"
                                        />
                                    )}
                                </div>
                                <CardContent>
                                    <Link to={`/vod/${question.id}`}>
                                        <Button variant='contained'
                                            startIcon={<FiberManualRecord />}>
                                            start recording
                                        </Button>
                                    </Link>
                                    <h5 className='pt-3'>{question.question}</h5>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}

            </Grid>
            {questions.every((e) => e.vod != null) ? (
                <Button variant="contained">
                    Enviar respuestas
                </Button>
            ) : (null)}
        </div>
    );
};

export default Question;
