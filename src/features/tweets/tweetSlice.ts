import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store';
import kp from '../../keypair.json'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)


var idl = require('../../idl.json')
// const idl = JSON.parse(
//   fs.readFileSync("./idl.json", "utf8")
// );
// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

const getProvider = () => {
    const connection = new Connection(network, {commitment: "processed"});
    const provider = new Provider(
      connection, window.solana, {commitment: "processed"},
    );
    return provider;
  }

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



export const createGifAccount = () => async (dispatch: any) => {
    const provider = getProvider();
      const program = new Program(idl, programID, provider);
    const baseAccount = web3.Keypair.fromSecretKey(secret)
    console.log("this is base account...", baseAccount.publicKey)
    console.log("this is provider account...", provider.wallet)
    try {
      
      console.log("ping")
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
      
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      dispatch(setTweetList(account.tweetList))
      dispatch(setTotalTweet(account.totalTweets))
    } catch(error) {
      console.log("Error creating BaseAccount account:", error)
    }
  }
export const createTweet = (inputValue: TweetResponse) => async (dispatch: any) => {
    const provider = getProvider();
      const program = new Program(idl, programID, provider);
    const baseAccount = web3.Keypair.fromSecretKey(secret)
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
      console.log("GIF successfully sent to program", inputValue)
  
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      dispatch(setTweetList(account.tweetList))
      dispatch(setTotalTweet(account.totalTweets))
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