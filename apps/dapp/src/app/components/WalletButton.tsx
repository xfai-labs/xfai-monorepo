import { Button, IconWallet, SkeletonWrapper } from '@xfai-labs/ui-components';
import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import useChain from '@dapp/hooks/chain/useChain';
import { useConnectWallet } from '@web3-onboard/react';
import cs from 'classnames';
import { useMemo, HTMLProps, FunctionComponent } from 'react';
import Localization from '@dapp/localization';

const shortenAddress = (address: string) => {
  if (!address) return undefined;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatBalance = (balance: string, precision = 4) => {
  // Keep only 4 digits after the decimal place
  const [whole, decimal] = balance.split('.');
  return !decimal ? whole : `${whole}.${decimal.slice(0, precision).replace(/0+$/, '')}`;
};

type Props = { contentButton?: boolean } & Omit<HTMLProps<HTMLButtonElement>, 'onClick' | 'type'>;

const WalletButton: FunctionComponent<Props> = ({ contentButton = false, className, ...props }) => {
  const { showModal } = useGlobalModalContext();
  const [{ wallet }, connectWallet] = useConnectWallet();
  const chain = useChain();
  const baseClassNames = cs(
    'group/wallet-button',
    'relative inline-flex items-center justify-center gap-1.75 lg:gap-2 pr-3 lg:-mr-1.5',
    'rounded-lg border-none outline-none',
    'whitespace-nowrap text-sm font-medium',
    'transition-colors cursor-pointer',
    'after:absolute after:right-0 after:block after:h-3.5 after:w-3.5 after:translate-x-1/2 after:content-[""]',
    'after:border-90 after:bg-50 after:rounded-full after:border-2',
    'after:transition-transform',
    'hover:bg-magenta-dark hover:after:scale-[0.8]',
    className,
  );

  const disconnectedClassNames = cs(
    'bg-magenta fill-white text-white',
    'p-1.75 pr-3.5 lg:p-2 lg:pr-3.5',
  );

  const account = useMemo(
    () => wallet?.accounts[0],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wallet?.accounts[0]?.balance, wallet?.accounts[0]?.address, wallet],
  );
  if (!wallet || !account || !chain) {
    if (contentButton) {
      return (
        <Button type="submit" size="xl" onClick={() => connectWallet()}>
          {Localization.Connect.Button.CONNECT_WALLET}
        </Button>
      );
    } else {
      return (
        <button
          className={cs(disconnectedClassNames, baseClassNames)}
          onClick={() => connectWallet()}
          {...props}
        >
          <IconWallet className="h-5 w-5" />
          <span className="!leading-none">{Localization.Connect.Button.CONNECT_WALLET}</span>
        </button>
      );
    }
  }

  const connectedClassNames = cs(
    'text-white-blue bg-70 p-1.75 after:bg-cyan',
    'hover:!bg-60 hover:after:bg-cyan-dark',
  );

  return (
    <button
      className={cs(connectedClassNames, baseClassNames)}
      onClick={() => showModal('WalletInfo')}
      {...props}
    >
      {wallet.icon && (
        <span
          className="h-5 w-5 [&>*]:h-5 [&>*]:w-5"
          dangerouslySetInnerHTML={{ __html: wallet.icon }}
        ></span>
      )}
      <span className="hidden !leading-none lg:block">
        {account.balance && account.balance[chain.nativeToken.symbol] ? (
          `${formatBalance(account.balance[chain.nativeToken.symbol])} ${chain.nativeToken.symbol}`
        ) : (
          <SkeletonWrapper>0.0000 ETH</SkeletonWrapper>
        )}
      </span>
      <span className="lg:text-10 lg:bg-60 lg:group-hover/wallet-button:bg-50 lg:p-1.75 block !leading-none transition-colors lg:rounded-[0.25rem] lg:text-xs lg:font-normal">
        {shortenAddress(account.address)}
      </span>
    </button>
  );
};

export default WalletButton;
