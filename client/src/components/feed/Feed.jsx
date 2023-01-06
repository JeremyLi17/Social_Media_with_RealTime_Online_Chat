import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Post from '../post/Post';
import Share from '../share/Share';
import { AuthContext } from '../../context/AuthContext';
import './feed.css';

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  /* empty list means only render once
  [posts] means posts is the dependence
  means that whenever posts is changed, the webpage will rerender */
  useEffect(() => {
    // useEffect cannot apply to a async function
    // we can only create a function inside
    const fetchPosts = async () => {
      const res = username
        ? await axios.get(`/posts/profile/${username}`)
        : await axios.get(`/posts/timeline/${user._id}`);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {user && (!username || username === user.username) && <Share />}
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
