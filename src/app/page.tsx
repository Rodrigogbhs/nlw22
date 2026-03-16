"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { analyzeCode } from "./lib/analyze";
import { useLanguage } from "./lib/LanguageContext";
import { type RoastedCode, useRoast } from "./lib/RoastContext";
import { LanguageSelector } from "./components/LanguageSelector";

const DEFAULT_CODE = `function calculatePrice(items) {
  let total = 0;
  for (const item of items) {
    total += item.price;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion
  return total;
}`;

export default function Home() {
	const [code, setCode] = useState(DEFAULT_CODE);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { addCode } = useRoast();
	const { t } = useLanguage();

	const lineCount = code.split("\n").length;
	const maxLines = Math.max(lineCount, 16);

	const handleSubmit = async () => {
		setIsLoading(true);

		const result = analyzeCode(code);

		const roastedCode: RoastedCode = {
			id: crypto.randomUUID(),
			code,
			fixedCode: result.fixedCode,
			score: result.score,
			roastComment: result.roastComment,
			language: result.language,
			issues: result.issues,
			createdAt: Date.now(),
		};

		addCode(roastedCode);

		const params = new URLSearchParams({
			id: roastedCode.id,
			score: result.score.toString(),
			roast: result.roastComment,
			issues: encodeURIComponent(JSON.stringify(result.issues)),
			code: btoa(code),
			fixedCode: btoa(result.fixedCode),
			language: result.language,
		});

		setTimeout(() => {
			router.push(`/share?${params.toString()}`);
		}, 500);
	};

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
						{t("leaderboard")}
					</Link>
					<LanguageSelector />
				</div>
			</nav>

			{/* Main Content */}
			<main className="flex flex-col items-center gap-8 px-10 pt-20 pb-10 w-full">
				{/* Hero Title */}
				<div className="flex flex-col items-center gap-3">
					<div className="flex items-center gap-3">
						<span className="text-[var(--accent-green)] font-primary text-[36px] font-bold">
							$
						</span>
						<h1 className="text-[var(--text-primary)] font-primary text-[36px] font-bold">
							{t("heroTitle")}
						</h1>
					</div>
					<p className="text-[var(--text-secondary)] font-secondary text-sm">
						{t("heroSubtitle")}
					</p>
				</div>

				{/* Code Editor */}
				<div className="flex flex-col w-[780px] border border-[var(--border-primary)] rounded-lg overflow-hidden bg-[var(--bg-input)]">
					{/* Window Header */}
					<div className="flex items-center h-10 px-4 border-b border-[var(--border-primary)]">
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 rounded-full bg-[var(--red-accent)]" />
							<div className="w-3 h-3 rounded-full bg-[var(--amber-accent)]" />
							<div className="w-3 h-3 rounded-full bg-[var(--accent-green-dim)]" />
						</div>
					</div>
					{/* Code Content - Editable */}
					<div className="flex h-[360px] overflow-auto">
						{/* Line Numbers */}
						<div className="flex flex-col w-12 px-4 py-4 border-r border-[var(--border-primary)] bg-[var(--bg-surface)] select-none">
							{Array.from({ length: maxLines }, (_, i) => i + 1).map(
								(lineNum) => (
									<span
										key={lineNum}
										className="text-[var(--text-tertiary)] font-primary text-xs leading-[1.5rem]"
									>
										{lineNum}
									</span>
								),
							)}
						</div>
						{/* Code Input */}
						<textarea
							value={code}
							onChange={(e) => setCode(e.target.value)}
							className="flex-1 p-4 font-primary text-xs leading-[1.5rem] text-[var(--text-primary)] bg-transparent border-none outline-none resize-none whitespace-pre"
							spellCheck={false}
							placeholder="// type your code here..."
						/>
					</div>
				</div>

				{/* Actions Bar */}
				<div className="flex items-center justify-between w-[780px]">
					<div className="flex items-center gap-4">
						{/* Toggle */}
						<div className="flex items-center gap-2">
							<div className="flex items-center w-10 h-[22px] rounded-full bg-[var(--accent-green)] p-[3px]">
								<div className="w-4 h-4 rounded-full bg-white ml-auto" />
							</div>
							<span className="text-[var(--accent-green)] font-primary text-[13px]">
								{t("roastMode")}
							</span>
						</div>
						<span className="text-[var(--text-tertiary)] font-secondary text-xs">
							{t("maximumSarcasm")}
						</span>
					</div>
					{/* Submit Button */}
					<button
						type="button"
						onClick={handleSubmit}
						disabled={isLoading}
						className="flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-green)] text-[#0A0A0A] font-primary text-[13px] font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-50"
					>
						{isLoading ? "$ processing..." : t("roastMyCode")}
					</button>
				</div>

				{/* Footer Hint */}
				<div className="flex items-center gap-6 mt-4">
					<span className="text-[var(--text-tertiary)] font-secondary text-xs">
						{t("codesRoasted")}
					</span>
					<span className="text-[var(--text-tertiary)] font-primary text-xs">
						·
					</span>
					<span className="text-[var(--text-tertiary)] font-secondary text-xs">
						{t("avgScore")}: 4.2/10
					</span>
				</div>

				{/* Spacer */}
				<div className="h-16" />

				{/* Leaderboard Preview */}
				<div className="flex flex-col gap-6 w-[960px]">
					{/* Title Row */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="text-[var(--accent-green)] font-primary text-sm font-bold">
								{"//"}
							</span>
							<span className="text-[var(--text-primary)] font-primary text-sm font-bold">
								{t("shameLeaderboard")}
							</span>
						</div>
						<Link
							href="/leaderboard"
							className="flex items-center gap-1 px-3 py-1.5 border border-[var(--border-primary)] rounded text-[var(--text-secondary)] font-primary text-xs hover:bg-[var(--bg-surface)] transition-colors"
						>
							{t("viewAll")}
						</Link>
					</div>
					<p className="text-[var(--text-tertiary)] font-secondary text-[13px]">
						{t("worstCode")}
					</p>

					{/* Table */}
					<div className="border border-[var(--border-primary)] rounded-lg overflow-hidden">
						{/* Header */}
						<div className="flex items-center h-10 px-5 bg-[var(--bg-surface)] border-b border-[var(--border-primary)]">
							<span className="w-[50px] text-[var(--text-tertiary)] font-primary text-xs">
								#
							</span>
							<span className="w-[70px] text-[var(--text-tertiary)] font-primary text-xs">
								score
							</span>
							<span className="flex-1 text-[var(--text-tertiary)] font-primary text-xs">
								code
							</span>
							<span className="w-[100px] text-[var(--text-tertiary)] font-primary text-xs">
								lang
							</span>
						</div>
						{/* Row 1 */}
						<div className="flex items-center px-5 py-4 border-b border-[var(--border-primary)]">
							<span className="w-[50px] text-[var(--text-primary)] font-primary text-xs">
								#1
							</span>
							<span className="w-[70px] text-[var(--red-accent)] font-primary text-xs">
								1.2
							</span>
							<div className="flex-1 flex flex-col gap-0.5">
								<span className="text-[var(--text-primary)] font-primary text-xs">
									{"const x = 1;"}
								</span>
								<span className="text-[var(--text-tertiary)] font-secondary text-[10px]">
									{"// literally just"}
								</span>
							</div>
							<span className="w-[100px] text-[var(--text-secondary)] font-secondary text-xs">
								javascript
							</span>
						</div>
						{/* Row 2 */}
						<div className="flex items-center px-5 py-4 border-b border-[var(--border-primary)]">
							<span className="w-[50px] text-[var(--text-primary)] font-primary text-xs">
								#2
							</span>
							<span className="w-[70px] text-[var(--amber-accent)] font-primary text-xs">
								2.8
							</span>
							<div className="flex-1 flex flex-col gap-0.5">
								<span className="text-[var(--text-primary)] font-primary text-xs">
									{"if (true) { return true; }"}
								</span>
								<span className="text-[var(--text-tertiary)] font-secondary text-[10px]">
									{"// monkaS"}
								</span>
							</div>
							<span className="w-[100px] text-[var(--text-secondary)] font-secondary text-xs">
								python
							</span>
						</div>
						{/* Row 3 */}
						<div className="flex items-center px-5 py-4">
							<span className="w-[50px] text-[var(--text-primary)] font-primary text-xs">
								#3
							</span>
							<span className="w-[70px] text-[var(--text-secondary)] font-primary text-xs">
								3.1
							</span>
							<div className="flex-1 flex flex-col gap-0.5">
								<span className="text-[var(--text-primary)] font-primary text-xs">{`print("hello world")`}</span>
								<span className="text-[var(--text-tertiary)] font-secondary text-[10px]">
									{"// copilot did this"}
								</span>
							</div>
							<span className="w-[100px] text-[var(--text-secondary)] font-secondary text-xs">
								rust
							</span>
						</div>
					</div>

					{/* Fade Hint */}
					<div className="flex justify-center px-4">
						<span className="text-[var(--text-tertiary)] font-secondary text-xs">
							showing top 3 of 2,847 · view full leaderboard &gt;&gt;
						</span>
					</div>
				</div>

				{/* Bottom Pad */}
				<div className="h-16" />
			</main>
		</div>
	);
}
