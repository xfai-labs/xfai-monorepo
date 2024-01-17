import { Routes, Route } from 'react-router-dom';
import AddLiquidityPage from './Add';
import ManageLiquidity from './Manage';
import NotFound from '@dapp/pages/NotFound';
import RequireWallet from '@dapp/router/guards/RequireWallet';

const LiquidityRoute = () => {
  return (
    <Routes>
      <Route index element={<AddLiquidityPage />} />
      <Route
        path="manage"
        element={
          <RequireWallet>
            <ManageLiquidity />
          </RequireWallet>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default LiquidityRoute;
