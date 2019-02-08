import React, { Component } from 'react';
import Style from './productInfo.scss';
import { connect } from 'react-redux';
import formatCurrency from 'format-currency';
import Head from 'next/head';
import { setSelectedImageList } from '../lib/store';

const formatOption = {format: '%v %c', code: 'TL', locale: 'tr-TR'};

function createImageObjectList(imageList, selectedIndex) {
    const imageObjectList = [];
    imageList.forEach((item,index) => {
        imageObjectList.push({
            src: item,
            selected: index === selectedIndex,
        });
    });
    return imageObjectList;
}

class ProductInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedAttrs: {},
            enabledAttrs: [],
            baremIndex: null,
            quantity: 0,
            totalPrice: 0,
        };
    }

    getPriceRange() {
        const {baremList} = this.props.ProductData;
        const maxPrice = baremList[0].minimumQuantity * baremList[0].price;
        const minPrice = baremList[baremList.length - 1].minimumQuantity * baremList[baremList.length - 1].price;

        const maxPriceMoney = formatCurrency(maxPrice, formatOption);
        const minPriceMoney = formatCurrency(minPrice, formatOption);

        return `${maxPriceMoney} - ${minPriceMoney}`;
    }

    prepareWholePriceList() {
        const {baremList} = this.props.ProductData;
        return baremList.map((item,index) => {
            const maxQuantity = item.maximumQuantity > 2000 ? '2000+' : item.maximumQuantity;
            return (<div key={`barem_${index}`} className={`${Style.wholePrice} ${this.state.baremIndex === index ? Style.selected : ''}`}>{item.minimumQuantity}-{maxQuantity}<br/>{formatCurrency(item.price, formatOption)}</div>);
        });
    }

    selectAttr(name, mainIndex, value) {
        const attr = this.state.selectedAttrs;
        attr[name] = value;

        if(mainIndex === 0) {
            Object.keys(attr).forEach((key, index) => {
                if(index !== 0) {
                    delete attr[key];
                }
            });
        }

        if(mainIndex === 0) {
            const {productVariants} = this.props.ProductData;
            const enabledAttrs = productVariants.filter(item => {
                return item.attributes.find(item => item.name === name && item.value === value);
            });
            this.setState({
                selectedAttrs: attr,
                enabledAttrs
            });
        } else {
            this.setState({
                selectedAttrs: attr
            });
            this.updateImageList();
        }
    }

    updateImageList() {
        const {selectedAttrs} = this.state;
        const variant = this.props.ProductData.productVariants.filter(item => item.attributes.filter(item => selectedAttrs[item.name] === item.value).length > 1);
        if(variant.length > 0) {
            let imageList = [];
            variant.forEach(item => {
                imageList = [...new Set(imageList.concat(...item.images))];
            });
            this.props.setSelectedImage(createImageObjectList(imageList, 0));
        }
    }

    prepareAttrList() {
        const {selectableAttributes} = this.props.ProductData;
        return selectableAttributes.map((item,index) => {
            return (<div className={Style.attrSelection} key={`attr_${index}`}>
                <div className={Style.attrTitle}>{item.name}</div>
                <div className={Style.attrList}>
                    {
                        item.values.map((valueItem, valueIndex) => {
                            const mainName = item.name;
                            const isSelected = valueItem === this.state.selectedAttrs[item.name];
                            const isDisabled = index !== 0 && this.state.enabledAttrs
                                .filter(item => {
                                    return item.attributes.find(item => item.name === mainName && item.value === valueItem);
                                }).length === 0;
                            return (<button className={`${Style.attrBtn} ${isSelected ? Style.selected : ''}`} key={`attrBtn_${valueIndex}`}
                                onClick={() => {this.selectAttr(item.name, index, valueItem)}} disabled={isDisabled}>{valueItem}</button>);
                        })
                    }
                </div>
            </div>);
        });
    }

    setQuantity(target) {
        let value = target.value.match(/\d+/g);
        if(!value || value.length < 1) {
            value = [0];
        }
        target.value = Number(value[0]);

        this.setState({
            quantity: Number(value[0])
        }, () => {
            const {baremList} = this.props.ProductData;
            let baremIndex = -1;
            let totalPrice = 0;
            for(let i = 0; i<baremList.length; i++) {
                if(this.state.quantity >= baremList[i].minimumQuantity && this.state.quantity <= baremList[i].maximumQuantity) {
                    baremIndex = i;
                }
            }
            if(baremIndex > -1) {
                totalPrice = Number(value[0]) * this.props.ProductData.baremList[baremIndex].price;
            }
            this.setState({
                baremIndex,
                totalPrice
            });
        });
    }

    render() {
        const Product = this.props.ProductData;
        return (
            <div className={Style.container}>
                <Head>
                    <title>{Product.productTitle}</title>
                </Head>
                <h1 className={Style.title}>{Product.productTitle}</h1>

                <div className={Style.rating}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" className={Style.active}>
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" className={Style.active}>
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" className={Style.active}>
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" className={Style.active}>
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" className={Style.active}>
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                    </svg>
                </div>
                <div className={Style.commentCount}>
                    23 Yorum
                </div>

                <div className={Style.wholeSaleInfo}>
                    <h2 className={Style.priceRange}>{this.getPriceRange()} <span className={Style.subText}>/ Adet</span></h2>
                    <p className={Style.subText}>{Product.baremList[0].minimumQuantity} Adet (Minimum Sipariş Adedi)</p>
                </div>
                {this.prepareAttrList()}

                <div className={Style.priceContainer}>
                    <div className={Style.attrTitle}>Toptan Fiyat<br/>(Adet)</div>
                    <div className={Style.attrList}>
                        {this.prepareWholePriceList()}
                    </div>
                    <div className={Style.attrTitle}>Adet</div>
                    <div className={Style.quantityForm}>
                        <div>
                            <input className={Style.quantity} type="number" defaultValue="100" onChange={(e) => { this.setQuantity(e.target); }} /> Adet
                        </div>
                        <div className={Style.stock}>Stok Adedi: <strong>500</strong></div>
                    </div>
                </div>

                <div className={Style.totalPriceContainer}>
                    <div className={Style.attrTitle}><strong>Toplam</strong></div>
                    <div className={Style.attrList}>
                        <div className={Style.totalPrice}>{formatCurrency(this.state.totalPrice, formatOption)}</div>
                        <div className={Style.cargoInfo}>
                            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                                <path d="M3 18h-2c-.552 0-1-.448-1-1v-13c0-.552.448-1 1-1h13c.552 0 1 .448 1 1v2h4.667c1.117 0 1.6.576 1.936 1.107.594.94 1.536 2.432 2.109 3.378.188.312.288.67.288 1.035v4.48c0 1.089-.743 2-2 2h-1c0 1.656-1.344 3-3 3s-3-1.344-3-3h-6c0 1.656-1.344 3-3 3s-3-1.344-3-3zm3-1.2c.662 0 1.2.538 1.2 1.2 0 .662-.538 1.2-1.2 1.2-.662 0-1.2-.538-1.2-1.2 0-.662.538-1.2 1.2-1.2zm12 0c.662 0 1.2.538 1.2 1.2 0 .662-.538 1.2-1.2 1.2-.662 0-1.2-.538-1.2-1.2 0-.662.538-1.2 1.2-1.2zm-3-2.8h-13v2h1.765c.549-.614 1.347-1 2.235-1 .888 0 1.686.386 2.235 1h7.53c.549-.614 1.347-1 2.235-1 .888 0 1.686.386 2.235 1h1.765v-4.575l-1.711-2.929c-.179-.307-.508-.496-.863-.496h-4.426v6zm-2-9h-11v7h11v-7zm3 4v3h5l-1.427-2.496c-.178-.312-.509-.504-.868-.504h-2.705z"/>
                            </svg>
                            Kargo Ücreti: <a className={Style.cargoPrice} href="#">Alıcı Öder</a>
                        </div>
                    </div>
                </div>

                <div className={Style.addCartContainer}>
                    <button className={Style.addCart}
                        disabled={!(this.state.baremIndex !== null && this.state.totalPrice && Object.keys(this.state.selectedAttrs).length>1)}
                        onClick={() => {console.log({Quantity: this.state.quantity, Attr: this.state.selectedAttrs, Barem: this.props.ProductData.baremList[this.state.baremIndex], totalPrice: formatCurrency(this.state.totalPrice, formatOption)})}}>SEPETE EKLE</button>
                    <a href="#" className={Style.paymentOptions}>Ödeme Seçenekleri</a>
                </div>
            </div>
        );
    }
}

function mapStateToProps (state) {
    const { ProductData, ImageList } = state;
    return { ProductData, ImageList };
}

function mapDispatchToProps (dispatch) {
    return {
        setSelectedImage: (data) => dispatch(setSelectedImageList(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductInfo);