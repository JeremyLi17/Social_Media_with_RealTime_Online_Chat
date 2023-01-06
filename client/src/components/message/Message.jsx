import './message.css';
import { format } from 'timeago.js';

export default function Message({ message, own }) {
  return (
    <div className={own ? 'message own' : 'message'}>
      <div className="messageTop">
        <img
          src="https://images.pexels.com/photos/35537/child-children-girl-happy.jpg"
          alt=""
          className="messageImg"
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
