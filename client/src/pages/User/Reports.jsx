import { Navigate, Route, Routes } from "react-router-dom";
import ProjectOverview from "./ProjectOverview";
import UpcomingTasks from "./UpcomingTasks";

const Reports = ({api, projectId}) => {
    return (
        <>
            <div className="mt-2">
                <div className="dropdown btn btn-info m-0 p-0">
                <a
                    className="nav-link px-3 py-1 m-0 dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Dashboard
                </a>
                <ul
                    className="dropdown-menu shadow shadow-1"
                    aria-labelledby="userDropdown"
                >
                    <li>
                    <a className="dropdown-item" href='project-overview'>
                        Project overview
                    </a>
                    </li>
                    <li>
                    <a className="dropdown-item" href='upcoming-tasks'>
                        Upcoming tasks
                    </a>
                    </li>
                </ul>
                </div>
            </div>
            <div>
                <Routes>
                    <Route path="/project-overview" element={<ProjectOverview api={api} projectId={projectId} />} />
                    <Route path="/upcoming-tasks" element={<UpcomingTasks api={api} projectId={projectId} />}/>
                    <Route path="*" element={<Navigate to="../project-overview" replace />} />
                </Routes>
            </div>
        </>
    );
}
export default Reports;