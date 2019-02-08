import React, { Component } from 'react';
import Style from './productImage.scss';
import { connect } from 'react-redux';
import { setSelectedImageList } from '../lib/store';

class ProductImage extends Component {
    constructor(props) {
        super(props);
    }

    renderThumbnails() {
        const { ImageList } = this.props;
        const thumbImages = [];
        const maxImage = ImageList.length > 5 ? 5 : ImageList.length;
        for(let i = 0; i<maxImage; i++) {
            thumbImages.push((<img key={i} className={ImageList[i].selected ? `${Style.active}` : ''} src={ImageList[i].src} width="82" height="82" onClick={() => { this.setSelectedImageList(i) }} />));
        }
        return thumbImages;
    }

    setSelectedImageList(selectedIndex) {
        const { ImageList } = this.props;
        const newImageList = ImageList.map((item, itemIndex) => {
            return {
                src: item.src,
                selected: itemIndex === selectedIndex 
            }
        });
        this.props.setSelectedImage(newImageList);
    }

    render() {
        const selectedImage = this.props.ImageList.find(item => item.selected);
        return (
            <div className={Style.container}>
                <img src={selectedImage.src} alt="test" width="450" height="450" />
                <div className={Style.thumbnails}>
                    {this.renderThumbnails()}
                </div>
            </div>
        )
    }
}

function mapStateToProps (state) {
    const { ImageList } = state;
    return { ImageList };
}

function mapDispatchToProps (dispatch) {
    return {
        setSelectedImage: (data) => dispatch(setSelectedImageList(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductImage);