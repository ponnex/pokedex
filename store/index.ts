import { getAccessorType } from 'typed-vuex';

// Import store modules here
import * as pokemon from '@/store/pokemon';

export const storePattern = {
	modules: {
		pokemon,
	},
};

export const accessorType = getAccessorType(storePattern);
