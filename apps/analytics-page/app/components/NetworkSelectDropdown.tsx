import DropdownRC from 'rc-dropdown';
import ButtonNetwork from './ButtonNetwork';
import { DropdownList, DropdownItem, Spinner } from '@xfai-labs/ui-components';
import { FunctionComponent, useState } from 'react';
import Networks from '@analytics/config/networks';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

const Loading = () => <div className="inset-0 flex items-center justify-center bg-black "></div>;
const DropdownNetworkSelect: FunctionComponent = () => {
  const path = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  return (
    <DropdownRC
      trigger={['click']}
      placement="bottom"
      onVisibleChange={(visible) => {
        if (path && visible) {
          const otherNetwork = Networks.map((n) => n.analyticsURL).find((n) => path.includes(n));
          if (otherNetwork) {
            router.prefetch(otherNetwork);
          }
        }
      }}
      minOverlayWidthMatchTrigger={true}
      overlay={
        <DropdownList checkMark>
          {Networks.map((network) => (
            <DropdownItem
              key={network.name}
              iconURL={network.iconURL}
              selected={path?.includes(network.analyticsURL)}
              onClick={async () => {
                setIsLoading(true);
                await router.replace(network.analyticsURL);
                setIsLoading(false);
              }}
            >
              {network.name}
            </DropdownItem>
          ))}
        </DropdownList>
      }
      prefixCls="dropdown"
    >
      <ButtonNetwork
        dropdown
        icon={isLoading ? <Spinner className={'!my-0 !h-5 !w-5'} /> : undefined}
      />
    </DropdownRC>
  );
};

export default DropdownNetworkSelect;
