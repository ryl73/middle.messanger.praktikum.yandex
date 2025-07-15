import connect from '@/store/connect/index.ts';
import cloneDeep from '@/utils/cloneDeep.ts';

const withChats = connect((state) => ({
	chats: cloneDeep(state.chats),
}));

export default withChats;
