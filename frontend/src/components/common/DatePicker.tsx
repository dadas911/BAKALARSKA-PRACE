interface DatePickerProps {
    month: number;
    year: number;
    onMonthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
    month,
    year,
    onMonthChange,
    onYearChange,
}) => (
    <div className="w-full bg-white p-4 rounded-sm border border-gray-200 flex flex-col items-center">
        <p className="text-gray-600 text-l font-medium mb-2">Vyberte datum</p>
        <div className="flex gap-4">
            <div>
                <select
                    id="month"
                    value={month}
                    onChange={onMonthChange}
                    className="p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value={1}>Leden</option>
                    <option value={2}>Únor</option>
                    <option value={3}>Březen</option>
                    <option value={4}>Duben</option>
                    <option value={5}>Květen</option>
                    <option value={6}>Červen</option>
                    <option value={7}>Červenec</option>
                    <option value={8}>Srpen</option>
                    <option value={9}>Září</option>
                    <option value={10}>Říjen</option>
                    <option value={11}>Listopad</option>
                    <option value={12}>Prosinec</option>
                </select>
            </div>
            <div>
                <select
                    id="year"
                    value={year}
                    onChange={onYearChange}
                    className="p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                </select>
            </div>
        </div>
    </div>
);

export default DatePicker;
