import robotAnswer from '/robot_32.svg';

function Answer({ answer, isError, error }) {
  return (
    <div className="answer-bundle">
      <img src={robotAnswer} alt="droid" className="answer-bot" />
      <div className="answer-text"><p>{answer}</p></div>
      {isError && <ErrorMessage error={error} />}
    </div>
  );
}

export default Answer;