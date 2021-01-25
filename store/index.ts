import { getAccessorType } from 'typed-vuex';

// Import store modules here
import * as submodule from '@/store/submodule';

export const storePattern = {
	modules: {
		submodule,
	},
};

export const accessorType = getAccessorType(storePattern);
