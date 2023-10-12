"use client";

import {ApiProject} from "@/types/projects";
import React, {useState} from "react";
import {getProjects} from "@/lib/private-api";
import {Loader} from "@/components/loader";

export const ProjectOverview = () => {

    const [projects, setProjects] = useState<ApiProject[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    React.useEffect(() => {
        setLoading(true);
        getProjects().then((projects) => {
            setProjects(projects);
            setLoading(false);
        });
    }, []);

    return (
        <Loader loading={loading} text="Loading projects...">
            <div className="flex flex-col gap-4">
                {projects.map((project) => (
                    <div className="flex flex-col gap-2" key={project.id}>
                        <span className="font-bold">{project.name}</span>
                        <span className="text-sm text-gray-500">{project.description}</span>
                    </div>
                ))}
            </div>
        </Loader>
    );
};
