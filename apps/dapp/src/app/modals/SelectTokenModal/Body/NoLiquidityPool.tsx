import Token from '@dapp/components/Token';
import { useSavedTokens } from '@dapp/context/SavedTokens';
import Localization from '@dapp/localization';
import { TokenInfo } from '@uniswap/token-lists';
import { delayMs } from '@xfai-labs/sdk';
import { Button } from '@xfai-labs/ui-components';
import { useNavigate } from 'react-router-dom';

const NoLiquidityPool = ({
  token,
  importing = false,
}: {
  token: TokenInfo & { hasPool?: boolean };
  importing?: boolean;
}) => {
  const navigate = useNavigate();
  const { addSavedToken: addToken } = useSavedTokens();
  return (
    <div className="flex flex-col items-center gap-5 py-10">
      <p className="px-10 text-center text-sm">{Localization.Message.TOKEN_DOES_NOT_HAVE_POOL}</p>
      <Token.View token={token} name />
      <Button
        size="xl"
        bgColor="bg-cyan hover:bg-cyan-dark"
        onClick={async () => {
          if (token.hasPool === false && !token.tags?.includes('imported')) {
            addToken(token);
            await delayMs(100);
          }
          navigate('/liquidity', {
            state: {
              token,
            },
          });
        }}
      >
        {!importing
          ? Localization.Button.CREATE_LIQUIDITY_POOL
          : Localization.Button.IMPORT_AND_CREATE_LIQUIDITY_POOL}
      </Button>
    </div>
  );
};

export default NoLiquidityPool;
