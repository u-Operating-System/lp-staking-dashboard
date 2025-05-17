// Remove the import from typechain-types

// Default mock addresses for local development
const DEFAULT_MOCK_ADDRESS = '0x0000000000000000000000000000000000000000';

// Get contract addresses from environment or use mock values
const uosTokenAddress = process.env.NEXT_PUBLIC_UOS_TOKEN_ADDRESS || DEFAULT_MOCK_ADDRESS;
const lpTokenAddress = process.env.NEXT_PUBLIC_LP_TOKEN_ADDRESS || DEFAULT_MOCK_ADDRESS;
const stakingRewardsAddress = process.env.NEXT_PUBLIC_STAKING_REWARDS_ADDRESS || DEFAULT_MOCK_ADDRESS;

// Log warning for development mode
if (!process.env.NEXT_PUBLIC_UOS_TOKEN_ADDRESS || 
    !process.env.NEXT_PUBLIC_LP_TOKEN_ADDRESS || 
    !process.env.NEXT_PUBLIC_STAKING_REWARDS_ADDRESS) {
  console.warn('Running in development mode with mock contract addresses. Set environment variables for production use.');
}

export const CONTRACTS = {
  UOS_TOKEN: uosTokenAddress as `0x${string}`,
  LP_TOKEN: lpTokenAddress as `0x${string}`,
  STAKING_REWARDS: stakingRewardsAddress as `0x${string}`
} as const;

export const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
] as const;

export type StakingRewardsContract = {
  totalSupply: () => Promise<bigint>;
  balanceOf: (account: string) => Promise<bigint>;
  earned: (account: string) => Promise<bigint>;
  rewardRate: () => Promise<bigint>;
  rewardsDuration: () => Promise<bigint>;
  getRewardForDuration: () => Promise<bigint>;
  lastTimeRewardApplicable: () => Promise<bigint>;
  rewardPerToken: () => Promise<bigint>;
  periodFinish: () => Promise<bigint>;
};

export const STAKING_REWARDS_ABI = [
  // View Functions
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "earned",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardRate",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardsDuration",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "periodFinish",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRewardForDuration",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastTimeRewardApplicable",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardPerToken",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Transaction Functions
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "exit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "Staked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "reward", type: "uint256" },
    ],
    name: "RewardPaid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "reward", type: "uint256" }],
    name: "RewardAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "newDuration", type: "uint256" }],
    name: "RewardsDurationUpdated",
    type: "event",
  },
] as const;

export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) : 11155111; // Sepolia chain ID 