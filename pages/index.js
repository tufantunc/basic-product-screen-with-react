import React, { Component } from 'react';
import ProductImage from '../components/productImage';
import ProductInfo from '../components/productInfo';
import Style from './style.scss';

class Home extends Component {
  render() {
    return(
      <div className={Style.container}>
        <ProductImage />
        <ProductInfo />
      </div>
    );
  }
}

export default Home;