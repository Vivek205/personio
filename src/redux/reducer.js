const initialState = {
    masterData:[],
    appData: [],
    headings: [],
    paginatedData:[]
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
        case 'updatePaginatedData':
            return{
                ...state,
                paginatedData:action.paginatedData
            }
        default:
            return state;
    }
}

export default reducer;