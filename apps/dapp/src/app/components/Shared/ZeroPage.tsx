import { FunctionComponent, HTMLAttributes, HTMLProps } from 'react';
import AppPage from '@dapp/components/Shared/PageLayout/AppPage';
import cs from 'classnames';

type Props = {
  image: HTMLProps<HTMLImageElement> & Required<Pick<HTMLProps<HTMLImageElement>, 'alt' | 'src'>>;
};

const ZeroPage: FunctionComponent<HTMLAttributes<HTMLDivElement> & Props> = ({
  image: { alt, src, ...otherImageProps },
  className,
  children,
}) => {
  return (
    <AppPage
      className={cs(
        'flex h-full flex-col content-center justify-center !gap-7 sm:!gap-10 lg:flex-row',
        className,
      )}
    >
      <div className="w-11/12 sm:w-10/12 md:w-7/12 lg:w-1/2 xl:w-5/12">
        <img src={src} alt={alt} {...otherImageProps} />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-5 sm:w-10/12 md:w-8/12 lg:w-1/2 lg:gap-7 xl:w-5/12">
        {children}
      </div>
    </AppPage>
  );
};

export default ZeroPage;
