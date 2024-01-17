import useFiatValue from '@dapp/hooks/tokens/useFiatValue';
import { toggleAmount } from '@dapp/utils/formatting';
import { FunctionComponent } from 'react';
import { TokenSelect, TokenSelectProps } from './TokenSelect';

export const TokenSelectAmountBox: FunctionComponent<TokenSelectProps> = ({
  amount,
  amountFiat,
  token,
  ...props
}) => {
  const fiatValue = useFiatValue(token);
  return (
    <div className="bg-60 flex items-center justify-between gap-4 rounded-lg py-2.5 pl-2.5 pr-3.5">
      <TokenSelect {...props} token={token} />
      <div className="flex flex-col items-end">
        <span className="text-white-blue text-lg font-medium">{toggleAmount(amount, token)}</span>
        {amountFiat && (
          <span className="text-10 text-xs">
            {toggleAmount(fiatValue(amount), 'fiat', { prefix: '$' })}
          </span>
        )}
      </div>
    </div>
  );
};
