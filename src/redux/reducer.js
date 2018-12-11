const initialState = {
    appData: [],
    headings:[]
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'updateAppData':
        console.log('updateAppData',action.payload);
            return {
                ...state,
                appData: action.payload
            };
        case 'updateHeadings':
        console.log('updateHeadings',action.headings);
        
            return {
                ...state,
                headings: action.headings
            };
        default:
            return state;
    }
}

export default reducer;