"use client";

import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";
import { useRoast } from "../lib/RoastContext";
import { LanguageSelector } from "../components/LanguageSelector";

export default function LeaderboardPage() {
	const { codes, clearCodes } = useRoast();
	const { t } = useLanguage();

	const sortedCodes = [...codes].sort((a, b) => a.score - b.score);

	const totalCodes = codes.length;
	const avgScore =
		totalCodes > 0
			? (codes.reduce((sum, c) => sum + c.score, 0) / totalCodes).toFixed(1)
			: "0.0";

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
						href="/"
						className="text-[var(--text-secondary)] font-secondary text-[13px] hover:text-[var(--text-primary)] transition-colors"
					>
						{t("roast")}
					</Link>
					<LanguageSelector />
				</div>
			</nav>

			{/* Main Content */}
			<main className="flex flex-col gap-10 px-20 pt-10 pb-10 w-full max-w-[1200px] mx-auto">
				{/* Hero Section */}
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="text-[var(--accent-green)] font-primary text-sm font-bold">
							{"//"}
						</span>
						<span className="text-[var(--text-primary)] font-primary text-sm font-bold">
							shame_leaderboard
						</span>
					</div>
					<p className="text-[var(--text-tertiary)] font-secondary text-[13px]">
						{"// the worst code on the internet, ranked by shame"}
					</p>
				</div>

				{/* Stats */}
				<div className="flex items-center gap-6">
					<span className="text-[var(--text-tertiary)] font-secondary text-xs">
						{totalCodes.toLocaleString()} codes roasted
					</span>
					<span className="text-[var(--text-tertiary)] font-primary text-xs">
						·
					</span>
					<span className="text-[var(--text-tertiary)] font-secondary text-xs">
						avg score: {avgScore}/10
					</span>
				</div>

				{/* Table */}
				{codes.length > 0 ? (
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
							<span className="w-[100px] text-[var(--text-tertiary)] font-primary text-xs text-right">
								date
							</span>
						</div>

						{/* Rows */}
						{sortedCodes.map((code, index) => (
							<Link
								key={code.id}
								href={`/results?id=${code.id}&score=${code.score}&roast=${encodeURIComponent(code.roastComment)}&issues=${encodeURIComponent(JSON.stringify(code.issues))}&code=${btoa(code.code)}&fixedCode=${btoa(code.fixedCode)}&language=${code.language}`}
								className="flex items-center px-5 py-4 border-b border-[var(--border-primary)] hover:bg-[var(--bg-surface)] transition-colors"
							>
								<span className="w-[50px] text-[var(--text-primary)] font-primary text-xs">
									#{index + 1}
								</span>
								<span
									className={`w-[70px] font-primary text-xs ${
										code.score < 2
											? "text-[var(--red-accent)]"
											: code.score < 4
												? "text-[var(--amber-accent)]"
												: "text-[var(--text-secondary)]"
									}`}
								>
									{code.score}
								</span>
								<div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
									<span className="text-[var(--text-primary)] font-primary text-xs truncate">
										{code.code.split("\n")[0]}
									</span>
									<span className="text-[var(--text-tertiary)] font-secondary text-[10px] truncate">
										{code.roastComment.slice(0, 50)}...
									</span>
								</div>
								<span className="w-[100px] text-[var(--text-secondary)] font-secondary text-xs">
									{code.language}
								</span>
								<span className="w-[100px] text-[var(--text-tertiary)] font-secondary text-xs text-right">
									{new Date(code.createdAt).toLocaleDateString()}
								</span>
							</Link>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-20 border border-[var(--border-primary)] rounded-lg">
						<span className="text-[var(--text-tertiary)] font-secondary text-lg mb-2">
							no codes roasted yet
						</span>
						<p className="text-[var(--text-tertiary)] font-secondary text-sm">
							{"// go roast some code!"}
						</p>
						<Link
							href="/"
							className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-green)] text-[#0A0A0A] font-primary text-[13px] font-medium rounded hover:opacity-90 transition-opacity"
						>
							$ roast_my_code
						</Link>
					</div>
				)}

				{/* Fade Hint */}
				{codes.length > 0 && (
					<div className="flex justify-center px-4">
						<span className="text-[var(--text-tertiary)] font-secondary text-xs">
							showing all {totalCodes} codes · ordered by shame
						</span>
					</div>
				)}

				{/* Clear Button */}
				{codes.length > 0 && (
					<div className="flex justify-center">
						<button
							type="button"
							onClick={clearCodes}
							className="text-[var(--text-tertiary)] font-secondary text-xs hover:text-[var(--red-accent)] transition-colors"
						>
							$ clear_leaderboard
						</button>
					</div>
				)}
			</main>
		</div>
	);
}
