const initialState = {
  isLoading: true,
  withdraws: [],
};

export const withdrawReducer = (state = initialState, action) => {
  switch (action.type) {
    // get all withdraw requests for admin
    case 'getAllWithdrawRequestsRequest':
      return {
        ...state,
        isLoading: true,
      };
    case 'getAllWithdrawRequestsSuccess':
      return {
        ...state,
        isLoading: false,
        withdraws: action.payload || [],
      };
    case 'getAllWithdrawRequestsFailed':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    // get all withdraw requests for seller (if needed)
    case 'getSellerWithdrawRequestsRequest':
      return {
        ...state,
        isLoading: true,
      };
    case 'getSellerWithdrawRequestsSuccess':
      return {
        ...state,
        isLoading: false,
        withdraws: action.payload || [],
      };
    case 'getSellerWithdrawRequestsFailed':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
