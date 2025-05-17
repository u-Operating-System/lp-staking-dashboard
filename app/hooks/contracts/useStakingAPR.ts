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

  // Get uOS balance in LP pool
  const { data: uOSInLP, isError: isUOSInLPError } = useReadContract({
    address: CONTRACTS.UOS_TOKEN,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [CONTRACTS.LP_TOKEN],
  });

  // Calculate APR
  const calculateAPR = () => {
    if (!rewardRate || !totalSupply || !lpTotalSupply || !uOSInLP) {
      return 0;
    }

    // First calculate APR per LP token staked
    const aprPerLPTokenStaked = (Number(rewardRate) / Number(totalSupply) * ONE_YEAR_IN_SECONDS * 100);
    
    // Then calculate APR per uOS provided in liquidity
    const aprPerUOSProvided = (aprPerLPTokenStaked * Number(lpTotalSupply)) / Number(uOSInLP);

    return aprPerUOSProvided;
  };

  const isLoading = !rewardRate || !totalSupply || !lpTotalSupply || !uOSInLP;
  const isError = isRewardRateError || isTotalSupplyError || isLpTotalSupplyError || isUOSInLPError;

  return {
    apr: calculateAPR(),
    isLoading,
    isError,
  };
}; 