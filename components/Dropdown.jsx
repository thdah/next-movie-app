//create resuable dropdown components for filter selections
    export default function Dropdown({label, name, value, onChange, options}) {
        return (
            <div>
                <label className="block mb-2 ml-1 text-sm">{label}</label>
                <select
                 name={name}
                 value={value}
                 onChange={onChange}
                 className="bg-[#252525] rounded-md px-3 py-2 text-white w-full"
                >
                    <option value="">All</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        )
    }
