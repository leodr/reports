import { format } from 'date-fns';

interface DatePickerProps {
    value: Date;
    min: Date;
    max: Date;
    onChange: (newDate: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
    onChange,
    value,
    max,
    min,
}) => {
    return (
        <input
            type="date"
            className="block px-4 py-3 border rounded border-gray-300 focus:shadow-outline-indigo outline-none bg-gray-50 appearance-none w-full"
            value={formatInputDate(value)}
            min={formatInputDate(min)}
            max={formatInputDate(max)}
            onChange={(event) => {
                onChange(new Date(event.currentTarget.value));
            }}
        />
    );
};

function formatInputDate(date: Date) {
    return format(date, 'yyyy-MM-dd');
}

export default DatePicker;
