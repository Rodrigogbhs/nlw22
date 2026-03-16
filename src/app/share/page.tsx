"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

function ShareContent() {
	const searchParams = useSearchParams();

	const score = useMemo(() => {
		const s = searchParams.get("score");
		return s ? parseFloat(s) : 0;
	}, [searchParams]);

	const roastComment = useMemo(() => {
		return searchParams.get("roast") || "";
	}, [searchParams]);

	const language = useMemo(() => {
		return searchParams.get("language") || "javascript";
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

	const lineCount = useMemo(() => {
		return code.split("\n").length;
	}, [code]);

	const scoreColor =
		score < 2
			? "var(--red-accent)"
			: score < 4
				? "var(--amber-accent)"
				: "var(--accent-green)";

	const verdict =
		score < 2
			? "catastrophic_failure"
			: score < 4
				? "needs_serious_help"
				: score < 6
					? "needs_work"
					: score < 8
						? "decent_work"
						: "solid_code";

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-[var(--bg-page)] p-16">
			{/* Modal Container */}
			<div className="flex flex-col items-center gap-7 w-full max-w-[800px]">
				{/* Logo */}
				<div className="flex items-center gap-2">
					<span className="text-[var(--accent-green)] font-primary text-[24px] font-bold">
						&gt;
					</span>
					<span className="text-[var(--text-primary)] font-primary text-xl font-medium">
						devroast
					</span>
				</div>

				{/* Score */}
				<div className="flex items-end gap-1">
					<span
						className="font-primary font-black"
						style={{ fontSize: "160px", lineHeight: 1, color: scoreColor }}
					>
						{score}
					</span>
					<span
						className="font-primary"
						style={{
							fontSize: "56px",
							lineHeight: 1,
							color: "var(--text-tertiary)",
						}}
					>
						/10
					</span>
				</div>

				{/* Verdict */}
				<div className="flex items-center gap-2">
					<div
						className="w-3 h-3 rounded-full"
						style={{ backgroundColor: scoreColor }}
					/>
					<span
						className="font-primary"
						style={{ fontSize: "20px", color: scoreColor }}
					>
						{verdict}
					</span>
				</div>

				{/* Lang Info */}
				<span className="text-[var(--text-tertiary)] font-primary text-base">
					lang: {language} · {lineCount} lines
				</span>

				{/* Roast Quote */}
				<p className="font-secondary text-[22px] leading-relaxed text-center text-[var(--text-primary)] max-w-[600px)]">
					"{roastComment}"
				</p>

				{/* Actions */}
				<div className="flex items-center gap-4 mt-4">
					<Link
						href="/"
						className="flex items-center gap-2 px-6 py-3 bg-[var(--accent-green)] text-[#0A0A0A] font-primary text-sm font-medium rounded hover:opacity-90 transition-opacity"
					>
						$ roast_another
					</Link>
					<Link
						href={`/results?id=${searchParams.get("id")}&score=${score}&roast=${encodeURIComponent(roastComment)}&issues=${searchParams.get("issues") || ""}&code=${searchParams.get("code") || ""}&fixedCode=${searchParams.get("fixedCode") || ""}&language=${language}`}
						className="flex items-center gap-2 px-6 py-3 border border-[var(--border-primary)] text-[var(--text-secondary)] font-primary text-sm font-medium rounded hover:bg-[var(--bg-surface)] transition-colors"
					>
						$ view_details
					</Link>
					<Link
						href="/leaderboard"
						className="flex items-center gap-2 px-6 py-3 border border-[var(--border-primary)] text-[var(--text-secondary)] font-primary text-sm font-medium rounded hover:bg-[var(--bg-surface)] transition-colors"
					>
						$ view_leaderboard
					</Link>
				</div>
			</div>
		</div>
	);
}

export default function SharePage() {
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
			<ShareContent />
		</Suspense>
	);
}
