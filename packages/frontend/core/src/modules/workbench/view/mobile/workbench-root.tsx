import { useLiveData, useService } from '@toeverything/infra';
import { useEffect } from 'react';
import type { createMemoryRouter } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { WorkbenchService } from '../../services/workbench';
import { useBindWorkbenchToBrowserRouter } from '../browser-adapter';
import { ViewIslandRegistryProvider } from '../view-islands';
import { ViewRoot } from '../view-root';

export const MobileWorkbenchRoot = ({
  router,
}: {
  router: ReturnType<typeof createMemoryRouter>;
}) => {
  const workbench = useService(WorkbenchService).workbench;

  // for debugging
  (window as any).workbench = workbench;

  const views = useLiveData(workbench.views$);

  const location = useLocation();
  const basename = location.pathname.match(/\/workspace\/[^/]+/g)?.[0] ?? '/';

  useBindWorkbenchToBrowserRouter(workbench, basename);

  useEffect(() => {
    workbench.updateBasename(basename);
  }, [basename, workbench]);

  return (
    <ViewIslandRegistryProvider>
      <ViewRoot router={router} view={views[0]} />
    </ViewIslandRegistryProvider>
  );
};
