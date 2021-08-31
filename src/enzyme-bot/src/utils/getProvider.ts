import { providers } from 'ethers';
// import { loadEnv } from './loadEnv';

export function getProvider(network: 'MAINNET' | 'KOVAN') {
  // console.log('network = ', network);
  // const node = loadEnv(`${network}_NODE_ENDPOINT`)
  // const node = loadEnv(`KOVAN_NODE_ENDPOINT`)
  const node = 'https://kovan.infura.io/v3/9c05243b35e9493ca08d65a1b74b7d4b';
  return new providers.JsonRpcProvider(node, network.toLowerCase());
}
