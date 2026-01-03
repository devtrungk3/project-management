import dayjs from "dayjs";

// only business day, ignore weekend (include start and finish date)
export const addBusinessDays = (date, numberOfDays) => {
    if (date == null) return null;
    let result = dayjs(date).clone();
    let added = 0;

    while (added < numberOfDays || result.day() == 0 || result.day() == 6) {
        if (result.day() !== 0 && result.day() !== 6) {
            added++;
        }
        result = result.add(1, "day");
    }
    return result.format("YYYY-MM-DD");
}
export const subtractBusinessDays = (date, numberOfDays) => {
    if (date == null) return null;
    let result = dayjs(date).clone();
    let subtracted = 0;

    while (subtracted < numberOfDays || result.day() == 0 || result.day() == 6) {
        if (result.day() !== 0 && result.day() !== 6) {
            subtracted++;
        }
        result = result.subtract(1, "day");
    }
    return result.format("YYYY-MM-DD");
}
export const businessDuration = (start, finish) => {
    let startDate = dayjs(start).clone();
    const finishDate = dayjs(finish);
    let count = 0;

    while (!startDate.isAfter(finishDate, "day")) {
        if (startDate.day() !== 0 && startDate.day() !== 6) {
            count++;
        }
        startDate = startDate.add(1, "day");
    }
    return count;
}