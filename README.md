# TOKEN LP Staking Dashboard

A minimalist, user-friendly dashboard for staking TOKEN-WETH LP tokens on Base network. Rewards are manually distributed from the treasury on a weekly basis.

## Features

- Stake and unstake LP tokens
- Claim staking rewards
- Real-time APR display
- Wallet connection with RainbowKit
- Responsive design with TOKEN theme

## Smart Contract Development

### Prerequisites
- Node.js v18+
- npm or yarn
- A Base network RPC URL
- A Base network private key for deployment
- A Basescan API key for contract verification

### Environment Setup
Create a `.env` file in the root directory with:
```env
BASE_RPC_URL=your_base_rpc_url
PRIVATE_KEY=your_deployment_private_key
BASESCAN_API_KEY=your_basescan_api_key
```

### Contract Development
1. Install dependencies:
```bash
npm install
```

2. Compile contracts:
```bash
npx hardhat compile
```

3. Run tests:
```bash
npx hardhat test
```

4. Deploy contracts:
```bash
npx hardhat run scripts/deploy.ts --network base
```

5. Verify contracts:
```bash
npx hardhat verify --network base [CONTRACT_ADDRESS]
```

### Contract Structure
- `contracts/StakingRewards.sol`: Main staking contract
- `contracts/interfaces/IStakingRewards.sol`: Contract interface
- `contracts/test/`: Test files

### Frontend Integration
The frontend is already set up to work with the contracts. After deployment:
1. Update `.env.local` with the deployed contract addresses
2. The frontend will automatically use the new contracts

## Frontend Development

### Prerequisites
- Node.js v18+
- npm or yarn
- A WalletConnect Project ID

### Environment Setup
Create a `.env.local` file with:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_TOKEN_TOKEN_ADDRESS=deployed_token_token_address
NEXT_PUBLIC_LP_TOKEN_ADDRESS=deployed_lp_token_address
NEXT_PUBLIC_STAKING_REWARDS_ADDRESS=deployed_staking_rewards_address
```

### Development
1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure
```
token-finance/
├── app/                   # Frontend application
├── contracts/             # Smart contracts
├── scripts/               # Deployment scripts
└── typechain-types/       # Generated contract types
```

## Contributing
1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License
MIT 