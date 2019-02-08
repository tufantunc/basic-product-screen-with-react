import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import productData from '../product-data.json';

let AllImages = [];
productData.productVariants.forEach(item => {
    AllImages = [...new Set(AllImages.concat(...item.images))];
});

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

const initialState = {
    ProductData: productData,
    ImageList: createImageObjectList(AllImages, 0)
};

export const actionTypes = {
    SELECTIMAGE: 'SELECTIMAGE'
}

// Reducers
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SELECTIMAGE:
            return Object.assign({}, state, {
                ImageList: action.ImageList
            });
        default:
            return state;
    }
}

// Actions
export const setSelectedImageList = (ImageList) => dispatch => {
    return dispatch({ type: actionTypes.SELECTIMAGE, ImageList: ImageList });
}

export function initializeStore (initialState = initialState) {
    return createStore(
        reducer,
        initialState,
        composeWithDevTools(applyMiddleware(thunkMiddleware))
    )
}