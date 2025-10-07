import { useEffect, useState } from "react";
import { Gantt, Willow } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import {formatDate} from '../utils/format';
import dayjs from 'dayjs';
const DEPENDENCY_TYPE = {
  "SS": "s2s",
  "SF": "s2e",
  "FS": "e2s",
  "FF": "e2e",
}
const GanttChart = ({projectInfo, tasks, isMyProject}) => {
  const [taskData, setTaskData] = useState([]);
  const [links, setLinks] = useState([]);
  useEffect(() => {
    if (tasks) {
      let tempLinks = [];
      setTaskData(tasks.map((task, index) => {
        if (task.start == null) return {};
        tempLinks.push({id: index, source: task.predecessor?.id, target: task.id, type: DEPENDENCY_TYPE[task.dependencyType]})
        return {
          id: task.id,
          text: task.name,
          start: new Date(formatDate(task.start)),
          duration: dayjs(task.finish).diff(task.start, "day")+1,
          base_start: new Date(formatDate(task.baseStart)),
          base_end: new Date(formatDate(dayjs(task.baseFinish).add(1, 'day'))),
          progress: task.complete,
          type: task.duration === 0
            ? "milestone"
            : tasks[index+1]?.level > task.level 
              ? "summary" : "task",
        }
      }))
      setLinks(tempLinks);
    } else {
        setTaskData([]);
        setLinks([]);
    }
  }, [tasks]);


  const scales = [
    { unit: "month", step: 1, format: "MMMM yyy" },
    { unit: "day", step: 1, format: "dd" },
  ];

  return (
    <Willow>
      <Gantt 
        key={taskData.length + links.length}
        tasks={taskData} 
        links={links} 
        scales={scales}
        readonly={true}
        baselines={projectInfo.current != null && isMyProject == true && projectInfo.current.status != "PLANNING"}
        taskAdd={false}
        linkAdd={false}
        menu={false}
        toolbar={false}
        taskMove={false}
        taskResize={false}
        taskProgress={false}
        columns={[]}
        cellHeight={40}
        cellWidth={25}
        scaleHeight={40}
      />
    </Willow>
  );
};

export default GanttChart;