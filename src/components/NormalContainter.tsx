import React from "react";
import classNames from "classnames";

export default function NormalContainter({
	children,
	className = "",
}: Readonly<{
	children: React.ReactNode;
	className?: string;
}>) {
	return (
		<div
			className={classNames("max-w-screen-lg m-auto px-2 sm:px-6", className)}
		>
			{children}
		</div>
	);
}
