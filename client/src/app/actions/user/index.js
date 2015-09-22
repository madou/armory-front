'use strict';

import * as validator from './validators';
import * as register from './register';
import * as auth from './auth';
import * as data from './data';

export const actions = {
	...validator.actions,
	...register.actions,
	...auth.actions,
	...data.actions
};

export const actionCreators = {
	...validator.actionCreators,
	...register.actionCreators,
	...auth.actionCreators,
	...data.actionCreators
};