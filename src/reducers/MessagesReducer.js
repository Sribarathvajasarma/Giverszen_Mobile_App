export const initialState = {
    isLoading: true,
    Messages: [],
    Conversations: []
}

export const reducer = (state, { type, payload }) => {
    switch (type) {
        case 'START_LOADING':
            return {
                ...state,
                isLoading: true
            }
        case "COVERSATIONS_INIT":
            return {
                Conversations: payload,
                Messages: [],
                isLoading: false,
            }
    }
}