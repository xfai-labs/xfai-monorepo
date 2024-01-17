import { Button, Spinner } from '@xfai-labs/ui-components';
import Localization from '@dapp/localization';
import useUnknownToken from '@dapp/hooks/tokens/useUnknownToken';
import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import NoLiquidityPool from './NoLiquidityPool';
import { useSavedTokens } from '@dapp/context/SavedTokens';
import Token from '@dapp/components/Token';
import { TokenInfo } from '@uniswap/token-lists';
type Props = {
  tokenOrAddress: string | TokenInfo;
  needsLiquidityPool?: boolean;
};

const UnknownToken = ({ tokenOrAddress, needsLiquidityPool }: Props) => {
  const { token, isLoading, exists } = useUnknownToken(tokenOrAddress);
  const { addSavedToken: addToken } = useSavedTokens();
  const { showImportToken } = useGlobalModalContext();

  return (
    <div className="flex h-full w-full grow flex-col items-center justify-center gap-5">
      {isLoading ? (
        <Spinner />
      ) : token && exists ? (
        token.hasPool || needsLiquidityPool === false ? (
          <>
            <p className="text-xs">{Localization.Message.TOKEN_NOT_ON_XFAI}</p>
            <Token.View token={token} name />
            <Button
              size="xl"
              bgColor="bg-cyan hover:bg-cyan-dark"
              onClick={() => {
                showImportToken({
                  token: token,
                  onConfirm: ({ hideImportTokenModal }) => {
                    addToken(token);
                    hideImportTokenModal();
                  },
                });
              }}
            >
              {Localization.Button.IMPORT_TOKEN}
            </Button>
          </>
        ) : (
          <NoLiquidityPool token={token!} importing={!token.tags?.includes('imported')} />
        )
      ) : (
        <p className="text-center">{Localization.Message.INCORRECT_TOKEN_ADDRESS}</p>
      )}
    </div>
  );
};

export default UnknownToken;
