import Localization from '@dapp/localization';

const TokenNotFound = () => {
  return (
    <div className="flex h-full w-full grow items-center justify-center p-10 text-center">
      <p className="text-sm">{Localization.Message.INCORRECT_TOKEN_ADDRESS}</p>
    </div>
  );
};

export default TokenNotFound;
