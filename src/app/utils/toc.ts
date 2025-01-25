import "client-only";
import { create } from "zustand/index";

export interface TOCItem {
	title: string;
	level: number;
	id: string;
	target: HTMLHeadingElement;
}

export default function generateTOC(container: HTMLDivElement): TOCItem[] {
	const headings = container.querySelectorAll(
		"h2, h3, h4",
	) as NodeListOf<HTMLHeadingElement>;
	const result: TOCItem[] = [];
	headings.forEach((heading) => {
		const item: TOCItem = {
			title: heading.textContent!,
			level: parseInt(heading.tagName[1]),
			id: heading.id,
			target: heading,
		};
		result.push(item);
	});
	return result;
}

export interface TocStore {
	hasToc: boolean;
	toc: TOCItem[];
	setToc: (toc: TOCItem[]) => void;
	currentAnchor: string;
	setCurrentAnchor: (anchor: string) => void;
}

export const useTocStore = create<TocStore>((set) => ({
	hasToc: false,
	toc: [],
	setToc: (toc: TOCItem[]) => set({ hasToc: true, toc }),
	currentAnchor: "",
	setCurrentAnchor: (anchor: string) => set({ currentAnchor: anchor }),
}));
