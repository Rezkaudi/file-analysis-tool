import ServiceItem from "./components/ServiceItem";

interface ServiceItem {
    id: string
    title: string;
    description: string;
}

const servicesData: ServiceItem[] = [
    {
        id: "1",
        title: "Service 1",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, praesentium iure. Ad, possimus asperiores. Minima esse nisi iusto exercitationem optio."
    },
    {
        id: "2",
        title: "Service 2",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, praesentium iure. Ad, possimus asperiores. Minima esse nisi iusto exercitationem optio."
    },
    {
        id: "3",
        title: "Service 3",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, praesentium iure. Ad, possimus asperiores. Minima esse nisi iusto exercitationem optio."
    }
];


const Services = () => {
    return (
        <section className="py-[100px]">
            {/* Section Title */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-5xl">
                    Our Services
                </h2>
            </div>

            {/* Services Grid */}
            <div className="mx-auto max-w-7xl px-4">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {servicesData.map(service => (
                        <ServiceItem key={service.id} data={service} />
                    ))}
                </div>
            </div>
        </section>
    )
};

export default Services;
