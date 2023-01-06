import './share.css';
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from '@mui/icons-material';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRef } from 'react';
import { useState } from 'react';
import axios from 'axios';

export default function Share() {
  const { user } = useContext(AuthContext);
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
  const BUCKET_URL = process.env.REACT_APP_BUCKET;
  const desc = useRef();
  const [file, setFile] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const newPost = {
        userId: user._id,
        desc: desc.current.value,
      };

      // upload image
      if (file !== '') {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'upload');

        const uploadRes = await axios.post(BUCKET_URL, data);
        const { url } = uploadRes.data;

        // add into payload
        newPost.img = url;
      }

      // post to server
      await axios.post('/posts', newPost);

      // refresh the window
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={
              user.profilePicture
                ? PUBLIC_FOLDER + user.profilePicture
                : PUBLIC_FOLDER + 'person/noAvatar.jpeg'
            }
            alt=""
            className="shareProfileImg"
          />
          <input
            placeholder={`What's in your mind ${user.username}?`}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
            <Cancel className="shareCancelImg" onClick={() => setFile('')} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: 'none' }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
