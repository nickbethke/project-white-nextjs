import {Separator} from "@/components/ui/separator";
import {ProjectOverview} from "./components/project-overview";

export default function Page() {
    return (
        <div className="flex flex-col gap-4 p-4 mr-0">
            <h1 className="text-2xl font-bold flex gap-2 items-baseline">
                Projects
            </h1>
            <Separator/>
            <ProjectOverview/>
        </div>
    );
}
