import axios from "axios";
import {IProjectsGet} from "@/types/axios-responses";

export async function getProjects() {
    return axios.get<IProjectsGet>("/api/projects").then(res => res.data.data.projects)
}
