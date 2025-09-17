export const calculateTaskCost = (resourceAllocations, effort, tagRates) => {
    if (effort == 0 || resourceAllocations.length == 0) return 0;
    const hourPerResource = effort / resourceAllocations.length;
    let cost = 0;
    resourceAllocations.forEach(ra => {
        cost += hourPerResource * (tagRates.find(tr => tr.id == ra.tagRateId)?.rate || 0);
    })
    return cost;
}