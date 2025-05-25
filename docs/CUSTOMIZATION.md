# Customization Guide

This document provides detailed instructions on how to customize the Liquidity Incentive Program for your own token.

## Required Assets and API Keys

Before you start, make sure you have:

1. **Contract Addresses**
   - Your ERC20 token contract address
   - Your LP token contract address
   - Your staking rewards contract address

2. **API Keys**
   - Infura API key for Base network access
   - WalletConnect Project ID

3. **Assets**
   - `favicon.ico` and `favicon.png` for your website
   - Any custom images or logos you want to use

## Environment Setup

1. Create a `.env` file in the root directory:
```env
# Contract Addresses
NEXT_PUBLIC_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_LP_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_STAKING_REWARDS_ADDRESS=0x...

# API Keys
NEXT_PUBLIC_INFURA_API_KEY=your_infura_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=8453  # Base Network
```

## Network Configuration

### Base Network (Default)
The application is configured to use Base network by default. The configuration is in:
- `app/config/wagmi.ts`
- `app/config/rainbow.ts`

To use a different network:
1. Update the chain configuration in both files
2. Update the RPC URLs
3. Change `NEXT_PUBLIC_CHAIN_ID` in your environment variables

## UI Customization

### 1. Theme Colors
Modify `tailwind.config.js` to match your brand colors:

```javascript
theme: {
  extend: {
    colors: {
      background: "#121212",
      foreground: "#FFFFFF",
      primary: {
        DEFAULT: "your-primary-color",
        foreground: "your-primary-foreground-color",
      },
      // Add more colors as needed
    },
  },
}
```

### 2. Component Styling
Key files for styling customization:
- `app/globals.css` - Global styles
- `app/styles/fonts.css` - Font configuration
- Individual component files in `app/components/`

### 3. Layout and Content
Main files to customize:
- `app/layout.tsx` - Main layout and metadata
- `app/page.tsx` - Landing page content
- `app/components/Header.tsx` - Navigation header
- `app/components/BottomNavigation.tsx` - Footer navigation

## Contract Integration

### Required Contract Functions

1. **Token & LP Token (ERC20)**
   - `balanceOf(address)`
   - `approve(address, uint256)`
   - `transfer(address, uint256)`
   - `transferFrom(address, address, uint256)`
   - `allowance(address, address)`

2. **Staking Rewards Contract**
   - `stake(uint256)`
   - `withdraw(uint256)`
   - `getReward()`
   - `exit()`
   - View functions:
     - `balanceOf(address)`
     - `earned(address)`
     - `rewardRate()`
     - `totalSupply()`

### Contract Configuration
Contract ABIs and addresses are configured in `app/config/contracts.ts`

## Vercel Deployment

1. **Environment Variables**
   Add all variables from your `.env` file to your Vercel project:
   - Go to Project Settings > Environment Variables
   - Add each variable (all should start with `NEXT_PUBLIC_`)

2. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

3. **Domain Configuration**
   - Set up a custom domain if needed
   - Configure SSL/TLS settings

## Testing Your Customization

1. **Local Testing**
```bash
pnpm dev
```

2. **Production Build Test**
```bash
pnpm build
pnpm start
```

3. **Key Areas to Test**
   - Contract interactions
   - Wallet connections
   - Transaction flows
   - Responsive design
   - Network switching
   - Error handling

## Troubleshooting

### Common Issues

1. **Contract Interaction Failures**
   - Verify contract addresses
   - Check ABI compatibility
   - Ensure proper network configuration

2. **Styling Issues**
   - Clear `.next` cache
   - Rebuild Tailwind classes
   - Check browser console for errors

3. **Build Failures**
   - Verify all environment variables
   - Check Node.js version
   - Clear dependency cache

### Getting Help
- Check the GitHub repository issues
- Review the contract documentation
- Consult Base network documentation 