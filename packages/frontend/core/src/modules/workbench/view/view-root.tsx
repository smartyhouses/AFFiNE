import { FrameworkScope, useLiveData } from '@toeverything/infra';
import { useLayoutEffect } from 'react';
import type { createMemoryRouter } from 'react-router-dom';
import {
  RouterProvider,
  UNSAFE_LocationContext,
  UNSAFE_RouteContext,
} from 'react-router-dom';

import type { View } from '../entities/view';

export const ViewRoot = ({
  view,
  router,
}: {
  view: View;
  router: ReturnType<typeof createMemoryRouter>;
}) => {
  // const viewRouter = useMemo(() => createMemoryRouter(warpedRoutes), []);

  const location = useLiveData(view.location$);

  useLayoutEffect(() => {
    router.navigate(location).catch(err => {
      console.error('navigate error', err);
    });
  }, [location, view, router]);

  // https://github.com/remix-run/react-router/issues/7375#issuecomment-975431736
  return (
    <FrameworkScope scope={view.scope}>
      <UNSAFE_LocationContext.Provider value={null as any}>
        <UNSAFE_RouteContext.Provider
          value={{
            outlet: null,
            matches: [],
            isDataRoute: false,
          }}
        >
          <RouterProvider router={router} />
        </UNSAFE_RouteContext.Provider>
      </UNSAFE_LocationContext.Provider>
    </FrameworkScope>
  );
};
