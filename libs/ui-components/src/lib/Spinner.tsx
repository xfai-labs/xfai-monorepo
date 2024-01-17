import cs from 'classnames';
import { HTMLProps, FunctionComponent } from 'react';

type Props = {
  round?: boolean;
  spinnerClassName?: string;
  spinnerRoundChildClassName?: string;
} & HTMLProps<HTMLDivElement>;

const Spinner: FunctionComponent<Props> = ({
  round,
  spinnerClassName,
  spinnerRoundChildClassName,
  className,
  ...props
}) => {
  const spinnerClassNames = cs(
    spinnerClassName,
    'relative my-4 mx-auto h-12 w-12 text-white animate-spinner-rotate',
    'before:bg-cyan before:absolute before:top-1/2 before:left-1/2 before:h-1/2 before:w-1/2 before:rounded-full before:scale-50 before:-translate-x-full before:-translate-y-full before:animate-spinner-circle-rotate',
    'after:bg-magenta after:absolute after:top-1/2 after:left-1/2 after:h-1/2 after:w-1/2 after:rounded-full after:scale-50 after:animate-spinner-circle-rotate',
  );

  const spinnerRoundChildClassNames = cs(
    spinnerRoundChildClassName,
    'border-l-magenta absolute block h-full w-full rounded-full border-4 border-transparent',
    'animate-spinner-round',
  );

  return (
    <div
      className={cs(round ? 'spinner-round relative m-1 h-9 w-9' : spinnerClassNames, className)}
      {...props}
    >
      {round && (
        <>
          <span className={spinnerRoundChildClassNames}></span>
          <span className={cs(spinnerRoundChildClassNames, 'animation-delay-150')}></span>
          <span className={cs(spinnerRoundChildClassNames, 'animation-delay-300')}></span>
          <span className={cs(spinnerRoundChildClassNames, 'animation-delay-450')}></span>
        </>
      )}
    </div>
  );
};

export default Spinner;
