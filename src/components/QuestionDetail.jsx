import { Card } from '@mui/material';
import CameraRecorder from './CameraRecorder';

const QuestionDetail = ({ questions }) => {
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12 d-flex justify-content-center'>
                    <Card sx={{ maxWidth: 800, maxHeight: 800 }} className='flex-grow-1 p-3'>
                        <CameraRecorder />
                        <h4>{questions.question}</h4>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default QuestionDetail;




