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
- An Infura API key
- A WalletConnect Project ID

## Quick Start

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
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

## Configuring Your Token

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

## Deployment to Vercel

1. Push your code to a GitHub repository

2. Connect to Vercel:
   - Go to [Vercel](https://vercel.com)
   - Create a new project
   - Import your GitHub repository
   - Select Next.js as the framework

3. Configure environment variables:
   - In your Vercel project settings, add all the environment variables from your `.env` file
   - Make sure all variables are prefixed with `NEXT_PUBLIC_`

4. Deploy:
   - Vercel will automatically build and deploy your application
   - Each push to main will trigger a new deployment

## Customization

### Styling
- Update colors and styles in `app/globals.css`
- Modify component styles using Tailwind classes
- Theme configuration in `tailwind.config.js`

### Network Configuration
- Default network is Base
- To change networks, modify `app/config/wagmi.ts` and `app/config/rainbow.ts`
- Update `NEXT_PUBLIC_CHAIN_ID` in your environment variables

### UI Components
- Main staking components in `app/components/staking/`
- Shared UI components in `app/components/ui/`
- Layout components in `app/components/`

## Development Notes

### Contract Interactions
- All contract calls use Wagmi hooks
- Contract ABIs and addresses are configured in `app/config/contracts.ts`
- Custom hooks for contract interactions in `app/hooks/contracts/`

### State Management
- Uses React state and Wagmi for Web3 state
- Toast notifications for transaction status
- Loading states handled automatically

## Troubleshooting

Common issues and solutions:

1. **Connection Issues**
   - Ensure Infura API key is correct
   - Check WalletConnect Project ID
   - Verify network configuration

2. **Transaction Failures**
   - Check token approvals
   - Verify contract addresses
   - Ensure sufficient balance and gas

3. **Build Errors**
   - Clear `.next` directory
   - Update dependencies
   - Check Node.js version

## Support

For issues and feature requests, please open an issue in the GitHub repository.

## License

MIT License - see LICENSE file for details 