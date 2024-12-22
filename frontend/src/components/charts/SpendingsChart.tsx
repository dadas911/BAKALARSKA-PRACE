import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Zaregistruj komponenty pro Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingChartProps {
    totalAmount: number;
    spentAmount: number;
}

const SpendingChart: React.FC<SpendingChartProps> = ({
    totalAmount,
    spentAmount,
}) => {
    if (spentAmount > totalAmount) {
        spentAmount = totalAmount;
    }

    const remainingAmount = totalAmount - spentAmount;

    const data = {
        labels: ["Utraceno", "Zbývá"],
        datasets: [
            {
                data: [spentAmount, remainingAmount],
                backgroundColor: ["#E53935", "#81C784"],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(
                            0
                        )} Kč`;
                    },
                },
            },
            datalabels: {
                display: true,
                formatter: (value: any) => `${value.toFixed(0)} Kč`,
                color: "white",
                font: {
                    weight: "bold",
                    size: 16,
                },
            },
        },
    };

    return (
        <div className="w-full h-full">
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default SpendingChart;
