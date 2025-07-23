import type Block from '@/services/Block.ts';
import store, { StoreEvents } from '@/store/store.ts';
import type { Indexed } from '@/types/store.ts';
import isEqual from '@/utils/isEqual.ts';

function connect<Props extends Record<string, unknown>>(
	mapStateToProps: (state: Indexed) => Indexed
) {
	return function (Component: typeof Block<Props>) {
		return class extends Component {
			constructor(props: Props) {
				// сохраняем начальное состояние
				let state = mapStateToProps(store.getState());

				super({ ...props, ...state });

				// подписываемся на событие
				store.on(StoreEvents.Updated, () => {
					// при обновлении получаем новое состояние
					const newState = mapStateToProps(store.getState());

					// если что-то из используемых данных поменялось, обновляем компонент
					if (!isEqual(state, newState)) {
						this.setProps({ ...newState } as Props);
					}

					// не забываем сохранить новое состояние
					state = newState;
				});
			}
		};
	};
}

export default connect;
