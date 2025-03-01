import { X } from "lucide-react";

interface ICriteriaManager {
    criterias: string[],
    setCriterias: React.Dispatch<React.SetStateAction<string[]>>
}

const CriteriaManager: React.FC<ICriteriaManager> = ({ criterias, setCriterias }) => {

    const addCriteria = () => {
        setCriterias([...criterias, ""]);
    };

    const updateCriteria = (index: number, value: string) => {
        const newCriteria = [...criterias];
        newCriteria[index] = value;
        setCriterias(newCriteria);
    };

    const removeCriteria = (index: number) => {
        const newCriteria = criterias.filter((_, i) => i !== index);
        setCriterias(newCriteria);
    };

    return (
        <div className="w-full p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-purple-700 ">Add Analysis Criteria</h2>
            {criterias.map((criterion, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                    <label className="text-purple-700 font-bold w-7">{index + 1} - </label>
                    <input
                        type="text"
                        value={criterion}
                        onChange={(e) => updateCriteria(index, e.target.value)}
                        placeholder={`Enter criteria ${index + 1}`}
                        className="flex-grow text-input"
                    />
                    {criterias.length > 1 && (
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
