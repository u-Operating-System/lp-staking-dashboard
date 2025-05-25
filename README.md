# Liquidity Staking Program

A Next.js application for staking LP tokens and earning rewards. This application uses:
- Next.js 13+ (App Router)
- RainbowKit & Wagmi for Web3 integration
- Tailwind CSS for styling
- Base Network support

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- A Vercel account for deployment
- An Infura API key ([Get one here](https://infura.io))
- A WalletConnect Project ID ([Get one here](https://cloud.walletconnect.com))

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/u-Operating-System/lp-staking-dashboard.git
cd lp-staking-dashboard
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory:
```env
# Required: Your token contract address
NEXT_PUBLIC_TOKEN_ADDRESS=0x...

# Required: Your LP token contract address
NEXT_PUBLIC_LP_TOKEN_ADDRESS=0x...

# Required: Your staking rewards contract address
NEXT_PUBLIC_STAKING_REWARDS_ADDRESS=0x...

# Required: Infura API key for Base network
NEXT_PUBLIC_INFURA_API_KEY=your_infura_key

# Required: WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Optional: Chain ID (defaults to Base: 8453)
NEXT_PUBLIC_CHAIN_ID=8453
```

4. Run the development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` to see your application.

## Contract Requirements

1. Update the environment variables with your contract addresses:
   - `NEXT_PUBLIC_TOKEN_ADDRESS`: Your ERC20 token contract
   - `NEXT_PUBLIC_LP_TOKEN_ADDRESS`: Your LP token contract (e.g., Uniswap V2 pair)
   - `NEXT_PUBLIC_STAKING_REWARDS_ADDRESS`: Your staking rewards contract

2. The contracts must implement the following interfaces:
   - Token & LP Token: Standard ERC20 interface
   - Staking Rewards: Standard staking rewards interface with the following methods:
     - `stake(uint256 amount)`
     - `withdraw(uint256 amount)`
     - `getReward()`
     - `exit()`
     - View functions: `balanceOf`, `earned`, `rewardRate`, etc.

2. **Staking Rewards Contract**
   Required functions:
   ```solidity
   // Core staking functions
   function stake(uint256 amount) external;
   function withdraw(uint256 amount) external;
   function getReward() external;
   function exit() external;
   
   // View functions
   function balanceOf(address account) external view returns (uint256);
   function earned(address account) external view returns (uint256);
   function rewardRate() external view returns (uint256);
   function totalSupply() external view returns (uint256);
   ```

## Deployment Guide

### 1. Prepare Your Environment
- Ensure all your contracts are deployed
- Have your Infura API key ready
- Have your WalletConnect Project ID ready

### 2. Deploy to Vercel
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. Connect to Vercel:
   - Visit [Vercel](https://vercel.com)
   - Create a new project
   - Import your GitHub repository
   - Select Next.js as the framework

3. Configure environment variables:
   - Go to Settings > Environment Variables
   - Add all variables from your `.env` file
   - Ensure all variables are prefixed with `NEXT_PUBLIC_`

4. Deploy:
   - Click "Deploy"
   - Vercel will automatically build and deploy your application
   - Each push to main will trigger a new deployment

## Customization

### 1. Styling
- Update colors and styles in `app/globals.css`
- Modify component styles using Tailwind classes
- Theme configuration in `tailwind.config.js`
- Replace logos and images in `public/`

### 2. Network Configuration
- Default network is Base
- To change networks:
  1. Modify `app/config/wagmi.ts`
  2. Update `app/config/rainbow.ts`
  3. Update `NEXT_PUBLIC_CHAIN_ID` in your environment variables

### 3. UI Components
- Main staking components in `app/components/staking/`
- Shared UI components in `app/components/ui/`
- Layout components in `app/components/`

## Development Notes

### Contract Interactions
- All contract calls use Wagmi hooks for reliability
- Contract ABIs and addresses are configured in `app/config/contracts.ts`
- Custom hooks for contract interactions in `app/hooks/contracts/`

### State Management
- Uses React state and Wagmi for Web3 state
- Toast notifications for transaction status
- Loading states handled automatically

## Troubleshooting

### Connection Issues
- Ensure Infura API key is correct and has access to Base Network
- Check WalletConnect Project ID is valid
- Verify network configuration matches your deployed contracts

### Transaction Failures
- Check token approvals are set correctly
- Verify contract addresses match your deployed contracts
- Ensure sufficient balance and gas for transactions
- Check contract interfaces match the requirements

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Update dependencies: `pnpm install`
- Ensure Node.js version is 18+: `node --version`

## Support & Contributing

- For issues and feature requests, please [open an issue](https://github.com/u-Operating-System/lp-staking-dashboard/issues)
- Pull requests are welcome
- Join our [Discord](https://discord.gg/your-discord) for community support

## License

MIT License - see [LICENSE](LICENSE) file for details 