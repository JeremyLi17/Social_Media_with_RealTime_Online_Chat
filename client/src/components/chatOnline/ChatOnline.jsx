import axios from 'axios';
import { useState, useEffect } from 'react';
import './chatOnline.css';

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  // fetch all friends
  useEffect(() => {
    const fetchFriends = async () => {
      const res = await axios.get('/users/friends/' + currentId);
      setFriends(res.data);
    };
    fetchFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (friend) => {
    try {
      const res = await axios.get(
        `/conversations/find/${currentId}/${friend._id}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      <>
        <div className='chatOnlineTitle'>Online friends</div>
        {onlineFriends.map((f) => (
          <div
            className="chatOnlineFriend"
            key={f._id}
            onClick={() => handleClick(f)}
          >
            <div className="chatOnlineImgContainer">
              <img
                src={
                  f?.profilePicture
                    ? PUBLIC_FOLDER + f.profilePicture
                    : PUBLIC_FOLDER + 'person/noAvatar.jpeg'
                }
                alt=""
                className="chatOnlineImg"
              />
              <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">{f.username}</span>
          </div>
        ))}
      </>
    </div>
  );
}
