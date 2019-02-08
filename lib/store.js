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
    SelectedVariant: null,
    ImageList: createImageObjectList(AllImages, 0)
};

export const actionTypes = {
    SELECTVARIANT: 'SELECTVARIANT',
    SELECTIMAGE: 'SELECTIMAGE'
}

// Reducers
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SELECTVARIANT:
            return Object.assign({}, state, {
                SelectedVariant: action.SelectedVariant
            });
        case actionTypes.SELECTIMAGE:
            return Object.assign({}, state, {
                ImageList: action.ImageList
            });
        // case actionTypes.ADDBREADCRUMB:
        //     const newAddArray = state.breadCrumb.slice();
        //     newAddArray.push(action.breadCrumbItem);
        //     return Object.assign({}, state, {
        //         breadCrumb: newAddArray
        //     });
        // case actionTypes.REMOVEBREADCRUMB:
        //     const newRemovedArray = state.breadCrumb.filter((item,index) => index !== action.breadCrumbIndex);
        //     return Object.assign({}, state, {
        //         breadCrumb: newRemovedArray
        //     });
        default:
            return state;
    }
}

// Actions
export const setSelectedAttr = (SelectedVariant) => dispatch => {
    return dispatch({ type: actionTypes.SELECTVARIANT, SelectedVariant: SelectedVariant });
}
export const setSelectedImageList = (ImageList) => dispatch => {
    return dispatch({ type: actionTypes.SELECTIMAGE, ImageList: ImageList });
}
// export const addBreadcrumbItem = (breadCrumbItem) => dispatch => {
//     return dispatch({ type: actionTypes.ADDBREADCRUMB, breadCrumbItem: breadCrumbItem });
// }
// export const removeBreadcrumbItem = (breadCrumbIndex) => dispatch => {
//     return dispatch({ type: actionTypes.REMOVEBREADCRUMB, breadCrumbIndex: breadCrumbIndex });
// }

export function initializeStore (initialState = initialState) {
    return createStore(
        reducer,
        initialState,
        composeWithDevTools(applyMiddleware(thunkMiddleware))
    )
}