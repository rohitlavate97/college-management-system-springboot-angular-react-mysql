const fs = require('fs');
const path = require('path');

function replaceInFile(filepath, replacements) {
    const fullPath = path.join(__dirname, filepath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    fs.writeFileSync(fullPath, content, 'utf8');
}

replaceInFile('src/features/dashboard/Dashboard.tsx', [
    ['pendingFees || 0', 'pendingFeesCount || 0'],
    ['enrolledCourses || 0', 'currentEnrolledCourses || 0'],
]);

replaceInFile('src/features/colleges/CollegeList.tsx', [
    ['isLoading={isLoading}', 'loading={isLoading}'],
    ['collegeService.search(search, page, size)', 'collegeService.search({ query: search, page, size })'],
]);

replaceInFile('src/features/colleges/CollegeDetail.tsx', [
    ['departmentService.getAll({ collegeId: Number(id) })', 'departmentService.getByCollege(Number(id), {})'],
]);

replaceInFile('src/features/departments/DepartmentList.tsx', [
    ['hodId: z.coerce.number().optional().nullable()', 'hodId: z.coerce.number().optional()'],
    ['departmentService.search(search, page, size)', 'departmentService.search({ query: search, page, size })'],
    ['isLoading={isLoading}', 'loading={isLoading}'],
]);

replaceInFile('src/features/professors/ProfessorList.tsx', [
    ['professorService.search(search, page, size)', 'professorService.search({ query: search, page, size })'],
    ['isLoading={isLoading}', 'loading={isLoading}'],
]);

replaceInFile('src/features/courses/CourseList.tsx', [
    ['isLoading={isLoading}', 'loading={isLoading}'],
]);

replaceInFile('src/features/subjects/SubjectList.tsx', [
    ['isLoading={isLoading}', 'loading={isLoading}'],
]);

replaceInFile('src/features/students/StudentList.tsx', [
    ['studentService.search(search, page, size)', 'studentService.search({ query: search, page, size })'],
    ['isLoading={isLoading}', 'loading={isLoading}'],
]);

// Out of scope files
replaceInFile('src/features/attendance/AttendanceManagement.tsx', [
    ['(user as any)?.studentId || user?.id', 'user?.userId'],
    ['studentId!', 'user?.userId!'],
    ['studentId:', 'userId:'],
    ['{ page: { page: 0, size: size: 100 } }', '{ page: 0, size: 100 } as any'],
]);

replaceInFile('src/features/fees/FeeManagement.tsx', [
    ['(user as any)?.studentId || user?.id', 'user?.userId'],
    ['(user as any)?.studentId || user?.id!', 'user?.userId!'],
]);

replaceInFile('src/features/results/ResultsManagement.tsx', [
    ['(user as any)?.studentId || user?.id', 'user?.userId'],
    ['(user as any)?.studentId || user?.id!', 'user?.userId!'],
]);

console.log('Fixes applied.');
