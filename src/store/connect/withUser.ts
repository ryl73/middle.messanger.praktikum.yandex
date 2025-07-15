import connect from '@/store/connect/index.ts';
import cloneDeep from '@/utils/cloneDeep.ts';

const withUser = connect((state) => ({
	user: cloneDeep(state.user),
}));

export default withUser;
