import { Routes, Route } from 'react-router-dom';
import ListPage from './list';
import View from './view';
import ZeroNFTsPage from './zero-nfts';
import NotFound from '@dapp/pages/NotFound';
import RequireWallet from '@dapp/router/guards/RequireWallet';

const NFTRoutes = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <RequireWallet>
            <ListPage />
          </RequireWallet>
        }
      />
      <Route path="view/:inftId" element={<View />} />
      <Route path="zero" element={<ZeroNFTsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default NFTRoutes;
