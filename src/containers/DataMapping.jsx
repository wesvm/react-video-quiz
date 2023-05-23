import { Link } from 'react-router-dom';

const DataMapping = ({ questions }) => {
    return (
        <div>
            <h1>Data Mapping</h1>
            {questions.map((question) => (
                <div key={question.id}>
                    <p>{question.question}</p>
                    {question.vod ? (
                        <img src={question.vod} alt="Question Image" />
                    ) : (
                        <p>No image available</p>
                    )}
                    <Link to={`/upload/${question.id}`}>Upload Image</Link>
                </div>
            ))}
        </div>
    );
};

export default DataMapping;