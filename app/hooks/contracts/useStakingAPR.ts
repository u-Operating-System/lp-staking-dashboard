'use client';

import { useReadContract } from 'wagmi';
import { CONTRACTS, STAKING_REWARDS_ABI, ERC20_ABI } from '../../config/contracts';

const ONE_YEAR_IN_SECONDS = 31_556_952;

export const useStakingAPR = () => {
  // Get reward rate from staking contract
  const { data: rewardRate, isError: isRewardRateError } = useReadContract({
    address: CONTRACTS.STAKING_REWARDS,
    abi: STAKING_REWARDS_ABI,
    functionName: 'rewardRate',
  });

  // Get total staked LP tokens
  const { data: totalSupply, isError: isTotalSupplyError } = useReadContract({
    address: CONTRACTS.STAKING_REWARDS,
    abi: STAKING_REWARDS_ABI,
    functionName: 'totalSupply',
  });

  // Get total LP tokens in existence
  const { data: lpTotalSupply, isError: isLpTotalSupplyError } = useReadContract({
    address: CONTRACTS.LP_TOKEN,
    abi: ERC20_ABI,
    functionName: 'totalSupply',
  });

  // Get token balance in LP pool
  const { data: tokenInLP, isError: isTokenInLPError } = useReadContract({
    address: CONTRACTS.TOKEN,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [CONTRACTS.LP_TOKEN],
  });

  // Calculate APR
  const calculateAPR = () => {
    if (!rewardRate || !totalSupply || !lpTotalSupply || !tokenInLP) {
      return 0;
    }

    // First calculate APR per LP token staked
    const aprPerLPTokenStaked = (Number(rewardRate) / Number(totalSupply) * ONE_YEAR_IN_SECONDS * 100);
    
    // Then calculate APR per token provided in liquidity
    const aprPerTokenProvided = (aprPerLPTokenStaked * Number(lpTotalSupply)) / Number(tokenInLP);

    return aprPerTokenProvided;
  };

  const isLoading = !rewardRate || !totalSupply || !lpTotalSupply || !tokenInLP;
  const isError = isRewardRateError || isTotalSupplyError || isLpTotalSupplyError || isTokenInLPError;

  return {
    apr: calculateAPR(),
    isLoading,
    isError,
  };
}; 