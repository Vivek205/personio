const initialState = {
    masterData:[],
    appData: [],
    headings: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'updateMasterData':
            return {
                ...state,
                masterData: action.payload
            };
        case 'updateAppData':
            return {
                ...state,
                appData: action.payload
            };
        case 'updateHeadings':

            return {
                ...state,
                headings: action.headings
            };
        default:
            return state;
    }
}

export default reducer;