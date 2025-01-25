import React from "react";

export default function SearchHighlight({ text }: { text: string }) {
	const regex = /<em>(.*?)<\/em>/gi;
	const parts = [];
	let lastIndex = 0;
	let match;
	while ((match = regex.exec(text)) !== null) {
		const startIndex = match.index;
		const endIndex = regex.lastIndex;
		if (startIndex > lastIndex) {
			parts.push(text.slice(lastIndex, startIndex));
		}
		parts.push(
			<span key={startIndex} style={{ backgroundColor: "yellow" }}>
				{match[1]}
			</span>,
		);
		lastIndex = endIndex;
	}

	if (lastIndex < text.length) {
		parts.push(text.slice(lastIndex));
	}

	return <span>{parts}</span>;
}
