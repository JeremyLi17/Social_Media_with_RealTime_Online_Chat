import axios from 'axios';
import { useEffect, useState } from 'react';
import './conversation.css';

export default function Conversation({ conversation, currentUser }) {
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find(
      (mId) => mId !== currentUser._id
    );
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users?userId=${friendId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={
          user?.profilePicture
            ? PUBLIC_FOLDER + user.profilePicture
            : PUBLIC_FOLDER + 'person/noAvatar.jpeg'
        }
        alt=""
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}
