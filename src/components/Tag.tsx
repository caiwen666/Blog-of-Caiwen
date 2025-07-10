import React from "react";
import classNames from "classnames";

export default function Tag({
	color = "purple",
	className,
	text,
}: {
	color?: "purple" | "green";
	className?: string;
	text: string;
}) {
	return (
		<div
			className={classNames(
				className,
				`mdui-color-${color}`,
				"rounded-xl text-xs px-2 py-1",
			)}
		>
			{text}
		</div>
	);
}
