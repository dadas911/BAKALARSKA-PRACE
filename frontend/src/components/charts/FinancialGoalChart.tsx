import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
} from "chart.js";

// Zaregistruj komponenty pro Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface FinancialGoalChartProps {
    neededAmount: number; // Celková potřebná částka
    currentAmount: number; // Aktuálně naspořeno
}

const FinancialGoalChart: React.FC<FinancialGoalChartProps> = ({
    neededAmount,
    currentAmount,
}) => {
    const progressPercentage = (currentAmount / neededAmount) * 100;

    const data = {
        labels: [""],
        datasets: [
            {
                label: "Našetřeno",
                data: [progressPercentage],
                backgroundColor: "#81C784",
                barThickness: 30,
            },
            {
                label: "Zbývá našetřit",
                data: [100 - progressPercentage],
                backgroundColor: "#FFCDD2",
                barThickness: 30,
            },
        ],
    };

    const options = {
        indexAxis: "y" as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        const value = tooltipItem.raw;
                        return `${tooltipItem.dataset.label}: ${value.toFixed(
                            0
                        )} %`;
                    },
                },
            },
        },
        scales: {
            x: {
                display: true,
                stacked: true,
            },
            y: {
                display: true,
                stacked: true,
            },
        },
    };

    return (
        <div className="w-full h-full">
            <Bar data={data} options={options} />
        </div>
    );
};

export default FinancialGoalChart;
