import React from 'react';
import send from '/send.svg';

function SendButton({handleSubmit}) {
  return (
    <img src={send} onClick={handleSubmit} className="send-btn" alt="send" />
  );
}

export default SendButton;