import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import React from "react";
import { create } from "zustand";

export interface NavigatorItem {
	title: string;
	path: string;
	value: string;
	icon: React.ElementType;
}

export const HomeNavigator: NavigatorItem = {
	title: "首页",
	path: "/",
	value: "home",
	icon: HomeOutlinedIcon,
};

export const ArchiverNavigator: NavigatorItem = {
	title: "归档",
	path: "/archives",
	value: "archives",
	icon: ArticleOutlinedIcon,
};

export const AboutNavigator: NavigatorItem = {
	title: "关于",
	path: "/about",
	value: "about",
	icon: AccountCircleOutlinedIcon,
};

// 占位
export const LoadingNavigator: NavigatorItem = {
	title: "加载中",
	path: "",
	value: "loading",
	icon: AccountCircleOutlinedIcon, // 仅占位
};

const NavigatorList = [HomeNavigator, ArchiverNavigator, AboutNavigator];

export default NavigatorList;

interface NavigatorStore {
	now: NavigatorItem;
	title: string;
	setNow: (now: NavigatorItem) => void;
	setTitle: (title: string) => void;
}

export const useNavigatorStore = create<NavigatorStore>((set) => ({
	now: LoadingNavigator,
	setNow: (now: NavigatorItem) => set({ now }),
	title: "",
	setTitle: (title: string) => set({ title }),
}));
