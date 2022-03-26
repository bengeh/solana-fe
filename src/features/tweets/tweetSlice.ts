import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseAccount, program, provider, SystemProgram } from '../../utils/common';

export interface TweetState {
    totalTweets: Tweet;
    tweetList: Array<ITweetList>;
    isWalletConnected: boolean;
}

export interface TweetResponse {
    userName: string;
    tweet: string;
}

export interface ITweetList {
    tweetObj: TweetResponse;
    userAddress: PublicKeyAccount
}
export interface PublicKeyAccount {
    negative: number;
    words: Array<number>;
    red?: number;
    length: number;
}
export interface Tweet {
    negative: number;
    words: Array<number>;
    red?: number;
    length: number;
}

export interface TweetData {
    totalTweets: Tweet;
    tweetList: Array<Tweet>;
}
const initialState: TweetState = {
    totalTweets: {
        negative: 0,
        words: [],
        length: 0
    },
    tweetList: [],
    isWalletConnected: false
}

export const getTweetList = () => async (dispatch: any) => {
    try {
        const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      dispatch(setTweetList(account.tweetList))
      dispatch(setTotalTweet(account.totalTweets))
    } catch (error) {
        console.log("Error creating BaseAccount account:", error)
    }    
}

export const createGifAccount = () => async () => {
    try {
      if(provider) {
        await program.rpc.startStuffOff({
            accounts: {
              baseAccount: baseAccount.publicKey,
              user: provider.wallet.publicKey,
              systemProgram: SystemProgram.programId,
            },
            signers: [baseAccount]
          });
          console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
      }
      
      
    } catch(error) {
      console.log("Error creating BaseAccount account:", error)
    }
  }
export const createTweet = (inputValue: TweetResponse) => async (dispatch: any) => {
    if (!inputValue) {
      console.log("Error, please input tweet and user name")
      return
    }

    try {
      await program.rpc.addTweet(inputValue, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("Tweet successfully sent to program", inputValue)

    } catch (error) {
      console.log("Error sending GIF:", error)
    }
  };

const tweetSlice = createSlice({
    name: 'tweet',
    initialState,
    reducers: {
        setTweetList: (state, { payload }: PayloadAction<Array<ITweetList>>) => {
            state.tweetList = payload
        },
        setTotalTweet: (state, { payload }: PayloadAction<Tweet>) => {
            state.totalTweets = payload
        },
        setIsWalletConnected: (state, { payload }: PayloadAction<boolean>) => {
            state.isWalletConnected = payload
        },
    }
})

export const { actions, reducer } = tweetSlice
export const { setTotalTweet, setTweetList, setIsWalletConnected } = actions;

export default reducer