import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { legacy_createStore } from "redux"
import { Provider } from "react-redux"
import Reducer from "./redux/reducer.js";

const appStore = legacy_createStore(Reducer);
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={appStore} >
      <App />
    </Provider>
  </BrowserRouter>,
)


