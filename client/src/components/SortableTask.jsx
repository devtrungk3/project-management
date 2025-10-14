import { useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import style from '../pages/User/DetailProject.module.css'
import { formatDate } from '../utils/format';
const TASK_PRIORITY_COLOR = {
    "LOW": '#b1b8b1ff',
    "MEDIUM": '#FFD54F',
    "HIGH": '#E57373'
}
const SortableTask = ({ activeColumns, task, taskAbove, predecessorIndex, isParent, index, onSelect, onDoubleClick, isSelected, isMyProject }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id
  });
  const trStyle = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: transform ? '#f0f8ff' : 'white',
    cursor: 'default'
  }), [transform, transition]);

  const handleSelect = (e) => {
    if (!transform) {
      onSelect(index)
    }
  }

  const handleDoubleClick = (e) => {
    onDoubleClick(task.id, false)
  }
  const getWorkBreakdownStructure = () => {
    // first task
    if (!taskAbove) {
      task.wbs = [1];
    }
    // first child
    else if (taskAbove.level === task.level-1) {
      task.wbs = [...taskAbove.wbs];
      task.wbs.push(1);
    }
    else {
      task.wbs = [...taskAbove.wbs.slice(0, task.level+1)];
      task.wbs[task.wbs.length-1] += 1;
    }
    return task.wbs;
  }

  return (
    <tr ref={setNodeRef} style={trStyle} className={`${isSelected && 'selected_row'} ${isParent && 'fw-bold'}`} onClick={handleSelect} onDoubleClick={handleDoubleClick}>
      <td className={`${style.cell} text-center`} {...attributes} {...(isMyProject ? listeners : {})} onClick={(e) => e.stopPropagation()}>⋮⋮</td>
      <td className={`${style.cell} text-center`}>{index + 1}</td>
      {
        activeColumns.get("WBS") === true &&
        <td className={`${style.cell} text-center`}>{getWorkBreakdownStructure().join('.')}</td>
      }
      <td className={`${style.cell} ${task.duration == 0 && task.start != null && 'text-primary'}`}>
        <span style={{ paddingLeft: `${task.level * 35}px`}}>
          {isParent && <span className='pe-1'>⮟</span>}
          {task.name}
        </span>
      </td>
      {
        activeColumns.get("priority") === true &&
        <td className={`${style.cell}`} style={{ backgroundColor: TASK_PRIORITY_COLOR[task.priority]}}>{task.priority}</td>
      }
      {
        activeColumns.get("owners") === true &&
        <td className={`${style.cell}`}>
          <div className='d-flex gap-2'>
            {task.resourceAllocations?.map((resource) => 
              <span key={resource.resourceId} className={`${style['resource-item']} px-2 rounded-3`}>{`${resource.username}`}</span>
            )}
          </div>
        </td>
      }
      {
        activeColumns.get("duration") === true &&
        <td className={`${style.cell}`}>{task.duration ? task.duration : 0} days</td>
      }
      {
        activeColumns.get("start") === true &&
        <td className={`${style.cell}`}>{formatDate(task.start, 'vi-VN')}</td>
      }
      {
        activeColumns.get("finish") === true &&
        <td className={`${style.cell}`}>{formatDate(task.finish, 'vi-VN')}</td>
      }
      {
        activeColumns.get("complete") === true &&
        <td className={`${style.cell}`}>{task.complete ? task.complete : 0} %</td>
      }
      {
        activeColumns.get("predecessor") === true &&
        <td className={`${style.cell}`}>{predecessorIndex > 0 && predecessorIndex} {predecessorIndex > 0 && `(${task.dependencyType})`}</td>
      }
      {
        activeColumns.get("effort") === true &&
        <td className={`${style.cell}`}>{task.effort ? task.effort : 0} hours</td>
      }
      {
        activeColumns.get("total cost") === true &&
        <td className={`${style.cell}`}>{task.cost ? task.cost : 0}</td>
      }
    </tr>
  );
}
export default SortableTask;