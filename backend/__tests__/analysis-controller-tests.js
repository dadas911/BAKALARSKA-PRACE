import {
    analyzeFinancialRisk,
    analyzeSpendingsReduction,
    analyzeFinancialGoal,
    analyzeExceededSpendings,
    analyzeIncomeVsExpenses,
    analyzeSpendingsDistribution,
    analyzeTips,
} from "../controllers/analysis-controller.js";
import { getCategoryById } from "../controllers/category-controller.js";
import { getSpendingsById } from "../controllers/spendings-controller.js";

jest.mock("../controllers/category-controller.js");
jest.mock("../controllers/spendings-controller.js");

describe("Financial Analysis Controller", () => {
    describe("analyzeFinancialRisk", () => {
        it("should calculate financial risk and required reserve correctly", async () => {
            const result = await analyzeFinancialRisk(1000, 500);

            expect(result.recommendedReserve).toBe(1500);
            expect(result.financialRiskLevel).toBe("Střední");
            expect(result.increaseReserve).toBe(500);
            expect(result.monthCovered).toBe(2);
        });

        it("should return high risk for less than 1 month covered", async () => {
            const result = await analyzeFinancialRisk(500, 1000);

            expect(result.financialRiskLevel).toBe("Vysoké");
        });

        it("should return low risk for less than 3 months covered", async () => {
            const result = await analyzeFinancialRisk(3500, 1000);

            expect(result.financialRiskLevel).toBe("Nízké");
        });
    });

    describe("analyzeSpendingsReduction", () => {
        it("should calculate spending reduction and savings per category", async () => {
            const budgets = [{ spendings: ["spending1", "spending2"] }];
            const spending1 = { category: "category1", spentAmount: 500 };
            const spending2 = { category: "category1", spentAmount: 400 };
            const category1 = { name: "Bydlení", reductionRate: 10 };

            getSpendingsById.mockImplementation((id) => {
                return id === "spending1" ? spending1 : spending2;
            });
            getCategoryById.mockImplementation(() => category1);

            const result = await analyzeSpendingsReduction(budgets);

            expect(result).toEqual([
                {
                    category: "Bydlení",
                    averageSpendings: 450,
                    reductionRate: 10,
                    adjustedSpendings: 405,
                    saving: 45,
                    tips: [
                        "Zvažte možnost snížení nákladů na energie (např. úsporné spotřebiče, LED osvětlení).",
                        "Pokud je to možné, snižte náklady na nájem (např. přechod na menší byt nebo sdílení nákladů s dalšími osobami).",
                        "Pravidelně kontrolujte nabídky na energie a pojištění a hledejte výhodnější tarify.",
                    ],
                },
            ]);
        });
    });

    describe("analyzeExceededSpendings", () => {
        it("should identify exceeded spendings and provide recommendations", async () => {
            const budget = { spendings: ["spending1"] };
            const spending1 = {
                totalAmount: 500,
                spentAmount: 600,
                name: "Bydlení",
                category: "category1",
            };
            const category1 = { name: "Bydlení" };

            getSpendingsById.mockImplementation(() => spending1);
            getCategoryById.mockImplementation(() => category1);

            const result = await analyzeExceededSpendings(budget);

            expect(result.status).toBe("Překročení některých výdajových plánů");
            expect(result.summary).toBe(
                "Výdaje v několika kategoriích překročily plán."
            );
            expect(result.recommendation).toBe(
                "Zaměřte se na tyto kategorie a hledejte možnosti úspor. Můžete zvážit nastavení jiného limitu."
            );
            expect(result.exceededSpendings).toEqual([
                {
                    name: "Bydlení",
                    category: "Bydlení",
                    totalAmount: 500,
                    spentAmount: 600,
                    difference: 100,
                },
            ]);
        });
    });

    describe("analyzeIncomeVsExpenses", () => {
        it("should calculate income vs expense analysis correctly", async () => {
            const budget = { income: 2000, expense: -2500 };

            const result = await analyzeIncomeVsExpenses(budget);

            expect(result.status).toBe("Výdaje jsou větší než příjmy");
            expect(result.summary).toBe(
                "Výdaje překračují příjmy, což znamená, že se dostáváte do finančního deficitu. Toto může vést dlouhodobě k finančním problémům."
            );
            expect(result.recommendation).toBe(
                "Zaměřte se na omezení výdajů v méně prioritních kategoriích nebo zvažte zvýšení příjmů."
            );
        });

        it("should handle case when income and expenses are in balance", async () => {
            const budget = { income: 2000, expense: -2000 };

            const result = await analyzeIncomeVsExpenses(budget);

            expect(result.status).toBe("Těsný rozpočet");
            expect(result.summary).toBe(
                "Vaše výdaje se téměř rovnají příjmům, což znamená, že máte omezené volné finance."
            );
            expect(result.recommendation).toBe(
                "Snažte se ušetřit v méně důležitých oblastech, abyste vytvořili větší rezervu a uvolnili více peněz."
            );
        });
    });

    describe("analyzeSpendingsDistribution", () => {
        it("should calculate spendings distribution correctly", async () => {
            const budget = {
                income: 2000,
                spendings: ["spending1", "spending2"],
            };
            const spending1 = { spentAmount: 500, category: "category1" };
            const spending2 = { spentAmount: 700, category: "category1" };
            const category1 = { name: "Bydlení" };

            getSpendingsById.mockImplementation((id) => {
                return id === "spending1" ? spending1 : spending2;
            });
            getCategoryById.mockImplementation(() => category1);

            const result = await analyzeSpendingsDistribution(budget);

            expect(result.distributionPerCategory).toEqual([
                {
                    name: "Bydlení",
                    incomePercentage: 60,
                    status: "Limit překročen (5%)",
                },
            ]);
            expect(result.summary).toBe(
                "Překročení limitu v kategoriích: Bydlení."
            );
            expect(result.recommendation).toBe(
                "Zaměřte se na úpravu výdajů v těchto kategoriích."
            );
        });
    });
});
