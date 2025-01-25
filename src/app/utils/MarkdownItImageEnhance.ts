import MarkdownIt from "markdown-it";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Token } from "markdown-it/lib/token";
import { getSrcPath } from "@/app/utils/index";

export default function MarkdownItImageEnhance(md: MarkdownIt) {
	const regex = /^\{[^}]*\}/;
	md.renderer.rules.image = (tokens: Token[], idx: number): string => {
		const token = tokens[idx];

		const src: string = getSrcPath(token.attrGet("src").trim());

		const alt = token.content.trim();
		const match = alt.match(regex);

		let scale: number = 1;
		let title = alt;

		if (match) {
			title = alt.slice(match[0].length).trim();
			const configs = match[0]
				.replace(/^\{/, "")
				.replace(/\}$/, "")
				.split(",")
				.map((item: string) => {
					const kv = item.split(":");
					if (kv.length !== 2) {
						return;
					}
					const [key, value] = kv;
					return { key: key.trim(), value: value.trim() };
				});
			for (const config of configs) {
				if (config.key === "scale") {
					scale = parseFloat(config.value);
				}
			}
		}
		return `<div class="img-box"><img class="lazy" data-src="${src}" style="transform: scale(${scale})"><div class="img-title">${title}</div></div>`;
	};
}
