
interface IServiceItem {
    data: {
        title: string;
        description: string;
    }
}

const ServiceItem: React.FC<IServiceItem> = ({ data }) => {
    return (
        <article className="group relative bg-white p-6 shadow-md rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {data.title}
            </h3>
            <p className="text-gray-600">
                {data.description}
            </p>
        </article>
    )
};

export default ServiceItem;
