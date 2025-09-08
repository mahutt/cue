exports.extractDepartmentAndNumber = function (courseCode) {
    const match = courseCode.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) return null;
    const department = match[1];
    const number = match[2];
    return { department, number };
};
