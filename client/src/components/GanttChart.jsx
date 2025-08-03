import { useEffect, useState } from "react";
import { Gantt, Willow } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import {formatDate} from '../utils/format'
const GanttChart = ({tasks}) => {
  const [taskData, setTaskData] = useState([]);
  useEffect(() => {
    if (tasks) {
        setTaskData(tasks.map(task => ({
            id: task.id,
            text: "",
            start: new Date(formatDate(task.start)),
            duration: parseInt(task.duration),
            progress: task.complete,
            type: "task",
        })))
    } else {
        setTaskData([])
    }
  }, [tasks]);

  const links = [{ id: 1, source: 20, target: 21, type: "e2e" }];

  const scales = [
    { unit: "month", step: 1, format: "MMMM yyy" },
    { unit: "day", step: 1, format: "dd" },
  ];

  return (
    <Willow>
      <Gantt 
        tasks={taskData} 
        links={links} 
        scales={scales}
        readonly={true}
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