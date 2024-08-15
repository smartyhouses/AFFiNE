import { ArrowRightSmallPlusIcon } from '@blocksuite/icons/rc';
import { type MouseEvent, useCallback, useContext } from 'react';

import type { MenuSubProps } from '../menu.types';
import { useMenuItem } from '../use-menu-item';
import { MobileMenuContext } from './context';

export const MobileMenuSub = ({
  children: propsChildren,
  items,
  triggerOptions,
  subContentOptions: contentOptions = {},
}: MenuSubProps) => {
  const { setSubMenus } = useContext(MobileMenuContext);
  const {
    className,
    children,
    otherProps: { onClick, ...otherTriggerOptions },
  } = useMenuItem({
    ...triggerOptions,
    children: propsChildren,
    suffixIcon: <ArrowRightSmallPlusIcon />,
  });

  const onItemClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      setSubMenus(prev => [...prev, { items, contentOptions }]);
    },
    [contentOptions, items, onClick, setSubMenus]
  );

  return (
    <div onClick={onItemClick} className={className} {...otherTriggerOptions}>
      {children}
    </div>
  );
};
