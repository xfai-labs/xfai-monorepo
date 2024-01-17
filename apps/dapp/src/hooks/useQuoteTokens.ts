import { useMutation } from '@tanstack/react-query';
import { Quote, QuoteBase, QuoteResult, quote } from '@xfai-labs/sdk';

const useQuoteTokens = <T extends QuoteBase>() => {
  return useMutation<QuoteResult<T>, Error, Quote<T>>({
    mutationKey: ['quoteTargetToSupplementary'] as const,
    mutationFn: async (vars) => quote(vars),
  });
};

export default useQuoteTokens;
