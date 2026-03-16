export interface AnalysisResult {
	score: number;
	issues: Issue[];
	fixedCode: string;
	roastComment: string;
	language: string;
}

export interface Issue {
	title: string;
	description: string;
	severity: "error" | "warning" | "info";
}

function detectLanguage(code: string): string {
	if (
		code.includes("def ") ||
		(code.includes("import ") && code.includes(":"))
	) {
		return "python";
	}
	if (
		code.includes("fn ") ||
		code.includes("let mut") ||
		code.includes("println!")
	) {
		return "rust";
	}
	if (code.includes("func ") || code.includes("package ")) {
		return "go";
	}
	if (code.includes("public class") || code.includes("private void")) {
		return "java";
	}
	return "javascript";
}

function analyzeJavaScript(code: string): AnalysisResult {
	const issues: Issue[] = [];
	let score = 10;

	if (!code.includes("try") && !code.includes("catch")) {
		issues.push({
			title: "No error handling",
			description: "Function will crash if items is null/undefined",
			severity: "error",
		});
		score -= 2;
	}

	if (code.includes("== ") || code.includes("===") === false) {
		if (code.match(/[^=!]=[^=]/)) {
			issues.push({
				title: "Use strict equality",
				description: "Use === instead of = for comparisons",
				severity: "warning",
			});
			score -= 0.5;
		}
	}

	if (code.includes("for (") && code.includes(") {")) {
		issues.push({
			title: "Use modern array methods",
			description: "Prefer .reduce(), .map(), .filter() over for loops",
			severity: "warning",
		});
		score -= 1.5;
	}

	if (code.includes("TODO") || code.includes("FIXME")) {
		issues.push({
			title: "Incomplete implementation",
			description: "TODO comments suggest incomplete code",
			severity: "info",
		});
		score -= 0.5;
	}

	if (!code.includes("if (") && !code.includes("if(")) {
		issues.push({
			title: "No input validation",
			description: "Function doesn't validate input parameters",
			severity: "error",
		});
		score -= 2;
	}

	if (code.match(/\b0\b/) && !code.includes("=== 0")) {
		issues.push({
			title: "Magic numbers",
			description: "Hardcoded values should be named constants",
			severity: "warning",
		});
		score -= 0.5;
	}

	if (!code.includes("?.price") && !code.includes("price ?? 0")) {
		issues.push({
			title: "No null safety",
			description: "Missing optional chaining or nullish coalescing",
			severity: "warning",
		});
		score -= 1;
	}

	if (!code.includes("return") && !code.includes("=>")) {
		issues.push({
			title: "Missing early returns",
			description: "Consider early returns for validation",
			severity: "info",
		});
		score -= 0.5;
	}

	if (code.length < 50 && !code.includes("function")) {
		issues.push({
			title: "Code too short",
			description: "Is this even a real function?",
			severity: "warning",
		});
		score -= 1;
	}

	const fixedCode = generateJavaScriptFix(code);

	const roastComment = getRoastComment(score);

	return {
		score: Math.max(0, Math.round(score * 10) / 10),
		issues,
		fixedCode,
		roastComment,
		language: "javascript",
	};
}

function generateJavaScriptFix(code: string): string {
	const lines = code.split("\n");
	const fixedLines: string[] = [];

	const funcMatch = code.match(/function\s+(\w+)\s*\(([^)]*)\)/);
	const funcName = funcMatch ? funcMatch[1] : "calculatePrice";
	const params = funcMatch ? funcMatch[2] : "items";

	fixedLines.push(`function ${funcName}(${params}) {`);

	if (!code.includes("if (!") && !code.includes("if(!")) {
		fixedLines.push(`  if (!${params} || !Array.isArray(${params})) return 0;`);
	}

	if (code.includes("for (")) {
		const varMatch = code.match(/let\s+(\w+)\s*=\s*0/);
		const varName = varMatch ? varMatch[1] : "total";
		fixedLines.push(`  const ${varName} = ${params}.reduce((sum, item) => {`);
		fixedLines.push(`    const price = item?.price ?? 0;`);
		fixedLines.push(`    return price > 0 ? sum + price : sum;`);
		fixedLines.push(`  }, 0);`);
	} else {
		fixedLines.push(...lines.filter((l) => !l.includes("TODO")));
	}

	if (!code.includes("return")) {
		fixedLines.push(`  return ${params};`);
	}

	fixedLines.push("}");

	return fixedLines.join("\n");
}

function getRoastComment(score: number): string {
	if (score < 2) {
		const comments = [
			"this code looks like it was written during a power outage... in 2005.",
			"i've seen better code written by my cat walking across the keyboard.",
			"this is what happens when you copy-paste from stackoverflow without understanding.",
			"the sheer audacity of submitting this code is actually impressive.",
		];
		return comments[Math.floor(Math.random() * comments.length)];
	}
	if (score < 5) {
		const comments = [
			"this code needs serious help, like, yesterday.",
			"are you okay? this code is a disaster.",
			"i've seen better logic in a fortune cookie.",
			"please, for the love of all that is holy, refactor this.",
		];
		return comments[Math.floor(Math.random() * comments.length)];
	}
	if (score < 7) {
		const comments = [
			"not terrible, but definitely needs work.",
			"you're getting there, but还有很多问题 (there are still many problems).",
			"this code is... okay. just okay. nothing special.",
			"have you considered using modern JavaScript?",
		];
		return comments[Math.floor(Math.random() * comments.length)];
	}
	const comments = [
		"actually pretty decent! who taught you?",
		"wow, this is actually solid work. i'm impressed.",
		"okay, i have to admit... this is clean code.",
		"did you actually study JavaScript? color me surprised.",
	];
	return comments[Math.floor(Math.random() * comments.length)];
}

export function analyzeCode(code: string): AnalysisResult {
	const language = detectLanguage(code);

	switch (language) {
		case "javascript":
		case "typescript":
			return analyzeJavaScript(code);
		default:
			return {
				score: 5,
				issues: [
					{
						title: "Unsupported language",
						description: `Language "${language}" analysis not yet supported`,
						severity: "info",
					},
				],
				fixedCode: code,
				roastComment: "we'll judge you for this... later.",
				language,
			};
	}
}
