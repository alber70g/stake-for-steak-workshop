import {
  ICommandBuilder,
  IPactCommand,
  signWithChainweaver,
} from '@kadena/client';
import { Pact } from '@kadena/client';

declare module '@kadena/client' {
  export type ICustomStakeForSteakCaps = {
    'stake-for-steak.GOVERNANCE': [];
    'stake-for-steak.STAKE_FOR_STEAK': [];
    'stake-for-steak.STAKER': [name: string, staker: string];
  };
  export type ICustomCoinCaps = {
    'coin.GOVERNANCE': [];
    'coin.GAS': [];
    'coin.COINBASE': [];
    'coin.GENESIS': [];
    'coin.REMEDIATE': [];
    'coin.DEBIT': [sender: string];
    'coin.CREDIT': [receiver: string];
    'coin.ROTATE': [account: string];
    'coin.TRANSFER': [sender: string, receiver: string, amount: number];
    'coin.TRANSFER_XCHAIN': [
      sender: string,
      receiver: string,
      amount: number,
      targetchain: string,
    ];
    'coin.TRANSFER_XCHAIN_RECD': [
      sender: string,
      receiver: string,
      amount: number,
      sourcechain: string,
    ];
    'coin.RELEASE_ALLOCATION': [account: string, amount: number];
  };
  export interface IPactModules {
    'free.stake-for-steak': {
      'stake-guard': (
        name: string,
        staker: string,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'create-stake-guard': (
        name: string,
        staker: string,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'create-stake': (
        name: string,
        merchant: string,
        owner: string,
        owner_guard: Function,
        stake: number,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'get-stake': (
        name: string,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'fund-stake': (
        name: string,
        staker: string,
        staker_guard: Function,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'install-refund-capabilities': (
        escrow: string,
        stakers: string,
        amount: number,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'install-refund-capability': (
        escrow: string,
        amount: number,
        staker: string,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      pay: (
        name: string,
        initiator: string,
        amount: number,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'get-stake-id': (
        stake: string,
        staker: string,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'get-staker': (
        name: string,
        staker: string,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'get-stakers': (
        name: string,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'refund-staker': (
        name: string,
        escrow_id: string,
        refund: number,
        staker: string,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'refund-staker-row': (
        staker_id: string,
        refund: number,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'refund-stake-row': (
        name: string,
        refund: number,
        staker: string,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'refund-stake': (
        name: string,
        initiator: string,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'get-refund': (
        balance: number,
        stakers: number,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      withdraw: (
        name: string,
        staker: string,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'get-left-over': (
        name: string,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'withdraw-staker': (
        stake_id: string,
        left_over: number,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
      'withdraw-stake': (
        name: string,
        staker: string,
      ) => ICommandBuilder<ICustomStakeForSteakCaps & ICustomCoinCaps> &
        IPactCommand;
    };
  }
}

// arbitrary string
const name: string = 'io-stake-for-lunch';
// account name of the merchant
const merchant: `k:${string}` =
  'k:e34b62cb48526f89e419dae4e918996d66582b5951361c98ee387665a94b7ad8';
// account name of the stake creator
const owner: `k:${string}` =
  'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
// statement that returns a guard (in this case we read the keyset from "data")
const owner_guard: () => `(read-keyset "${string}")` = () =>
  '(read-keyset "owner")';
// keyset data
const data: Record<string, unknown> = {
  owner: {
    // public key(s) of the "owner"
    keys: ['554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94'],
    pred: 'keys-all',
  },
};
// amount per person that's being staked
const stake: number = 3;

async function stakeForSteak(): Promise<void> {
  const transaction = Pact.modules['free.stake-for-steak']
    ['create-stake'](name, merchant, owner, owner_guard, stake)
    .addData(data)
    .addCap('coin.TRANSFER', owner, `${owner}-${name}`, )

  const res = await signWithChainweaver(transaction);
  console.log(res);
}

stakeForSteak().catch(console.error);
