import type { PageLoad } from '../$types';
import type { NoticeType } from '../../types/notice';

/** @type {import('./$types').PageLoad} */
export const load: PageLoad = async ({ params }) => {
	const fetchData = async () => {
		const res = await fetch('/notice.json').then((res) => res.json());
		return res;
	};

	return {
		notices: (await fetchData()) as NoticeType[]
	};
};
