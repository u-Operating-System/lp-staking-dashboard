import { StatsOverview } from '../components/staking/StatsOverview';
import { StakeCard } from '../components/staking/StakeCard';
import { UnstakeCard } from '../components/staking/UnstakeCard';
import { ConnectButton } from '../components/shared/ConnectButton';
import { LPStakingOverview } from '../components/staking/LPStakingOverview';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">TOKEN LP Staking</h1>
            <ConnectButton />
          </div>

          <StatsOverview />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <StakeCard />
            <UnstakeCard />
          </div>

          <LPStakingOverview />
        </div>
      </main>
    </div>
  );
} 