import { useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import style from '../pages/User/DetailProject.module.css'
import { formatDate } from '../utils/format';

const SortableTask = ({ task, index, onSelect, onDoubleClick, isSelected, isMyProject }) => {
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
      onSelect(task.id)
    }
  }

  const handleDoubleClick = (e) => {
    onDoubleClick(task.id, false)
  }

  return (
    <tr ref={setNodeRef} style={trStyle} className={isSelected ? 'bg-light' : ''} onClick={handleSelect} onDoubleClick={handleDoubleClick}>
      <td className={`${style.cell} text-center`} {...attributes} {...(isMyProject ? listeners : {})} onClick={(e) => e.stopPropagation()}>⋮⋮</td>
      <td className={`${style.cell} text-center`}>{index + 1}</td>
      <td className={`${style.cell}`}>{task.name}</td>
      <td className={`${style.cell}`}>{task.priority}</td>
      <td className={`${style.cell}`}>
        <div className='d-flex flex-wrap gap-2'>
          {task.resourceAllocations.map((resource) => 
            <div key={resource.resourceId} className={`${style['resource-item']} px-2 rounded-3`}>{`${resource.username}`}</div>
          )}
        </div>
      </td>
      <td className={`${style.cell}`}>{task.duration ? task.duration : 0} days</td>
      <td className={`${style.cell}`}>{formatDate(task.start)}</td>
      <td className={`${style.cell}`}>{formatDate(task.finish)}</td>
      <td className={`${style.cell}`}>{task.complete ? task.complete : 0} %</td>
      <td className={`${style.cell}`}>{task.effort ? task.effort : 0} hours</td>
    </tr>
  );
}
export default SortableTask;