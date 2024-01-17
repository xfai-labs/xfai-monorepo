import { TokenView } from './TokenView';
import useFiatValue from '@dapp/hooks/tokens/useFiatValue';
import { toggleAmount } from '@dapp/utils/formatting';
import BaseTokenProps from './BaseTokenProps';
import { FunctionComponent } from 'react';

export const TokenAmountBox: FunctionComponent<BaseTokenProps> = ({
  token,
  amount,
  amountFiat,
}) => {
  const fiatValue = useFiatValue(token);

  return (
    <div className="bg-60 flex items-center justify-between gap-4 rounded-lg px-3.5 py-2.5">
      <TokenView token={token} />
      <div className="flex flex-col items-end">
        {amount && token && (
          <span className="text-white-blue text-lg font-medium">{toggleAmount(amount, token)}</span>
        )}
        {amountFiat && (
          <span className="text-10 text-xs">
            {toggleAmount(fiatValue(amount), 'fiat', { prefix: '$' })}
          </span>
        )}
      </div>
    </div>
  );
};
