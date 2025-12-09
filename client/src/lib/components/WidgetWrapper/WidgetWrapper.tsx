import React, { PropsWithChildren, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/card';
import styles from './WidgetWrapper.module.scss';
import classNames from 'classnames';

type WidgetWrapperProps = {
  children: ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
};

export const WidgetWrapper: React.FC<PropsWithChildren<WidgetWrapperProps>> = ({
  children,
  title,
  className,
  onClick,
}) => {
  return (
    <Card className={classNames(styles.widgetWrapper, className)} onClick={onClick}>
      {!!title && (
        <CardHeader className={styles.wrapperHeader}>
          <CardTitle className={styles.wrapperTitle}>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={styles.widgetContent}>{children}</CardContent>
    </Card>
  );
};
