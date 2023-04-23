import clsx from 'clsx';
import { ForwardedRef, forwardRef } from 'react';
import Button from '../Button';
import { BaseButtonProps } from '../Button/Button';
import styles from './LoadingButton.module.css';
import Spinner from './Spinner';

const LoadingButton = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  BaseButtonProps & {
    loading?: boolean;
  }
>(({ children, loading, ...props }, ref) => {
  return (
    <Button
      {...props}
      ref={ref as ForwardedRef<HTMLButtonElement>}
      className={clsx(styles.button, props.className, {
        [styles.loading]: loading,
      })}
    >
      {loading && <Spinner />}
      {children}
    </Button>
  );
});

LoadingButton.displayName = 'LoadingButton';

export default LoadingButton;
