import Localization from '@dapp/localization';
import MainConfig from '@dapp/config/MainConfig';
import cs from 'classnames';
import { ReactNode } from 'react';

type Props = {
  title: string;
  highlightedColor?: string;
  normalCase?: boolean;
  highlightedNormalCase?: boolean;
  description?: string;
  mobileDescription?: boolean;
  children?: ReactNode;
  highlightedWords?: string[];
  breakAfterWord?: string[];
  className?: string;
};

export default function PageTitle({
  title,
  highlightedWords = [' '],
  highlightedColor = 'text-magenta',
  normalCase = false,
  highlightedNormalCase = false,
  breakAfterWord = [' '],
  className,
  description,
  mobileDescription = false,
  children,
}: Props) {
  const highlightedRegex = new RegExp(`(${highlightedWords.join('|')})`, 'gi');
  const breakRegex = new RegExp(`(${breakAfterWord.join('|')})`, 'gi');
  const titleParts = title.toString().split(' ');

  const titleElement = (
    <h1
      className={cs(
        'text-2xl leading-none lg:text-3xl xl:text-4xl 2xl:text-[2.25rem]',
        !normalCase && 'uppercase',
        className,
      )}
    >
      {titleParts.map((part, index) =>
        part.match(highlightedRegex) ? (
          <span
            key={index}
            className={cs(highlightedColor, { 'normal-case': highlightedNormalCase || normalCase })}
          >
            {part}
            {part.match(breakRegex) ? <br /> : ' '}
          </span>
        ) : (
          <span key={index}>
            {part} {part.match(breakRegex) ? <br /> : ' '}
          </span>
        ),
      )}
    </h1>
  );

  return (
    <div className="flex flex-col gap-0.5 text-center">
      <div className="flex flex-col gap-0.5 2xl:gap-1 ">
        <span className="text-cyan hidden text-xs 2xl:block">
          {Localization.Label.VERSION} {MainConfig.SITE_VERSION}
        </span>
        {titleElement}
      </div>
      {(description || children) && (
        <div className="text-xsm flex flex-col items-center gap-0 xl:text-sm">
          <p className={cs(!mobileDescription && 'hidden 2xl:block')}>{description}</p>
          {children}
        </div>
      )}
    </div>
  );
}
