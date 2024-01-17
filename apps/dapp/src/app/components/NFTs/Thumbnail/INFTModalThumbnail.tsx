import { useState, forwardRef, HTMLAttributes } from 'react';
import Localization from '@dapp/localization';
import { SkeletonWrapper, SkeletonCover } from '@xfai-labs/ui-components';
import cs from 'classnames';
import { motion } from 'framer-motion';
import { INFT, getInftImage } from '@xfai-labs/sdk';

type INFTThumbnailProps = {
  loading?: boolean;
  size?: 'medium' | 'large';
  inft?: INFT;
} & HTMLAttributes<HTMLDivElement>;

const INFTModalThumbnail = forwardRef<HTMLDivElement, INFTThumbnailProps>(
  ({ loading = false, size = 'large', inft, className, ...props }, ref) => {
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const isLoading = loading;

    const classNames = cs('text-start bg-60 flex w-full p-2.5 rounded-lg', className);

    return (
      <div className={classNames} ref={ref} {...props}>
        <figure
          className={cs(
            'relative aspect-[15/17] overflow-hidden rounded-md',
            size === 'large' ? 'w-28' : 'w-24',
          )}
        >
          {!isLoading && inft ? (
            <img
              src={getInftImage(inft, 'md')}
              onLoad={() => setImageLoaded(true)}
              alt={`INFT #${inft.id}`}
              className="object-cover"
            />
          ) : (
            <SkeletonCover />
          )}
        </figure>
        <figcaption className="flex grow flex-col justify-center gap-[0.188rem] p-2.5 lg:p-5">
          <h6 className="text-white-blue text-base lg:text-xl">
            {!isLoading && inft ? (
              <>
                {Localization.INFTs.Label.INFINITY_NFT} #{inft.id}
              </>
            ) : (
              <SkeletonWrapper>{Localization.INFTs.Label.INFINITY_NFT} 10</SkeletonWrapper>
            )}
          </h6>
        </figcaption>
      </div>
    );
  },
);

const INFTModalThumbnailMotion = motion(INFTModalThumbnail);
export default INFTModalThumbnailMotion;
