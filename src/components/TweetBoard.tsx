import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { createGifAccount } from "../features/tweets/tweetSlice";
import { RootState } from "../store";
import { TEST_TWEETS } from "../utils/constants";
import classes from "./TweetBoard.module.scss";

interface ITweet {
    userName: string;
    tweet: string;
}

const TweetBoard = () => {
    const dispatch = useDispatch()
    const isWalletConnected = useSelector((state: RootState) => state.tweets.isWalletConnected)
    const tweetList = useSelector((state: RootState) => state.tweets.tweetList)
    const totalTweet = useSelector((state: RootState) => state.tweets.totalTweets)
    const [states, setStates] = useState({
        userName:'',
        tweet:''
        })
        
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        setStates({
            ...states,
            [e.target.name]: e.target.value,
          });
    }
    const sendTweet = async () => {
        if (states.userName) {
          console.log('Gif link:', states);
        } else {
          console.log('Empty input. Try again.');
        }
      };
      
      

      useEffect(() => {
        console.log("this is tweet list...", tweetList)
        
      }, [tweetList])

      const handleOneTimeInit = () => {
        dispatch(createGifAccount())
      }
      if(totalTweet.length === 0) {
        return (
            <div className="connected-container">
              <button className="cta-button submit-gif-button" onClick={handleOneTimeInit}>
                Do One-Time Initialization For GIF Program Account
              </button>
            </div>
          )
      } else {
        return(
            <div>
                {/* {tweetList.tweetList.map((tweet: ITweet) => (
                    <div className={classes.TweetContainer}>
                        <div className={classes.UserNameWrapper}>{tweet.userName}</div>
                        <div className={classes.TweetWrapper}>{tweet.tweet}</div>
                    </div>
                ))} */}
                <form
                className={classes.FormContainer}
          onSubmit={(event) => {
              console.log("this is the state...", states)
            event.preventDefault();
            sendTweet()
          }}
        >
            <label htmlFor="userName">Username:</label> 
            <input type="text" name="userName" value={states.userName} placeholder="Enter user name" onChange={handleChange}/>
            <label htmlFor="tweet">Tweet:</label> 
          <input type="text" name="tweet" value={states.tweet} placeholder="Enter gif link!" onChange={handleChange}/>
          <button type="submit" className="cta-button submit-gif-button">Submit</button>
        </form>
            </div>
        )
      }
    
}

export default TweetBoard;