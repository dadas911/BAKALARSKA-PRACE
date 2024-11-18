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
    <div>
        <div>
            <select id="month" value={month} onChange={onMonthChange}>
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
            <select id="year" value={year} onChange={onYearChange}>
                <option value={2024}>2024</option>
            </select>
        </div>
    </div>
);

export default DatePicker;
