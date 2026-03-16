"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

interface Issue {
	id: string;
	title: string;
	description: string;
	severity: string;
}

function ResultsContent() {
	const searchParams = useSearchParams();

	const score = useMemo(() => {
		const s = searchParams.get("score");
		return s ? parseFloat(s) : 0;
	}, [searchParams]);

	const roastComment = useMemo(() => {
		return searchParams.get("roast") || "";
	}, [searchParams]);

	const issues: Issue[] = useMemo(() => {
		const i = searchParams.get("issues");
		if (!i) return [];
		try {
			return JSON.parse(decodeURIComponent(i));
		} catch {
			return [];
		}
	}, [searchParams]);

	const code = useMemo(() => {
		const c = searchParams.get("code");
		if (!c) return "";
		try {
			return atob(c);
		} catch {
			return "";
		}
	}, [searchParams]);

	const fixedCode = useMemo(() => {
		const f = searchParams.get("fixedCode");
		if (!f) return "";
		try {
			return atob(f);
		} catch {
			return "";
		}
	}, [searchParams]);

	const language = useMemo(() => {
		return searchParams.get("language") || "javascript";
	}, [searchParams]);

	const codeLines = useMemo(() => {
		return code.split("\n");
	}, [code]);

	const fixedCodeLines = useMemo(() => {
		return fixedCode.split("\n");
	}, [fixedCode]);

	const diffLines = useMemo(() => {
		const result: { id: string; type: string; content: string }[] = [];
		const maxLen = Math.max(codeLines.length, fixedCodeLines.length);

		for (let i = 0; i < maxLen; i++) {
			const codeLine = codeLines[i] || "";
			const fixedLine = fixedCodeLines[i] || "";

			if (codeLine === fixedLine) {
				result.push({ id: `dl-${i}`, type: "context", content: fixedLine });
			} else {
				if (codeLine) {
					result.push({ id: `rm-${i}`, type: "remove", content: codeLine });
				}
				if (fixedLine) {
					result.push({ id: `add-${i}`, type: "add", content: fixedLine });
				}
			}
		}

		return result;
	}, [codeLines, fixedCodeLines]);

	const scoreColor =
		score < 2
			? "var(--red-accent)"
			: score < 4
				? "var(--amber-accent)"
				: "var(--accent-green)";

	const verdict =
		score < 2
			? "verdict: catastrophic_failure"
			: score < 4
				? "verdict: needs_serious_help"
				: score < 6
					? "verdict: needs_work"
					: score < 8
						? "verdict: decent_work"
						: "verdict: solid_code";

	return (
		<div className="flex flex-col min-h-screen w-full bg-[var(--bg-page)]">
			{/* Navbar */}
			<nav className="flex items-center justify-between h-14 px-10 border-b border-[var(--border-primary)] bg-[var(--bg-page)]">
				<Link
					href="/"
					className="flex items-center gap-2 hover:opacity-80 transition-opacity"
				>
					<span className="text-[var(--accent-green)] font-primary text-xl font-bold">
						&gt;
					</span>
					<span className="text-[var(--text-primary)] font-primary text-lg font-medium">
						devroast
					</span>
				</Link>
				<div className="flex items-center gap-6">
					<Link
						href="/leaderboard"
						className="text-[var(--text-secondary)] font-secondary text-[13px] hover:text-[var(--text-primary)] transition-colors"
					>
						leaderboard
					</Link>
				</div>
			</nav>

			{/* Main Content */}
			<main className="flex flex-col gap-10 px-20 pt-10 pb-10 w-full max-w-[1200px] mx-auto">
				{/* Score Hero */}
				<div className="flex items-center gap-12">
					{/* Score Ring */}
					<div className="relative w-[180px] h-[180px] flex items-center justify-center">
						<div className="absolute inset-0 rounded-full border-4 border-[var(--border-primary)]" />
						<div
							className="absolute inset-0 rounded-full border-4"
							style={{
								borderColor: scoreColor,
								clipPath: `polygon(0 0, 100% 0, 100% ${score * 10}%, 0 ${score * 10}%)`,
							}}
						/>
						<div className="flex flex-col items-center">
							<span
								className="text-[48px] font-primary font-bold"
								style={{ color: scoreColor }}
							>
								{score}
							</span>
							<span className="text-[var(--text-tertiary)] font-primary text-base">
								/10
							</span>
						</div>
					</div>

					{/* Roast Summary */}
					<div className="flex flex-col gap-4 flex-1">
						{/* Badge */}
						<div className="flex items-center gap-2">
							<div
								className={`w-2 h-2 rounded-full ${
									score < 4
										? "bg-[var(--red-accent)]"
										: score < 7
											? "bg-[var(--amber-accent)]"
											: "bg-[var(--accent-green)]"
								}`}
							/>
							<span
								className={`font-primary text-[13px] font-medium ${
									score < 4
										? "text-[var(--red-accent)]"
										: score < 7
											? "text-[var(--amber-accent)]"
											: "text-[var(--accent-green)]"
								}`}
							>
								{verdict}
							</span>
						</div>
						{/* Quote */}
						<h1 className="text-[var(--text-primary)] font-secondary text-[20px] leading-relaxed">
							"{roastComment}"
						</h1>
						{/* Meta */}
						<div className="flex items-center gap-4 text-[var(--text-tertiary)] font-primary text-xs">
							<span>lang: {language}</span>
							<span>·</span>
							<span>{codeLines.length} lines</span>
						</div>
						{/* Share */}
						<button
							type="button"
							className="flex items-center gap-1.5 px-4 py-2 w-fit border border-[var(--border-primary)] rounded text-[var(--text-secondary)] font-primary text-xs hover:bg-[var(--bg-surface)] transition-colors"
						>
							$ share_roast
						</button>
					</div>
				</div>

				{/* Divider */}
				<div className="h-px bg-[var(--border-primary)]" />

				{/* Submitted Code Section */}
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="text-[var(--accent-green)] font-primary text-sm font-bold">
							{"//"}
						</span>
						<span className="text-[var(--text-primary)] font-primary text-sm font-bold">
							your_submission
						</span>
					</div>
					<div className="flex border border-[var(--border-primary)] rounded-lg overflow-hidden bg-[var(--bg-input)] h-[424px]">
						{/* Line Numbers */}
						<div className="flex flex-col w-12 px-4 py-3 border-r border-[var(--border-primary)] bg-[var(--bg-surface)]">
							{Array.from({ length: codeLines.length }, (_, i) => (
								<span
									key={i}
									className="text-[var(--text-tertiary)] font-primary text-xs leading-[1.5rem]"
								>
									{i + 1}
								</span>
							))}
						</div>
						{/* Code */}
						<pre className="flex-1 p-4 font-primary text-xs leading-[1.5rem] text-[var(--text-primary)] overflow-auto">
							<code>{code}</code>
						</pre>
					</div>
				</div>

				{/* Divider */}
				<div className="h-px bg-[var(--border-primary)]" />

				{/* Analysis Section */}
				<div className="flex flex-col gap-6">
					<div className="flex items-center gap-2">
						<span className="text-[var(--accent-green)] font-primary text-sm font-bold">
							{"//"}
						</span>
						<span className="text-[var(--text-primary)] font-primary text-sm font-bold">
							detailed_analysis
						</span>
					</div>
					{/* Issues Grid */}
					{issues.length > 0 ? (
						<div className="grid grid-cols-2 gap-5">
							{issues.map((issue) => (
								<div
									key={issue.id}
									className="flex flex-col gap-3 p-5 border border-[var(--border-primary)] rounded-lg"
								>
									<div className="flex items-center gap-2">
										<div
											className={`w-2 h-2 rounded-full ${
												issue.severity === "error"
													? "bg-[var(--red-accent)]"
													: issue.severity === "warning"
														? "bg-[var(--amber-accent)]"
														: "bg-[var(--accent-green)]"
											}`}
										/>
										<span className="text-[var(--text-primary)] font-primary text-sm font-medium">
											{issue.title}
										</span>
									</div>
									<p className="text-[var(--text-secondary)] font-secondary text-xs">
										{issue.description}
									</p>
								</div>
							))}
						</div>
					) : (
						<div className="flex items-center justify-center p-8 border border-[var(--border-primary)] rounded-lg">
							<span className="text-[var(--text-secondary)] font-secondary">
								No issues found! Your code is clean.
							</span>
						</div>
					)}
				</div>

				{/* Divider */}
				<div className="h-px bg-[var(--border-primary)]" />

				{/* Diff Section */}
				<div className="flex flex-col gap-6">
					<div className="flex items-center gap-2">
						<span className="text-[var(--accent-green)] font-primary text-sm font-bold">
							{"//"}
						</span>
						<span className="text-[var(--text-primary)] font-primary text-sm font-bold">
							suggested_fix
						</span>
					</div>
					{/* Diff Block */}
					<div className="flex flex-col border border-[var(--border-primary)] rounded-lg overflow-hidden bg-[var(--bg-input)]">
						{/* Header */}
						<div className="flex items-center h-10 px-4 border-b border-[var(--border-primary)]">
							<span className="text-[var(--text-secondary)] font-primary text-xs font-medium">
								your_code.ts → improved_code.ts
							</span>
						</div>
						{/* Diff Body */}
						<div className="flex flex-col">
							{diffLines.map((line) => (
								<div
									key={line.id}
									className={`flex items-center h-7 px-4 font-primary text-xs ${
										line.type === "remove"
											? "bg-[#EF4444]/10"
											: line.type === "add"
												? "bg-[#10B981]/10"
												: ""
									}`}
								>
									<span className="w-4 mr-2 text-[var(--text-tertiary)]">
										{line.type === "remove"
											? "-"
											: line.type === "add"
												? "+"
												: " "}
									</span>
									<span
										className={
											line.type === "remove"
												? "text-[var(--red-accent)]"
												: line.type === "add"
													? "text-[var(--accent-green)]"
													: "text-[var(--text-primary)]"
										}
									>
										{line.content}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

export default function ResultsPage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)]">
					<span className="text-[var(--text-secondary)] font-primary">
						Loading...
					</span>
				</div>
			}
		>
			<ResultsContent />
		</Suspense>
	);
}
