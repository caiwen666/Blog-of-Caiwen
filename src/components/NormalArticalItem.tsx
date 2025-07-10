import React from "react";
import {
	Card,
	CardActionArea,
	CardContent,
	Link,
	Typography,
} from "@mui/material";
import LazyLoad from "react-lazyload";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";

export default function NormalArticalItem({
	title,
	id,
	summary,
	date,
	img,
}: {
	title: string;
	id: string;
	summary: string;
	date: Date;
	img: string;
}) {
	return (
		<Card>
			<Link href={`/post/${id}`} underline="none">
				<CardActionArea>
					<div className={"bg-primary h-48"}>
						<LazyLoad className={"w-full h-full"}>
							<div
								style={{ backgroundImage: `url('${img}')` }}
								className={"animate-fadeIn w-full h-full bg-cover bg-center"}
							></div>
						</LazyLoad>
					</div>
					<CardContent className={"flex flex-col h-36"}>
						<div
							className={
								"text-xl flex-none text-wrap truncate text-black text-opacity-70"
							}
						>
							{title}
						</div>
						<Typography
							variant="body2"
							sx={{ color: "text.secondary" }}
							className={"flex-1 text-wrap truncate min-h-0 w-full"}
						>
							{summary}
						</Typography>
						<div
							className={
								"flex-none mt-auto text-sm opacity-60 flex items-center pt-1 text-black"
							}
						>
							<AccessTimeIcon fontSize={"inherit"} />
							<span className={"ml-1"}>{dayjs(date).format("YYYY-MM-DD")}</span>
						</div>
					</CardContent>
				</CardActionArea>
			</Link>
		</Card>
	);
}
