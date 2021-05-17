import {
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 lazy,
 Suspense,
} from 'react';
import { Switch, Route } from 'react-router-dom';

import Error from '../pages/Error';
import Loading from '../pages/Loading';

const Routes: React.FC = () => (
 <Suspense fallback={Loading}>
  <Switch>
   <Route component={Error} />
  </Switch>
 </Suspense>
);

export default Routes;
