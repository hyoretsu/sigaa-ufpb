import { BrowserRouter as Router } from 'react-router-dom';

import Fonts from './assets/fonts';
import Routes from './routes';
import GlobalStyle from './styles/global';
import './styles/custom.css';

const App: React.FC = () => (
 <>
  <Router>
   <Routes />
  </Router>
  <GlobalStyle />
  <Fonts />
 </>
);

export default App;
