import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { useStakingRewards } from '@/hooks/contracts/useStakingRewards';
import { useStakingAPR } from '@/hooks/contracts/useStakingAPR';
import { useTokenBalance } from '@/hooks/contracts/useTokenBalance';
import { useToast } from '@/providers/ToastProvider';
import { CONTRACTS } from '@/config/contracts';

export const LPStakingOverview = () => {
  const { address } = useAccount();
  const { showToast } = useToast();
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const lpButtonRef = useRef(null);

  useEffect(() => {
    if (lpButtonRef.current) {
      const button = lpButtonRef.current;
      const styles = window.getComputedStyle(button);
      console.log('LP Button computed styles:', {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        // Add any other properties you want to check
      });
    }
  }, []);

  const {
    stakedBalance,
    earned,
    totalLPInStaking,
    handleStake,
    handleWithdraw,
    handleGetReward,
    handleApprove,
    isStaking,
    isWithdrawing,
    isClaiming,
    remainingDays
  } = useStakingRewards();

  const { balance: lpBalance } = useTokenBalance(CONTRACTS.LP_TOKEN);
  const { apr, isLoading: isLoadingAPR } = useStakingAPR();

  const handleStakeMax = () => {
    setStakeAmount(lpBalance);
  };

  const handleUnstakeMax = () => {
    setUnstakeAmount(stakedBalance);
  };

  const handleStakeSubmit = async () => {
    try {
      await handleStake(stakeAmount);
      showToast('Successfully staked LP tokens', 'success');
      setStakeAmount('');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to stake LP tokens',
        'error'
      );
    }
  };

  const handleWithdrawSubmit = async () => {
    try {
      await handleWithdraw(unstakeAmount);
      showToast('Successfully unstaked LP tokens', 'success');
      setUnstakeAmount('');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to unstake LP tokens',
        'error'
      );
    }
  };

  const handleClaimSubmit = async () => {
    try {
      await handleGetReward();
      showToast('Successfully claimed rewards', 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to claim rewards',
        'error'
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-gray-900">TOKEN LP Staking</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-500">Base</span>
          </div>
          <span className="text-sm text-gray-500">
            {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'Not Connected'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-purple-600">Total LP Tokens Staked</h3>
          <p className="text-2xl font-medium text-gray-900 mt-2">{totalLPInStaking}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-purple-600">Your Earned $TOKEN Rewards</h3>
          <p className="text-2xl font-medium text-gray-900 mt-2">{earned}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-purple-600">Current APR</h3>
          <p className="text-2xl font-medium text-gray-900 mt-2">
            {isLoadingAPR ? 'Loading...' : `${Number(apr).toFixed(2)}%`}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stake Section */}
        <Card className="p-6">
          <h3 className="text-xl font-medium text-purple-600 mb-6">Stake</h3>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-2xl font-medium text-gray-900">{lpBalance}</p>
              <div className="text-sm text-gray-500">
                <p>Wallet Balance</p>
                <p>LP Token</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-2xl font-medium text-gray-900">{remainingDays}</p>
              <div className="text-sm text-gray-500">
                <p>Rewards Period</p>
                <p>Days Remaining</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Amount of LP Token to stake"
                className="flex-1"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                type="number"
                min="0"
                step="0.000001"
              />
              <Button variant="secondary" size="sm" onClick={handleStakeMax}>max</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                ref={lpButtonRef}
                variant="primary"
                onClick={handleApprove}
                disabled={!stakeAmount || !address}
                style={{ color: 'black' }}
                className="lp-token-button-text"
              >
                {!address ? 'Connect Wallet' : 'Approve LP Token'}
              </Button>
              <Button 
                variant="secondary" 
                disabled={!stakeAmount || isStaking || !address}
              >
                Stake LP Tokens
              </Button>
            </div>
          </div>
        </Card>

        {/* Unstake Section */}
        <Card className="p-6">
          <h3 className="text-xl font-medium text-purple-600 mb-6">Unstake</h3>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-2xl font-medium text-gray-900">{stakedBalance}</p>
              <div className="text-sm text-gray-500">
                <p>Staked</p>
                <p>LP Token</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-2xl font-medium text-gray-900">{earned}</p>
              <div className="text-sm text-gray-500">
                <p>Claimable Rewards</p>
                <p>$TOKEN</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Amount of LP Token to unstake"
                className="flex-1"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                type="number"
                min="0"
                step="0.000001"
              />
              <Button variant="secondary" size="sm" onClick={handleUnstakeMax}>max</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="primary"
                onClick={handleClaimSubmit}
                isLoading={isClaiming}
                disabled={Number(earned) === 0 || isClaiming || !address}
              >
                {!address ? 'Connect Wallet' : 'Claim Rewards'}
              </Button>
              <Button 
                variant="secondary"
                onClick={handleWithdrawSubmit}
                isLoading={isWithdrawing}
                disabled={!unstakeAmount || isWithdrawing || !address}
              >
                Unstake LP Tokens
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}; 