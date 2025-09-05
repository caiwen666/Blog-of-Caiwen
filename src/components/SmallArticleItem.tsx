import React from "react";
import { ButtonBase, Link, Paper } from "@mui/material";
import LazyLoad from "react-lazyload";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import classNames from "classnames";

export default function SmallArticleItem({
	title,
	id,
	img,
	className = "",
}: {
	title: string;
	id: string;
	img: string;
	className?: string;
}) {
	return (
		<Link
			href={`/post/${id}`}
			underline="none"
			className={classNames("h-full", className)}
		>
			<ButtonBase focusRipple className={"rounded h-full"}>
				<Paper
					className={
						"flex-none h-full w-56 bg-primary overflow-hidden relative rounded"
					}
					elevation={1}
				>
					<LazyLoad className={"w-full h-full"}>
						<div
							style={{ backgroundImage: `url('${img}')` }}
							className={"animate-fadeIn w-full h-full bg-cover bg-center"}
						></div>
					</LazyLoad>
					<div
						className={
							"absolute left-0 top-0 w-full h-full z-20 bg-black bg-opacity-30 hover:bg-opacity-40 transition"
						}
					>
						<div
							className={"text-white m-2 absolute left-0 bottom-0 text-start"}
						>
							{title}
						</div>
						<div className={"text-white m-1 absolute right-0 opacity-50"}>
							<ArrowForwardIcon fontSize={"small"} />
						</div>
					</div>
				</Paper>
			</ButtonBase>
		</Link>
	);
}
