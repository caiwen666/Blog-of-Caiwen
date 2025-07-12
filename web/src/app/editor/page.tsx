"use client";

import React, { useEffect, useRef, useState } from "react";
import { Link, Paper } from "@mui/material";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import IconButton from "@mui/material/IconButton";
import classNames from "classnames";
import "@/config/markdown.css";
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItContainer from "markdown-it-container";
import MarkdownItImageEnhance from "@/utils/MarkdownItImageEnhance";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItKatex from "@vscode/markdown-it-katex";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import slugify from "@sindresorhus/slugify";
import pinyin from "pinyin";
import generateTOC, { TOCItem } from "@/utils/toc";

const DEBOUNCE_TIME = 100;

let timer: NodeJS.Timeout;

// 使用import导入会有bug，需要使用require https://github.com/markdown-it/markdown-it/issues/1082
// eslint-disable-next-line @typescript-eslint/no-require-imports
const markdownit = require("markdown-it");
const md = markdownit({
	html: true,
	linkify: true,
	highlight: function (str: string, lang: string) {
		let formattedCode;
		let language;
		if (lang && hljs.getLanguage(lang)) {
			formattedCode = hljs.highlight(str, {
				language: lang,
				ignoreIllegals: true,
			}).value;
			language = lang;
		} else {
			formattedCode = md.utils.escapeHtml(str);
			language = "Unknown";
		}

		const codeLines = str.split("\n");
		let lineDivs = "";
		codeLines.forEach((_, index) => {
			if (_ === "" && index === codeLines.length - 1) return;
			lineDivs += `<div>${index + 1}</div>`;
		});

		return `<pre><div class="head"><div class="language">${language}</div><div class="copy" data="${btoa(encodeURIComponent(str))}"><svg focusable="false" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"></path></svg></div></div><code class="hljs"><div class="lines">${lineDivs}</div><div class="code">${formattedCode}</div></code></pre>`;
	},
})
	.use(MarkdownItFootnote)
	.use(MarkdownItContainer, "alert", {
		validate: function (params: string) {
			const alertTypes = ["info", "success", "warn", "error"];
			return alertTypes.includes(params.trim().split(" ", 1)[0]);
		},

		render: function (
			tokens: {
				[x: number]: { nesting: number; info: string; markup: string };
			},
			idx: number,
		) {
			type IconsKeys = "success" | "info" | "warn" | "error";
			type Icons = { [key in IconsKeys]: string };
			const icons: Icons = {
				success:
					"M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z",
				info: "M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z",
				warn: "M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z",
				error:
					"M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
			};
			if (tokens[idx].nesting === 1) {
				// opening tag
				const headStr = tokens[idx].info.trim();
				const type = headStr.split(" ", 1)[0] as IconsKeys;
				const title = headStr.slice(type.length);
				return `<div class="alert alert-${type}"><div class="icon"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="${icons[type]}"></path></svg></div><div class="message"><div class="title">${title}</div>`;
			} else {
				// closing tag
				return "</div></div>\n";
			}
		},
	})
	.use(MarkdownItImageEnhance)
	.use(MarkdownItAnchor, {
		level: 2,
		slugify: (s: string) => {
			return slugify(pinyin(s, { style: pinyin.STYLE_NORMAL }).join(" "));
		},
	})
	.use(MarkdownItKatex, { throwOnError: false, errorColor: " #cc0000" });

export default function Editor() {
	const [showContext, setShowContext] = useState(true);
	const [renderedMarkdown, setRenderedMarkdown] = useState({ __html: "" });
	const [text, setText] = useState("");
	const editorRef = useRef(null);
	const [currentAnchor, setCurrentAnchor] = useState("");
	const [toc, setToc] = useState<TOCItem[]>([]);

	useEffect(() => {
		const text = localStorage.getItem("editor_markdown");
		if (text) {
			setText(text);
			renderMarkdown(text);
		}
	}, []);

	function handleKeydown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Tab") {
			e.preventDefault();
			const target = e.target as HTMLTextAreaElement;
			const start = target.selectionStart;
			const end = target.selectionEnd;
			setText((prevText) => {
				return prevText.slice(0, start) + "\t" + prevText.slice(end);
			});
			setTimeout(() => {
				target.selectionStart = target.selectionEnd = start + 1;
			}, 0);
		}
	}

	async function handleCopy(value: string) {
		value = decodeURIComponent(atob(value));
		await navigator.clipboard.writeText(value);
	}

	async function handleEditorClick(e: React.MouseEvent<HTMLDivElement>) {
		if (e.target && (e.target as HTMLElement).matches(".copy")) {
			const target = e.target as HTMLElement;
			const value = target.getAttribute("data")!;
			await handleCopy(value);
		}
	}

	let lazyloadObserver: IntersectionObserver | undefined = undefined;
	let tocObserver: IntersectionObserver | undefined = undefined;

	function renderMarkdown(value: string) {
		const html = md.render(value);
		localStorage.setItem("editor_markdown", value);
		setRenderedMarkdown({ __html: html });
		requestAnimationFrame(() => {
			if (editorRef.current) {
				const editor = editorRef.current as HTMLDivElement;

				if (lazyloadObserver) {
					lazyloadObserver.disconnect();
				}
				if (tocObserver) {
					tocObserver.disconnect();
				}

				const lazy_observer = new IntersectionObserver(
					(entries) => {
						entries.forEach((entry) => {
							if (entry.isIntersecting) {
								console.log("load image");
								const image = entry.target as HTMLImageElement;
								image.src = image.getAttribute("data-src")!;
								image.removeAttribute("data-src");
								lazy_observer.unobserve(entry.target);
							}
						});
					},
					{ threshold: 0.2 },
				);

				const images = editor.querySelectorAll(
					"img[data-src]",
				) as NodeListOf<HTMLImageElement>;
				images.forEach((image) => {
					console.log(image);
					image.onload = () => {
						image.classList.add("loaded");
					};
					lazy_observer.observe(image);
				});
				lazyloadObserver = lazy_observer;

				const toc_observer = new IntersectionObserver(
					(entries) => {
						let flag = false;
						entries.forEach((entry) => {
							if (flag) return;
							if (entry.isIntersecting) {
								setCurrentAnchor(entry.target.id);
								window.history.replaceState(null, "", `#${entry.target.id}`);
								flag = true;
							}
						});
					},
					{ threshold: 1 },
				);
				const toc = generateTOC(editor);
				//console.log(toc);
				setToc(toc);
				toc.forEach((item) => {
					toc_observer.observe(item.target);
				});
				tocObserver = toc_observer;
			}
		});
	}

	function onChange(value: string) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			renderMarkdown(value);
		}, DEBOUNCE_TIME);
	}

	function toggleContextBar() {
		setShowContext(!showContext);
	}

	return (
		<div className={"mx-2"}>
			<div className={"relative flex min-h-screen"}>
				<Paper
					elevation={4}
					className={
						"sticky top-20 min-w-32 flex-none flex flex-col overflow-hidden resize-x"
					}
					style={{ height: "calc(100vh - 120px)" }}
				>
					<Paper
						elevation={1}
						className={"w-full bg-black bg-opacity-5 text-title flex z-10"}
						square
					></Paper>
					<textarea
						className={
							"resize-none w-full border-none outline-none p-2 flex-1 text-low"
						}
						onInput={(e) => {
							setText((e.target as HTMLTextAreaElement).value);
							onChange((e.target as HTMLTextAreaElement).value);
						}}
						value={text}
						onKeyDown={handleKeydown}
					></textarea>
				</Paper>
				<div
					className={"flex-1 px-5 py-3 break-all md-typeset break-words"}
					dangerouslySetInnerHTML={renderedMarkdown}
					dir="ltr"
					id={"markdown-preview"}
					ref={editorRef}
					onClick={handleEditorClick}
				></div>
				<div
					className={classNames(
						"sticky top-20 ml-auto overflow-y-auto flex-none transition-all",
						{
							"context-bar": showContext,
							"h-9": !showContext,
							"w-44": showContext,
							"w-9": !showContext,
							"overflow-y-auto": showContext,
							"overflow-y-hidden": !showContext,
						},
					)}
				>
					<div className={"flex text-low"}>
						<div
							className={classNames("text-title font-bold self-center", {
								hidden: !showContext,
							})}
						>
							目录
						</div>
						<IconButton
							size={"small"}
							className={"ml-auto"}
							onClick={toggleContextBar}
						>
							<ArrowForwardIosOutlinedIcon
								className={classNames("transition-all", {
									"transform rotate-180": !showContext,
								})}
							/>
						</IconButton>
					</div>
					{toc.map((item) => (
						<Link
							key={item.id}
							href={`#${item.id}`}
							underline={"none"}
							className={classNames("text-low my-1 block", {
								"text-black text-opacity-50 hover:text-opacity-80 transition":
									currentAnchor !== item.id,
								"text-primary font-bold text-low": currentAnchor === item.id,
								"ml-4": item.level === 3,
								"ml-8": item.level === 4,
							})}
						>
							{item.title}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
