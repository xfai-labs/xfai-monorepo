import { Link, LinkProps } from 'react-router-dom';
import Localization from '@dapp/localization';
import { SkeletonWrapper, SkeletonCover } from '@xfai-labs/ui-components';
import { motion } from 'framer-motion';
import cs from 'classnames';
import { INFT, getInftImage } from '@xfai-labs/sdk';
import { FunctionComponent, useState } from 'react';

type INFTThumbnailProps = {
  loading: boolean;
  inft?: INFT;
} & LinkProps;

const INFTGridThumbnail: FunctionComponent<INFTThumbnailProps> = ({
  loading,
  inft,
  className,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const isLoading = loading;

  const classNames = cs(
    'group/inft-thumbnail text-start bg-60 flex flex-col overflow-hidden rounded-lg transition-all duration-200 ease-in-out',
    'hover:bg-50 hover:scale-[1.04]',
    className,
  );

  return (
    <Link className={classNames} {...props}>
      <figure className="relative aspect-[15/17] w-full overflow-hidden">
        {(isLoading || !imageLoaded) && <SkeletonCover />}
        {!isLoading && inft && (
          <motion.img
            src={getInftImage(inft, 'md')}
            alt={`INFT #${inft.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ opacity: { delay: 0.05, duration: 0.2 } }}
            onLoad={(e) => setImageLoaded(e.currentTarget.complete)}
            className="scale-[1.01] object-cover transition-transform duration-200 ease-in-out group-hover/inft-thumbnail:scale-[1.05]"
          />
        )}
      </figure>
      <figcaption className="flex flex-col gap-[0.188rem] p-2.5 lg:p-5">
        <h4 className="text-5 text-base 2xl:text-xl">
          {(!isLoading || imageLoaded) && inft ? (
            <>
              {Localization.INFTs.Label.INFINITY_NFT}{' '}
              <span className="dark:text-white">#{inft.id}</span>
            </>
          ) : (
            <SkeletonWrapper>Default_Xfai</SkeletonWrapper>
          )}
        </h4>
      </figcaption>
    </Link>
  );
};

export default INFTGridThumbnail;
