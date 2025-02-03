import { X } from "lucide-react";

interface ICriteriaManager {
    criteria: string[],
    setCriteria: React.Dispatch<React.SetStateAction<string[]>>
}

const CriteriaManager: React.FC<ICriteriaManager> = ({ criteria, setCriteria }) => {

    const addCriteria = () => {
        setCriteria([...criteria, ""]);
    };

    const updateCriteria = (index: number, value: string) => {
        const newCriteria = [...criteria];
        newCriteria[index] = value;
        setCriteria(newCriteria);
    };

    const removeCriteria = (index: number) => {
        const newCriteria = criteria.filter((_, i) => i !== index);
        setCriteria(newCriteria);
    };

    return (
        <div className="w-full p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add Analysis Criteria</h2>
            {criteria.map((criterion, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                        type="text"
                        value={criterion}
                        onChange={(e) => updateCriteria(index, e.target.value)}
                        placeholder={`Enter criteria ${index + 1}`}
                        className="flex-grow text-input"
                    />
                    {criteria.length > 1 && (
                        <button onClick={() => removeCriteria(index)}>
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}
            <button onClick={addCriteria} className="mt-10 px-4 py-2 bg-gray-200 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors duration-300">
                Add Criteria
            </button>
        </div>
    );
};

export default CriteriaManager;
