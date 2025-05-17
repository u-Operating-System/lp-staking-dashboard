# Customization Guide

This document provides a step-by-step guide on how to customize the Liquidity Incentive Program dashboard for your own token.

## Required Assets

Before you start, make sure you have the following assets prepared:

1. **Token Logo** - Create and add the following files to the `public` directory:
   - `favicon.ico` - Website favicon (recommended size: 32x32px)
   - `logo-white.svg` - White version of your logo for the header
   - Any other logo variations you might need

## Placeholder Replacements

The application uses placeholder values that need to be replaced with your own:

### 1. Token Details

Throughout the application, replace:
- `TOKEN` - Your token name
- `$TOKEN` - Your token ticker with $ prefix

### 2. Smart Contract Addresses (in .env.local)

Create a `.env.local` file in the root directory and set these variables:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_TOKEN_TOKEN_ADDRESS=your_token_contract_address
NEXT_PUBLIC_LP_TOKEN_ADDRESS=your_lp_token_address
NEXT_PUBLIC_STAKING_REWARDS_ADDRESS=your_staking_rewards_address
```

### 3. Community Links

In `app/components/BottomNavigation.tsx`, update these placeholder URLs:

```javascript
// Social media URLs
href="https://twitter.com/your-handle"
href="https://medium.com/@your-handle"
href="https://warpcast.com/your-handle"
href="https://discord.gg/your-invite-code"
href="https://t.me/your-community"

// Documentation and GitHub
href="https://docs.example.com"
href="https://github.com/your-org/your-repo"
```

### 4. DEX Integration

In `app/components/BottomNavigation.tsx` and in `app/page.tsx`, update the swap/add liquidity links:

```javascript
// Example from BottomNavigation.tsx
href="https://app.example.com/swap"

// Example from page.tsx (Add Liquidity button)
href="https://aerodrome.finance/deposit?token0=0x4200000000000000000000000000000000000006&token1=YOUR_TOKEN_ADDRESS_HERE&type=-1&chain=8453&factory=0x420DD381b31aEf6683db6B902084cB0FFECe40Da"
```

## Additional Customization

### Theme Colors

You can modify the theme colors in `tailwind.config.ts` to match your brand:

```typescript
theme: {
  extend: {
    colors: {
      background: "#121212",
      foreground: "#FFFFFF",
      border: "hsl(var(--border))",
      primary: {
        DEFAULT: "your-primary-color",
        foreground: "your-primary-foreground-color",
      },
      // Add more color customizations as needed
    },
  },
}
```

### Application Settings

Update these files to configure application metadata:

1. `package.json` - Update name and version
2. `public/manifest.json` - Update name, description, and theme colors

## Deployment

Once you've completed the customizations:

1. Build the application:
```bash
npm run build
```

2. Deploy to your hosting provider of choice (Vercel, Netlify, etc.)

## Troubleshooting

If you encounter issues with your customizations:

1. Check browser console for errors
2. Ensure all environment variables are properly set
3. Confirm all contract addresses are valid
4. Make sure your logo files are in the correct format and location 