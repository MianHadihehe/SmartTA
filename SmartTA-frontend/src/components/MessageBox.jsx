import React, { useEffect, useState } from 'react';
import '../styling/message.css'; // Import CSS for styling
const MessageBox = ({ message }) => {
    return (
      <div className="message-box">
        {message}
      </div>
    );
  };
  
  export default MessageBox;