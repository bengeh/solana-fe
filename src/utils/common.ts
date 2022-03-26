import kp from '../keypair.json';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';

// SystemProgram is a reference to the Solana runtime!
export const { SystemProgram, Keypair } = web3;

const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)


var idl = require('../idl.json')
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

export const provider = getProvider();
export const program = new Program(idl, programID, provider);
export const baseAccount = web3.Keypair.fromSecretKey(secret)