import { actions } from '../../actions/user/data';

function fetchingMeReducer (state, action) {
  let newState = {
    ...state
  };

  newState.fetching = action.payload;

  return newState;
}

function fetchingMeResultReducer (state, action) {
  let newState = {
    ...state,
    ...action.payload
  };

  return newState;
}

function changingPasswordReducer (state, action) {
  let newState = {
    ...state
  };

  newState.changingPassword = action.payload;

  return newState;
}

function fetchingGw2TokensReducer (state, action) {
  let newState = {
    ...state
  };

  newState.fetchingTokens = action.payload;

  return newState;
}

function fetchGw2TokensReducer (state, action) {
  let newState = {
    ...state
  };

  newState.gw2Tokens = action.payload;

  return newState;
}

function validatingGw2TokenReducer (state, action) {
  let newState = {
    ...state
  };

  newState.validatingGw2Token = action.payload;

  return newState;
}

function validateGw2TokenResultReducer (state, action) {
  let newState = {
    ...state
  };

  if (action.error) {
    newState.gw2TokenError = action.payload;
  } else {
    newState.gw2TokenError = undefined;
  }
    
  newState.validGw2Token = !action.error;

  return newState;
}

function addingGw2TokenReducer (state, action) {
  let newState = {
    ...state
  };

  newState.addingGw2Token = action.payload;

  return newState;
}

function addGw2TokenResultReducer (state, action) {
  let newState = {
    ...state
  };

  newState.gw2Tokens.push(action.payload);

  return newState;
}

function invalidateGw2Token (state) {
  let newState = {
    ...state
  };

  newState.validGw2Token = false;

  return newState;
}

function removeGw2Token (state, action) {
  let newState = {
    ...state
  };

  newState.gw2Tokens = newState.gw2Tokens.filter((token) => {
    return token.token != action.payload;
  });

  return newState;
}

function selectPrimaryTokenReducer (state, action) {
  const newState = {
    ...state,
  };

  newState.gw2Tokens = newState.gw2Tokens.map(token => {
     token.primary = token.token === action.payload;
     return token;
  });

  return newState;
}

export function dataReducer (state, action) {
  switch (action.type) {
    case actions.FETCHING_GW2_TOKENS:
      return fetchingGw2TokensReducer(state, action);

    case actions.FETCH_GW2_TOKEN_RESULT: 
      return fetchGw2TokensReducer(state, action);

    case actions.VALIDATING_GW2_TOKEN:
      return validatingGw2TokenReducer(state, action);

    case actions.VALIDATE_GW2_TOKEN_RESULT:
      return validateGw2TokenResultReducer(state, action);

    case actions.ADDING_GW2_TOKEN:
      return addingGw2TokenReducer(state, action);

    case actions.ADD_GW2_TOKEN_RESULT:
      return addGw2TokenResultReducer(state, action);

    case actions.INVALIDATE_GW2_TOKEN:
      return invalidateGw2Token(state);

    case actions.REMOVE_GW2_TOKEN:
      return removeGw2Token(state, action);

    case actions.FETCHING_ME_RESULT:
      return fetchingMeResultReducer(state, action);

    case actions.FETCHING_ME:
      return fetchingMeReducer(state, action);

    case actions.CHANGING_PASSWORD:
      return changingPasswordReducer(state, action);

    case actions.SELECT_PRIMARY_TOKEN:
      return selectPrimaryTokenReducer(state, action);

    default:
      return state;
  }
}