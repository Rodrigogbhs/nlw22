"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

export interface RoastedCode {
	id: string;
	code: string;
	fixedCode: string;
	score: number;
	roastComment: string;
	language: string;
	issues: Issue[];
	createdAt: number;
}

export interface Issue {
	title: string;
	description: string;
	severity: "error" | "warning" | "info";
}

interface RoastContextType {
	codes: RoastedCode[];
	addCode: (code: RoastedCode) => void;
	clearCodes: () => void;
}

const RoastContext = createContext<RoastContextType | undefined>(undefined);

const STORAGE_KEY = "devroast_codes";

export function RoastProvider({ children }: { children: ReactNode }) {
	const [codes, setCodes] = useState<RoastedCode[]>([]);

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				setCodes(JSON.parse(stored));
			} catch {
				setCodes([]);
			}
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
	}, [codes]);

	const addCode = (code: RoastedCode) => {
		setCodes((prev) => [code, ...prev]);
	};

	const clearCodes = () => {
		setCodes([]);
		localStorage.removeItem(STORAGE_KEY);
	};

	return (
		<RoastContext.Provider value={{ codes, addCode, clearCodes }}>
			{children}
		</RoastContext.Provider>
	);
}

export function useRoast() {
	const context = useContext(RoastContext);
	if (context === undefined) {
		throw new Error("useRoast must be used within a RoastProvider");
	}
	return context;
}
