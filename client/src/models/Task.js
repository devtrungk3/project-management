import { addBusinessDays, subtractBusinessDays } from "../utils/businessDays";
export default class Task {
    constructor(
        id, 
        name=null, 
        description=null, 
        effort=0, 
        duration=0, 
        start=null,
        priority=null, 
        complete=0, 
        cost=null, 
        resourceAllocations=null,
        parent=null, 
        predecessor=null, 
        dependencyType=null,
        baseStart=null,
        baseFinish=null,
    ) {
        this._id = id;
        this._name = name;
        this._description = description;
        if (effort) {
            this._effort = effort;
        } else {
            this._effort = 0;
        }
        if (duration) {
            this._duration = duration;
        } else {
            this._duration = 0;
        }
        this._start = start;
        this._finish = null;
        this._baseStart = baseStart;
        this._baseFinish = baseFinish;
        this._priority = priority;
        this._parent = parent;
        this._predecessor = predecessor;
        this._dependencyType = dependencyType;
        if (complete) {
            this._complete = complete;
        } else {
            this._complete = 0;
        }
        this._level = 0;
        this._cost = cost;
        this._resourceAllocations = resourceAllocations;
    }

    toJSON() {
        return {
            id: this.id, 
            name: this.name,
            description: this.description,
            effort: this.effort,
            duration: this.duration,
            start: this.start,
            finish: this.finish,
            priority: this.priority,
            parentId: this._parent ? this._parent.id : null, 
            predecessor: this.predecessor ? this.predecessor.id : null,
            dependencyType: this.dependencyType,
            complete: this.complete,
            cost: this.cost,
            resourceAllocations: this.resourceAllocations,
        };
    }

    setAll(        
        name=null, 
        description=null, 
        effort=0, 
        duration=0, 
        start=null, 
        priority=null, 
        complete=0, 
        cost=null, 
        resourceAllocations=null,
        parent=null, 
        predecessor=null, 
        dependencyType=null
    ) {
        this._name = name;
        this._description = description;
        if (effort) {
            this._effort = effort;
        } else {
            this._effort = 0;
        }
        if (duration) {
            this._duration = duration;
        } else {
            this._duration = 0;
        }
        this._start = start;
        this._priority = priority;
        this._parent = parent;
        this._predecessor = predecessor;
        this._dependencyType = dependencyType;
        if (complete) {
            this._complete = complete;
        } else {
            this._complete = 0;
        }
        this._cost = cost;
        this._resourceAllocations = resourceAllocations;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get effort() {
        return this._effort;
    }

    get duration() {
        return this._duration;
    }
    getStart = () => {
        return this._start;
    }
    get start() {
        // move to business day
        this._start = addBusinessDays(this._start, 0);
        if (this._predecessor && this._dependencyType) {
            switch (this._dependencyType) {
                case "SS":
                    if (this._start == null || this._start < this._predecessor.start) {
                        this._start = this._predecessor.start;
                    }
                    break;
                case "SF":
                    if (this._start == null || this.finish <= this._predecessor.start) {
                        this._start = subtractBusinessDays(this._predecessor.start, this._duration > 0 ? this._duration-1 : 0);
                    }
                    break;
                case "FS":
                    if (this._start == null || this._start <= this._predecessor.finish) {
                        this._start = addBusinessDays(this._predecessor.finish, 1); 
                    }
                    break;
                case "FF":
                    if (this._start == null || this.finish < this._predecessor.finish) {
                        this._start = subtractBusinessDays(this._predecessor.finish, this._duration > 0 ? this._duration-1 : 0);
                    }
                    break;
                default:
                    break;
            }
        }
        return this._start;
    }

    get finish() {
        return addBusinessDays(this._start, this._duration > 0 ? this._duration-1 : 0);
    }

    get baseStart() {
        return this._baseStart ? this._baseStart : this.start;
    }

    get baseFinish() {
        return this._baseFinish ? this._baseFinish : this.finish;
    }

    get priority() {
        return this._priority;
    }

    get parent() {
        return this._parent;
    }

    get predecessor() {
        return this._predecessor;
    }

    get dependencyType() {
        return this._dependencyType;
    }

    get complete() {
        return this._complete;
    }

    get level() {
        if (this._parent) {
            return this._parent.level + 1;
        }
        return 0;
    }

    get cost() {
        return this._cost;
    }

    get resourceAllocations() {
        return this._resourceAllocations;
    }

    // --- Setters ---

    set id(newId) {
        this._id = newId;
    }

    set name(newName) {
        this._name = newName;
    }

    set description(newDescription) {
        this._description = newDescription;
    }

    set effort(newEffort) {
        if (newEffort) {
            this._effort = newEffort;
        } else {
            this._effort = 0;
        }
    }

    set duration(newDuration) {
        if (newDuration) {
            this._duration = newDuration;
        } else {
            this._duration = 0;
        }
    }

    set start(newStart) {
        this._start = newStart;
    }

    set priority(newPriority) {
        this._priority = newPriority;
    }

    set parent(newParent) {
        this._parent = newParent;
    }

    set predecessor(newPredecessor) {
        this._predecessor = newPredecessor;
    }

    set dependencyType(newDependencyType) {
        this._dependencyType = newDependencyType;
    }

    set complete(newComplete) {
        if (newComplete) {
            this._complete = newComplete;
        } else {
            this._complete = 0;
        }
    }

    set cost(newCost) {
        this._cost = newCost;
    }

    set resourceAllocations(newResourceAllocations) {
        this._resourceAllocations = newResourceAllocations;
    }
}