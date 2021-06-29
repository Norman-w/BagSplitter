import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import BagSplitter from './BagSplitter';


ReactDOM.render(
  <React.StrictMode>
    <BagSplitter />
  </React.StrictMode>,
  document.getElementById('root')
);

if(module.hot)
{
    module.hot.accept();
}
